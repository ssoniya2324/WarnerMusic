import { useState, useEffect } from 'react';
import {updateData,rejectData } from '../Api';


const useValidateTableData = (trigger: boolean, selectedItems:string[], tabType:string, actionType:string, UserInput?:string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!trigger) return; 
    const fetchData = async () => {
      try {
        setLoading(true);

        const responseData = actionType == 'approve'?  await updateData(tabType,selectedItems,UserInput):  await rejectData(tabType,selectedItems);
        setData(responseData);
        setLoading(false);


      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [trigger]); 
  return { data, loading, error };
};

export default useValidateTableData;
