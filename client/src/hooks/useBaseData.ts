// useSingerData.ts
import { useState, useEffect } from 'react';
import { fetchBaseData } from '../Api';
import useSingerData, { SingerData } from './useSingerData';
import useRegionData from './useRegionData';
import useLanguageData from './useLanguageData';

export interface BaseData {
  CC_CALL_CENTER_ID: string;
  CC_NAME: string;
}

const useBaseData = (trigger: boolean, viewType:string, columns?:string[],singerData?:any,regionData?:any, languageData?:any) => {
  const [data, setData] = useState<BaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!trigger) return; // Exit if trigger is false
    const fetchData = async () => {
      try {
        setLoading(true);
        const allColumns = columns ? ['ALBUM', ...new Set(columns)] : ['ALBUM'];
      
        const responseData = await fetchBaseData(allColumns || []);
        setData(responseData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [trigger,columns,singerData,regionData,languageData]); // Run effect when trigger changes

  return { data, loading, error };
};

export default useBaseData;
