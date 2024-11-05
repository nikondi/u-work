import axios from "axios";

const base_url = `${import.meta.env.VITE_API_BASE_URL}/api`;

const AxiosClient = axios.create({
  baseURL: base_url,
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  }
});

export default AxiosClient;
