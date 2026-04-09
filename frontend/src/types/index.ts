export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  isFeatured?: boolean;
}

export type EventCategory =
  | "Hackathon"
  | "Guest Lecture"
  | "Workshop"
  | "Club Fair"
  | "Networking"
  | "Cultural";

export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}
