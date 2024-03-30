// useUpdateSingerData.ts
import { useState, useEffect } from 'react';
import { updateSingerData, updateRegionData, updateLanguageData } from '../Api';


const useValidateTableData = (trigger: boolean, selectedItems:string[],tabType:string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!trigger) return; // Exit if trigger is false
    const fetchData = async () => {
      try {
        setLoading(true);
 
        if(tabType == 'singer'){
          const responseData = await updateSingerData(selectedItems);
          setData(responseData);
        setLoading(false);

        }else if(tabType == 'region'){
          const responseData = await updateRegionData(selectedItems);
          setData(responseData);
        setLoading(false);
        }else if(tabType == 'language'){
          const responseData = await updateLanguageData(selectedItems);
          setData(responseData);
        setLoading(false);
        }
        
       

      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [trigger]); // Run effect when trigger changes

  return { data, loading, error };
};

export default useValidateTableData;
