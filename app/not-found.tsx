import Link from "next/link";
import { IrisRing } from "@/components/IrisRing";
import { Button } from "@/components/Button";
import { TopBar } from "@/components/TopBar";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-6 pb-16 text-center sm:px-8">
        <IrisRing status="error" size={168} />
        <div className="max-w-[28ch]">
          <h1 className="text-[22px] leading-snug font-medium text-foreground">This page doesn&rsquo;t exist.</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-foreground-dim">
            The link may be old, or mistyped. The three checks are still where you left them.
          </p>
        </div>
        <Link href="/">
          <Button>Back to StaySoji</Button>
        </Link>
      </div>
    </div>
  );
}
