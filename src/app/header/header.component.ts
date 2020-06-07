import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewTaskComponent } from '../tasks/newTask/newTask.component';
import {MatDialog} from '@angular/material/dialog';
import { TaskService } from '../tasks/task.service';
import { Task } from '../tasks/task.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  private task : Task = {
    id: '',
    title: '',
    notes: '',
    label: '',
    dueDate: new Date(),
    dueDateString: '',
    complete: false
  }

  userIsAuthenticated = false;

  private authListenerSubs: Subscription;

  constructor(public dialog: MatDialog, public taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  openTaskModal(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      height:'auto',
      width: 'auto',
      data: this.task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result.data) {
        this.taskService.addTask(result.data);
      }

    });
  }

  onLogout() {
    this.authService.logout();
  }
}
