import type { Event } from "../types/index.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/api/events`);

  if (!response.ok) {
    throw new Error(`Failed to load events: ${response.status}`);
  }

  return (await response.json()) as Event[];
}
