import type { ReactNode } from "react";
import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Sign in — StaySoji",
  description: "Sign in to your StaySoji account.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar title="Sign in" backHref="/" />
      {children}
    </>
  );
}
