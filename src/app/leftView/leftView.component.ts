import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../tasks/task.model';
import { TaskService } from '../tasks/task.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-left-view',
  templateUrl: './leftView.component.html',
  styleUrls: ['./leftView.component.css']
})
export class LeftViewComponent {
  tasks : Task[] = [];
  private tasksSub : Subscription;

  constructor(public taskService: TaskService) {}
}
