/**
 * @fileoverview Schedule page component with class schedule management
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleSheetCSV } from '../utils/useGoogleSheetCSV';
import classColors from '../config/classColors.json';
import { APP_CONSTANTS } from '../core/constants/app.constants';
import { Logger } from '../core/utils/logger.util';
import { ErrorHandler } from '../core/utils/error-handler.util';
import { AnimationWrapper, StaggerContainer } from '../components/ui/Animation/AnimationWrapper';
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary';

// Initialize services
const logger = new Logger('Schedule');
const errorHandler = new ErrorHandler();

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmYOSXn1a6VJb3VLG2hvYrnSAyZaLB8OyGOfcR4Cm-8HPwOGy8rQ-C_Rf1y4b4_LbCelC_MydXpYQx/pub?gid=0&single=true&output=csv';

/**
 * Class for managing schedule cell styling logic (Single Responsibility)
 */
class ScheduleCellStyler {
  constructor(colorMap) {
    this.colorMap = colorMap;
    this.normalizedColorMap = this._createNormalizedColorMap(colorMap);
  }

  _createNormalizedColorMap(colorMap) {
    const normalizedMap = {};
    Object.entries(colorMap).forEach(([key, value]) => {
      normalizedMap[key.trim().toLowerCase()] = value;
    });
    return normalizedMap;
  }

  /**
   * Get CSS class for a cell based on its value
   * @param {string} value - Cell value
   * @returns {string} CSS class string
   */
  getCellClass(value) {
    if (!value) return 'bg-gray-100 text-gray-500';
    
    const normalizedValue = value.trim().toLowerCase();
    const colorClass = this.normalizedColorMap[normalizedValue];
    
    return colorClass || 'bg-gray-100 text-gray-500';
  }

  /**
   * Get color class for legend items
   * @param {string} value - Legend value
   * @returns {string} Color class
   */
  getColorClass(value) {
    if (!value || Object.keys(this.colorMap).length === 0) {
      return 'bg-gray-100';
    }

    const normalizedValue = value.toLowerCase().trim();
    return this.normalizedColorMap[normalizedValue] || 'bg-gray-100';
  }
}

/**
 * Class for managing row span calculations (Single Responsibility)
 */
