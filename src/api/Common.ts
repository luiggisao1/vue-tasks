import type { AxiosInstance } from "axios";
import axios from "axios";
import router from "../routes";

class CommonAPI {
  public session: AxiosInstance;
  static instance: CommonAPI;

  constructor() {
    this.session = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
    CommonAPI.instance = this;

    this.session.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refresh = localStorage.getItem("refresh");
            const response = await this.session.post("token/refresh/", {
              refresh,
            });
            const { access } = response.data;
            localStorage.setItem("access", access);
            this.session.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            originalRequest.headers["Authorization"] = `Bearer ${access}`;
            return this.session(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            router.push({ name: "Login" });
            return Promise.reject(refreshError);
          }
        }
      },
    );
  }

  static getInstance(): CommonAPI {
    if (CommonAPI.instance) {
      return CommonAPI.instance;
    } else {
      return new CommonAPI();
    }
  }
}

export default CommonAPI.getInstance();
