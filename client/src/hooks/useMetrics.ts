import { useState, useEffect } from 'react';
import { getMetrics } from '../Api';


const useMetrics = (trigger: number, dataa:string[]) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const responseData = await getMetrics();
        setData(responseData);
        setLoading(false);


      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [trigger,dataa]); 
  return { data, loading, error };
};

export default useMetrics;
