import axios from "axios";
import baseUrl from "./api";
import Cookies from "js-cookie";

const axiosInstance = axios.create({ baseURL: baseUrl });
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { axiosInstance };
