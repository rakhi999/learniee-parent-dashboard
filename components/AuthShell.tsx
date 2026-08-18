import Link from "next/link";
import { Brand } from "@/components/Brand";

export function AuthShell({ title, subtitle, mode, children }: { title: string; subtitle: string; mode: "login" | "signup"; children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-80" style={{ background: "radial-gradient(circle at 20% 20%, rgba(99,102,241,.45), transparent 32%), radial-gradient(circle at 90% 80%, rgba(14,165,233,.28), transparent 35%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 font-semibold">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">L</span>
              Learniee
            </div>
          </div>
          <div className="relative z-10 max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-indigo-200">Parent-first learning discovery</p>
            <h2 className="text-4xl font-semibold leading-tight">Find the right course without the endless scrolling.</h2>
            <p className="mt-5 text-base leading-7 text-slate-300">Search by subject, grade, price and teacher rating, then compare clear course details in one calm dashboard.</p>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"><strong className="block text-lg text-white">30+</strong>courses</div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"><strong className="block text-lg text-white">7</strong>subjects</div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"><strong className="block text-lg text-white">4.6★</strong>avg. rating</div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 lg:hidden"><Brand /></div>
            <p className="text-sm font-semibold text-indigo-600">{mode === "login" ? "Welcome back" : "Create your parent account"}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 leading-7 text-slate-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-center text-sm text-slate-600">
              {mode === "login" ? "New to Learniee?" : "Already have an account?"}{" "}
              <Link className="font-semibold text-indigo-600 hover:text-indigo-700" href={mode === "login" ? "/signup" : "/login"}>
                {mode === "login" ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
