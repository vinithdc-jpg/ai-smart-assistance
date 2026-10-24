"use client";


export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 dark:bg-background">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/2 -top-40 h-130 w-180 rounded-full bg-linear-to-b from-indigo-200/40 via-purple-100/30 to-transparent blur-3xl opacity-70 sm:left-1/2 sm:-translate-x-1/2" />

        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-indigo-50/60 blur-2xl" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      {/* Main */}
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>

            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              HTTP 404 • Routing Exception
            </span>
          </div>

          {/* 404 */}
          <div className="relative mb-6">
            {/* Glow */}
            <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-2xl" />

            <div className="flex select-none items-center justify-center gap-2 font-black tracking-tight sm:gap-4">
              {/* First 4 */}
              <span className="bg-linear-to-br from-indigo-700 via-indigo-600 to-indigo-900 bg-clip-text text-7xl font-extrabold text-transparent drop-shadow-sm sm:text-9xl">
                4
              </span>

              {/* Center 0 */}
              <div className="group relative flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-indigo-100 bg-white shadow-xl shadow-indigo-200/50 transition-all duration-300 hover:rotate-6 sm:h-28 sm:w-28">
                <div className="absolute inset-2 flex items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-inner">
                  <svg
                    className="h-10 w-10 text-white/90 transition-transform group-hover:scale-110 sm:h-14 sm:w-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Alert Indicator */}
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-400 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                </span>
              </div>

              {/* Second 4 */}
              <span className="bg-linear-to-br from-indigo-700 via-indigo-600 to-indigo-900 bg-clip-text text-7xl font-extrabold text-transparent drop-shadow-sm sm:text-9xl">
                4
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ledger Entry or Page Not Found
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
            The transaction trace, club route, or administrative record you are
            trying to reach doesn&apos;t exist, was archived, or may have relocated
            in the autonomous ledger graph.
          </p>

          {/* Actions */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-3.5">
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 bg-white/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-600">SmartLedger</span>

            <span className="text-slate-300">•</span>

            <span>Financial Management System</span>
          </div>

          <div className="font-medium">
            © {new Date().getFullYear()} SmartLedger
          </div>
        </div>
      </footer>
    </main>
  );
}
