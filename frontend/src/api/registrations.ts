const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface RegistrationStatus {
  registered: boolean;
  totalRegistrations: number;
}

/**
 * Check whether a user is registered for an event.
 */
export async function getRegistrationStatus(
  eventId: string,
  userId: string,
): Promise<RegistrationStatus> {
  const res = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/registration-status?userId=${encodeURIComponent(userId)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch registration status");
  return res.json() as Promise<RegistrationStatus>;
}

/**
 * Register a user for an event.
 */
export async function registerForEvent(
  eventId: string,
  userId: string,
): Promise<RegistrationStatus> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? "Registration failed");
  }
  return res.json() as Promise<RegistrationStatus>;
}

/**
 * Cancel a user's registration for an event.
 */
export async function cancelRegistration(
  eventId: string,
  userId: string,
): Promise<RegistrationStatus> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? "Cancellation failed");
  }
  return res.json() as Promise<RegistrationStatus>;
}
