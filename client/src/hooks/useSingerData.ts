// useSingerData.ts
import { useState, useEffect } from 'react';
import { fetchSingerBaseData, fetchSingerData } from '../Api';

export interface SingerData {
  CC_CALL_CENTER_ID: string;
  CC_NAME: string;
}

const useSingerData = (trigger: boolean, viewType:string) => {
  const [data, setData] = useState<SingerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!trigger) return; // Exit if trigger is false
    const fetchData = async () => {
      try {
        setLoading(true);

        const responseData = (viewType =='validate')? await fetchSingerData():await fetchSingerBaseData();
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

export default useSingerData;
