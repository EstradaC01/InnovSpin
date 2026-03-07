import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gift, Sparkles } from 'lucide-react';
import Header from './components/Header';
import SpinningWheel from './components/SpinningWheel';
import SpinButton from './components/SpinButton';
import WinnerModal from './components/WinnerModal';
import ManualEntryModal from './components/ManualEntryModal';
import useCSVParser from './hooks/useCSVParser';

function App() {
  // State
  const [companyName, setCompanyName] = useState('WhirlWin');
  const [participants, setParticipants] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isParticipantSpinning, setIsParticipantSpinning] = useState(false);
  const [isPrizeSpinning, setIsPrizeSpinning] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [prize, setPrize] = useState(null);
  const [spinResults, setSpinResults] = useState({ participant: null, prize: null });
  const [error, setError] = useState(null);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);

  // CSV Parser hook
  const { parseCSV } = useCSVParser();

  // Refs for wheel controls
  const participantWheelRef = useRef(null);
  const prizeWheelRef = useRef(null);

  // Check if both wheels have data
  const canSpin = participants.length > 0 && prizes.length > 0 && !isSpinning && !isParticipantSpinning && !isPrizeSpinning;
  const canSpinParticipant = participants.length > 0 && !isSpinning && !isParticipantSpinning;
  const canSpinPrize = prizes.length > 0 && !isSpinning && !isPrizeSpinning;

  // Handle file upload for participants
  const handleParticipantsUpload = useCallback(async (file) => {
    try {
      setError(null);
      const data = await parseCSV(file, 'participants');
      setParticipants(data);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  }, [parseCSV]);

  // Handle file upload for prizes
  const handlePrizesUpload = useCallback(async (file) => {
    try {
      setError(null);
      const data = await parseCSV(file, 'prizes');
      setPrizes(data);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  }, [parseCSV]);

  // Clear participants data
  const handleClearParticipants = useCallback(() => {
    setParticipants([]);
    setSpinResults(prev => ({ ...prev, participant: null }));
    if (spinResults.prize === null) {
      setWinner(null);
      setPrize(null);
      setShowWinnerModal(false);
    }
  }, [spinResults.prize]);

  // Clear prizes data
  const handleClearPrizes = useCallback(() => {
    setPrizes([]);
    setSpinResults(prev => ({ ...prev, prize: null }));
    if (spinResults.participant === null) {
      setWinner(null);
      setPrize(null);
      setShowWinnerModal(false);
    }
  }, [spinResults.participant]);

  // Add manual participants (to existing pool)
  const handleAddManualParticipants = useCallback((newParticipants) => {
    setParticipants(prev => [...prev, ...newParticipants]);
  }, []);

  // Add manual prizes (to existing pool)
  const handleAddManualPrizes = useCallback((newPrizes) => {
    setPrizes(prev => [...prev, ...newPrizes]);
  }, []);

  // Handle spin both wheels
  const handleSpin = useCallback(() => {
    if (!canSpin) return;

    setIsSpinning(true);
    setIsParticipantSpinning(true);
    setIsPrizeSpinning(true);

    // Reset previous results
    setSpinResults({ participant: null, prize: null });
    setShowWinnerModal(false);

    // Calculate random target positions for both wheels
    const participantTarget = Math.random() * 360;
    const prizeTarget = Math.random() * 360;

    // Spin both wheels
    participantWheelRef.current?.spin(participantTarget);
    prizeWheelRef.current?.spin(prizeTarget);
  }, [canSpin]);

  // Handle individual participant wheel spin
  const handleParticipantSpin = useCallback(() => {
    if (!canSpinParticipant) return;

    setIsParticipantSpinning(true);
    setSpinResults(prev => ({ ...prev, prize: prev.prize || null })); // Keep existing prize if any
    setShowWinnerModal(false);

    // Calculate random target position
    const participantTarget = Math.random() * 360;

    // Spin only participant wheel
    participantWheelRef.current?.spin(participantTarget);
  }, [canSpinParticipant]);

  // Handle individual prize wheel spin
  const handlePrizeSpin = useCallback(() => {
    if (!canSpinPrize) return;

    setIsPrizeSpinning(true);
    setSpinResults(prev => ({ ...prev, participant: prev.participant || null })); // Keep existing participant if any
    setShowWinnerModal(false);

    // Calculate random target position
    const prizeTarget = Math.random() * 360;

    // Spin only prize wheel
    prizeWheelRef.current?.spin(prizeTarget);
  }, [canSpinPrize]);

  // Handle when participant wheel stops
  const handleParticipantSpinEnd = useCallback((selectedParticipant) => {
    setIsParticipantSpinning(false);
    setIsSpinning(false);
    
    setSpinResults(prev => {
      const newResults = { ...prev, participant: selectedParticipant };

      // If both wheels have stopped, show winner and eliminate
      if (newResults.prize && newResults.participant) {
        setWinner(selectedParticipant);
        setPrize(newResults.prize);
        setTimeout(() => setShowWinnerModal(true), 500);
      }

      return newResults;
    });
  }, []);

  // Handle when prize wheel stops
  const handlePrizeSpinEnd = useCallback((selectedPrize) => {
    setIsPrizeSpinning(false);
    setIsSpinning(false);
    
    setSpinResults(prev => {
      const newResults = { ...prev, prize: selectedPrize };

      // If both wheels have stopped, show winner and eliminate
      if (newResults.participant && newResults.prize) {
        setWinner(newResults.participant);
        setPrize(selectedPrize);
        setTimeout(() => setShowWinnerModal(true), 500);
      }

      return newResults;
    });
  }, []);

  // Close winner modal and eliminate winners
  const handleCloseModal = useCallback(() => {
    setShowWinnerModal(false);
    
    // Elimination Mode: Remove the winner and prize from their respective arrays
    if (winner && prize) {
      // Remove only the first matching participant
      setParticipants(prev => {
        const index = prev.findIndex(p => p.name === winner.name);
        if (index > -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        }
        return prev;
      });
      
      // Remove only the first matching prize
      setPrizes(prev => {
        const index = prev.findIndex(p => p.name === prize.name);
        if (index > -1) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        }
        return prev;
      });
      
      // Reset spin results for next round
      setSpinResults({ participant: null, prize: null });
      setWinner(null);
      setPrize(null);
    }
  }, [winner, prize]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header */}
      <Header
        companyName={companyName}
        onOpenSettings={() => setShowManualEntryModal(true)}
      />
      <div style={{ height: '4rem' }} />

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500/90 backdrop-blur-sm rounded-xl shadow-lg"
          >
            <p className="text-white text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Title - Perfectly Centered */}
        <div className="w-full flex-shrink-0" style={{ transform: 'translateY(30px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              Who will be the lucky winner?
              <Sparkles className="w-8 h-8 text-amber-400" />
            </h2>
            <p className="text-white/60 text-lg mt-2">
              {participants.length} participants | {prizes.length} prizes
            </p>
          </motion.div>
        </div>

        {/* Wheels Container - Centered with gap */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 w-full px-4">
          {/* Participant Wheel */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="flex items-center gap-3 mb-12">
              <Users className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-semibold text-white">Participants</h3>
            </div>
            <SpinningWheel
              ref={participantWheelRef}
              items={participants}
              type="participants"
              size={Math.min(window.innerWidth * 0.45, window.innerHeight * 0.65, 850)}
              onSpinEnd={handleParticipantSpinEnd}
              isSpinning={isSpinning || isParticipantSpinning}
              onFileUpload={handleParticipantsUpload}
              onClearData={handleClearParticipants}
              hasData={participants.length > 0}
              onIndividualSpin={handleParticipantSpin}
              canSpinIndividually={canSpinParticipant}
            />
          </motion.div>

          {/* Spin Button - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex flex-col items-center flex-shrink-0 z-10"
          >
            <SpinButton
              onClick={handleSpin}
              disabled={!canSpin}
              isSpinning={isSpinning}
            />
            {!canSpin && !isSpinning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 text-sm text-center max-w-[200px] mt-2"
              >
                {participants.length === 0 && prizes.length === 0
                  ? 'Upload both CSV files to start'
                  : participants.length === 0
                  ? 'Upload participants CSV'
                  : 'Upload prizes CSV'}
              </motion.p>
            )}
          </motion.div>

          {/* Prize Wheel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="flex items-center gap-3 mb-12">
              <Gift className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-semibold text-white">Prizes</h3>
            </div>
            <SpinningWheel
              ref={prizeWheelRef}
              items={prizes}
              type="prizes"
              size={Math.min(window.innerWidth * 0.45, window.innerHeight * 0.65, 850)}
              onSpinEnd={handlePrizeSpinEnd}
              isSpinning={isSpinning || isPrizeSpinning}
              onFileUpload={handlePrizesUpload}
              onClearData={handleClearPrizes}
              hasData={prizes.length > 0}
              onIndividualSpin={handlePrizeSpin}
              canSpinIndividually={canSpinPrize}
            />
          </motion.div>
        </div>

          {/* Results Preview (shown after spin) */}
          <div className="mt-6 sm:mt-8">
            <AnimatePresence>
              {spinResults.participant && spinResults.prize && !showWinnerModal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="glass rounded-3xl px-12 py-8" style={{ minWidth: '400px' }}>
                    <p className="text-white/60 text-lg mb-4">Result</p>
                    <p className="text-3xl font-bold text-white">
                      <span className="text-amber-400">{spinResults.participant.name}</span>
                      {' '} wins {' '}
                      <span className="text-amber-400">{spinResults.prize.name}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-white/30 text-sm">
          {companyName} Raffle System
        </p>
      </footer>

      {/* Winner Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        winner={winner}
        prize={prize}
        onClose={handleCloseModal}
      />

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={showManualEntryModal}
        onClose={() => setShowManualEntryModal(false)}
        onAddParticipants={handleAddManualParticipants}
        onAddPrizes={handleAddManualPrizes}
      />
    </div>
  );
}

export default App;
