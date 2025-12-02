import React, { useState, useEffect, useCallback } from 'react';
import { History, Moon, Sun, Loader2, Delete, Keyboard, Mic } from 'lucide-react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryDrawer from './components/HistoryDrawer';
import { evaluateExpression } from './services/mathUtils';
import { solveWithGemini } from './services/geminiService';
import { ButtonConfig, HistoryItem, ThemeConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showScientific, setShowScientific] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDegree, setIsDegree] = useState<boolean>(true); // Default to Degree
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Initialize Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Live Preview Logic
  useEffect(() => {
    if (!input || isKeyboardMode) {
      setLivePreview(null);
      return;
    }
    
    // Don't preview if input ends with operator or contains currency (let AI handle currency)
    const lastChar = input.slice(-1);
    if (['+', '-', '*', '/', '(', 'sin(', 'cos(', 'tan('].includes(lastChar)) {
      setLivePreview(null);
      return;
    }

    // Check for currency symbols - if present, don't try to eval with math
    if (/[₹$€£]/.test(input)) {
      setLivePreview("AI Mode...");
      return;
    }

    // Check if input contains letters (except valid math functions)
    // If user speaks "50 plus 20", it might come as words.
    // If input has unknown characters, don't try to math-eval it.
    if (/[a-zA-Z]/.test(input.replace(/sin|cos|tan|log|ln|sqrt|pi|e/gi, ''))) {
      setLivePreview("AI Mode...");
      return;
    }

    const preview = evaluateExpression(input, isDegree);
    if (preview !== 'Error' && preview !== input) {
      setLivePreview(preview);
    } else {
      setLivePreview(null);
    }
  }, [input, isDegree, isKeyboardMode]);

  const addToHistory = (expression: string, resultVal: string, type: 'math' | 'ai') => {
    const newItem: HistoryItem = {
      id: uuidv4(),
      expression,
      result: resultVal,
      timestamp: Date.now(),
      type
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleAiSolve = async () => {
    if (!input) return;
    setIsLoading(true);
    setResult("Thinking...");
    
    const aiResult = await solveWithGemini(input);
    
    setResult(aiResult);
    setIsLoading(false);
    addToHistory(input, aiResult, 'ai');
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US'; // Default to English, but it usually handles accents well
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      // Clean up transcript a bit for math if possible
      // e.g. "50 + 20" is fine, "fifty plus twenty" is better handled by AI
      
      // Replace input with voice text
      setInput(transcript);
      setResult(null); // Clear previous result
      
      // If the input is complex (has words), switch to Keyboard mode so user sees full text
      if (/[a-zA-Z]/.test(transcript.replace(/sin|cos|tan/g, ''))) {
         setIsKeyboardMode(true);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handlePress = (btn: ButtonConfig) => {
    // Vibrate on press
    if (navigator.vibrate) navigator.vibrate(5);

    if (btn.value === 'clear') {
      setInput('');
      setResult(null);
      setLivePreview(null);
    } else if (btn.value === '=') {
      if (!input) return;

      // Smart Routing: Check for Currency Symbols, Words, or Keyboard Mode
      const hasCurrency = /[₹$€£]/.test(input);
      // Check for words that are not scientific functions
      const hasWords = /[a-zA-Z]/.test(input.replace(/sin|cos|tan|log|ln|sqrt|pi|e|deg|rad|mod|inv|abs/gi, ''));
      
      if (isKeyboardMode || hasCurrency || hasWords) {
        handleAiSolve();
      } else {
        // Standard Math
        const res = evaluateExpression(input, isDegree);
        setResult(res);
        addToHistory(input, res, 'math');
      }
    } else if (btn.value === 'ai_solve') {
      handleAiSolve();
    } else if (btn.value === 'deg_toggle') {
      setIsDegree(!isDegree);
    } else if (btn.value === 'keyboard_mode') {
      setIsKeyboardMode(!isKeyboardMode);
      if (!isKeyboardMode) {
        setShowScientific(false); // Clean up UI when entering keyboard mode
      }
    } else {
      if (result && !['+', '-', '*', '/', '%', '^'].includes(btn.value) && btn.type !== 'scientific') {
        setInput(btn.value);
        setResult(null);
      } else if (result && ['+', '-', '*', '/', '%', '^'].includes(btn.value)) {
        setInput(result + btn.value);
        setResult(null);
      } else {
        setInput(prev => prev + btn.value);
        setResult(null);
      }
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
    setResult(null);
  };

  // Keyboard support for physical keyboard
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    
    if (isKeyboardMode) return; 

    if (/[0-9.]/.test(key)) {
      handlePress({ label: key, value: key, type: 'number' });
    } else if (['+', '-', '*', '/'].includes(key)) {
      handlePress({ label: key, value: key, type: 'operator' });
    } else if (key === 'Enter') {
      handlePress({ label: '=', value: '=', type: 'action' });
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === 'Escape') {
      handlePress({ label: 'C', value: 'clear', type: 'action' });
    }
  }, [input, result, isKeyboardMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-100 dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-safe z-20">
        <button 
          onClick={() => setShowHistory(true)}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <History className="text-gray-600 dark:text-gray-300" size={24} />
        </button>
        
        <div className="flex gap-2">
           {/* Mic Button */}
           <button 
            onClick={startVoiceInput}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
          >
            <Mic size={24} />
          </button>

           {/* Toggle Keyboard Mode Button */}
           <button 
            onClick={() => setIsKeyboardMode(!isKeyboardMode)}
            className={`p-2 rounded-full transition-colors ${isKeyboardMode ? 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-300' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
          >
            <Keyboard size={24} />
          </button>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-indigo-600" size={24} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-end relative z-10 pb-0">
        
        {/* Display */}
        <div className="flex-1 flex flex-col justify-end">
           {isLoading && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fuchsia-500 animate-fade-in">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-xs font-bold tracking-widest uppercase">Computing</span>
              </div>
           )}
           
           <Display 
              input={input} 
              setInput={setInput}
              result={result} 
              isAiMode={history.length > 0 && history[0].type === 'ai' && result === history[0].result}
              isDegree={isDegree}
              livePreview={livePreview}
              isKeyboardMode={isKeyboardMode}
              isListening={isListening}
           />
           
           {/* Delete Button (Only visible if not empty and not keyboard mode) */}
           {!isKeyboardMode && input && (
             <div className="w-full flex justify-end px-6 pb-2 text-gray-400">
                <button 
                  onClick={handleDelete}
                  className="p-2 active:scale-90 transition-transform hover:text-red-400"
                >
                  <Delete size={28} />
                </button>
             </div>
           )}
        </div>

        {/* Keypad */}
        <Keypad 
          onPress={handlePress} 
          showScientific={showScientific}
          toggleScientific={() => setShowScientific(!showScientific)}
          isDegree={isDegree}
          isKeyboardMode={isKeyboardMode}
        />
      </div>

      {/* History Drawer */}
      <HistoryDrawer 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history}
        onSelect={(item) => {
          setInput(item.expression);
          setResult(item.result);
          setShowHistory(false);
        }}
        onClear={() => setHistory([])}
      />
    </div>
  );
};

export default App;