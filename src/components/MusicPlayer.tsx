import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSIC_CONFIG } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
          // Browsers often block autoplay, so we might need a user gesture
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Show tooltip on mount to let user know music is available
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[60] flex items-center gap-4">
      <audio
        ref={audioRef}
        src={MUSIC_CONFIG.url}
        loop
      />
      
      <div className="relative">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-full ml-4 px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl whitespace-nowrap pointer-events-none"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                {isPlaying ? 'Now Playing' : 'Play Background Music'}
              </p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase">
                {MUSIC_CONFIG.title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isPlaying && setShowTooltip(false)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shadow-2xl ${
            isPlaying 
              ? 'bg-yellow-400 border-yellow-400 text-black shadow-yellow-400/20' 
              : 'bg-zinc-900/50 backdrop-blur-xl border-white/10 text-white hover:border-yellow-400/50'
          }`}
        >
          {isPlaying ? (
            <div className="relative">
              <Volume2 className="w-6 h-6" />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-black rounded-full -z-10"
              />
            </div>
          ) : (
            <VolumeX className="w-6 h-6 opacity-50" />
          )}
        </motion.button>
      </div>

      {isPlaying && (
        <div className="flex gap-1 items-end h-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, 16, 8, 12, 4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              className="w-1 bg-yellow-400 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};
