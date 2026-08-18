"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseSearchResponse, PublicUser } from "@/lib/types";
import { CourseCard } from "@/components/dashboard/CourseCard";

const emptyResponse: CourseSearchResponse = { items: [], page: 1, pageSize: 6, total: 0, totalPages: 1, filters: { grades: [], subjects: [], maxPrice: 5000 } };

function useDebouncedValue(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const timer = window.setTimeout(() => setDebounced(value), delay); return () => window.clearTimeout(timer); }, [value, delay]);
  return debounced;
}

export function DashboardClient({ user }: { user: PublicUser }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CourseSearchResponse>(emptyResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const search = new URLSearchParams({ page: String(page), pageSize: "6", sort });
    if (debouncedQuery) search.set("q", debouncedQuery);
    if (grade) search.set("grade", grade);
    if (subject) search.set("subject", subject);
    if (minPrice) search.set("minPrice", minPrice);
    if (maxPrice) search.set("maxPrice", maxPrice);
    if (minRating) search.set("minRating", minRating);
    return search;
  }, [debouncedQuery, grade, subject, minPrice, maxPrice, minRating, sort, page]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/courses?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
        if (response.status === 401) { window.location.href = "/login"; return; }
        if (!response.ok) throw new Error("Could not load courses.");
        setData(await response.json() as CourseSearchResponse);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Could not load courses.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [params]);

  function updateFilter(setter: (value: string) => void, value: string) { setPage(1); setter(value); }
  function clearFilters() { setQuery(""); setGrade(""); setSubject(""); setMinPrice(""); setMaxPrice(""); setMinRating(""); setSort("recommended"); setPage(1); }
  const hasFilters = Boolean(query || grade || subject || minPrice || maxPrice || minRating || sort !== "recommended");

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-sm font-semibold text-indigo-300">Parent dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, {user.name.split(" ")[0]}.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Use the search and filters below to find a course that fits your child’s grade, interests and your budget.</p></div><div className="grid grid-cols-3 gap-3"><Stat value="30" label="courses" /><Stat value="7" label="subjects" /><Stat value="4.6★" label="avg rating" /></div></div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <div className="flex items-center justify-between"><div><p className="font-semibold text-slate-950">Filters</p><p className="mt-1 text-xs text-slate-500">Combine any options</p></div>{hasFilters && <button onClick={clearFilters} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Clear all</button>}</div>
          <div className="mt-5 space-y-5">
            <Select label="Grade" value={grade} onChange={(v) => updateFilter(setGrade, v)} options={data.filters.grades} placeholder="All grades" />
            <Select label="Subject" value={subject} onChange={(v) => updateFilter(setSubject, v)} options={data.filters.subjects} placeholder="All subjects" />
            <div><label className="text-sm font-medium text-slate-700">Price range (₹)</label><div className="mt-2 grid grid-cols-2 gap-2"><NumberInput aria-label="Minimum price" value={minPrice} onChange={(v) => updateFilter(setMinPrice, v)} placeholder="Min" /><NumberInput aria-label="Maximum price" value={maxPrice} onChange={(v) => updateFilter(setMaxPrice, v)} placeholder="Max" /></div></div>
            <Select label="Teacher rating" value={minRating} onChange={(v) => updateFilter(setMinRating, v)} options={["4", "4.5", "4.8"]} labels={{ "4": "4.0+", "4.5": "4.5+", "4.8": "4.8+" }} placeholder="Any rating" />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="grid gap-3 sm:grid-cols-[1fr_190px]"><label className="relative block"><span className="sr-only">Search courses</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input value={query} onChange={(e) => { setPage(1); setQuery(e.target.value); }} placeholder="Search by course, subject or teacher…" className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label><select aria-label="Sort courses" value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"><option value="recommended">Recommended</option><option value="rating-desc">Highest rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div></div>

          <div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-slate-950">Course results</p><p className="mt-1 text-sm text-slate-500">{loading ? "Searching…" : `${data.total} ${data.total === 1 ? "course" : "courses"} found`}</p></div>{data.total > 0 && <p className="hidden text-xs text-slate-400 sm:block">Page {data.page} of {data.totalPages}</p>}</div>

          {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div> : loading ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-12 w-12 rounded-2xl bg-slate-100"/><div className="mt-6 h-3 w-24 rounded bg-slate-100"/><div className="mt-3 h-6 w-3/4 rounded bg-slate-100"/><div className="mt-3 h-3 w-full rounded bg-slate-100"/><div className="mt-2 h-3 w-5/6 rounded bg-slate-100"/></div>)}</div> : data.items.length === 0 ? <div className="mt-5 rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">⌕</div><h2 className="mt-5 text-xl font-semibold text-slate-950">No courses match those filters</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try a broader subject, a higher price range, or lower the minimum teacher rating.</p><button onClick={clearFilters} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Reset search</button></div> : <><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.items.map((course) => <CourseCard key={course.id} course={course} />)}</div><Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} /></>}
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) { return <div className="min-w-[82px] rounded-2xl bg-white/5 px-3 py-3 text-center ring-1 ring-white/10"><strong className="block text-lg">{value}</strong><span className="text-[11px] text-slate-400">{label}</span></div>; }
function Select({ label, value, onChange, options, placeholder, labels = {} }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string; labels?: Record<string,string> }) { return <label className="block text-sm font-medium text-slate-700">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{labels[option] || option}</option>)}</select></label>; }
function NumberInput({ value, onChange, ...props }: { value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) { return <input type="number" min="0" step="50" value={value} onChange={(e) => onChange(e.target.value)} {...props} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />; }
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) { if (totalPages <= 1) return null; const pages = Array.from({ length: totalPages }, (_, i) => i + 1); return <nav aria-label="Course result pages" className="mt-7 flex flex-wrap items-center justify-center gap-2"><button disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-40">Previous</button>{pages.map((number) => <button key={number} onClick={() => onChange(number)} aria-current={number === page ? "page" : undefined} className={`h-9 w-9 rounded-lg text-sm font-semibold ${number === page ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{number}</button>)}<button disabled={page === totalPages} onClick={() => onChange(page + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 disabled:opacity-40">Next</button></nav>; }
