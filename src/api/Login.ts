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
      const response = await this.session.post("login/", { username, password });
      this.session.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      localStorage.setItem("userData", response.data);
      return response.data.user;
    } catch {
      throw new Error("Login failed");
    }
  }
}
