import axios from "axios";
import storage from "@/utils/storage";

// @ts-ignore
const base_url = `${import.meta.env.VITE_API_BASE_URL}/api`;

const AxiosClient = axios.create({
  baseURL: base_url,
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
});

AxiosClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  config.headers.Authorization = `Bearer ${token}`;
  // config.headers.Accept = 'application/json';

  return config;
});

AxiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const {response} = error;

  if (response && response.status == 401)
    storage.clearToken();

  throw error;
});

export default AxiosClient;
