import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleSheetCSV } from '../utils/useGoogleSheetCSV';
import config from '../../../config/tandavalasya.config.json';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmYOSXn1a6VJb3VLG2hvYrnSAyZaLB8OyGOfcR4Cm-8HPwOGy8rQ-C_Rf1y4b4_LbCelC_MydXpYQx/pub?gid=0&single=true&output=csv';

function getCellClass(value) {
  return config.classColors[value] || '';
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

// Each class cell spans 2 rows (1 hour). For empty slots, only allow clicking on the first of each pair.
function calculateRowSpansHour(rows, headers) {
  const rowSpans = Array.from({ length: rows.length }, () => ({}));
  for (let col = 0; col < headers.length; col++) {
    if (col === 0 || col === 1) continue; // Don't merge the index or time slot column
    for (let row = 0; row < rows.length; row++) {
      const value = rows[row][headers[col]] || '';
      if (value !== '') {
        // Only render for even rows (first of each hour)
        if (row % 2 === 0) {
          rowSpans[row][headers[col]] = 2;
          rowSpans[row + 1] && (rowSpans[row + 1][headers[col]] = 0);
        } else if (rowSpans[row][headers[col]] === undefined) {
          rowSpans[row][headers[col]] = 0;
        }
      } else {
        // For empty slots, no rowSpan, but only allow click on first of each pair
        rowSpans[row][headers[col]] = 1;
      }
    }
  }
  return rowSpans;
}

const Schedule = () => {
  const { data, loading, error } = useGoogleSheetCSV(CSV_URL);
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const rows = data;
  const rowSpans = calculateRowSpansHour(rows, headers);
  const navigate = useNavigate();

  // Find the header for the time slot column (case-insensitive)
  const timeHeader = headers.find(h => h.toLowerCase().includes('time')) || headers[1];

  const handleEmptySlotClick = (day, rowIdx) => {
    const startTime = rows[rowIdx]?.[timeHeader] || '';
    const endTime = rows[rowIdx + 1]?.[timeHeader] || '';
    let msg = '';
    if (startTime && endTime) {
      msg = `I'd like to reserve recurring classes on ${day} between ${startTime} and ${endTime}.`;
    } else if (startTime) {
      msg = `I'd like to reserve recurring classes on ${day} at ${startTime}.`;
    } else {
      msg = `I'd like to reserve recurring classes on ${day}.`;
    }
    navigate(`/contact?message=${encodeURIComponent(msg)}`);
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
        {Object.entries(config.classColors).map(([label, colorClass]) => (
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
                    // For empty slots, only allow click on first of each pair (even rows)
                    const isEmpty = value === '';
                    const isFirstOfPair = i % 2 === 0;
                    if (isEmpty && isFirstOfPair && j > 1) {
                      return (
                        <td
                          key={j}
                          rowSpan={span}
                          className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 cursor-pointer hover:bg-orange-50`}
                          style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
                          onClick={() => handleEmptySlotClick(headers[j], i)}
                          title={`Click to reserve recurring classes on ${headers[j]} between ${row[timeHeader] || ''} and ${rows[i + 1]?.[timeHeader] || ''}`}
                        >
                          {value}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={j}
                        rowSpan={span}
                        className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 ${getCellClass(value)}`}
                        style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
                        title={value}
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