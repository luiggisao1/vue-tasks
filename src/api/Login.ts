import { type AxiosInstance } from "axios";
import type { User } from "../types";
import instance from "./Common";

export class LoginAPI {
  private session: AxiosInstance;

  constructor() {
    this.session = instance.session;
  }

  public async login(username: string, password: string): Promise<User> {
    try {
      const lowerUsername = username.toLowerCase();
      const response = await this.session.post("login/", { username: lowerUsername, password });
      this.session.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("access", response.data.access);
      return response.data.user;
    } catch {
      throw new Error("Login failed");
    }
  }

  public async logout(): Promise<boolean> {
    try {
      const response = await this.session.post("logout/");
      return response.status === 200;
    } catch {
      return false;
    }
  }

  public async refreshToken(): Promise<void> {
    try {
      const refresh = localStorage.getItem("refresh");

      const response = await this.session.post("token/refresh/", { refresh });
      this.session.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      localStorage.setItem("access", response.data.access);
    } catch {
      throw new Error("Token refresh failed");
    }
  }
}
