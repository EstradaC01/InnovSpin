import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const SpinningWheel = forwardRef(({
  items,
  type,
  size = 350,
  onSpinEnd,
  isSpinning,
  onFileUpload,
  onClearData,
  hasData
}, ref) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [localSpinning, setLocalSpinning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const segmentAngle = items.length > 0 ? 360 / items.length : 360;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 10;

  // Colors for segments
  const colors = [
    '#1e3a5f', '#254670', '#2d5280', '#1e3a5f',
    '#254670', '#2d5280', '#1e3a5f', '#254670'
  ];

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size for high DPI displays
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw segments
    items.forEach((item, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill with alternating colors
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Add subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      ctx.rotate(textAngle);

      // Text styling
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.min(14, 200 / items.length))}px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Truncate text if too long
      const maxTextLength = 15;
      const displayText = item.name.length > maxTextLength
        ? item.name.substring(0, maxTextLength) + '...'
        : item.name;

      ctx.fillText(displayText, radius - 15, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#182B49';
    ctx.fill();
    ctx.strokeStyle = '#D65A20';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#D65A20';
    ctx.lineWidth = 4;
    ctx.stroke();

  }, [items, size, segmentAngle, centerX, centerY, radius]);

  const spin = useCallback((targetRotation) => {
    if (localSpinning || items.length === 0) return;

    setLocalSpinning(true);
    setSelectedItem(null);

    // Calculate target rotation
    const minSpins = 5;
    const maxSpins = 8;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalRotation = rotation + (spins * 360) + targetRotation;

    // Animate wheel
    controls.start({
      rotate: finalRotation,
      transition: {
        duration: 5 + Math.random() * 2,
        ease: [0.2, 0.8, 0.2, 1], // Custom easing for realistic deceleration
      }
    }).then(() => {
      // Normalize rotation to 0-360
      const normalizedRotation = finalRotation % 360;
      setRotation(finalRotation);

      // Calculate winning segment
      // The pointer is at the top (0 degrees), segments start from -90 degrees
      const pointerAngle = (360 - (normalizedRotation % 360) + 90) % 360;
      const winningIndex = Math.floor(pointerAngle / segmentAngle) % items.length;
      const winner = items[winningIndex];

      setSelectedItem(winner);
      setLocalSpinning(false);
      onSpinEnd?.(winner);
    });
  }, [localSpinning, items, rotation, segmentAngle, controls, onSpinEnd]);

  // Expose spin method via ref
  useImperativeHandle(ref, () => ({
    spin: (targetRotation) => spin(targetRotation),
    getSelectedItem: () => selectedItem
  }));

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      onFileUpload?.(file);
    }
  };

  // Handle click on empty wheel
  const handleClick = () => {
    if (!hasData && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Empty state - clickable upload area
  if (items.length === 0) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <motion.div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex flex-col items-center justify-center rounded-full cursor-pointer
            border-4 border-dashed transition-all duration-300
            ${isDragOver
              ? 'border-burnt-orange bg-burnt-orange/10'
              : 'border-white/20 hover:border-burnt-orange/50 glass'
            }
          `}
          style={{ width: size, height: size }}
        >
          <motion.div
            animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
            className="p-4 rounded-full bg-burnt-orange/20 mb-3"
          >
            <Upload className="w-8 h-8 text-burnt-orange" />
          </motion.div>
          <p className="text-white/70 text-sm font-medium">
            {type === 'participants' ? 'Upload Participants' : 'Upload Prizes'}
          </p>
          <p className="text-white/40 text-xs mt-1">
            Click or drag CSV file
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Hidden file input for replacing */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Clear/Remove button */}
      {hasData && !isSpinning && !localSpinning && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClearData?.();
          }}
          className="absolute -top-2 -right-2 z-20 p-2 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-colors"
          title="Remove data"
        >
          <X className="w-4 h-4 text-white" />
        </motion.button>
      )}

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <svg width="30" height="40" viewBox="0 0 30 40">
          <path
            d="M15 40 L0 10 L15 0 L30 10 Z"
            fill="#D65A20"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Wheel */}
      <motion.div
        animate={controls}
        style={{
          width: size,
          height: size,
          transformOrigin: 'center center'
        }}
        className="rounded-full shadow-2xl"
      >
        <canvas
          ref={canvasRef}
          className="rounded-full"
        />
      </motion.div>

      {/* Center decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-navy-deep border-3 border-burnt-orange flex items-center justify-center pointer-events-none z-10"
        style={{ boxShadow: '0 0 20px rgba(214, 90, 32, 0.5)' }}
      >
        <span className="text-xs font-bold text-burnt-orange uppercase">
          {type === 'participants' ? 'WHO' : 'WIN'}
        </span>
      </div>

      {/* Glow effect when selected */}
      {selectedItem && !localSpinning && !isSpinning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(214, 90, 32, 0.5), 0 0 60px rgba(214, 90, 32, 0.3)'
          }}
        />
      )}

      {/* Item count badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-burnt-orange/20 border border-burnt-orange/30"
      >
        <span className="text-xs font-medium text-burnt-orange">
          {items.length} {type === 'participants' ? 'participants' : 'prizes'}
        </span>
      </motion.div>
    </div>
  );
});

SpinningWheel.displayName = 'SpinningWheel';

export default SpinningWheel;
