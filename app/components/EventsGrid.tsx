import EventCard, { EventItem } from "./EventCard";

export default function EventsGrid({ events }: { events: EventItem[] }) {
  return (
  <section id="events" className="bg-black py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e31837]">
            Featured Events
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Sports built for speed, skill, and spectacle.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/70">
            Every matchup is a fight for points and pride; expect fast breaks,
            power plays, and championship energy on every court and field.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
