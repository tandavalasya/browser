import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleSheetCSV } from '../utils/useGoogleSheetCSV';
import classColors from '../config/classColors.json';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmYOSXn1a6VJb3VLG2hvYrnSAyZaLB8OyGOfcR4Cm-8HPwOGy8rQ-C_Rf1y4b4_LbCelC_MydXpYQx/pub?gid=0&single=true&output=csv';

function getCellClass(value) {
  if (!value) return 'bg-gray-100 text-gray-500';
  const normalizedValue = value.trim().toLowerCase();
  const colorMap = {};
  Object.entries(classColors).forEach(([k, v]) => {
    colorMap[k.trim().toLowerCase()] = v;
  });
  const colorClass = colorMap[normalizedValue];
  // Debug color mapping
  if (!colorClass) {
    console.log('COLOR MAP FAIL:', { value, normalizedValue, colorMapKeys: Object.keys(colorMap) });
  } else {
    console.log('COLOR MAP SUCCESS:', { value, normalizedValue, colorClass });
  }
  return colorClass || 'bg-gray-100 text-gray-500';
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
    if (col === 0) continue; // Only skip the index/time slot column
    for (let row = 0; row < rows.length; row++) {
      const value = rows[row][headers[col]] || '';
      const nextValue = rows[row + 1]?.[headers[col]] || '';
      // Normalize values for comparison
      const normValue = value.trim().toLowerCase();
      const normNextValue = nextValue.trim().toLowerCase();
      if (normValue !== '') {
        if (normValue === normNextValue) {
          rowSpans[row][headers[col]] = 2;
          rowSpans[row + 1] && (rowSpans[row + 1][headers[col]] = 0);
        } else {
          rowSpans[row][headers[col]] = 1;
        }
      } else {
        rowSpans[row][headers[col]] = 1;
      }
    }
  }
  return rowSpans;
}

const getColorClass = (value, colorMap) => {
  if (!value || !colorMap || Object.keys(colorMap).length === 0) {
    return 'bg-gray-100';
  }

  const normalizedValue = value.toLowerCase().trim();
  const colorClass = colorMap[normalizedValue];
  return colorClass || 'bg-gray-100';
};

const Schedule = () => {
  const { data, loading, error } = useGoogleSheetCSV(CSV_URL);
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const rows = data;
  const rowSpans = calculateRowSpansHour(rows, headers);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState({ headers, rows });
  const [colorMap, setColorMap] = useState(classColors);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(googlePlacesConfig.scheduleUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule data');
        }

        const data = await response.text();
        const { headers, rows } = parseCSV(data);

        if (!headers.length || !rows.length) {
          throw new Error('Invalid schedule data format');
        }

        setScheduleData({ headers, rows });
      } catch (err) {
        setError('Unable to load schedule. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const renderCell = (value, header, i, j) => {
    const span = value === scheduleData.rows[i - 1]?.[j] ? 0 : 1;
    const colorClass = getColorClass(value, colorMap);

    return (
      <td
        key={`${i}-${j}`}
        className={`p-2 border ${colorClass} ${span === 0 ? 'hidden' : ''}`}
        rowSpan={span || undefined}
      >
        {value}
      </td>
    );
  };

  // Find the header for the time slot column (case-insensitive)
  const timeHeader = headers.find(h => h.toLowerCase().includes('time')) || headers[1];

  // Identify index and time columns
  const isClassColumn = (header, idx) => idx >= 1;

  const handleEmptySlotClick = (day, rowIdx) => {
    const startTime = rows[rowIdx]?.[timeHeader] || '';
    let endTime = '';
    if (startTime) {
      // Try to parse and add 1 hour
      const match = startTime.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[1], 10);
        let min = parseInt(match[2], 10);
        hour = (hour + 1) % 24;
        endTime = `${hour.toString().padStart(2, '0')}:${match[2]}`;
      }
    }
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
        className="text-3xl font-bold mb-8 text-center text-orange-700 max-w-3xl mx-auto"
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
      {/* 1-hour minimum note */}
      <motion.div className="text-center text-sm text-gray-500 mb-2" variants={itemVariants}>
        All reservations are for a minimum of 1 hour.
      </motion.div>
      {loading && <motion.div className="text-center text-gray-500" variants={itemVariants}>Loading schedule...</motion.div>}
      {error && <motion.div className="text-center text-red-600" variants={itemVariants}>Error loading schedule.</motion.div>}
      {!loading && !error && rows && rows.length > 0 && (
        <motion.div className="overflow-x-auto" variants={itemVariants}>
          <table className="min-w-full w-full rounded-3xl overflow-hidden border-0">
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
                    const value = row[header];
                    const span = rowSpans[i][header] === undefined ? 1 : rowSpans[i][header];
                    if (span === 0) return null; // skip cell, it's merged
                    const isEmpty = value === '' || value === undefined || value === null;
                    const isFirstOfPair = i % 2 === 0;
                    const cellClass = isClassColumn(header, j) ? getCellClass(value || '') : 'bg-white text-gray-700';
                    // Debug log for non-empty values
                    if (!isEmpty) {
                      console.log(`RENDERING: Cell [row ${i}, col ${j}, header '${header}']: value=`, value, '| span=', span);
                    }
                    if (isEmpty && isFirstOfPair && isClassColumn(header, j)) {
                      return (
                        <td
                          key={j}
                          rowSpan={span}
                          className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 cursor-pointer hover:bg-orange-50 ${cellClass}`}
                          style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
                          onClick={() => handleEmptySlotClick(headers[j], i)}
                          title={`Click to reserve recurring classes on ${headers[j]} between ${row[timeHeader] || ''} and ${rows[i + 1]?.[timeHeader] || ''}`}
                        >
                          {/* Render nothing for empty, clickable cells */}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={j}
                        rowSpan={span}
                        className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 ${cellClass}`}
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