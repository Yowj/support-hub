import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

// Friendly messages for error codes the auth callback may redirect back with.
const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Sign-in failed. Please try again.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error ? ERROR_MESSAGES[error] ?? "" : "";

  return (
      <div className="grid xl:grid-cols-2 grid-cols-1 min-h-screen">
        <div className="flex items-start justify-center bg-muted/30 pt-28 px-6 pb-12">
          <LoginForm initialError={initialError} />
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
  );
}
