type StatItem = {
  label: string;
  value: string;
};

const stats: StatItem[] = [
  { label: "Events", value: "20+" },
  { label: "Participants", value: "5,000" },
  { label: "Championships", value: "18" },
];

export default function StatsSection() {
  return (
    <section className="bg-black py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center shadow-sm"
          >
            <p className="text-4xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#e31837]">
              {stat.label}
            </p>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
