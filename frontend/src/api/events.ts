import type { Event } from "../types/index.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/api/events`);

  if (!response.ok) {
    throw new Error(`Failed to load events: ${response.status}`);
  }

  return (await response.json()) as Event[];
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:MM"
  location: string;
  category: string;   // e.g. "Hackathon", "Workshop"
  featured: boolean;
  createdBy: string;
}

/**
 * Create a new event — POST /api/events
 */
export async function createEvent(request: CreateEventRequest): Promise<Event> {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `Failed to create event (${res.status})`);
  }

  return res.json() as Promise<Event>;
}

/**
 * Get all events created by an organizer — GET /api/users/{userId}/created-events
 */
export async function getCreatedEvents(userId: string): Promise<Event[]> {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/created-events`);
  if (!res.ok) throw new Error("Failed to fetch created events");
  return res.json() as Promise<Event[]>;
}
