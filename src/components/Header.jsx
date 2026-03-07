import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function Header({ companyName, onOpenSettings }) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full glass-dark z-50"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Company Name - Center */}
          <div className="flex justify-center" style={{ paddingLeft: '2rem' }}>
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              {companyName}
            </h1>
          </div>

          {/* Settings Button - Right */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ paddingRight: '2rem' }}
            title="Manual Entry"
          >
            <Settings className="w-5 h-5 text-white/70 hover:text-amber-400 transition-colors" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
