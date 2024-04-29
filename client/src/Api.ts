import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      console.error('CORS Error:', error.response.data);
      throw new Error('CORS Error: Request blocked by CORS policy');
    }
    throw error;
  }
);

//Base API CALL
export const fetchBaseData = async (selectedAlbums: string[]) => {
  try {
    const response = await api.post('/baseData',{selectedAlbums:selectedAlbums});
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch base data');
  }
};


//Get Validate Data API Call
// Ensure fetchDataByType uses forceRefresh to decide between fetching new data or using cache
const cache: { [key: string]: any } = {};
export const fetchDataByType = async (columnName, forceRefresh = false) => {
  if (!forceRefresh && cache[columnName]) {
    return cache[columnName]; // Use cached data
  }
  // Fetch new data logic
  try {
    const response = await api.get(`/getData/${columnName}`);
    cache[columnName] = response.data; // Update cache
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${columnName} data`);
  }
};

//Approve Update API Call
export const updateData = async (columnName:string, selectedAlbums:string[], userInput?:string) => {
  try {
    console.log(selectedAlbums);
    const endpoint = `/data/update`;
    const response = await api.put(endpoint, { columnName, selectedAlbums, userInput },);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ${columnName} data`);
  }
};

//Reject API Call
export const rejectData = async (columnName:string, selectedAlbums:string[]) => {
  try {
    console.log(selectedAlbums);
    
    const endpoint = `/reject`;
    const response = await api.put(endpoint, { selectedAlbums });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to reject ${columnName} data`);
  }
};

// Get Metrics API Call
export const getMetrics = async () => {
  try {
    const response = await api.get('/getMetrics');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch metrics');
  }
};

export const ingestData = async (data: any) => {
  try {
    const endpoint = `/ingest`;
    const response = await api.put(endpoint, data); 
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update data`);
  }
};


