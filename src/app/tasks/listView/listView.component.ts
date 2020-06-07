import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../newTask/newTask.component';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './listView.component.html',
  styleUrls: ['./listView.component.css']
})
export class ListViewComponent implements OnInit, OnDestroy{

  tasks : Task[] = [];
  todoTasks : Task[] = [];
  doneTasks : Task[] = [];
  private tasksSub : Subscription;
  private authListenerSubs : Subscription;
  public userIsAuthenticated: boolean = false;
  public isLoading : boolean = false;

  constructor(public dialog: MatDialog,
    public taskService: TaskService,
    private authService: AuthService) {}

  openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      height:'auto',
      width: 'auto',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result.data) {
        this.taskService.editTask(result.data);
      }

    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.taskService.getTasks();
    this.tasksSub = this.taskService.getTasksListUpdateListener()
      .subscribe((tasks: Task[]) => {
          this.tasks = tasks;
          this.todoTasks = this.tasks.filter(task => {
            return task.complete === false;
          });
          this.doneTasks = this.tasks.filter(task => {
            return task.complete === true;
          });
          this.isLoading = false;
      });

      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  setAsComplete(task : Task) {
      task.complete = !task.complete;
      this.taskService.editTask(task);

  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  editTask(taskId: string) {
      const task = this.taskService.getTask(taskId);
      this.openEditTaskModal(task);
  }
}
