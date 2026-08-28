import Navbar from "./components/Navbar.tsx";
import HeroSection from "./components/HeroSection.tsx";
import UpcomingEvents from "./components/UpcomingEvents.tsx";
import HowItWorks from "./components/HowItWorks.tsx";
import Footer from "./components/Footer.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

export default function App() {
  const pathname = window.location.pathname;

  if (pathname === "/signup") {
    return <SignUpPage />;
  }

  if (pathname === "/login") {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <UpcomingEvents />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

