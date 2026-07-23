import { useState } from 'react';
import Hero from './components/ui/animated-shader-hero';
import Home from './components/ui/Home';
import Login from './components/ui/Login';
import About from './components/ui/About';
import Contact from './components/ui/Contact';
import { Questionnaire } from './components/screener/Questionnaire';

type Page = 'hero' | 'home' | 'login' | 'screener' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('hero');

  const handleStartScreening = () => {
    setCurrentPage('screener');
  };

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleBack = () => {
    setCurrentPage('hero');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Login submitted:', { email, password });
    setCurrentPage('home');
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
      
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => console.log('Chat with Serenoa clicked!')}
          className="group bg-white text-dark-yellow p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 hover:scale-110"
        >
          <i className="fas fa-comment-dots text-xl group-hover:animate-pulse"></i>
          <span className="font-semibold hidden md:inline text-sm">Talk to Serenoa</span>
        </button>
      </div>
    </>
  );
}

export default App;