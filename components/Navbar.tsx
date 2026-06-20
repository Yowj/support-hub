'use client';

import { Link, MessageSquare } from "lucide-react";
import AuthButton from "./auth-button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SupportHub</span>
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
