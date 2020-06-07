export interface Task {
  id: string;
  title: string;
  notes: string;
  label: string;
  dueDate: Date;
  dueDateString: string;
  complete: boolean;
}
