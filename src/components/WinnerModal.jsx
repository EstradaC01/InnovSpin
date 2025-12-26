import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WinnerModal({ isOpen, winner, prize, onClose }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen && winner && prize) {
      // Trigger confetti explosion
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#D65A20', '#ffffff', '#FFD700', '#182B49']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#D65A20', '#ffffff', '#FFD700', '#182B49']
        });
      }, 250);

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D65A20', '#ffffff', '#FFD700']
      });

      // Play sound effect (placeholder - user needs to add audio file)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      return () => clearInterval(interval);
    }
  }, [isOpen, winner, prize]);

  return (
    <AnimatePresence>
      {isOpen && winner && prize && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Dark blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Legendary Item Drop Modal */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 12,
              stiffness: 150,
              mass: 0.8
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-3xl p-12 max-w-4xl w-full mx-4 overflow-hidden"
            style={{
              background: 'rgba(24, 43, 73, 0.85)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.2), 0 0 100px rgba(214, 90, 32, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Animated glow border effect */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(214, 90, 32, 0.3), transparent)',
                filter: 'blur(20px)',
                zIndex: -1
              }}
            />

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow-400/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-yellow-400/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-yellow-400/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow-400/50 rounded-br-2xl" />

            {/* Content */}
            <div className="relative text-center">
              {/* CONGRATULATIONS Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-12"
              >
                <motion.h2
                  className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(255, 215, 0, 0.8)',
                      '0 0 30px rgba(255, 215, 0, 1)',
                      '0 0 20px rgba(255, 215, 0, 0.8)',
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  CONGRATULATIONS!
                </motion.h2>
              </motion.div>

              {/* Prize Image - The FOCUS */}
              <motion.div
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{
                  delay: 0.4,
                  type: 'spring',
                  damping: 10,
                  stiffness: 100
                }}
                className="mb-12 flex justify-center"
              >
                <div className="relative">
                  {/* Rotating glow effect behind image */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(214, 90, 32, 0.6), transparent, rgba(255, 215, 0, 0.6), transparent)',
                      filter: 'blur(30px)',
                      transform: 'scale(1.3)',
                      zIndex: -1
                    }}
                  />

                  {prize.imageUrl ? (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      src={prize.imageUrl}
                      alt={prize.name}
                      className="w-80 h-80 rounded-2xl object-cover"
                      style={{
                        boxShadow: '0 0 40px rgba(214, 90, 32, 0.8), 0 0 80px rgba(214, 90, 32, 0.4)',
                        border: '3px solid rgba(214, 90, 32, 0.6)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback Gift Box Icon */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-80 h-80 rounded-2xl bg-gradient-to-br from-burnt-orange via-burnt-orange-light to-yellow-500 flex items-center justify-center"
                    style={{
                      display: prize.imageUrl ? 'none' : 'flex',
                      boxShadow: '0 0 40px rgba(214, 90, 32, 0.8), 0 0 80px rgba(214, 90, 32, 0.4)',
                      border: '3px solid rgba(214, 90, 32, 0.6)'
                    }}
                  >
                    <Gift className="w-40 h-40 text-white drop-shadow-2xl" strokeWidth={1.5} />
                  </motion.div>

                  {/* Particle effects around image */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-4 rounded-3xl bg-burnt-orange/20 blur-2xl -z-10"
                  />
                </div>
              </motion.div>

              {/* Winner Name */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <p className="text-sm text-white/50 uppercase tracking-widest mb-3">Winner</p>
                <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {winner.name}
                </h3>
              </motion.div>

              {/* Prize Name */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-10"
              >
                <p className="text-sm text-burnt-orange/70 uppercase tracking-widest mb-3">Prize</p>
                <h4 className="text-2xl font-bold text-burnt-orange drop-shadow-[0_0_8px_rgba(214,90,32,0.6)]">
                  {prize.name}
                </h4>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(214, 90, 32, 0.8), 0 0 60px rgba(214, 90, 32, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-12 py-4 bg-gradient-to-r from-burnt-orange via-burnt-orange-light to-burnt-orange rounded-xl text-white font-black text-lg uppercase tracking-wider relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 20px rgba(214, 90, 32, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <motion.div
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10">Close</span>
              </motion.button>
            </div>

            {/* Audio placeholder for win sound */}
            <audio ref={audioRef} preload="auto">
              {/* Add your sound file here: <source src="/win-sound.mp3" type="audio/mpeg" /> */}
            </audio>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
