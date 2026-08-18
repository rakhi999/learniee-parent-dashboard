"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";

const accentClasses: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
};

export function CourseCard({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const accent = accentClasses[course.accent] || accentClasses.violet;

  return (
    <>
      <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
        <div className="flex items-start justify-between gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold ring-1 ${accent}`}>{course.subject.slice(0, 1)}</div><span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{course.level}</span></div>
        <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">{course.subject} · {course.grade}</p><h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{course.description}</p></div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Teacher</span><strong className="mt-1 block font-semibold text-slate-800">{course.teacher}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Schedule</span><strong className="mt-1 block font-semibold text-slate-800">{course.schedule}</strong></div></div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6"><div><div className="flex items-center gap-1 text-sm font-semibold text-amber-600"><span>★</span><span>{course.rating.toFixed(1)}</span><span className="font-normal text-slate-400">({course.reviews})</span></div><p className="mt-1 text-lg font-bold text-slate-950">₹{course.price.toLocaleString("en-IN")}</p></div><button onClick={() => setOpen(true)} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600">View details</button></div>
      </article>

      {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="presentation" onMouseDown={() => setOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby={`course-${course.id}`} className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">{course.subject} · {course.grade}</p><h2 id={`course-${course.id}`} className="mt-2 text-2xl font-semibold text-slate-950">{course.title}</h2></div><button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Close details">×</button></div><p className="mt-4 leading-7 text-slate-600">{course.description}</p><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><Detail label="Teacher" value={course.teacher} /><Detail label="Rating" value={`${course.rating.toFixed(1)} / 5 (${course.reviews} reviews)`} /><Detail label="Duration" value={`${course.durationWeeks} weeks`} /><Detail label="Schedule" value={course.schedule} /><Detail label="Level" value={course.level} /><Detail label="Price" value={`₹${course.price.toLocaleString("en-IN")}`} /></dl><div className="mt-7 rounded-xl bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-800">This assignment focuses on discovery and search. Booking/payment is intentionally left out of scope and documented in the README.</div></div></div>}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-slate-100 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-slate-800">{value}</dd></div>; }
