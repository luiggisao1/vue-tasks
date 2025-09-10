export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

export interface TaskData {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  due_date?: string;
  completed_at?: string;
  owner: string;
}

export class Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  dueDate?: string;
  completedAt?: string;
  owner: string;

  constructor(data: TaskData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.dueDate = data.due_date;
    this.completedAt = data.completed_at;
    this.owner = data.owner;
  }

  get completed(): boolean {
    return this.status === "completed";
  }

  get isPending(): boolean {
    return this.status === "pending";
  }

  get isOverdue(): boolean {
    if (!this.dueDate) return false;
    const due = new Date(this.dueDate);
    const now = new Date();
    return now > due && !this.completed;
  }
}

export interface TaskCreateData {
  title: string;
  description?: string;
  updated_at?: string;
  due_date?: string;
  owner: string;
  status?: string;
}
