"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on the focused auth / onboarding screens
  const isAuthForm =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/onboarding");

  if (isAuthForm) {
    return null;
  }

  return <Navbar />;
}
