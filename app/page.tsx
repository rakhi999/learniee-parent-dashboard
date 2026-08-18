import Link from "next/link";
import { Brand } from "@/components/Brand";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Brand />
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Open dashboard</Link>
          ) : (
            <><Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">Sign in</Link><Link href="/signup" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">Create account</Link></>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" />Built for busy parents</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">Find courses your child will actually look forward to.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Search a curated course catalog by subject, grade, price and teacher rating. Compare clear details, then narrow down the best fit quickly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={user ? "/dashboard" : "/signup"} className="rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">{user ? "Go to dashboard" : "Explore courses"}</Link>
            {!user && <Link href="/login" className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 hover:border-slate-300">I already have an account</Link>}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500"><span>✓ Real sign-up & login</span><span>✓ Combined filters</span><span>✓ Responsive dashboard</span></div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5"><div><p className="text-sm font-semibold text-slate-950">Course search</p><p className="mt-1 text-xs text-slate-500">30 hand-picked options</p></div><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">⌕</div></div>
            <div className="mt-5 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">Search “mathematics”</div>
            <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Grade 6</div><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Rating 4.5+</div></div>
            <div className="mt-6 space-y-3">
              {["Algebra Foundations", "Creative Coding Lab", "Young Scientists Club"].map((title, index) => <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"><div className={`h-12 w-12 rounded-xl ${index === 0 ? "bg-violet-100" : index === 1 ? "bg-sky-100" : "bg-emerald-100"}`} /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">4.{9-index} ★ · ₹{899 + index*200}/course</p></div><span className="text-slate-300">›</span></div>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
