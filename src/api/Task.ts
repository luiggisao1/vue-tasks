import { type AxiosInstance } from "axios";
import type { TaskCreateData, TaskData } from "../types";
import instance from "./Common";

export class TaskAPI {
  private session: AxiosInstance;

  constructor() {
    this.session = instance.session;
  }

  public async post(data: TaskCreateData): Promise<TaskData> {
    try {
      const response = await this.session.post("tasks/", data);

      return response.data;
    } catch {
      throw new Error("Login failed");
    }
  }

  public async getTasks(): Promise<TaskData[]> {
    try {
      const response = await this.session.get("tasks/");
      return response.data;
    } catch {
      return [];
    }
  }

  public async editTask(
    id: number,
    data: Pick<TaskCreateData, "description" | "owner" | "title" | "due_date">,
  ): Promise<TaskData> {
    try {
      const response = await this.session.put(`tasks/${id}/`, data);
      return response.data;
    } catch {
      throw new Error("Edit failed");
    }
  }

  public async deleteTask(id: number): Promise<void> {
    try {
      await this.session.delete(`tasks/${id}/`);
    } catch {
      throw new Error("Delete failed");
    }
  }
}
