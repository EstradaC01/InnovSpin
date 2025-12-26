import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Users, Gift, Check, AlertCircle, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

export default function CSVUploadPanel({
  isOpen,
  participants,
  setParticipants,
  prizes,
  setPrizes
}) {
  const [participantsFile, setParticipantsFile] = useState(null);
  const [prizesFile, setPrizesFile] = useState(null);
  const [errors, setErrors] = useState({ participants: null, prizes: null });

  const parseCSV = useCallback((file, type) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }

          const data = results.data;

          if (type === 'participants') {
            // Validate participants CSV
            const hasRequired = data.every(row => row.ID && row.Name);
            if (!hasRequired) {
              reject(new Error('Participants CSV must have ID and Name columns'));
              return;
            }

            const formatted = data.map((row, index) => ({
              id: row.ID || String(index + 1),
              name: row.Name,
              imageUrl: row.ImageURL || null
            }));
            resolve(formatted);
          } else {
            // Validate prizes CSV
            const hasRequired = data.every(row => row.ID && row.PrizeName);
            if (!hasRequired) {
              reject(new Error('Prizes CSV must have ID and PrizeName columns'));
              return;
            }

            const formatted = data.map((row, index) => ({
              id: row.ID || String(index + 1),
              name: row.PrizeName,
              imageUrl: row.ImageURL || null
            }));
            resolve(formatted);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }, []);

  const handleFileDrop = useCallback(async (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];

    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setErrors(prev => ({ ...prev, [type]: 'Please upload a CSV file' }));
      return;
    }

    try {
      const data = await parseCSV(file, type);

      if (type === 'participants') {
        setParticipantsFile(file);
        setParticipants(data);
        setErrors(prev => ({ ...prev, participants: null }));
      } else {
        setPrizesFile(file);
        setPrizes(data);
        setErrors(prev => ({ ...prev, prizes: null }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [type]: error.message }));
    }
  }, [parseCSV, setParticipants, setPrizes]);

  const clearData = (type) => {
    if (type === 'participants') {
      setParticipantsFile(null);
      setParticipants([]);
      setErrors(prev => ({ ...prev, participants: null }));
    } else {
      setPrizesFile(null);
      setPrizes([]);
      setErrors(prev => ({ ...prev, prizes: null }));
    }
  };

  const UploadBox = ({ type, file, data, error, icon: Icon, title, columns }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: type === 'participants' ? 0.1 : 0.2 }}
      className="flex-1"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-burnt-orange" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      {!file ? (
        <label
          onDrop={(e) => handleFileDrop(e, type)}
          onDragOver={(e) => e.preventDefault()}
          className="block cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.02, borderColor: 'rgba(214, 90, 32, 0.5)' }}
            className="glass rounded-xl p-6 border-2 border-dashed border-white/20 hover:border-burnt-orange/50 transition-all duration-200"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-full bg-burnt-orange/20">
                <Upload className="w-6 h-6 text-burnt-orange" />
              </div>
              <div>
                <p className="text-white font-medium">Drop CSV here or click to upload</p>
                <p className="text-sm text-white/50 mt-1">
                  Required columns: {columns}
                </p>
              </div>
            </div>
          </motion.div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileDrop(e, type)}
            className="hidden"
          />
        </label>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {file.name}
                </p>
                <p className="text-sm text-white/50">{data.length} items loaded</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => clearData(type)}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </motion.button>
          </div>

          {/* Preview */}
          <div className="max-h-32 overflow-y-auto rounded-lg bg-navy-deep/50 p-2">
            <div className="space-y-1">
              {data.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-burnt-orange">{index + 1}.</span>
                  <span>{item.name}</span>
                  {item.imageUrl && (
                    <span className="text-xs text-green-400">(has image)</span>
                  )}
                </div>
              ))}
              {data.length > 5 && (
                <p className="text-xs text-white/40 mt-2">
                  ... and {data.length - 5} more
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-burnt-orange" />
                Setup - CSV Data Import
              </h2>

              <div className="flex flex-col md:flex-row gap-6">
                <UploadBox
                  type="participants"
                  file={participantsFile}
                  data={participants}
                  error={errors.participants}
                  icon={Users}
                  title="Participants"
                  columns="ID, Name, ImageURL (optional)"
                />

                <UploadBox
                  type="prizes"
                  file={prizesFile}
                  data={prizes}
                  error={errors.prizes}
                  icon={Gift}
                  title="Prizes"
                  columns="ID, PrizeName, ImageURL (optional)"
                />
              </div>

              {/* Sample CSV format helper */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 rounded-xl bg-navy-deep/50"
              >
                <p className="text-sm text-white/60 mb-2">Sample CSV format:</p>
                <div className="flex flex-col sm:flex-row gap-4 text-xs font-mono text-white/40">
                  <div>
                    <p className="text-burnt-orange mb-1">participants.csv</p>
                    <p>ID,Name,ImageURL</p>
                    <p>1,John Doe,https://...</p>
                    <p>2,Jane Smith,</p>
                  </div>
                  <div>
                    <p className="text-burnt-orange mb-1">prizes.csv</p>
                    <p>ID,PrizeName,ImageURL</p>
                    <p>1,iPhone 15,https://...</p>
                    <p>2,Gift Card,</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
