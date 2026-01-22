"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Events", href: "#events" },
  { label: "Register", href: "#tickets" },
  { label: "Contact Us", href: "#contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
  <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur">
  <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8 text-white">
        <Link href="#" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden">
            <Image
              src="/airo-logo.png"
              alt="AIRO logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

  <div className="hidden items-center gap-6 text-sm font-medium text-white lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#e31837]"
            >
              {link.label}
            </a>
          ))}
        </div>


        <button
          className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white transition hover:border-white lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 top-full border-t border-white/10 bg-black/95 backdrop-blur lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 text-sm font-medium text-white sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-[#e31837]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
