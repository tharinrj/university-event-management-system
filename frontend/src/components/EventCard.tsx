import { useState, useEffect, useCallback } from "react";
import type { Event } from "../types/index.ts";
import { categoryColors, categoryGradients } from "../data/mockEvents.ts";
import { useAuth } from "../context/AuthContext.tsx";
import {
  getRegistrationStatus,
  registerForEvent,
  cancelRegistration,
} from "../api/registrations.ts";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const colors = categoryColors[event.category];
  const gradient = categoryGradients[event.category];
  const { user } = useAuth();

  const [isRegistered, setIsRegistered] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch registration status when user is logged in
  const fetchStatus = useCallback(async () => {
    if (!user) return;
    setStatusLoading(true);
    try {
      const status = await getRegistrationStatus(event.id, user.id, user.token);
      setIsRegistered(status.registered);
      setTotalRegistrations(status.totalRegistrations);
    } catch {
      // silently ignore — status unavailable
    } finally {
      setStatusLoading(false);
    }
  }, [user, event.id]);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const handleRegister = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      if (isRegistered) {
        const result = await cancelRegistration(event.id, user.id, user.token);
        setIsRegistered(result.registered);
        setTotalRegistrations(result.totalRegistrations);
      } else {
        const result = await registerForEvent(event.id, user.id, user.token);
        setIsRegistered(result.registered);
        setTotalRegistrations(result.totalRegistrations);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // Only students (or guests redirected to login) see the register button
  const canRegister = !user || user.role === "STUDENT";

  return (
    <article className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image placeholder */}
      <div className={`h-48 bg-linear-to-br ${gradient} relative overflow-hidden shrink-0`}>
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-lg rotate-12" />
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}
          >
            {event.category}
          </span>
        </div>
        {event.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
              Featured
            </span>
          </div>
        )}
        {/* Registration count badge */}
        {totalRegistrations > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-black/40 text-white backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
              </svg>
              {totalRegistrations}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Register section — only for students and guests */}
        {canRegister && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            {error && (
              <p className="mb-2 text-xs text-red-600 dark:text-red-400">{error}</p>
            )}

            {isRegistered ? (
              /* ── Registered state ── */
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  Registered
                </span>
                <button
                  id={`cancel-btn-${event.id}`}
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Cancelling…" : "Cancel registration"}
                </button>
              </div>
            ) : (
              /* ── Not registered state ── */
              <button
                id={`register-btn-${event.id}`}
                onClick={handleRegister}
                disabled={actionLoading || statusLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Registering…"
                  : statusLoading
                    ? "Loading…"
                    : !user
                      ? "Sign in to Register"
                      : "Register for Event"}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

