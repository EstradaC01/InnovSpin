import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Header({ companyName, setCompanyName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(companyName);

  const handleDoubleClick = () => {
    setTempName(companyName);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setCompanyName(tempName || 'Makerspace Innovhub');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempName(companyName);
      setIsEditing(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full glass-dark sticky top-0 z-50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 sm:h-20">
          {/* Company Name (Editable) - Centered */}
          <div className="flex justify-center">
            {isEditing ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-center text-lg sm:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-burnt-orange max-w-md w-full"
              />
            ) : (
              <motion.h1
                onDoubleClick={handleDoubleClick}
                whileHover={{ scale: 1.02 }}
                className="text-lg sm:text-2xl font-bold text-white cursor-pointer hover:text-burnt-orange transition-colors duration-200"
                title="Double-click to edit"
              >
                {companyName}
              </motion.h1>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
