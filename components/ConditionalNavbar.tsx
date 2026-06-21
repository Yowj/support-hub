"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on shop pages
  const isShopPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isShopPage) {
    return null;
  }

  return <Navbar />;
}
