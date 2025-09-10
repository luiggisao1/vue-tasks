import type { AxiosInstance } from "axios";
import axios from "axios";

class CommonAPI {
  public session: AxiosInstance;
  static readonly instance: CommonAPI;

  constructor() {
    this.session = axios.create({
      baseURL: "http://localhost:8000/api/",
    });
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
