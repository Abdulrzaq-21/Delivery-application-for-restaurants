import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, apiUrl } from "./constants";


const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
