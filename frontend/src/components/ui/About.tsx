import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../common/Navbar';

interface AboutProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate, onLogin }) => {
  const stats = [
    { value: '50K+', label: 'Active Users', icon: 'fa-users', color: 'text-blue-500', bg: 'bg-blue-100' },
    { value: '5M+', label: 'Minutes Meditated', icon: 'fa-clock', color: 'text-green-500', bg: 'bg-green-100' },
    { value: '92%', label: 'User Satisfaction', icon: 'fa-star', color: 'text-purple-500', bg: 'bg-purple-100' },
    { value: '24/7', label: 'Support Available', icon: 'fa-headset', color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered',
      desc: 'Intelligent conversations tailored to your needs',
      color: 'from-blue-400 to-cyan-400',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: '🔒',
      title: 'Private & Secure',
      desc: 'Your data stays confidential and protected',
      color: 'from-purple-400 to-violet-400',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: '💚',
      title: '24/7 Support',
      desc: 'Available anytime, anywhere you need it',
      color: 'from-rose-400 to-pink-400',
      bg: 'bg-rose-50',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      desc: 'Monitor your wellness journey with detailed insights',
      color: 'from-amber-400 to-orange-400',
      bg: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
  ];

  const team = [
    { name: 'Alex Johnson', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Sarah Chen', role: 'Lead Psychologist', emoji: '👩‍⚕️' },
    { name: 'Mike Patel', role: 'AI Engineer', emoji: '👨‍💻' },
    { name: 'Emily Davis', role: 'UX Designer', emoji: '🎨' },
  ];

  const testimonials = [
    {
      quote: "Serenoa changed how I view finals week. It's not about the grind anymore; it's about the flow.",
      author: 'Sarah J.',
      role: 'Graduate Student'
    },
    {
      quote: "The breathing exercises helped me manage my anxiety better than anything I've tried before.",
      author: 'David R.',
      role: 'Software Engineer'
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-rose-50/90">
      {/* Decorative Background Blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Navbar */}
      <div className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Navbar 
            onLogin={onLogin} 
            onNavigate={onNavigate} 
            currentPage="about" 
            variant="light"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 px-5 py-1.5 rounded-full mb-3">
            <span className="text-xs font-medium text-amber-700">🌟 About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Your Mental Wellness
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Serenoa is your AI-powered mental health companion designed to help you navigate 
            stress, anxiety, and everyday challenges with ease.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`${stat.bg} rounded-xl p-4 text-center border border-white/50 hover:shadow-lg transition-all`}
            >
              <i className={`fas ${stat.icon} text-xl ${stat.color} mb-1`}></i>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            Why Choose <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Serenoa</span>
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-8">
            We combine cutting-edge AI with compassionate care to provide you with the best mental wellness experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`${feature.bg} rounded-xl p-5 border ${feature.borderColor} hover:shadow-lg transition-all text-center`}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className={`text-sm font-semibold ${feature.textColor}`}>{feature.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Our Mission</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To make mental wellness accessible to everyone through innovative AI technology 
              and compassionate support, breaking down barriers to mental health care.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🌟</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Our Vision</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              A world where mental wellness is prioritized, and everyone has access to 
              personalized, AI-powered support whenever they need it.
            </p>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            What Our Users Say
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-8">
            Hear from people who have transformed their mental wellness journey with Serenoa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-2">
                  <span className="text-3xl text-amber-400">"</span>
                  <p className="text-sm text-gray-700 italic leading-relaxed">{testimonial.quote}</p>
                </div>
                <div className="mt-3 ml-7">
                  <p className="text-sm font-semibold text-gray-800">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            Meet Our <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-8">
            Passionate individuals dedicated to improving mental wellness through technology.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-5 text-center border border-white/50 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-1">{member.emoji}</div>
                <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 md:p-8 text-center text-white"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Ready to Start Your Wellness Journey?
          </h3>
          <p className="text-white/80 mb-5 max-w-2xl mx-auto text-sm">
            Join thousands of users who have found peace and balance with Serenoa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => onNavigate('hero')}
              className="px-6 py-2.5 bg-white text-amber-600 font-semibold rounded-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-lg text-sm"
            >
              <i className="fas fa-rocket mr-2"></i>
              Go Home
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-2.5 bg-amber-600/30 text-white font-semibold rounded-xl hover:bg-amber-600/40 transition-all hover:scale-105 border border-white/30 text-sm"
            >
              <i className="fas fa-envelope mr-2"></i>
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-4 border-t border-gray-200/30">
        <p className="text-[10px] text-gray-400">© 2026 Serenoa — AI Mental Health Companion</p>
      </div>
    </div>
  );
};

export default About;