import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-slate-950" aria-label="Learniee home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 19.5V6.8a2 2 0 0 1 1.1-1.8L11 2l5.9 3A2 2 0 0 1 18 6.8v12.7" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      </span>
      <span className="text-xl">Learniee</span>
    </Link>
  );
}
