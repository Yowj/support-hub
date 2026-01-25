import LoginForm from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Login() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                SupportHub
              </span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <div className="grid xl:grid-cols-2 grid-cols-1 min-h-screen">
        <div className="flex items-center justify-center pt-16">
          <LoginForm />
        </div>
        <div className="hidden xl:block relative">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/20" />
          <Image
            src={"/images/hero.jpg"}
            alt="hero.jpg"
            width={5376}
            height={3584}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}
