import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export function useGoogleSheetCSV(csvUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(csvUrl)
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true });
        setData(parsed.data.filter(row => Object.values(row).some(cell => cell && cell.trim() !== '')));
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [csvUrl]);

  return { data, loading, error };
} 