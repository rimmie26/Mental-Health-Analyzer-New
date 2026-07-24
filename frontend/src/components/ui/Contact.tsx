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
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1500);
  };

  const contactInfo = [
    { icon: 'fa-envelope', label: 'Email', value: 'support@serenoa.ai', color: 'text-blue-500', bg: 'bg-blue-100' },
    { icon: 'fa-phone', label: 'Phone', value: '+1 (555) 123-4567', color: 'text-green-500', bg: 'bg-green-100' },
    { icon: 'fa-clock', label: 'Hours', value: '24/7 Support', color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: 'fa-map-marker-alt', label: 'Location', value: 'San Francisco, CA', color: 'text-amber-500', bg: 'bg-amber-100' },
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
            currentPage="contact" 
            variant="light"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 px-5 py-1.5 rounded-full mb-3">
            <span className="text-xs font-medium text-amber-700">📬 Get in Touch</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
            Contact <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`${item.bg} rounded-xl p-4 text-center border border-white/50 hover:shadow-lg transition-all`}
            >
              <i className={`fas ${item.icon} text-xl ${item.color} mb-2`}></i>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-xs text-gray-700 font-medium">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-800">Thank You!</h3>
                  <p className="text-sm text-gray-600 mt-2">Your message has been sent successfully. We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        <i className="fas fa-user mr-2 text-amber-500"></i>
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        <i className="fas fa-envelope mr-2 text-amber-500"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      <i className="fas fa-tag mr-2 text-amber-500"></i>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      <i className="fas fa-pencil-alt mr-2 text-amber-500"></i>
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      rows={5}
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 resize-none text-sm"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* FAQ / Quick Help */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-amber-500">💡</span> Quick Help
              </h3>
              <div className="space-y-3">
                {[
                  { q: 'How does the screening work?', a: 'Complete 25 questions to get a personalized wellness report.' },
                  { q: 'Is my data private?', a: 'Yes, all your data is encrypted and never shared.' },
                  { q: 'How do I track progress?', a: 'View your dashboard for daily stats and milestones.' },
                ].map((item, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="text-xs font-medium text-gray-700">{item.q}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-200 text-center">
              <p className="text-xs text-gray-600">
                ⚡ Response time: <span className="text-amber-600 font-medium">Within 24 hours</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-4 border-t border-gray-200/30">
        <p className="text-[10px] text-gray-400">© 2026 Serenoa — AI Mental Health Companion</p>
      </div>
    </div>
  );
};

export default Contact;