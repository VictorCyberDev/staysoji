import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";

export default function ScanLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar title="Terms scanner" backHref="/" />
      {children}
    </>
  );
}
