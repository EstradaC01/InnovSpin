import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gift, Sparkles } from 'lucide-react';
import Header from './components/Header';
import SpinningWheel from './components/SpinningWheel';
import SpinButton from './components/SpinButton';
import WinnerModal from './components/WinnerModal';
import useCSVParser from './hooks/useCSVParser';

function App() {
  // State
  const [companyName, setCompanyName] = useState('Makerspace Innovhub');
  const [participants, setParticipants] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [prize, setPrize] = useState(null);
  const [spinResults, setSpinResults] = useState({ participant: null, prize: null });
  const [error, setError] = useState(null);

  // CSV Parser hook
  const { parseCSV } = useCSVParser();

  // Refs for wheel controls
  const participantWheelRef = useRef(null);
  const prizeWheelRef = useRef(null);

  // Check if both wheels have data
  const canSpin = participants.length > 0 && prizes.length > 0 && !isSpinning;

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
  }, []);

  // Clear prizes data
  const handleClearPrizes = useCallback(() => {
    setPrizes([]);
  }, []);

  // Handle spin
  const handleSpin = useCallback(() => {
    if (!canSpin) return;

    setIsSpinning(true);

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

  // Handle when participant wheel stops
  const handleParticipantSpinEnd = useCallback((selectedParticipant) => {
    setSpinResults(prev => {
      const newResults = { ...prev, participant: selectedParticipant };

      // If both wheels have stopped, show winner
      if (newResults.prize) {
        setWinner(selectedParticipant);
        setPrize(newResults.prize);
        setIsSpinning(false);
        setTimeout(() => setShowWinnerModal(true), 500);
      }

      return newResults;
    });
  }, []);

  // Handle when prize wheel stops
  const handlePrizeSpinEnd = useCallback((selectedPrize) => {
    setSpinResults(prev => {
      const newResults = { ...prev, prize: selectedPrize };

      // If both wheels have stopped, show winner
      if (newResults.participant) {
        setWinner(newResults.participant);
        setPrize(selectedPrize);
        setIsSpinning(false);
        setTimeout(() => setShowWinnerModal(true), 500);
      }

      return newResults;
    });
  }, []);

  // Close winner modal
  const handleCloseModal = useCallback(() => {
    setShowWinnerModal(false);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header */}
      <Header
        companyName={companyName}
        setCompanyName={setCompanyName}
      />

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
      <main className="flex-1 flex flex-col items-center overflow-hidden">
        <div className="w-full h-full flex flex-col items-center" style={{ paddingTop: '2vh' }}>
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            style={{ marginBottom: '1.5vh' }}
          >
            {/* Circular Logo */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <div
                  className="rounded-full overflow-hidden border-4 border-burnt-orange shadow-lg"
                  style={{
                    width: 'min(12vw, 180px)',
                    height: 'min(12vw, 180px)',
                    boxShadow: '0 0 30px rgba(214, 90, 32, 0.5), 0 0 60px rgba(214, 90, 32, 0.3)'
                  }}
                >
                  <img
                    src="/makerspace logo.jpg"
                    alt="Makerspace Innovhub Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Spacer between logo and text */}
            <div style={{ height: '2vh' }} />

            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3" style={{ marginBottom: '1vh' }}>
              <Sparkles className="w-8 h-8 text-burnt-orange" />
              Year-End Draw
              <Sparkles className="w-8 h-8 text-burnt-orange" />
            </h2>
            <p className="text-white/60 text-lg">
              {participants.length} participants | {prizes.length} prizes
            </p>
          </motion.div>

          {/* Wheels Container */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full" style={{ marginTop: '-25vh', paddingLeft: '3rem', paddingRight: '3rem' }}>
            {/* Participant Wheel - Positioned to the left */}
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center lg:-ml-12"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-burnt-orange" />
                <h3 className="text-xl font-semibold text-white">Participants</h3>
              </div>
              <div className="mt-4">
                <SpinningWheel
                  ref={participantWheelRef}
                  items={participants}
                  type="participants"
                  size={Math.min(window.innerWidth * 0.45, window.innerHeight * 0.70, 900)}
                  onSpinEnd={handleParticipantSpinEnd}
                  isSpinning={isSpinning}
                  onFileUpload={handleParticipantsUpload}
                  onClearData={handleClearParticipants}
                  hasData={participants.length > 0}
                />
              </div>
            </motion.div>

            {/* Spin Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="flex flex-col items-center gap-4 flex-shrink-0 z-10"
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
                  className="text-white/40 text-sm text-center max-w-[200px]"
                >
                  {participants.length === 0 && prizes.length === 0
                    ? 'Upload both CSV files to start'
                    : participants.length === 0
                    ? 'Upload participants CSV'
                    : 'Upload prizes CSV'}
                </motion.p>
              )}
            </motion.div>

            {/* Prize Wheel - Positioned to the right (mirrored) */}
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center lg:-mr-12"
            >
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-burnt-orange" />
                <h3 className="text-xl font-semibold text-white">Prizes</h3>
              </div>
              <div className="mt-4">
                <SpinningWheel
                  ref={prizeWheelRef}
                  items={prizes}
                  type="prizes"
                  size={Math.min(window.innerWidth * 0.45, window.innerHeight * 0.70, 900)}
                  onSpinEnd={handlePrizeSpinEnd}
                  isSpinning={isSpinning}
                  onFileUpload={handlePrizesUpload}
                  onClearData={handleClearPrizes}
                  hasData={prizes.length > 0}
                />
              </div>
            </motion.div>
          </div>

          {/* Results Preview (shown after spin) */}
          <div style={{ marginTop: '-8vh' }}>
            <AnimatePresence>
              {spinResults.participant && spinResults.prize && !showWinnerModal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="glass rounded-2xl p-8 inline-block">
                    <p className="text-white/60 text-lg mb-4">Result</p>
                    <p className="text-4xl font-bold text-white">
                      <span className="text-burnt-orange">{spinResults.participant.name}</span>
                      {' '} wins {' '}
                      <span className="text-burnt-orange">{spinResults.prize.name}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    </div>
  );
}

export default App;
