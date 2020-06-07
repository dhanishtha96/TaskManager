import { Task } from './task.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class TaskService {
  private tasks: Task[] = [];
  private tasksListUpdated = new Subject<Task[]>();

  constructor(private http: HttpClient, public datePipe: DatePipe) {}

  getTasks() {
    this.http.get<{message: string, data: any}>('http://localhost:3000/api/tasks')
      .pipe(map((res) => {
          return res.data.map(task => {
            return {
              id: task._id,
              title: task.title,
              notes: task.notes,
              label: task.label,
              dueDateString: this.datePipe.transform(task.dueDate, 'dd/MM/yyyy'),
              dueDate: task.dueDate,
              complete: task.complete
            };
          });
      }))
      .subscribe((tasksList) => {
          this.tasks = tasksList;
          this.tasksListUpdated.next([...this.tasks]);
      });
  }

  getTasksListUpdateListener() {
    return this.tasksListUpdated.asObservable();
  }

  addTask(task: Task) {
    this.http.post<{message: string, taskId: string}>('http://localhost:3000/api/tasks', task)
      .subscribe((res) => {
          console.log(res.message);
          task.id = res.taskId;
          this.tasks.push(task);
          this.tasksListUpdated.next([...this.tasks]);

      });

  }

  deleteTask(taskId: string) {
    this.http.delete<{message: string}>('http://localhost:3000/api/tasks/' + taskId)
      .subscribe(() => {
        const tasksList = this.tasks.filter(task => task.id !== taskId);
        this.tasks = tasksList;
        this.tasksListUpdated.next([...this.tasks]);
      })
  }

  editTask(task: Task) {
    this.http.put<{message: string}>('http://localhost:3000/api/tasks/' + task.id, task)
      .subscribe((response) => {
        const oldTasksList = [...this.tasks];
        const taskIndex = oldTasksList.findIndex(t => t.id === task.id);
        oldTasksList[taskIndex] = task;
        this.tasks = oldTasksList;
        this.tasksListUpdated.next([...this.tasks]);
      });
  }

  getTask(taskId: string) {
    return {...this.tasks.find(t => t.id === taskId)};
  }
}
