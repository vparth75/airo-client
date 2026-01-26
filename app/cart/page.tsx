"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  playerNumber: number;
}

interface Registration {
  id: string;
  paidAmount: number;
  createdAt: string;
  collegeName?: string;
  captainName?: string;
  captainPhone?: string;
  teamMembers?: TeamMember[];
  event: {
    id: string;
    sport: string;
    displayName: string;
    prizePool: number;
    registrationFee: number;
    minPlayers: number;
    maxPlayers: number;
    isTeamEvent: boolean;
    category: string;
  };
}

const sportDisplayNames: { [key: string]: string } = {
  ATHLETICS: "Athletics",
  BADMINTON: "Badminton",
  BASKETBALL: "Basketball",
  CHESS: "Chess",
  CRICKET: "Cricket",
  FOOTBALL: "Football",
  KABADDI: "Kabaddi",
  KHO_KHO: "Kho Kho",
  POOL: "Pool",
  SNOOKER: "Snooker",
  POWERLIFTING: "Powerlifting",
  SWIMMING: "Swimming",
  TABLE_TENNIS: "Table Tennis",
  TENNIS: "Tennis",
  THROWBALL: "Throwball",
  VOLLEYBALL: "Volleyball",
  YOGA: "Yoga",
};

const categoryDisplayNames: { [key: string]: string } = {
  MENS: "Men's",
  WOMENS: "Women's",
  MIXED: "Mixed",
};

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signin?redirect=/cart");
      return;
    }
    fetchRegistrations();
  }, [user, router]);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      setError("Failed to load your registrations.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/registrations/${registrationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to cancel registration");
      
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    } catch (err) {
      setError("Failed to cancel registration.");
    }
  };

  const totalPaid = registrations.reduce((sum, r) => sum + r.paidAmount, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-4xl font-bold">
            My <span className="text-[#e31837]">Registrations</span>
          </h1>
          <p className="mb-8 text-white/60">
            View and manage your event registrations
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#e31837]" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold">No registrations yet</h3>
              <p className="mt-2 text-white/60">
                You haven&apos;t registered for any events yet.
              </p>
              <Link
                href="/register"
                className="mt-6 inline-block rounded-lg bg-[#e31837] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#c41530]"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {sportDisplayNames[registration.event.sport] || registration.event.sport}
                      </h3>
                      <p className="text-white/60">{registration.event.displayName}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            registration.event.category === "MENS"
                              ? "bg-blue-500/20 text-blue-400"
                              : registration.event.category === "WOMENS"
                              ? "bg-pink-500/20 text-pink-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {categoryDisplayNames[registration.event.category]}
                        </span>
                        {registration.event.isTeamEvent && (
                          <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
                            {registration.event.minPlayers === registration.event.maxPlayers
                              ? `Team of ${registration.event.minPlayers}`
                              : `${registration.event.minPlayers}-${registration.event.maxPlayers} players`}
                          </span>
                        )}
                        <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                          Prize: ₹{registration.event.prizePool.toLocaleString()}
                        </span>
                      </div>
                      
                      {registration.collegeName && !registration.event.isTeamEvent && (
                        <div className="mt-3 rounded-lg bg-white/5 p-3">
                          <p className="text-sm font-medium text-white">
                            {registration.collegeName}
                          </p>
                        </div>
                      )}
                      
                      {registration.event.isTeamEvent && registration.collegeName && (
                        <div className="mt-3 rounded-lg bg-white/5 p-4 space-y-3">
                          <div className="border-b border-white/10 pb-3">
                            <p className="text-sm font-semibold text-white">
                              {registration.collegeName}
                            </p>
                          </div>
                          
                          <div className="border-b border-white/10 pb-3">
                            <p className="text-xs font-medium text-[#e31837] uppercase tracking-wide mb-1">Captain</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-white font-medium">{registration.captainName}</p>
                              <p className="text-sm text-white/60">{registration.captainPhone}</p>
                            </div>
                          </div>
                          
                          {registration.teamMembers && registration.teamMembers.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-[#e31837] uppercase tracking-wide mb-2">
                                Team Members ({registration.teamMembers.length})
                              </p>
                              <div className="space-y-2">
                                {registration.teamMembers.map((member) => (
                                  <div key={member.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                    <p className="text-sm text-white">
                                      <span className="text-white/40 mr-2">{member.playerNumber}.</span>
                                      {member.name}
                                    </p>
                                    <p className="text-sm text-white/60">{member.phone}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-xs text-white/40">
                              Total players: {(registration.teamMembers?.length || 0) + 1} (including captain)
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <p className="mt-2 text-sm text-white/40">
                        Registered on{" "}
                        {new Date(registration.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#e31837]">
                        ₹{registration.paidAmount}
                      </p>
                      <button
                        onClick={() => handleCancel(registration.id)}
                        className="mt-2 text-sm text-white/60 transition-colors hover:text-red-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="rounded-xl border border-[#e31837]/30 bg-[#e31837]/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60">Total Registered Events</p>
                    <p className="text-2xl font-bold">{registrations.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60">Total Amount</p>
                    <p className="text-2xl font-bold text-[#e31837]">
                      ₹{totalPaid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/register"
                className="block rounded-lg border border-white/10 bg-white/5 p-4 text-center transition-colors hover:bg-white/10"
              >
                + Register for more events
              </Link>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
