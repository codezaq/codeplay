import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, Rocket, Star } from 'lucide-react';

interface WelcomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ isOpen, onClose, userName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
        >
          {/* Backdrop with animated gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          />
          
          {/* Particle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: "50%",
                  y: "50%"
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -40 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative z-10 text-center px-6"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(250,204,21,0.3)] border border-white/20"
            >
              <Crown className="w-12 h-12 text-black" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-display text-sm font-black uppercase tracking-[0.5em] text-yellow-400 mb-4">
                Access Granted
              </h2>
              <h1 className="font-display text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
                Selamat Datang <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-white">
                  Yang Mulia
                </span>
              </h1>
              <p className="text-zinc-500 font-display text-xl md:text-2xl font-black uppercase italic tracking-tight mb-12">
                {userName}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-12 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-yellow-400 transition-all group"
              >
                <span className="flex items-center gap-3">
                  Enter The Lab
                  <Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform" />
                </span>
              </motion.button>
              
              <div className="flex gap-4">
                <Sparkles className="w-5 h-5 text-yellow-500/50 animate-pulse" />
                <Star className="w-5 h-5 text-orange-500/50 animate-pulse delay-75" />
                <Sparkles className="w-5 h-5 text-pink-500/50 animate-pulse delay-150" />
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
