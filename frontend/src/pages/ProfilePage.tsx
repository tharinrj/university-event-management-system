import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { getUserRegistrations } from "../api/registrations.ts";
import type { RegisteredEvent } from "../api/registrations.ts";
import { categoryColors, categoryGradients } from "../data/mockEvents.ts";
import type { EventCategory } from "../types/index.ts";

const roleLabels: Record<string, { label: string; color: string }> = {
  STUDENT: { label: "Student", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  ORGANIZER: { label: "Event Organizer", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  ADMIN: { label: "Administrator", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatRegisteredAt(dt: string) {
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [registrations, setRegistrations] = useState<RegisteredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (user.role !== "STUDENT") {
      setLoading(false);
      return;
    }
    getUserRegistrations(user.id)
      .then(setRegistrations)
      .catch(() => setError("Could not load registrations. Please try again."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const roleInfo = roleLabels[user.role] ?? { label: user.role, color: "bg-gray-100 text-gray-700" };
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar strip */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">UniEvents</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Back to Events
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary-500 to-sky-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{user.fullName}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>
          {/* Stats — only for students */}
          {user.role === "STUDENT" && !loading && (
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {registrations.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {registrations.length === 1 ? "event registered" : "events registered"}
              </p>
            </div>
          )}
        </div>

        {/* Registered events — students only */}
        {user.role === "STUDENT" && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              My Registered Events
            </h2>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {!loading && !error && registrations.length === 0 && (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-16 text-center">
                <p className="text-5xl mb-4">🎟️</p>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No events yet</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Head to the home page and register for an event to see it here.
                </p>
                <a
                  href="/"
                  className="mt-6 inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Browse Events
                </a>
              </div>
            )}

            {!loading && !error && registrations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {registrations.map((reg) => {
                  const colors = categoryColors[reg.event.category as EventCategory] ?? { bg: "bg-gray-100", text: "text-gray-700" };
                  const gradient = categoryGradients[reg.event.category as EventCategory] ?? "from-gray-400 to-gray-600";
                  return (
                    <article
                      key={reg.registrationId}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
                    >
                      {/* Event colour strip */}
                      <div className={`h-32 bg-linear-to-br ${gradient} relative`}>
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-3 right-3 w-14 h-14 border-2 border-white rounded-full" />
                          <div className="absolute bottom-3 left-3 w-9 h-9 border-2 border-white rounded-lg rotate-12" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
                            {reg.event.category}
                          </span>
                        </div>
                        {/* Registered badge */}
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/90 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Registered
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {reg.event.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {reg.event.description}
                        </p>
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                              <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                            </svg>
                            <span>{formatDate(reg.event.date)} at {reg.event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                              <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                            </svg>
                            <span className="line-clamp-1">{reg.event.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-400 dark:text-gray-600">
                            Registered on {formatRegisteredAt(reg.registeredAt)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Non-student placeholder */}
        {user.role !== "STUDENT" && (
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
            <p className="text-4xl mb-4">{user.role === "ADMIN" ? "🛡️" : "📋"}</p>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {user.role === "ADMIN" ? "Admin Account" : "Organizer Account"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {user.role === "ADMIN"
                ? "As an administrator you manage the system. Event registration is reserved for students."
                : "As an event organizer you create and manage events. Event registration is reserved for students."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
