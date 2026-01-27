"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface SportEvent {
  id: string;
  sport: string;
  eventType: string;
  displayName: string;
  prizePool: number;
  registrationFee: number;
  minPlayers: number;
  maxPlayers: number;
  isTeamEvent: boolean;
  category: string;
}

interface TeamMember {
  name: string;
  phone: string;
}

interface GroupedEvents {
  [sport: string]: SportEvent[];
}

const sportDisplayNames: { [key: string]: string } = {
  ARCHERY: "Archery",
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

function GenderSelector() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSelectGender = async (gender: "MALE" | "FEMALE", clearRegistrations = false) => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gender, clearRegistrations }),
      });

      const data = await res.json();

      if (res.ok) {
        updateUser({ gender });
      } else if (data.requiresConfirmation) {
        const confirmed = window.confirm(
          `You have ${data.registrationCount} existing registration(s). Changing your gender will cancel all your registrations. Do you want to continue?`
        );
        if (confirmed) {
          await handleSelectGender(gender, true);
        }
      } else {
        setError(data.message || "Failed to update gender");
      }
    } catch (err) {
      console.error("Failed to update gender:", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (user?.gender) {
    return (
      <div className="flex items-center gap-3">
        <span className={`rounded-lg px-4 py-2 text-sm font-medium ${
          user.gender === "MALE" 
            ? "bg-blue-500 text-white" 
            : "bg-pink-500 text-white"
        }`}>
          {user.gender === "MALE" ? "Male" : "Female"}
        </span>
        <button
          onClick={() => handleSelectGender(user.gender === "MALE" ? "FEMALE" : "MALE")}
          disabled={saving}
          className="text-sm text-white/60 underline hover:text-white disabled:opacity-50"
        >
          {saving ? "Changing..." : "Change"}
        </button>
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleSelectGender("MALE")}
          disabled={saving}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Male"}
        </button>
        <button
          onClick={() => handleSelectGender("FEMALE")}
          disabled={saving}
          className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Female"}
        </button>
      </div>
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}

interface RegistrationModalProps {
  event: SportEvent;
  onClose: () => void;
  onSuccess: () => void;
}

function RegistrationModal({ event, onClose, onSuccess }: RegistrationModalProps) {
  const [collegeName, setCollegeName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneErrors, setPhoneErrors] = useState<{ [key: string]: string }>({});

  const minAdditionalPlayers = event.minPlayers - 1;
  const maxAdditionalPlayers = event.maxPlayers - 1;

  const validatePhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePhoneChange = (value: string, field: string, index?: number) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    
    if (field === "captain") {
      setCaptainPhone(digitsOnly);
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneErrors((prev) => ({ ...prev, captain: "Must be 10 digits" }));
      } else {
        setPhoneErrors((prev) => {
          const { captain, ...rest } = prev;
          return rest;
        });
      }
    } else if (index !== undefined) {
      updateTeamMember(index, "phone", digitsOnly);
      const key = `member_${index}`;
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneErrors((prev) => ({ ...prev, [key]: "Must be 10 digits" }));
      } else {
        setPhoneErrors((prev) => {
          const { [key]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  useEffect(() => {
    if (event.isTeamEvent) {
      const initialMembers = Array.from({ length: minAdditionalPlayers }, () => ({
        name: "",
        phone: "",
      }));
      setTeamMembers(initialMembers);
    }
  }, [event.isTeamEvent, minAdditionalPlayers]);

  const addTeamMember = () => {
    if (teamMembers.length < maxAdditionalPlayers) {
      setTeamMembers([...teamMembers, { name: "", phone: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > minAdditionalPlayers) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: "name" | "phone", value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (event.isTeamEvent) {
      if (!validateEmail(captainEmail)) {
        setError("Please enter a valid email address for the captain");
        setSubmitting(false);
        return;
      }

      if (!validatePhone(captainPhone)) {
        setError("Captain phone must be exactly 10 digits");
        setSubmitting(false);
        return;
      }

      const invalidMembers = teamMembers.filter((m) => !validatePhone(m.phone));
      if (invalidMembers.length > 0) {
        setError("All team member phone numbers must be exactly 10 digits");
        setSubmitting(false);
        return;
      }

      // Check for duplicate names
      const allNames = [captainName.trim().toLowerCase(), ...teamMembers.map((m) => m.name.trim().toLowerCase())];
      const uniqueNames = new Set(allNames);
      if (uniqueNames.size !== allNames.length) {
        setError("Each team member must have a unique name");
        setSubmitting(false);
        return;
      }

      // Check for duplicate phone numbers
      const allPhones = [captainPhone, ...teamMembers.map((m) => m.phone)];
      const uniquePhones = new Set(allPhones);
      if (uniquePhones.size !== allPhones.length) {
        setError("Each team member must have a unique phone number");
        setSubmitting(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const body: any = { eventId: event.id, collegeName };

      if (event.isTeamEvent) {
        body.captainName = captainName;
        body.captainEmail = captainEmail;
        body.captainPhone = captainPhone;
        body.teamMembers = teamMembers;
      }

      const res = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {sportDisplayNames[event.sport]} - {event.displayName}
            </h2>
            <p className="mt-1 text-white/60">
              Registration Fee: <span className="text-[#e31837] font-semibold">₹{event.registrationFee}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {event.isTeamEvent ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-white/80">College Name *</label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-[#e31837] focus:outline-none"
                  placeholder="Enter college name"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 font-medium text-white/90">Captain Details</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/60">Name *</label>
                    <input
                      type="text"
                      required
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#e31837] focus:outline-none"
                      placeholder="Captain name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/60">Email *</label>
                    <input
                      type="email"
                      required
                      value={captainEmail}
                      onChange={(e) => setCaptainEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#e31837] focus:outline-none"
                      placeholder="captain@email.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-white/60">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={captainPhone}
                      onChange={(e) => handlePhoneChange(e.target.value, "captain")}
                      className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none ${
                        phoneErrors.captain ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-[#e31837]"
                      }`}
                      placeholder="10-digit number"
                    />
                    {phoneErrors.captain && (
                      <p className="mt-1 text-xs text-red-400">{phoneErrors.captain}</p>
                    )}
                    {captainPhone.length === 10 && (
                      <p className="mt-1 text-xs text-green-400">✓ Valid</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-white/90">
                    Team Members ({teamMembers.length + 1}/{event.maxPlayers})
                  </h3>
                  {teamMembers.length < maxAdditionalPlayers && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="text-sm text-[#e31837] hover:underline"
                    >
                      + Add Player
                    </button>
                  )}
                </div>
                
                <p className="mb-3 text-xs text-white/50">
                  Min {event.minPlayers} / Max {event.maxPlayers} players (including captain)
                </p>

                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="mt-2 text-sm text-white/40">{index + 1}.</span>
                      <div className="flex-1 grid gap-2 sm:grid-cols-2">
                        <input
                          type="text"
                          required
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#e31837] focus:outline-none"
                          placeholder="Player name"
                        />
                        <div>
                          <input
                            type="tel"
                            required
                            value={member.phone}
                            onChange={(e) => handlePhoneChange(e.target.value, "member", index)}
                            className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none ${
                              phoneErrors[`member_${index}`] ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-[#e31837]"
                            }`}
                            placeholder="Phone number"
                          />
                          {phoneErrors[`member_${index}`] && (
                            <p className="mt-1 text-xs text-red-400">{phoneErrors[`member_${index}`]}</p>
                          )}
                        </div>
                      </div>
                      {teamMembers.length > minAdditionalPlayers && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="mt-2 text-white/40 hover:text-red-400"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">College Name *</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-[#e31837] focus:outline-none"
                placeholder="Enter your college name"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#e31837] py-3 font-semibold text-white transition-colors hover:bg-[#c41530] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Adding to Cart...
              </span>
            ) : (
              `Add to Cart (₹${event.registrationFee})`
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSport, setExpandedSport] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = user?.gender
    ? events.filter((event) => {
        if (event.category === "MIXED") return true;
        if (user.gender === "MALE" && event.category === "MENS") return true;
        if (user.gender === "FEMALE" && event.category === "WOMENS") return true;
        return false;
      })
    : [];

  const groupedEvents: GroupedEvents = filteredEvents.reduce((acc, event) => {
    if (!acc[event.sport]) {
      acc[event.sport] = [];
    }
    acc[event.sport].push(event);
    return acc;
  }, {} as GroupedEvents);

  const handleEventClick = (event: SportEvent) => {
    if (!user) {
      router.push("/signin?redirect=/register");
      return;
    }
    setSelectedEvent(event);
  };

  const handleRegistrationSuccess = () => {
    setSelectedEvent(null);
    setSuccessMessage("Registration successful! View your registrations in the Cart.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 text-4xl font-bold">
            Register for <span className="text-[#e31837]">AIRO 2026</span>
          </h1>
          <p className="mb-8 text-white/60">
            Select an event to register
            {user?.gender && (
              <span className="ml-2">
                (Showing {user.gender === "MALE" ? "men's" : "women's"} and mixed events)
              </span>
            )}
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

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-400"
            >
              {successMessage}
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#e31837]" />
            </div>
          ) : !user?.gender ? (
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold">Select your gender to continue</h3>
              <p className="mt-2 mb-6 text-white/60">
                Please select your gender to view available events for registration.
              </p>
              <GenderSelector />
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedEvents).map(([sport, sportEvents]) => (
                <motion.div
                  key={sport}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSport(expandedSport === sport ? null : sport)}
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">
                        {sportDisplayNames[sport] || sport}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                        {sportEvents.length} event{sportEvents.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 transition-transform ${expandedSport === sport ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {expandedSport === sport && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10"
                      >
                        {sportEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
                          >
                            <div>
                              <p className="font-medium">{event.displayName}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-xs ${
                                    event.category === "MENS"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : event.category === "WOMENS"
                                      ? "bg-pink-500/20 text-pink-400"
                                      : "bg-purple-500/20 text-purple-400"
                                  }`}
                                >
                                  {categoryDisplayNames[event.category]}
                                </span>
                                {event.isTeamEvent && (
                                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                                    {event.minPlayers === event.maxPlayers
                                      ? `Team of ${event.minPlayers}`
                                      : `${event.minPlayers}-${event.maxPlayers} players`}
                                  </span>
                                )}
                                <span>Prize: ₹{event.prizePool.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-semibold text-[#e31837]">
                                ₹{event.registrationFee}
                              </span>
                              <p className="text-xs text-white/40">Click to add to cart</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
