"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const slides = useMemo(
    () => [
      "/images/hero-1.jpg",
      "/images/hero-2.jpg",
      "/images/hero-3.jpg",
      "/images/hero-4.jpg",
    ],
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="Fest hero background"
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/10" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            February 9th-14th 2026 • Mahindra University
          </p>
          <h1 className="text-6xl font-black uppercase leading-none tracking-[0.18em] text-[#e31837] drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)] sm:text-7xl lg:text-8xl xl:text-9xl">
            <span className="block scale-x-[1.08]">AIRO</span>
            <span className="block scale-x-[1.08]">2026</span>
          </h1>
          <p className="text-lg leading-relaxed text-white/80">
            A week-long celebration of sports challenges with top colleges battling for glory.
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Registrations opening soon
          </p>
        </div>
      </div>
    </section>
  );
}
