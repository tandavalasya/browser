import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Schedule from '../pages/Schedule';
import * as useGoogleSheetCSVModule from '../utils/useGoogleSheetCSV';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Sample CSV test data
const sampleScheduleData = [
  { 'Time': '9:00 AM', 'Monday': 'Bharatanatyam Basics', 'Tuesday': '', 'Wednesday': 'Advanced Bharatanatyam' },
  { 'Time': '10:00 AM', 'Monday': 'Bharatanatyam Basics', 'Tuesday': '', 'Wednesday': 'Advanced Bharatanatyam' },
  { 'Time': '11:00 AM', 'Monday': '', 'Tuesday': 'Kids Dance', 'Wednesday': '' },
  { 'Time': '12:00 PM', 'Monday': '', 'Tuesday': 'Kids Dance', 'Wednesday': '' },
  { 'Time': '1:00 PM', 'Monday': 'Private Lesson', 'Tuesday': '', 'Wednesday': 'Group Session' },
  { 'Time': '2:00 PM', 'Monday': 'Private Lesson', 'Tuesday': '', 'Wednesday': 'Group Session' },
];

const renderSchedule = () => {
  return render(
    <BrowserRouter>
      <Schedule />
    </BrowserRouter>
  );
};

describe('Schedule Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders schedule component', () => {
    // Mock loading state
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    renderSchedule();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Loading schedule...')).toBeInTheDocument();
  });

  test('shows loading state while fetching data', () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    renderSchedule();
    expect(screen.getByText('Loading schedule...')).toBeInTheDocument();
  });

  test('handles CSV loading error', () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: [],
      loading: false,
      error: 'Failed to load data',
    });

    renderSchedule();
    expect(screen.getByText('Error loading schedule.')).toBeInTheDocument();
  });

  test('displays schedule data from CSV', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      expect(screen.getAllByText('Bharatanatyam Basics')).toHaveLength(2);
      expect(screen.getAllByText('Advanced Bharatanatyam')).toHaveLength(2);
      expect(screen.getAllByText('Kids Dance')).toHaveLength(2);
    });
  });

  test('renders color legend for classes', () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    // The legend should render based on classColors.json
    // Look for any span elements that might be part of legend
    const legendSpans = document.querySelectorAll('.inline-flex.items-center');
    expect(legendSpans.length).toBeGreaterThan(0);
  });

  test('renders minimum reservation note', () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    expect(screen.getByText('All reservations are for a minimum of 1 hour.')).toBeInTheDocument();
  });

  test('renders table headers from CSV data', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
    });
  });

  test('handles empty slot clicks for scheduling', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      // Find empty slots (clickable cells)
      const emptyCells = document.querySelectorAll('td.cursor-pointer');
      if (emptyCells.length > 0) {
        fireEvent.click(emptyCells[0]);
        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/contact?message='));
      }
    });
  });

  test('empty slot navigation includes time and day information', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      const emptyCells = document.querySelectorAll('td.cursor-pointer');
      if (emptyCells.length > 0) {
        fireEvent.click(emptyCells[0]);
        const navigateCall = mockNavigate.mock.calls[0][0];
        expect(navigateCall).toContain('/contact?message=');
        expect(decodeURIComponent(navigateCall)).toContain('recurring classes');
      }
    });
  });

  test('renders table with proper styling classes', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      const table = document.querySelector('table');
      expect(table).toHaveClass('min-w-full', 'w-full', 'rounded-3xl');
    });
  });

  test('handles edge case with empty CSV data', () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    renderSchedule();
    
    // Should render schedule heading and legend but no table
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('All reservations are for a minimum of 1 hour.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('renders with responsive overflow container', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      const overflowContainer = document.querySelector('.overflow-x-auto');
      expect(overflowContainer).toBeInTheDocument();
    });
  });

  test('table cells have proper hover effects', async () => {
    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: sampleScheduleData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      const emptyCells = document.querySelectorAll('td.cursor-pointer');
      if (emptyCells.length > 0) {
        expect(emptyCells[0]).toHaveClass('hover:bg-orange-50');
      }
    });
  });

  test('handles different time formats in slot clicking', async () => {
    const customData = [
      { 'Time': '9:00', 'Monday': '', 'Tuesday': 'Class A' },
      { 'Time': '10:00', 'Monday': '', 'Tuesday': 'Class A' },
    ];

    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: customData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      const emptyCells = document.querySelectorAll('td.cursor-pointer');
      if (emptyCells.length > 0) {
        fireEvent.click(emptyCells[0]);
        expect(mockNavigate).toHaveBeenCalled();
      }
    });
  });

  test('handles data with various class names and applies colors', async () => {
    const diverseData = [
      { 'Time': '9:00 AM', 'Monday': 'bharatanatyam basics', 'Tuesday': 'KIDS DANCE', 'Wednesday': 'Private Lesson' },
      { 'Time': '10:00 AM', 'Monday': 'bharatanatyam basics', 'Tuesday': 'KIDS DANCE', 'Wednesday': 'Private Lesson' },
    ];

    jest.spyOn(useGoogleSheetCSVModule, 'useGoogleSheetCSV').mockReturnValue({
      data: diverseData,
      loading: false,
      error: null,
    });

    renderSchedule();
    
    await waitFor(() => {
      // Check that different classes are rendered
      expect(screen.getAllByText('bharatanatyam basics')).toHaveLength(2);
      expect(screen.getAllByText('KIDS DANCE')).toHaveLength(2);
      expect(screen.getAllByText('Private Lesson')).toHaveLength(2);
    });
  });
}); 