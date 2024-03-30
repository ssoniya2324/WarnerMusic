// useUpdateSingerData.ts
import { useState, useEffect } from 'react';
import { updateRegionData } from '../Api';


const useUpdateRegionData = (trigger: boolean, selectedItems:string[]) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!trigger) return; // Exit if trigger is false
    const fetchData = async () => {
      try {
        setLoading(true);

        const responseData = await updateRegionData(selectedItems);
        setData(responseData);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [trigger]); // Run effect when trigger changes

  return { data, loading, error };
};

export default useUpdateRegionData;
