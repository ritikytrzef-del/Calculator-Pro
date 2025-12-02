import React from 'react';
import { ButtonConfig } from '../types';
import { BASIC_BUTTONS, SCIENTIFIC_BUTTONS } from '../constants';
import { ChevronDown, GripHorizontal, Sparkles } from 'lucide-react';

interface KeypadProps {
  onPress: (btn: ButtonConfig) => void;
  showScientific: boolean;
  toggleScientific: () => void;
  isDegree: boolean;
  isKeyboardMode: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onPress, showScientific, toggleScientific, isDegree, isKeyboardMode }) => {
  
  const handleVibratePress = (btn: ButtonConfig) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10); 
    }
    onPress(btn);
  };

  if (isKeyboardMode) {
    return (
      <div className="w-full p-4 pb-safe bg-white/50 dark:bg-black/20 backdrop-blur-sm z-20 flex justify-center animate-slide-up">
        <button
          onClick={() => onPress({ value: 'ai_solve', type: 'action', label: 'ASK AI' })}
          className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Sparkles size={20} />
          ASK AI / CONVERT
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/90 dark:bg-dark-surface/80 glass rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.3)] z-20 flex flex-col transition-all duration-300 pb-safe">
      
      {/* Scientific Toggle Handle */}
      <div 
        onClick={toggleScientific}
        className="w-full h-8 flex items-center justify-center cursor-pointer text-gray-400 hover:text-primary transition-colors group mt-1"
      >
        <div className="p-1 rounded-full group-hover:bg-white/10 transition-colors">
          {showScientific ? <ChevronDown size={20} /> : <GripHorizontal size={20} />}
        </div>
      </div>

      {/* Scientific Keys (Collapsible) */}
      <div className={`
        grid grid-cols-5 gap-2 px-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${showScientific ? 'max-h-80 opacity-100 mb-3 pt-2' : 'max-h-0 opacity-0 mb-0 pt-0'}
      `}>
        {SCIENTIFIC_BUTTONS.map((btn) => {
          const isToggle = btn.value === 'deg_toggle';
          
          return (
            <button
              key={btn.label}
              onClick={() => handleVibratePress(btn)}
              className={`
                h-10 text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center
                ${btn.value === 'ai_solve' ? btn.className : ''}
                ${isToggle 
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30' 
                  : (btn.value !== 'ai_solve' ? 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10' : '')
                }
              `}
            >
              {isToggle 
                ? (isDegree ? 'DEG' : 'RAD') 
                : (btn.icon ? btn.icon : btn.label)
              }
            </button>
          );
        })}
      </div>

      {/* Basic Keys */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 p-5 pt-1 pb-6 md:pb-8">
        {BASIC_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleVibratePress(btn)}
              className={btn.className}
            >
              {btn.icon ? btn.icon : btn.label}
            </button>
        ))}
      </div>
    </div>
  );
};

export default Keypad;