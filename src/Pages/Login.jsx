import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { motion } from 'framer-motion'; // For the smooth animations
import { Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) alert(error.message);
    else setMessage('✨ Check your inbox for the magic link!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#050505] px-4">
      {/* This is the background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-200 dark:bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 mb-4">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">ZenFlow</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-center">
              Your focus sanctuary starts here.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
  type="email"
  placeholder="Your email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-indigo-500 transition text-gray-900 dark:text-white"
  required
/>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-white dark:text-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Sending Magic...' : 'Get Magic Link'}
            </motion.button>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-2xl text-center font-medium border border-indigo-100 dark:border-indigo-500/20"
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;