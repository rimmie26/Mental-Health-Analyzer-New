import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../common/Navbar';

interface ContactProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1a1008] via-dark-yellow-dark to-[#1a1008]">
      {/* Enhanced Animated Background Blobs - Darker */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-pastel-yellow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pastel-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute top-40 right-40 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-40 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />

      {/* Navbar */}
      <div className="relative z-20 px-6 py-4">
        <Navbar onLogin={onLogin} onNavigate={onNavigate} currentPage="contact" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 p-0.5 rounded-2xl">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-2xl">
                <span className="text-sm font-medium text-warm-white/80">📬 Get in Touch</span>
              </div>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-warm-white text-center mb-6">
            Contact <span className="bg-gradient-to-r from-pastel-yellow to-warm-white bg-clip-text text-transparent">Us</span>
          </h1>
          
          <p className="text-warm-white/60 text-center mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-warm-white">Thank You!</h3>
              <p className="text-warm-white/60 mt-2">Your message has been sent successfully.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-5 bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10"
            >
              <div>
                <label className="block text-sm font-medium text-warm-white/70 mb-1.5">
                  <i className="fas fa-user mr-2 text-pastel-yellow"></i>
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-warm-white placeholder-warm-white/30 focus:outline-none focus:border-pastel-yellow/50 transition-all duration-300 focus:ring-2 focus:ring-pastel-yellow/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-white/70 mb-1.5">
                  <i className="fas fa-envelope mr-2 text-pastel-yellow"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-warm-white placeholder-warm-white/30 focus:outline-none focus:border-pastel-yellow/50 transition-all duration-300 focus:ring-2 focus:ring-pastel-yellow/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-white/70 mb-1.5">
                  <i className="fas fa-pencil-alt mr-2 text-pastel-yellow"></i>
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-warm-white placeholder-warm-white/30 focus:outline-none focus:border-pastel-yellow/50 transition-all duration-300 resize-none focus:ring-2 focus:ring-pastel-yellow/20"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <i className="fas fa-paper-plane"></i>
                Send Message
              </motion.button>
            </motion.form>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'fa-envelope', text: 'support@serenoa.ai', delay: 0.4 },
              { icon: 'fa-phone', text: '+1 (555) 123-4567', delay: 0.5 },
              { icon: 'fa-clock', text: '24/7 Support', delay: 0.6 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay }}
                className="text-center text-warm-white/60 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-pastel-yellow/20 transition-all duration-300"
              >
                <i className={`fas ${item.icon} text-lg text-pastel-yellow mb-2`}></i>
                <p className="text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6">
        <p className="text-xs text-warm-white/20">© 2026 Serenoa — AI Mental Health Companion</p>
      </div>
    </div>
  );
};

export default Contact;