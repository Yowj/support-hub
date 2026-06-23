import { getUserProfile, ensureUserProfile } from "@/lib/auth";
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

  if (profile.role === "agent" || profile.role === "admin") {
    return redirect("/agent");
  }

  return <CustomerDashboard user={user} />;
}
