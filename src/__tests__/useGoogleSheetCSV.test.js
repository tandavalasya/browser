import { renderHook, waitFor } from '@testing-library/react';
import { useGoogleSheetCSV } from '../utils/useGoogleSheetCSV';

// Mock fetch is already available from setupTests.js

describe('useGoogleSheetCSV', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should return initial state with URL', () => {
    // Mock fetch to prevent actual network calls
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('Name,Age\nJohn,25\nJane,30')
    });

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('should fetch and parse CSV data successfully', async () => {
    const csvData = 'Name,Age\nJohn,25\nJane,30';
    
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(csvData)
    });

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([
        { Name: 'John', Age: '25' },
        { Name: 'Jane', Age: '30' }
      ]);
      expect(result.current.error).toBe(null);
    });
  });

  test('should handle empty CSV data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('')
    });

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });

  test('should handle fetch errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch data');
    });
  });

  test('should handle HTTP errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch data');
    });
  });

  test('should not fetch when URL is empty', () => {
    const { result } = renderHook(() => useGoogleSheetCSV(''));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should handle whitespace-only text response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('   \n  \t  ')
    });

    const { result } = renderHook(() => useGoogleSheetCSV('test-url'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });
}); 