// useUpdateSingerData.ts
import { useState, useEffect } from 'react';
import {updateData } from '../Api';


const useValidateTableData = (trigger: boolean, selectedItems:string[],tabType:string, actionType:string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!trigger) return; // Exit if trigger is false
    const fetchData = async () => {
      try {
        setLoading(true);

        const responseData =  await updateData(tabType,selectedItems,actionType);
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

export default useValidateTableData;
