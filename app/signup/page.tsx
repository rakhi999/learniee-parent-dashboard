import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/SignupForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return <AuthShell mode="signup" title="Start discovering better-fit courses" subtitle="Create an account in under a minute. No external database or third-party auth setup is required."><SignupForm /></AuthShell>;
}