class RowSpanCalculator {
  /**
   * Calculate row spans for schedule table
   * @param {Array} rows - Schedule data rows
   * @param {Array} headers - Table headers
   * @returns {Array} Row span configuration
   */
  static calculateRowSpans(rows, headers) {
    logger.debug('Calculating row spans', { rowCount: rows.length, headerCount: headers.length });
    
    const rowSpans = Array.from({ length: rows.length }, () => ({}));
    
    for (let col = 0; col < headers.length; col++) {
      if (col === 0) continue; // Skip time column
      
      for (let row = 0; row < rows.length; row++) {
        const value = rows[row][headers[col]] || '';
        const nextValue = rows[row + 1]?.[headers[col]] || '';
        
        const normValue = value.trim().toLowerCase();
        const normNextValue = nextValue.trim().toLowerCase();
        
        if (normValue !== '') {
          if (normValue === normNextValue) {
            rowSpans[row][headers[col]] = 2;
            if (rowSpans[row + 1]) {
              rowSpans[row + 1][headers[col]] = 0;
            }
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
}

/**
 * Class for managing time slot operations (Single Responsibility)
 */
class TimeSlotManager {
  /**
   * Find time header from headers array
   * @param {Array} headers - Table headers
   * @returns {string} Time header name
   */
  static findTimeHeader(headers) {
    return headers.find(h => h.toLowerCase().includes('time')) || headers[1];
  }

  /**
   * Calculate end time from start time
   * @param {string} startTime - Start time string
   * @returns {string} End time string
   */
  static calculateEndTime(startTime) {
    if (!startTime) return '';
    
    const match = startTime.match(/(\d{1,2}):(\d{2})/);
    if (!match) return '';
    
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    hour = (hour + 1) % 24;
    
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }

  /**
   * Generate reservation message
   * @param {string} day - Day of week
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @returns {string} Formatted message
   */
  static generateReservationMessage(day, startTime, endTime) {
    if (startTime && endTime) {
      return `I'd like to reserve recurring classes on ${day} between ${startTime} and ${endTime}.`;
    } else if (startTime) {
      return `I'd like to reserve recurring classes on ${day} at ${startTime}.`;
    } else {
      return `I'd like to reserve recurring classes on ${day}.`;
    }
  }
}

/**
 * Legend component for class color indicators
 */
const ScheduleLegend = ({ colorMap, styler }) => {
  logger.debug('Rendering schedule legend', { colorCount: Object.keys(colorMap).length });
  
  return (
    <AnimationWrapper 
      variant="fadeIn" 
      motionProps={{ transition: { delay: 0.2 } }}
    >
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {Object.entries(colorMap).map(([label, colorClass]) => (
          <span 
            key={label} 
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
          >
            <span 
              className="w-3 h-3 rounded-full inline-block" 
              style={{ 
                background: colorClass
                  .split(' ')[0]
                  .replace('bg-', '')
                  .replace('-', '#') 
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </AnimationWrapper>
  );
};

/**
 * Schedule table cell component
 */
const ScheduleCell = ({ 
  value, 
  header, 
  rowIndex, 
  colIndex, 
  span, 
  isEmpty, 
  isFirstOfPair, 
  isClassColumn, 
  styler, 
  timeHeader, 
  rows, 
  onEmptySlotClick 
}) => {
  const cellClass = isClassColumn 
    ? styler.getCellClass(value || '') 
    : 'bg-white text-gray-700';

  if (isEmpty && isFirstOfPair && isClassColumn) {
    return (
      <td
        key={colIndex}
        rowSpan={span}
        className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 cursor-pointer hover:bg-orange-50 ${cellClass}`}
        style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
        onClick={() => onEmptySlotClick(header, rowIndex)}
        title={`Click to reserve recurring classes on ${header} between ${rows[rowIndex]?.[timeHeader] || ''} and ${rows[rowIndex + 1]?.[timeHeader] || ''}`}
      />
    );
  }

  return (
    <td
      key={colIndex}
      rowSpan={span}
      className={`px-2 py-2 align-middle text-center border border-orange-200 whitespace-pre-line break-words transition-all duration-300 ${cellClass}`}
      style={{ minWidth: 100, maxWidth: 180, wordBreak: 'break-word' }}
      title={value}
    >
      {value}
    </td>
  );
};

/**
 * Main Schedule component
 */
const Schedule = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useGoogleSheetCSV(CSV_URL);
  
  // Memoized calculations
  const headers = useMemo(() => 
    data && data.length > 0 ? Object.keys(data[0]) : [],
    [data]
  );
  
  const rows = useMemo(() => data || [], [data]);
  
  const styler = useMemo(() => 
    new ScheduleCellStyler(classColors), 
    []
  );
  
  const rowSpans = useMemo(() => 
    RowSpanCalculator.calculateRowSpans(rows, headers),
    [rows, headers]
  );
  
  const timeHeader = useMemo(() => 
    TimeSlotManager.findTimeHeader(headers),
    [headers]
  );

  /**
   * Handle click on empty schedule slot
   */
  const handleEmptySlotClick = useCallback((day, rowIdx) => {
    try {
      logger.info('Empty slot clicked', { day, rowIdx });
      
      const startTime = rows[rowIdx]?.[timeHeader] || '';
      const endTime = TimeSlotManager.calculateEndTime(startTime);
      const message = TimeSlotManager.generateReservationMessage(day, startTime, endTime);
      
      logger.debug('Generated reservation message', { day, startTime, endTime, message });
      navigate(`/contact?message=${encodeURIComponent(message)}`);
    } catch (err) {
      errorHandler.handle(err, 'Empty slot click handler');
    }
  }, [navigate, rows, timeHeader]);

  /**
   * Check if column is a class column
   */
  const isClassColumn = useCallback((header, idx) => idx >= 1, []);

  // Log component mount
  React.useEffect(() => {
    logger.info('Schedule component mounted', {
      hasData: !!data,
      rowCount: rows.length,
      headerCount: headers.length
    });
  }, [data, rows.length, headers.length]);

  // Handle loading state
  if (loading) {
    return (
      <StaggerContainer className="max-w-7xl mx-auto py-12 px-2 sm:px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4" />
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    );
  }

  // Handle error state
  if (error) {
    logger.error('Schedule data loading error', { error });
    return (
      <StaggerContainer className="max-w-7xl mx-auto py-12 px-2 sm:px-4">
        <AnimationWrapper variant="fadeIn">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>Error loading schedule</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    );
  }

  return (
    <ErrorBoundary>
      <StaggerContainer className="max-w-7xl mx-auto py-12 px-2 sm:px-4">
        {/* Page Header */}
        <AnimationWrapper variant="fadeIn">
          <h2 className="text-3xl font-bold mb-8 text-center text-orange-700 max-w-3xl mx-auto">
            Class Schedule
          </h2>
        </AnimationWrapper>

        {/* Legend */}
        <ScheduleLegend colorMap={classColors} styler={styler} />

        {/* Reservation Notice */}
        <AnimationWrapper 
          variant="fadeIn" 
          motionProps={{ transition: { delay: 0.3 } }}
        >
          <div className="text-center text-sm text-gray-500 mb-6 bg-orange-50 p-3 rounded-lg">
            <p className="font-medium text-orange-700 mb-1">How to Reserve Classes</p>
            <p>Click on any empty time slot to reserve recurring classes. All reservations are for a minimum of 1 hour.</p>
          </div>
        </AnimationWrapper>

        {/* Schedule Table */}
        {rows && rows.length > 0 && (
          <AnimationWrapper 
            variant="fadeIn" 
            motionProps={{ transition: { delay: 0.4 } }}
          >
            <div className="overflow-x-auto shadow-lg rounded-xl">
              <table className="min-w-full w-full rounded-xl overflow-hidden border-0">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th 
                        key={header} 
                        className="px-2 py-3 bg-orange-100 text-orange-700 font-bold text-center border border-orange-200 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {headers.map((header, j) => {
                        const value = row[header];
                        const span = rowSpans[i][header] === undefined ? 1 : rowSpans[i][header];
                        
                        if (span === 0) return null; // Skip merged cells
                        
                        const isEmpty = value === '' || value === undefined || value === null;
                        const isFirstOfPair = i % 2 === 0;

                        return (
                          <ScheduleCell
                            key={j}
                            value={value}
                            header={header}
                            rowIndex={i}
                            colIndex={j}
                            span={span}
                            isEmpty={isEmpty}
                            isFirstOfPair={isFirstOfPair}
                            isClassColumn={isClassColumn(header, j)}
                            styler={styler}
                            timeHeader={timeHeader}
                            rows={rows}
                            onEmptySlotClick={handleEmptySlotClick}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimationWrapper>
        )}

        {/* Contact CTA */}
        <AnimationWrapper 
          variant="fadeIn" 
          motionProps={{ transition: { delay: 0.5 } }}
        >
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need help with scheduling or have questions about our classes?
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </button>
          </div>
        </AnimationWrapper>
      </StaggerContainer>
    </ErrorBoundary>
  );
};

export default Schedule; 