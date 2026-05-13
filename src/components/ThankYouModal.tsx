import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Rocket, Github, BookOpen } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  type: 'source' | 'docs';
  link: string;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, projectTitle, type, link }) => {
  const isDocs = type === 'docs';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-2xl text-center"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[80px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-20 h-20 ${isDocs ? 'bg-blue-400' : 'bg-yellow-400'} rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12`}
            >
              {isDocs ? (
                <BookOpen className="w-10 h-10 text-black" />
              ) : (
                <Heart className="w-10 h-10 text-black fill-black" />
              )}
            </motion.div>

            <h2 className="font-display text-4xl font-black uppercase italic mb-4 leading-tight">
              {isDocs ? 'Great Choice!' : 'Thank You!'}
            </h2>
            
            <p className="text-zinc-400 font-medium mb-8 leading-relaxed">
              {isDocs ? (
                <>Ready to dive deep into <span className="text-white font-bold">{projectTitle}</span>? The documentation is waiting for you!</>
              ) : (
                <>We really appreciate your interest in <span className="text-white font-bold">{projectTitle}</span>. The source code is now being prepared for you!</>
              )}
            </p>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open(link, '_blank');
                  onClose();
                }}
                className={`w-full py-5 ${isDocs ? 'bg-blue-400 hover:bg-blue-500' : 'bg-white hover:bg-yellow-400'} text-black rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 shadow-xl transition-colors`}
              >
                {isDocs ? <BookOpen className="w-5 h-5" /> : <Github className="w-5 h-5" />}
                {isDocs ? 'Open Documentation' : 'Go to Repository'}
              </motion.button>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {isDocs ? 'Quick Start' : 'Free Access'}
                </div>
                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Rocket className="w-3 h-3 text-orange-500" />
                  {isDocs ? 'Developer Guide' : 'Open Source'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
