import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';

export default function SpinButton({ onClick, disabled, isSpinning }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isSpinning}
      whileHover={!disabled && !isSpinning ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isSpinning ? { scale: 0.95 } : {}}
      className={`
        relative rounded-full font-bold text-2xl text-white uppercase tracking-wider
        transition-all duration-300 overflow-hidden
        ${disabled || isSpinning
          ? 'bg-gray-500/50 cursor-not-allowed'
          : 'bg-gradient-to-r from-burnt-orange to-burnt-orange-light hover:from-burnt-orange-light hover:to-burnt-orange cursor-pointer'
        }
      `}
      style={!disabled && !isSpinning ? {
        padding: '32px 64px',
        boxShadow: '0 0 30px rgba(214, 90, 32, 0.5), 0 10px 40px rgba(214, 90, 32, 0.3)'
      } : {
        padding: '32px 64px'
      }}
    >
      {/* Animated background shimmer */}
      {!disabled && !isSpinning && (
        <motion.div
          className="absolute inset-0 shimmer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Button content */}
      <span className="relative flex items-center gap-4">
        {isSpinning ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>Spinning...</span>
          </>
        ) : (
          <>
            <Play className="w-8 h-8" />
            <span>Spin</span>
          </>
        )}
      </span>

      {/* Pulse effect when enabled */}
      {!disabled && !isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(214, 90, 32, 0.4)',
              '0 0 0 20px rgba(214, 90, 32, 0)',
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}
    </motion.button>
  );
}
