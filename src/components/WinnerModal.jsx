import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, User, X, PartyPopper } from 'lucide-react';
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
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-dark rounded-3xl p-8 max-w-lg w-full mx-4 overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(214, 90, 32, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burnt-orange via-yellow-500 to-burnt-orange" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-burnt-orange/10 rounded-full blur-3xl"
            />

            {/* Content */}
            <div className="relative text-center">
              {/* Trophy icon */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="p-4 rounded-full bg-gradient-to-br from-yellow-400 to-burnt-orange"
                  style={{ boxShadow: '0 0 30px rgba(214, 90, 32, 0.5)' }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              {/* Congratulations text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PartyPopper className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
                  <PartyPopper className="w-6 h-6 text-yellow-400 transform scale-x-[-1]" />
                </div>
                <p className="text-white/60 text-sm">We have a winner!</p>
              </motion.div>

              {/* Winner info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 justify-center text-burnt-orange mb-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Winner</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  {winner.imageUrl ? (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 }}
                      src={winner.imageUrl}
                      alt={winner.name}
                      className="w-20 h-20 rounded-full object-cover border-3 border-burnt-orange"
                      style={{ boxShadow: '0 0 20px rgba(214, 90, 32, 0.4)' }}
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-navy-light to-navy-deep flex items-center justify-center border-3 border-burnt-orange"
                    >
                      <span className="text-3xl font-bold text-white">
                        {winner.name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                  )}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl font-bold text-white glow-text"
                  >
                    {winner.name}
                  </motion.h3>
                </div>
              </motion.div>

              {/* Prize info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-4 rounded-2xl bg-burnt-orange/10 border border-burnt-orange/30"
              >
                <div className="flex items-center gap-2 justify-center text-burnt-orange mb-2">
                  <Gift className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Prize Won</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  {prize.imageUrl ? (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.6 }}
                      src={prize.imageUrl}
                      alt={prize.name}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-burnt-orange/50"
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.6 }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-burnt-orange to-burnt-orange-dark flex items-center justify-center"
                    >
                      <Gift className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xl font-bold text-burnt-orange"
                  >
                    {prize.name}
                  </motion.h3>
                </div>
              </motion.div>

              {/* Close button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-burnt-orange to-burnt-orange-light rounded-xl text-white font-bold shadow-lg hover:shadow-burnt-orange/30 transition-shadow"
              >
                Continue
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
