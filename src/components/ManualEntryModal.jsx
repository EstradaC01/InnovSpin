import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X } from 'lucide-react';

export default function ManualEntryModal({ isOpen, onClose, onAddParticipants, onAddPrizes }) {
  const [inputType, setInputType] = useState('participants');
  const [inputValue, setInputValue] = useState('');

  const parseInput = (value) => {
    if (!value.trim()) return [];
    
    let names = [];
    
    if (value.includes(',')) {
      names = value.split(',');
    } else {
      names = value.split('\n');
    }
    
    return names
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  const handleAdd = () => {
    const names = parseInput(inputValue);
    
    if (names.length === 0) return;

    const entries = names.map((name, index) => ({
      id: `manual-${Date.now()}-${index}`,
      name: name,
      imageUrl: null
    }));

    if (inputType === 'participants') {
      onAddParticipants(entries);
    } else {
      onAddPrizes(entries);
    }

    setInputValue('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative rounded-2xl p-8 max-w-md w-full mx-4 overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-white">Manual Entry</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/60 hover:text-amber-400 transition-colors" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-3 ml-1">Entry Type</label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:border-burnt-orange transition-all"
                style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
              >
                <option value="participants">Participants</option>
                <option value="prizes">Prizes</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm text-white/60 mb-3 ml-1">
                Enter names ({inputType === 'participants' ? 'participants' : 'prizes'})
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputType === 'participants' 
                  ? "John Doe\nJane Smith\nBob Wilson" 
                  : "Grand Prize\n2nd Prize\n3rd Prize"}
                className="w-full px-5 py-4 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-burnt-orange resize-none h-48 transition-all"
                style={{ 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(214, 90, 32, 0.3), 0 0 20px rgba(214, 90, 32, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs text-white/60 mt-3 ml-1">
                One name per line or comma-separated
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-4 rounded-xl bg-transparent border border-white/30 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!inputValue.trim()}
                className="flex-1 px-5 py-4 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.4)';
                }}
              >
                Add {inputType === 'participants' ? 'Participants' : 'Prizes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
