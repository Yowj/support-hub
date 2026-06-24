"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on shop pages
  const isAuthForm = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthForm) {
    return null;
  }

  return <Navbar />;
}
