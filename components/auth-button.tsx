import { getUserProfile } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default async function AuthButton() {
  const { user, profile } = await getUserProfile();

  const signOut = async () => {
    "use server";

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <div className="font-medium">{profile?.display_name || user.email}</div>
        <div className="text-muted-foreground capitalize">{profile?.role || "customer"}</div>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <form action={signOut}>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
    </div>
  );
}
