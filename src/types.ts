export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  responsibleId: string;
  dueDate: string;
  createdAt: string;
}