import { useState, useEffect } from 'react';
import { fetchDataByType } from '../Api';

// Inside useGenericData.js
export const useGenericData = (columnName, forceRefreshData) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!columnName) { // Only proceed if columnName is truthy
      // Optionally, you can also clear existing data, error, or loading states here
      // For example:
      // setData([]);
      // setError(null);
      setLoading(false); // Consider whether you need to change this based on your UX requirements
      return; // Exit early if no columnName is specified
    }

    setLoading(true);
    const fetchData = async () => {
      try {
        // Assume fetchDataByType is your API call function
        const responseData = await fetchDataByType(columnName, forceRefreshData > 0);
        setData(responseData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [columnName, forceRefreshData]); // Depend on activecolumnName and refreshTrigger

  return { data, loading, error };
};
