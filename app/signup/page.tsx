import SignupForm from "@/components/auth/SignupForm";
import Image from "next/image";

export default function Signup() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid xl:grid-cols-2 grid-cols-1 min-h-screen">
        <div className="flex items-start justify-center bg-muted/30 pt-28 px-6 pb-12">
          <SignupForm />
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
