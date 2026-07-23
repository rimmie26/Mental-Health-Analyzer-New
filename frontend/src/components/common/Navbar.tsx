import React from 'react';

interface NavbarProps {
  onLogin?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  variant?: 'dark' | 'light';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onLogin, 
  onNavigate, 
  currentPage,
  variant = 'dark' 
}) => {
  const navItems = ['Home', 'About', 'Contact'];
  const isDark = variant === 'dark';

  return (
    <nav className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <i className={`fas fa-brain text-2xl ${isDark ? 'text-warm-white' : 'text-amber-600'} drop-shadow-lg`}></i>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-warm-white' : 'text-gray-800'}`}>
          Serenoa
        </h1>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate?.(item.toLowerCase())}
            className={`text-sm font-medium transition-colors ${
              currentPage === item.toLowerCase()
                ? isDark ? 'text-warm-white' : 'text-gray-800'
                : isDark ? 'text-warm-white/70 hover:text-warm-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {item}
          </button>
        ))}
        <button 
          onClick={onLogin}
          className={`${
            isDark 
              ? 'bg-white/20 backdrop-blur-sm text-warm-white hover:bg-white/30 border border-white/30' 
              : 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-400'
          } px-4 py-1.5 rounded-full transition-all text-sm`}
        >
          <i className="fas fa-user mr-2"></i>
          Login
        </button>
      </div>
    </nav>
  );
};