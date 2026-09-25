import type { ReactNode } from "react";
import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Create account — StaySoji",
  description: "Create a StaySoji account.",
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar title="Create account" backHref="/" />
      {children}
    </>
  );
}
