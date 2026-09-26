import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";

export default function LookupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar title="Loan app lookup" backHref="/dashboard" />
      {children}
    </>
  );
}
