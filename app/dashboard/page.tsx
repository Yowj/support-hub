import { getUserProfile, ensureUserProfile, resolveLandingRoute } from "@/lib/auth";
import CustomerDashboard from "@/app/dashboard/_components/CustomerDashboard";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    return redirect("/login");
  }

  if (!profile) {
    await ensureUserProfile(user.id, user.email || "");
    return redirect("/dashboard");
  }

  // Onboarding-incomplete or wrong-role users get routed away.
  const target = resolveLandingRoute(profile);
  if (target !== "/dashboard") {
    return redirect(target);
  }

  return <CustomerDashboard user={user} />;
}
