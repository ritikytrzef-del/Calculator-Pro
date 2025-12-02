import React, { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

interface DisplayProps {
  input: string;
  setInput: (val: string) => void;
  result: string | null;
  isAiMode: boolean;
  isDegree: boolean;
  livePreview: string | null;
  isKeyboardMode: boolean;
  isListening: boolean;
}

const Display: React.FC<DisplayProps> = ({ 
  input, setInput, result, isAiMode, isDegree, livePreview, isKeyboardMode, isListening 
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll logic for standard display
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [input]);
  
  // Scroll result into view if it updates
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = 0; // Reset scroll on new result
    }
  }, [result]);

  // Focus textarea when entering keyboard mode
  useEffect(() => {
    if (isKeyboardMode && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isKeyboardMode]);

  return (
    <div className={`
      flex flex-col justify-end items-end p-6 w-full relative z-10
      transition-all duration-500 ease-out 
      ${isKeyboardMode ? 'h-[300px]' : 'h-[240px] md:h-[280px]'}
    `}>
      {/* Listening Overlay */}
      {isListening && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm rounded-3xl animate-fade-in">
          <div className="p-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
             <Mic className="text-white" size={32} />
          </div>
          <span className="mt-4 text-lg font-medium text-gray-800 dark:text-white">Listening...</span>
        </div>
      )}

      {/* Mode Indicators */}
      <div className="absolute top-4 left-6 flex gap-2 animate-fade-in z-20">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-300 border ${isDegree ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'border-transparent text-gray-400 opacity-50'}`}>
          DEG
        </span>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-300 border ${!isDegree ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'border-transparent text-gray-400 opacity-50'}`}>
          RAD
        </span>
        {isKeyboardMode && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 animate-pulse">
            PRO MODE
          </span>
        )}
      </div>

      {/* Secondary Display (History or Live Preview) */}
      <div className={`
        text-right font-mono overflow-hidden transition-all duration-300 min-h-[1.5rem] w-full
        ${result ? 'text-gray-500 dark:text-gray-400 text-lg mb-1' : 'text-gray-400 dark:text-gray-500 text-2xl mt-1 order-last opacity-80'}
      `}>
        {result !== null 
          ? (!isKeyboardMode && input)  // Show equation small if result shown (calc mode)
          : (livePreview && livePreview !== 'Error' && livePreview !== input ? `= ${livePreview}` : '') // Show live preview
        }
      </div>

      {/* Main Input/Result Area */}
      {isKeyboardMode ? (
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tap Mic or type... (e.g. 100 USD to INR)"
          className="w-full bg-transparent text-right text-3xl md:text-4xl font-light text-gray-800 dark:text-white outline-none resize-none placeholder-gray-300 dark:placeholder-gray-600 h-40 font-mono leading-snug"
        />
      ) : (
        <div className="w-full flex flex-col items-end">
           {/* If result exists, show it big. If not, show input big. */}
           {result !== null ? (
             <div 
               ref={resultRef}
               className={`
                 w-full text-right overflow-y-auto overflow-x-hidden max-h-[140px] no-scrollbar
                 ${isAiMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400' : 'text-gray-800 dark:text-white'}
                 text-4xl md:text-5xl font-light tracking-tight
               `}
             >
                <span className="whitespace-pre-wrap break-words">{result}</span>
             </div>
           ) : (
             <div 
               ref={inputRef}
               className="w-full text-right overflow-x-auto no-scrollbar whitespace-nowrap py-1"
             >
               <span className={`
                 font-light tracking-tight transition-all duration-300 block
                 text-gray-800 dark:text-white
                 ${input === 'Error' ? 'text-red-500' : ''}
                 ${input.length > 10 ? 'text-5xl md:text-6xl' : 'text-6xl md:text-7xl'}
               `}>
                 {input || '0'}
               </span>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Display;