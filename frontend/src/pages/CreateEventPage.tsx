import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { createEvent, type CreateEventRequest } from "../api/events.ts";

const CATEGORIES = [
  "Hackathon",
  "Guest Lecture",
  "Workshop",
  "Club Fair",
  "Networking",
  "Cultural",
];

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  featured: boolean;
}

const empty: FormData = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "",
  featured: false,
};

export default function CreateEventPage() {
  const { user } = useAuth();

  // Redirect non-organizers / non-admins
  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    window.location.href = "/";
    return null;
  }

  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const next: Partial<FormData> = {};
    if (!form.title.trim()) next.title = "Title is required";
    else if (form.title.length > 120) next.title = "Max 120 characters";
    if (!form.description.trim()) next.description = "Description is required";
    else if (form.description.length > 2000) next.description = "Max 2000 characters";
    if (!form.date) next.date = "Date is required";
    if (!form.time) next.time = "Time is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.category) next.category = "Category is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const req: CreateEventRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        category: form.category,
        featured: form.featured,
        createdBy: user.id,
      };
      await createEvent(req);
      setSuccess(true);
      setForm(empty);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">UniEvents</span>
          </a>
          <a
            href="/"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to Events
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            New Event
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an event</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Fill in the details below and your event will be published immediately.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">Event published!</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                Your event is now live.{" "}
                <a href="/profile" className="underline font-medium hover:no-underline">View my events →</a>
                {" · "}
                <a href="/" className="underline font-medium hover:no-underline">Browse all →</a>
              </p>
            </div>
          </div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-300">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Card 1 — Core details */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event details</h2>

            {/* Title */}
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Event title <span className="text-red-500">*</span>
              </label>
              <input
                id="event-title"
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Spring Hackathon 2026"
                maxLength={120}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors ${
                  errors.title
                    ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                }`}
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
              <p className="mt-1 text-xs text-gray-400 text-right">{form.title.length}/120</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="event-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="event-desc"
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What's this event about? Who should attend?"
                maxLength={2000}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors resize-none ${
                  errors.description
                    ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                }`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
              <p className="mt-1 text-xs text-gray-400 text-right">{form.description.length}/2000</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="event-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="event-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none transition-colors ${
                  errors.category
                    ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
            </div>
          </div>

          {/* Card 2 — Time & Location */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">When & where</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none transition-colors ${
                    errors.date
                      ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                  }`}
                />
                {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none transition-colors ${
                    errors.time
                      ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                  }`}
                />
                {errors.time && <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="event-location"
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Engineering Building, Hall A"
                maxLength={200}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors ${
                  errors.location
                    ? "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                }`}
              />
              {errors.location && <p className="mt-1.5 text-xs text-red-500">{errors.location}</p>}
            </div>
          </div>

          {/* Card 3 — Options */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Options</h2>
            <label htmlFor="event-featured" className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  id="event-featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-primary-600 transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature this event</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  Featured events appear highlighted with a badge and at the top of listings.
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="/"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              id="create-event-submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Publishing…
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Publish Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
