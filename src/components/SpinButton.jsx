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
        transition-all duration-300 overflow-hidden glass
        ${disabled || isSpinning
          ? 'bg-gray-500/50 cursor-not-allowed'
          : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 cursor-pointer'
        }
      `}
      style={!disabled && !isSpinning ? {
        padding: '32px 64px',
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.5), 0 10px 40px rgba(245, 158, 11, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.2)'
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
              '0 0 0 0 rgba(245, 158, 11, 0.4)',
              '0 0 0 20px rgba(245, 158, 11, 0)',
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
