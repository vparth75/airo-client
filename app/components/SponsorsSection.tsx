import Image from "next/image";

type SponsorItem = {
  name: string;
  logo: string;
};

export default function SponsorsSection({
  sponsors,
}: {
  sponsors: SponsorItem[];
}) {
  return (
  <section id="sponsors" className="bg-black py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e31837]">
            Sponsors
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Powered by leaders who believe in campus talent.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex items-center justify-center rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-sm transition hover:shadow-md"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={100}
                className="h-auto w-full grayscale transition duration-300 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
