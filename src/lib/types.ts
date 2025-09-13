export type TaskCategory = 'personal' | 'work' | 'study';

export interface Task {
  id: string;
  name: string;
  dueDate: Date | undefined;
  category: TaskCategory;
  completed: boolean;
  priority?: number;
}
