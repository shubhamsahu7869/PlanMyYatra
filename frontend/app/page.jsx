import Link from "next/link";

const features = [
  "Secure login and user-specific dashboards",
  "Destination, days, budget, and interest-based planning",
  "AI day-by-day itinerary with budget estimate",
  "Editable activities, day regeneration, and hotel suggestions",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
            AI Travel Planner
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
              AI Travel Planner for complete, editable trip itineraries.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Build personalized trips with authentication, strict user data isolation, AI-generated day plans, local budget estimates, and hotel recommendations.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/register" className="inline-flex justify-center rounded-full bg-sky-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Start planning
            </Link>
            <Link href="/login" className="inline-flex justify-center rounded-full border border-slate-700 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500">
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Example trip</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">3 days in Rishikesh</h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Medium budget</span>
            </div>
            <div className="mt-6 space-y-3">
              {["Day 1: Triveni Ghat, Beatles Ashram, Ram Jhula", "Day 2: Neer Garh Waterfall, Shivpuri rafting", "Day 3: Parmarth Niketan, Laxman Jhula market"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
