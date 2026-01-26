"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Register", href: "/register" },
  { label: "Contact Us", href: "#contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e31837] text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-black/95 py-2 shadow-lg backdrop-blur"
                  >
                    <div className="border-b border-white/10 px-4 py-2">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                    <Link
                      href="/cart"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-[#e31837]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-[#e31837]"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-medium text-white transition-colors hover:text-[#e31837]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#e31837] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c41530]"
              >
                Register
              </Link>
            </div>
          )}
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

              {user ? (
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 pb-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e31837] text-sm font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/cart"
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e31837] py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#c41530]"
                    onClick={() => setOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full rounded-lg border border-white/20 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-[#e31837]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                  <Link
                    href="/signin"
                    className="w-full rounded-lg border border-white/20 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="w-full rounded-lg bg-[#e31837] py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#c41530]"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
