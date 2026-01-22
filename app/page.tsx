import EventsGrid from "./components/EventsGrid";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import StatsSection from "./components/StatsSection";
import type { EventItem } from "./components/EventCard";

const events: EventItem[] = [
  {
    id: "archery",
    title: "Archery",
    description: "Precision rounds with knockout brackets and finals on the main lawn.",
    date: "Jan 24",
    time: "9:00 AM",
    image: "/images/event-1.svg",
    tag: "Target",
  },
  {
    id: "athletics",
    title: "Athletics",
    description: "Track & field sprints, relays, and endurance finals.",
    date: "Jan 24",
    time: "3:00 PM",
    image: "/images/event-2.svg",
    tag: "Track",
  },
  {
    id: "badminton",
    title: "Badminton",
    description: "Fast-paced rallies with singles and doubles championship matches.",
    date: "Jan 25",
    time: "10:30 AM",
    image: "/images/event-3.svg",
    tag: "Court",
  },
  {
    id: "basketball",
    title: "Basketball",
    description: "High-intensity knockout games under the arena lights.",
    date: "Jan 25",
    time: "6:00 PM",
    image: "/images/event-1.svg",
    tag: "Arena",
  },
  {
    id: "chess",
    title: "Chess",
    description: "Rapid and blitz formats with live boards and analysis lounge.",
    date: "Jan 26",
    time: "11:00 AM",
    image: "/images/event-2.svg",
    tag: "Mind",
  },
  {
    id: "cricket",
    title: "Cricket",
    description: "Day-night clashes with campus rivalries and finals ceremony.",
    date: "Jan 26",
    time: "4:30 PM",
    image: "/images/event-3.svg",
    tag: "Stadium",
  },
  {
    id: "football",
    title: "Football",
    description: "League stages with penalty shootout finale.",
    date: "Jan 27",
    time: "5:00 PM",
    image: "/images/event-1.svg",
    tag: "Pitch",
  },
  {
    id: "kabaddi",
    title: "Kabaddi",
    description: "Full-contact raids with crowd-powered energy.",
    date: "Jan 27",
    time: "7:30 PM",
    image: "/images/event-2.svg",
    tag: "Raid",
  },
  {
    id: "kho-kho",
    title: "Kho Kho",
    description: "Lightning tag matches across the central field.",
    date: "Jan 28",
    time: "9:30 AM",
    image: "/images/event-3.svg",
    tag: "Speed",
  },
  {
    id: "powerlifting",
    title: "Powerlifting",
    description: "Strength challenges with elite judging and crowd hype.",
    date: "Jan 28",
    time: "2:00 PM",
    image: "/images/event-1.svg",
    tag: "Strength",
  },
  {
    id: "snooker",
    title: "Snooker/Pool",
    description: "Precision tables, cue mastery, and tension-packed finals.",
    date: "Jan 28",
    time: "6:00 PM",
    image: "/images/event-2.svg",
    tag: "Cue",
  },
  {
    id: "swimming",
    title: "Swimming",
    description: "Freestyle and relay championships at the aquatic arena.",
    date: "Jan 29",
    time: "8:00 AM",
    image: "/images/event-3.svg",
    tag: "Pool",
  },
  {
    id: "table-tennis",
    title: "Table Tennis",
    description: "Lightning-fast rallies with singles and doubles brackets.",
    date: "Jan 29",
    time: "1:00 PM",
    image: "/images/event-1.svg",
    tag: "Spin",
  },
  {
    id: "tennis",
    title: "Tennis",
    description: "Grand slam format with serve challenges.",
    date: "Jan 29",
    time: "4:00 PM",
    image: "/images/event-2.svg",
    tag: "Court",
  },
  {
    id: "throwball",
    title: "Throwball",
    description: "High-tempo rallies with team tactics and finals spotlight.",
    date: "Jan 30",
    time: "9:30 AM",
    image: "/images/event-3.svg",
    tag: "Team",
  },
  {
    id: "volleyball",
    title: "Volleyball",
    description: "Power spikes and defensive walls in a knockout format.",
    date: "Jan 30",
    time: "1:30 PM",
    image: "/images/event-1.svg",
    tag: "Spike",
  },
  {
    id: "yoga",
    title: "Yoga",
    description: "Sunrise sessions with flexibility, form, and balance scoring.",
    date: "Jan 30",
    time: "6:30 AM",
    image: "/images/event-2.svg",
    tag: "Flow",
  },
  {
    id: "pickleball",
    title: "Pickleball",
    description: "Mixed doubles fun with finals on the marquee court.",
    date: "Jan 30",
    time: "5:30 PM",
    image: "/images/event-3.svg",
    tag: "Rally",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main>
        <Hero />
        <EventsGrid events={events} />
        <StatsSection />
        <section id="tickets" className="bg-black py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl border border-white/10 bg-[#e31837] px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Register
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Registrations opening soon.
              </h2>
              <p className="mt-2 text-base text-white/85">
                Stay tuned for the registration launch and event updates.
              </p>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Registrations opening soon
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
