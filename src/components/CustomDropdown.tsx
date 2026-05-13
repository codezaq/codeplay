import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  selected, 
  onChange, 
  label,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
          {label}
        </label>
      )}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm hover:border-yellow-400/50 transition-all text-left"
      >
        <span className="font-bold uppercase tracking-wider">{selected}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="text-zinc-500"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[140]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 right-0 top-full z-[150] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden py-2 backdrop-blur-xl"
            >
              <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                      selected === option ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {option}
                    {selected === option && (
                      <Check className="w-3 h-3" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
