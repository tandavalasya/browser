import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export function useGoogleSheetCSV(csvUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!csvUrl || csvUrl.trim() === '') {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch(csvUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        return res.text();
      })
      .then(text => {
        if (!text || text.trim() === '') {
          setData([]);
          setLoading(false);
          return;
        }

        try {
          const parsed = Papa.parse(text, { header: true });
          if (parsed.errors && parsed.errors.length > 0) {
            throw new Error('Failed to parse CSV data');
          }
          setData(parsed.data.filter(row => Object.values(row).some(cell => cell && cell.trim() !== '')));
          setLoading(false);
        } catch (parseError) {
          setError('Failed to parse CSV data');
          setLoading(false);
        }
      })
      .catch(e => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [csvUrl]);

  return { data, loading, error };
}

// Add default export
export default useGoogleSheetCSV; 