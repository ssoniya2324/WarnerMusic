import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a response interceptor to handle CORS errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      // Handle CORS error
      console.error('CORS Error:', error.response.data);
      throw new Error('CORS Error: Request blocked by CORS policy');
    }
    throw error;
  }
);

export const fetchSingerData = async () => {
  try {
    const response = await api.get('/singer');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch singer data');
  }
};

export const fetchRegionData = async () => {
  try {
    const response = await api.get('/region');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch region data');
  }
};


export const fetchLanguageData = async () => {
  try {
    const response = await api.get('/language');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch language data');
  }
};


export const fetchBaseData = async (selectedAlbums: string[]) => {
  try {
    const response = await api.post('/baseData',{selectedAlbums:selectedAlbums});
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch base data');
  }
};


export const fetchRegionBaseData = async () => {
  try {
    const response = await api.get('/regionBase');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch region data');
  }
};


export const fetchLanguageBaseData = async () => {
  try {
    const response = await api.get('/languageBase');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch language data');
  }
};



export const updateSingerData = async (selectedAlbums: string[]) => {
  try {
    console.log(selectedAlbums)
    
    const response = await api.put('/singer/update',{selectedAlbums:selectedAlbums});
    return response.data;
  } catch (error) {
    throw new Error('Failed to update singer data');
  }
};


export const updateRegionData = async (selectedAlbums: string[]) => {
  try {
    console.log(selectedAlbums)
    
    const response = await api.put('/region/update',{selectedAlbums:selectedAlbums});
    return response.data;
  } catch (error) {
    throw new Error('Failed to update region data');
  }
};


export const updateLanguageData = async (selectedAlbums: string[]) => {
  try {
    console.log(selectedAlbums)
    
    const response = await api.put('/language/update',{selectedAlbums:selectedAlbums});
    return response.data;
  } catch (error) {
    throw new Error('Failed to update region data');
  }
};