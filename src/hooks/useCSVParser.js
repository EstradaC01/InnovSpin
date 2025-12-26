import { useCallback } from 'react';
import Papa from 'papaparse';

export default function useCSVParser() {
  const parseCSV = useCallback((file, type) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          // Filter out rows that are completely empty
          const data = results.data.filter(row => {
            return Object.values(row).some(val => val && val.trim() !== '');
          });

          if (data.length === 0) {
            reject(new Error('CSV file is empty or has no valid data'));
            return;
          }

          if (type === 'participants') {
            // Check if required columns exist
            const firstRow = data[0];
            if (!('ID' in firstRow) || !('Name' in firstRow)) {
              reject(new Error('Participants CSV must have ID and Name columns'));
              return;
            }

            // Validate and format data
            const formatted = data
              .filter(row => row.ID && row.Name) // Only include rows with required fields
              .map((row, index) => ({
                id: String(row.ID).trim() || String(index + 1),
                name: String(row.Name).trim(),
                imageUrl: row.ImageURL ? String(row.ImageURL).trim() : null
              }));

            if (formatted.length === 0) {
              reject(new Error('No valid participant entries found'));
              return;
            }

            resolve(formatted);
          } else {
            // Check if required columns exist
            const firstRow = data[0];
            if (!('ID' in firstRow) || !('PrizeName' in firstRow)) {
              reject(new Error('Prizes CSV must have ID and PrizeName columns'));
              return;
            }

            // Validate and format data
            const formatted = data
              .filter(row => row.ID && row.PrizeName) // Only include rows with required fields
              .map((row, index) => ({
                id: String(row.ID).trim() || String(index + 1),
                name: String(row.PrizeName).trim(),
                imageUrl: row.ImageURL ? String(row.ImageURL).trim() : null
              }));

            if (formatted.length === 0) {
              reject(new Error('No valid prize entries found'));
              return;
            }

            resolve(formatted);
          }
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      });
    });
  }, []);

  return { parseCSV };
}
