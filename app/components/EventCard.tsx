import Image from "next/image";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  tag?: string;
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
        {event.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-[#e31837] px-3 py-1 text-xs font-semibold text-white">
            {event.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
      </div>
    </article>
  );
}
