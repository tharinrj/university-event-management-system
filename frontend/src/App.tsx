import Navbar from "./components/Navbar.tsx";
import HeroSection from "./components/HeroSection.tsx";
import UpcomingEvents from "./components/UpcomingEvents.tsx";
import HowItWorks from "./components/HowItWorks.tsx";
import Footer from "./components/Footer.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

export default function App() {
  const isSignUpPage = window.location.pathname === "/signup";

  if (isSignUpPage) {
    return <SignUpPage />;
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
