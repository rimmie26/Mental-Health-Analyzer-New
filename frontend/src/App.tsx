import { useState } from 'react';
import Hero from './components/ui/animated-shader-hero';
import Home from './components/ui/Home';
import Login from './components/ui/Login';
import About from './components/ui/About';
import Contact from './components/ui/Contact';
import { Questionnaire } from './components/screener/Questionnaire';
import ChatWidget from './components/ui/ChatWidget';
import { getUser, clearAuth, isAuthenticated } from './utils/auth';
import type { AuthUser } from './utils/auth';

type Page = 'hero' | 'home' | 'login' | 'screener' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');
  const [user, setUser] = useState<AuthUser | null>(getUser());
  // Where to send the user after a successful login (e.g. they hit "Start Screening" while logged out)
  const [postLoginPage, setPostLoginPage] = useState<Page>('home');

  const goToProtected = (page: Page) => {
    if (isAuthenticated()) {
      setCurrentPage(page);
    } else {
      setPostLoginPage(page);
      setCurrentPage('login');
    }
  };

  const handleStartScreening = () => {
    goToProtected('screener');
  };

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setCurrentPage('hero');
  };

  const handleBack = () => {
    setCurrentPage('hero');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    if (page === 'home' || page === 'screener') {
      goToProtected(page as Page);
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleLoginSubmit = (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    setCurrentPage(postLoginPage);
  };

  // Login Page
  if (currentPage === 'login') {
    return <Login onBack={handleBack} onLogin={handleLoginSubmit} />;
  }

  // About Page
  if (currentPage === 'about') {
    return <About onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  // Contact Page
  if (currentPage === 'contact') {
    return <Contact onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  // Home Page (Dashboard)
  if (currentPage === 'home') {
    return <Home onStartScreening={handleStartScreening} onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  // Screening Page
  if (currentPage === 'screener') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-yellow to-dark-yellow-dark p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Questionnaire onBack={handleBackToHome} />
        </div>
      </div>
    );
  }

  // Hero Page - Your Beautiful Landing Page
  return (
    <>
      <Hero
        trustBadge={{
          text: "Your mental wellness journey starts here",
          icons: ["🧠", "💚"]
        }}
        headline={{
          line1: "Your AI Mental",
          line2: "Health Companion"
        }}
        subtitle="Thoughtful AI chatbot to help you navigate stress, anxiety, and everyday challenges. Anonymous, science-based guidance available 24/7."
        buttons={{
          primary: {
            text: "Start Screening",
            onClick: handleStartScreening
          },
          secondary: {
            text: "Go to Dashboard",
            onClick: () => setCurrentPage('home')
          }
        }}
        showNavbar={true}
        showStats={true}
        onLogin={handleLogin}
        onNavigate={handleNavigate}
      />
      
      {/* Chat Widget - Floating */}
      <ChatWidget />
    </>
  );
}

export default App;