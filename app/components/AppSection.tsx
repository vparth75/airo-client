import Image from "next/image";

export default function AppSection() {
  return (
  <section id="schedule" className="bg-neutral-950 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e31837]">
            Fest Companion
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Plan every match with the official schedule app.
          </h2>
          <p className="text-base leading-relaxed text-white/70">
            Build your custom itinerary, follow live scores, and get instant
            venue alerts. Never miss a second of the action.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-[#e31837] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c5142f]">
              Download App
            </button>
            <button className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
              See Features
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <div className="absolute -right-6 top-8 hidden h-40 w-40 rounded-full bg-[#e31837]/10 lg:block" />
          <div className="relative rounded-3xl border border-white/10 bg-white p-4 shadow-xl">
            <Image
              src="/images/app-mockup.svg"
              alt="Fest companion app mockup"
              width={520}
              height={780}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
