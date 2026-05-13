import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  userName: string;
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Allow user to click to dismiss or wait
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-6"
        >
          {/* Background Atmospheric Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-yellow-400/5 blur-[150px]"
            />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-2xl text-center"
          >
            <motion.div
              initial={{ rotate: -180, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(250,204,21,0.3)]"
            >
              <Crown className="w-12 h-12 text-black" strokeWidth={2.5} />
            </motion.div>

            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-yellow-400/60 font-black uppercase tracking-[0.4em] text-[10px]"
              >
                Penghormatan Tertinggi
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none"
              >
                Selamat Datang<br />
                <span className="text-yellow-400">Yang Mulia</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.7, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-zinc-300">{userName}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="group relative flex items-center gap-3 bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black uppercase italic text-sm tracking-tighter transition-all"
                >
                  Masuki Lab <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </motion.div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -100],
                    opacity: [0, 1, 0],
                    x: [0, (i - 2) * 20]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                  className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <Sparkles className="w-3 h-3" />
              Powered by Playground Engine v2.0
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
