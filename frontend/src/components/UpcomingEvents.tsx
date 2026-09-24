import { useEffect, useMemo, useState } from "react";
import { getEvents } from "../api/events.ts";
import EventCard from "./EventCard.tsx";
import type { Event, EventCategory } from "../types/index.ts";

const ALL_CATEGORIES: EventCategory[] = [
  "Hackathon",
  "Guest Lecture",
  "Workshop",
  "Club Fair",
  "Networking",
  "Cultural",
];

const PAGE_SIZE = 6;

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="pt-2 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory | "All">("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const nextEvents = await getEvents();
        setEvents(nextEvents);
      } catch {
        setErrorMessage("Unable to load events right now. Make sure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadEvents();
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? events
        : events.filter((e) => e.category === activeCategory),
    [events, activeCategory]
  );

  const featuredEvents = useMemo(() => events.filter((e) => e.isFeatured), [events]);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Available categories from actual data
  const availableCategories = useMemo(
    () => ALL_CATEGORIES.filter((c) => events.some((e) => e.category === c)),
    [events]
  );

  return (
    <section id="events" className="py-20 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Upcoming Events
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Discover what's happening on campus — filter by category and find your next favourite event.
          </p>
        </div>

        {/* ── Featured strip (only when not filtering) ───────────── */}
        {!isLoading && !errorMessage && featuredEvents.length > 0 && activeCategory === "All" && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">⭐ Featured</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* ── Category filter tabs ────────────────────────────────── */}
        {!isLoading && !errorMessage && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              id="filter-all"
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === "All"
                  ? "bg-primary-600 text-white shadow-sm shadow-primary-200 dark:shadow-primary-900/40"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              All
              <span className="ml-1.5 text-xs opacity-70">({events.length})</span>
            </button>
            {availableCategories.map((cat) => (
              <button
                id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-200 dark:shadow-primary-900/40"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-70">
                  ({events.filter((e) => e.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Grid ────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No {activeCategory} events found.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <>
            {activeCategory !== "All" && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} {activeCategory} events
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Show more */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  id="show-more-events"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors"
                >
                  Show more
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
