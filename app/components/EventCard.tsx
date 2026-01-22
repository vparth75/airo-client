import Image from "next/image";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  categories?: string[];
};

export default function EventCard({ event }: { event: EventItem }) {
  return (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
        {event.categories && event.categories.length > 0 && (
          <p className="text-sm text-white/70">{event.categories.join(" · ")}</p>
        )}
      </div>
    </article>
  );
}
