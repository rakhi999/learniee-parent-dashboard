import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return <AuthShell mode="login" title="Sign in to your dashboard" subtitle="Continue where you left off and find the next great course for your child."><LoginForm /></AuthShell>;
}
