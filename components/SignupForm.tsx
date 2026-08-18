"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmPassword") ?? "");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to create account.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Full name" name="name" type="text" autoComplete="name" placeholder="Aarav Sharma" minLength={2} maxLength={80} />
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="parent@example.com" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} maxLength={128} />
      <Field label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" minLength={8} maxLength={128} />
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-xs leading-5 text-slate-500">Passwords are hashed with scrypt before being stored. The session cookie is HTTP-only and signed.</p>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = `signup-${props.name}`;
  const { label, ...inputProps } = props;
  return <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}<input id={id} required {...inputProps} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label>;
}
