import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";

export default function CalculateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar title="True cost calculator" backHref="/dashboard" />
      {children}
    </>
  );
}
