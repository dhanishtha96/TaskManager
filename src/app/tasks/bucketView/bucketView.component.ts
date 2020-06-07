import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth/auth.service';
import { NewTaskComponent } from '../newTask/newTask.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bucket-view',
  templateUrl: './bucketView.component.html',
  styleUrls: ['./bucketView.component.css']
})
export class BucketViewComponent {

  tasks : Task[] = [];
  todoTasks : Task[] = [];
  doneTasks : Task[] = [];

  isLoading: boolean = false;

  private tasksSub : Subscription;
  private authListenerSubs : Subscription;
  public userIsAuthenticated: boolean = false;

  constructor(public taskService: TaskService,
    private authService: AuthService,
    public dialog: MatDialog) {}

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

  checkAuth() {
    return this.userIsAuthenticated;
  }

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


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  editTask(taskId: string) {
      const task = this.taskService.getTask(taskId);
      this.openEditTaskModal(task);
  }
}
