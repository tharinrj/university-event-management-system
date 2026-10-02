const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface RegistrationStatus {
  registered: boolean;
  totalRegistrations: number;
}

export interface RegisteredEvent {
  registrationId: string;
  registeredAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    isFeatured: boolean;
  };
}

/**
 * Check whether a user is registered for an event.
 * Requires the user's JWT token for the Authorization header.
 */
export async function getRegistrationStatus(
  eventId: string,
  userId: string,
  token: string,
): Promise<RegistrationStatus> {
  const res = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/registration-status?userId=${encodeURIComponent(userId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch registration status");
  return res.json() as Promise<RegistrationStatus>;
}

/**
 * Register a user for an event.
 * Requires the user's JWT token for the Authorization header.
 */
export async function registerForEvent(
  eventId: string,
  userId: string,
  token: string,
): Promise<RegistrationStatus> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
 * Requires the user's JWT token for the Authorization header.
 */
export async function cancelRegistration(
  eventId: string,
  userId: string,
  token: string,
): Promise<RegistrationStatus> {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? "Cancellation failed");
  }
  return res.json() as Promise<RegistrationStatus>;
}

/**
 * Get all registered events for a user (for the profile page).
 * Requires the user's JWT token for the Authorization header.
 */
export async function getUserRegistrations(userId: string, token: string): Promise<RegisteredEvent[]> {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/registrations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch registrations");
  return res.json() as Promise<RegisteredEvent[]>;
}
