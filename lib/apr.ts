export type AprInput = {
  /** Naira, the amount the borrower asks for */
  principal: number;
  /** the tenure the app advertises, in days */
  statedDurationDays: number;
  /** "processing fee" as a percent of principal, deducted upfront */
  feePercent: number;
  /**
   * Optional: the number of days until the app actually demands repayment
   * (found in the T&Cs or from a borrower's own experience). When present
   * this drives an exact bait-and-switch comparison instead of the generic
   * pattern warning.
   */
  actualRepaymentDays?: number;
};

export type BaitFlag = {
  level: "confirmed" | "pattern";
  message: string;
};

export type AprResult = {
  principal: number;
  feeAmount: number;
  amountReceived: number;
  amountRepaid: number;
  costOfCredit: number;
  periodRate: number;
  trueApr: number;
  statedDurationDays: number;
  baitFlag: BaitFlag | null;
};

export function validateAprInput(input: AprInput): AprInput {
  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    throw new Error("Enter a principal amount greater than zero.");
  }
  if (!Number.isFinite(input.statedDurationDays) || input.statedDurationDays <= 0) {
    throw new Error("Enter a stated duration in days.");
  }
  if (!Number.isFinite(input.feePercent) || input.feePercent < 0 || input.feePercent >= 100) {
    throw new Error("Processing fee should be a percentage between 0 and 100.");
  }
  return input;
}

type CoreFigures = Pick<
  AprResult,
  "principal" | "feeAmount" | "amountReceived" | "amountRepaid" | "costOfCredit" | "periodRate" | "trueApr" | "statedDurationDays"
>;

/**
 * Nigerian "quick loan" apps commonly structure the transaction as a
 * discount loan: the borrower is approved for principal P, but the stated
 * "processing fee" is deducted before disbursement, while the full P is
 * still owed back at term. So the real cost of credit is the fee, and the
 * real base of that cost is what the borrower actually received, not P.
 *
 *   received  = P × (1 − fee%)
 *   repaid    = P
 *   cost      = P − received = P × fee%
 *   periodRate = cost / received
 *   APR       = periodRate × (365 / statedDurationDays)
 */
export function computeCoreFigures(input: AprInput): CoreFigures {
  const { principal, statedDurationDays, feePercent } = input;

  const feeAmount = principal * (feePercent / 100);
  const amountReceived = principal - feeAmount;
  const amountRepaid = principal;
  const costOfCredit = amountRepaid - amountReceived;
  const periodRate = amountReceived > 0 ? costOfCredit / amountReceived : 0;
  const trueApr = statedDurationDays > 0 ? periodRate * (365 / statedDurationDays) * 100 : 0;

  return { principal, feeAmount, amountReceived, amountRepaid, costOfCredit, periodRate, trueApr, statedDurationDays };
}

export function detectBaitFlag(core: CoreFigures, input: AprInput): BaitFlag | null {
  const { statedDurationDays, actualRepaymentDays } = input;

  if (actualRepaymentDays && actualRepaymentDays > 0 && actualRepaymentDays < statedDurationDays) {
    const ratio = actualRepaymentDays / statedDurationDays;
    if (ratio <= 0.34) {
      return {
        level: "confirmed",
        message: `Advertised as a ${statedDurationDays}-day loan, but this one actually demands repayment in ${actualRepaymentDays} days. That is the exact bait-and-switch structure FCCPC has flagged: a long tenure in the marketing, a short default window in the fine print.`,
      };
    }
    return {
      level: "pattern",
      message: `The advertised ${statedDurationDays}-day tenure is longer than the ${actualRepaymentDays}-day repayment date you entered. Even a smaller gap like this is worth reading the repayment schedule for closely.`,
    };
  }

  if (statedDurationDays >= 60) {
    return {
      level: "pattern",
      message: `${statedDurationDays}-day tenures are the exact marketing window several FCCPC-delisted apps used while structurally demanding repayment within 7 to 14 days. A long stated duration alone does not confirm this app is safe. If you know the app's real first-repayment date, enter it above to check directly.`,
    };
  }

  return null;
}

export function calculateTrueApr(input: AprInput): AprResult {
  const validated = validateAprInput(input);
  const core = computeCoreFigures(validated);
  const baitFlag = detectBaitFlag(core, validated);
  return { ...core, baitFlag };
}

export function classifyApr(apr: number): "low" | "amber" | "high" {
  if (apr < 60) return "low";
  if (apr < 400) return "amber";
  return "high";
}

export const NAIRA = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const PERCENT = new Intl.NumberFormat("en-NG", {
  style: "percent",
  maximumFractionDigits: 1,
});
