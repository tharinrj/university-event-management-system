import type { Event, HowItWorksStep, NavLink } from "../types/index.ts";

export const navLinks: NavLink[] = [
  { label: "Events", href: "#events" },
  { label: "About", href: "#how-it-works" },
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "HackUni 2026",
    description:
      "36-hour hackathon bringing together 500+ students to build innovative solutions for real-world Uni challenges.",
    date: "Apr 5, 2026",
    time: "6:00 PM",
    location: "Engineering Building, Hall A",
    category: "Hackathon",
    isFeatured: true,
  },
  {
    id: "2",
    title: "AI in Higher Education: A Guest Lecture",
    description:
      "Dr. Sarah Chen from MIT discusses how artificial intelligence is reshaping university learning and research.",
    date: "Mar 22, 2026",
    time: "2:00 PM",
    location: "Science Auditorium, Room 301",
    category: "Guest Lecture",
  },
  {
    id: "3",
    title: "Spring Club Fair 2026",
    description:
      "Explore 100+ student organizations, find your community, and sign up for clubs that match your interests.",
    date: "Mar 30, 2026",
    time: "10:00 AM",
    location: "Student Union Plaza",
    category: "Club Fair",
  },
  {
    id: "4",
    title: "Intro to Cloud Computing Workshop",
    description:
      "Hands-on workshop covering AWS fundamentals, deployment pipelines, and serverless architectures for beginners.",
    date: "Apr 2, 2026",
    time: "4:00 PM",
    location: "CS Lab 204",
    category: "Workshop",
  },
  {
    id: "5",
    title: "Industry Networking Night",
    description:
      "Connect with recruiters and alumni from top tech companies. Bring your resume and your curiosity.",
    date: "Apr 10, 2026",
    time: "7:00 PM",
    location: "Business School Atrium",
    category: "Networking",
  },
  {
    id: "6",
    title: "International Culture Festival",
    description:
      "Celebrate diversity with performances, food stalls, and exhibitions representing 40+ countries on Uni.",
    date: "Apr 18, 2026",
    time: "11:00 AM",
    location: "Main Quad & Amphitheater",
    category: "Cultural",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    title: "Browse Events",
    description:
      "Explore upcoming events across Uni filtered by category, date, or department.",
    icon: "search",
  },
  {
    id: 2,
    title: "Register Instantly",
    description:
      "Sign up for events with a single click. Get confirmation and calendar reminders automatically.",
    icon: "ticket",
  },
  {
    id: 3,
    title: "Attend & Connect",
    description:
      "Show up, learn something new, and meet like-minded students and professionals.",
    icon: "users",
  },
];

export const categoryColors: Record<
  Event["category"],
  { bg: string; text: string }
> = {
  Hackathon: {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  "Guest Lecture": {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  Workshop: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  "Club Fair": {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  Networking: {
    bg: "bg-rose-100 dark:bg-rose-900/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  Cultural: {
    bg: "bg-teal-100 dark:bg-teal-900/40",
    text: "text-teal-700 dark:text-teal-300",
  },
};

export const categoryGradients: Record<Event["category"], string> = {
  Hackathon: "from-violet-500 to-purple-600",
  "Guest Lecture": "from-blue-500 to-cyan-600",
  Workshop: "from-emerald-500 to-teal-600",
  "Club Fair": "from-amber-500 to-orange-600",
  Networking: "from-rose-500 to-pink-600",
  Cultural: "from-teal-500 to-green-600",
};
