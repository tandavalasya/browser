import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleSheetCSV } from '../utils/useGoogleSheetCSV';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmYOSXn1a6VJb3VLG2hvYrnSAyZaLB8OyGOfcR4Cm-8HPwOGy8rQ-C_Rf1y4b4_LbCelC_MydXpYQx/pub?gid=0&single=true&output=csv';

const classColors = {
  'Intermediate Kids': 'bg-orange-200 text-orange-800',
  'Beginner Adult': 'bg-blue-200 text-blue-800',
  'Advanced Adult': 'bg-green-200 text-green-800',
  'Beginner Kids': 'bg-pink-200 text-pink-800',
  'Reserved for Private Classes': 'bg-gray-200 text-gray-700',
};

function getCellClass(value) {
  return classColors[value] || '';
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

// Improved merged cell logic for consecutive identical values (rowSpan)
function calculateRowSpans(rows, headers) {
  const rowSpans = Array.from({ length: rows.length }, () => ({}));
  for (let col = 0; col < headers.length; col++) {
    if (col === 1) continue; // Don't merge the time slot column
    let prev = null;
    let start = 0;
    for (let row = 0; row <= rows.length; row++) {
      const value = row < rows.length ? rows[row][headers[col]] : null;
      if (value !== prev) {
        if (prev !== null && prev !== '') {
          const span = row - start;
          if (span > 1) {
            rowSpans[start][headers[col]] = span;
            for (let k = start + 1; k < row; k++) {
              rowSpans[k][headers[col]] = 0; // Mark as skip
            }
          }
        }
        prev = value;
        start = row;
      }
    }
  }
  return rowSpans;
}

const Schedule = () => {
  const { data, loading, error } = useGoogleSheetCSV(CSV_URL);
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const rows = data;
  const rowSpans = calculateRowSpans(rows, headers);
  const navigate = useNavigate();

  // Handler for empty slot click (to be implemented in next step)
  const handleEmptySlotClick = (day, time) => {
    // Placeholder for now
    // navigate(`/contact?slot=${encodeURIComponent(`${day} at ${time}`)}`);
  };

  return (
    <motion.section
      className="max-w-7xl mx-auto py-12 px-2 sm:px-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-orange-700"
        variants={itemVariants}
      >
        Schedule
      </motion.h2>
      {/* Legend */}
      <motion.div className="flex flex-wrap gap-4 mb-6 justify-center" variants={itemVariants}>
        {Object.entries(classColors).map(([label, colorClass]) => (
          <span key={label} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: colorClass.split(' ')[0].replace('bg-', '').replace('-', '#') }}></span>
            {label}
          </span>
        ))}
      </motion.div>
      {loading && <motion.div className="text-center text-gray-500" variants={itemVariants}>Loading schedule...</motion.div>}
      {error && <motion.div className="text-center text-red-600" variants={itemVariants}>Error loading schedule.</motion.div>}
      {!loading && !error && rows && rows.length > 0 && (
        <motion.div className="overflow-x-auto" variants={itemVariants}>
          <table className="min-w-full w-full border border-orange-200 rounded-xl overflow-hidden shadow-lg bg-white">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-2 py-2 bg-orange-100 text-orange-700 font-bold text-center border border-orange-200 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr key={i} variants={itemVariants}>
                  {headers.map((header, j) => {
                    const value = row[header] || '';
                    const span = rowSpans[i][header] === undefined ? 1 : rowSpans[i][header];
                    if (span === 0) return null; // skip cell, it's merged
                    // For empty slots, make cell clickable (prepare for next step)
                    const isEmpty = value === '';
                    return (
                      <td
                        key={j}
                        rowSpan={span}
                        className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 ${getCellClass(value)} ${isEmpty ? 'cursor-pointer hover:bg-orange-50' : ''}`}
                        style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
                        onClick={isEmpty && j !== 0 && j !== 1 ? () => handleEmptySlotClick(headers[j], row[headers[1]]) : undefined}
                        title={isEmpty ? `Click to reserve ${headers[j]} at ${row[headers[1]]}` : value}
                      >
                        {value}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.section>
  );
};

export default Schedule; 