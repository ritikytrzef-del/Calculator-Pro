import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, X } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative mt-auto h-[70%] w-full bg-white dark:bg-dark-surface rounded-t-[2rem] shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-white/10">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Clock size={20} />
            <span>History</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClear}
              className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
              title="Clear History"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-sm">No history yet</span>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="flex flex-col items-end p-4 rounded-xl bg-gray-50 dark:bg-dark-surface2 active:scale-98 transition-transform cursor-pointer"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {item.expression}
                </div>
                <div className={`text-xl font-medium ${item.type === 'ai' ? 'text-purple-500' : 'text-primary'}`}>
                  = {item.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;