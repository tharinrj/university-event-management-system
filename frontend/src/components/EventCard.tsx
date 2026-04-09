import type { Event } from "../types/index.ts";
import { categoryColors, categoryGradients } from "../data/mockEvents.ts";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const colors = categoryColors[event.category];
  const gradient = categoryGradients[event.category];

  return (
    <article className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
      {/* Image placeholder */}
      <div
        className={`h-48 bg-linear-to-br ${gradient} relative overflow-hidden`}
      >
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
      </div>

      {/* Card body */}
      <div className="p-5">
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
            <span>
              {event.date} at {event.time}
            </span>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
