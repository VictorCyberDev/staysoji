"use client";

import { useCallback, useRef, useState } from "react";

export type IrisStep = {
  label: string;
  /** Receives the previous step's output (undefined for the first step). */
  run: (prev: unknown) => Promise<unknown> | unknown;
};

export type IrisSequenceStatus = "idle" | "checking" | "result" | "error";

type SequenceState<R> = {
  status: IrisSequenceStatus;
  activeIndex: number;
  stepCount: number;
  activeLabel: string | null;
  result: R | null;
  error: string | null;
};

function nextFrame() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 16);
    }
  });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// Most steps here (a regex pass, a math computation) finish in under a
// millisecond. The ring only ever advances once a step has genuinely
// resolved, but for steps well under this floor we hold the label on
// screen a little longer so a human can actually read it contract by
// contract; nothing is delayed while its real work is still in flight.
const MIN_STEP_MS = 420;

/**
 * Drives the Iris Ring's "active-check" contraction from genuinely sequenced
 * work. Each step's `run` executes for real between renders; the ring only
 * advances once that step's own async (or sync) operation has resolved, so
 * the animation timeline is derived from real completion, not a timer.
 */
export function useIrisSequence<R>(
  steps: IrisStep[],
  reduce: (results: unknown[]) => R,
) {
  const [state, setState] = useState<SequenceState<R>>({
    status: "idle",
    activeIndex: -1,
    stepCount: steps.length,
    activeLabel: null,
    result: null,
    error: null,
  });
  const running = useRef(false);

  const run = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setState({
      status: "checking",
      activeIndex: 0,
      stepCount: steps.length,
      activeLabel: steps[0]?.label ?? null,
      result: null,
      error: null,
    });

    const results: unknown[] = [];
    try {
      for (let i = 0; i < steps.length; i++) {
        setState((s) => ({ ...s, activeIndex: i, activeLabel: steps[i].label }));
        // yield so the label paints before the step's real work begins
        await nextFrame();
        const started = Date.now();
        const value = await steps[i].run(results[i - 1]);
        const elapsed = Date.now() - started;
        if (elapsed < MIN_STEP_MS) await delay(MIN_STEP_MS - elapsed);
        results.push(value);
      }
      const finalResult = reduce(results);
      setState({
        status: "result",
        activeIndex: steps.length - 1,
        stepCount: steps.length,
        activeLabel: null,
        result: finalResult,
        error: null,
      });
    } catch (err) {
      setState({
        status: "error",
        activeIndex: -1,
        stepCount: steps.length,
        activeLabel: null,
        result: null,
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      running.current = false;
    }
  }, [steps, reduce]);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      activeIndex: -1,
      stepCount: steps.length,
      activeLabel: null,
      result: null,
      error: null,
    });
  }, [steps.length]);

  return { ...state, run, reset };
}
