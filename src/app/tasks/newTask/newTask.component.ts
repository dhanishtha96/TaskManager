import {Component,  Inject, EventEmitter, Output} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Task } from '../task.model';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'new-task-dialog',
  templateUrl: './newTask.component.html',
  styleUrls:['./newTask.component.css']
})

export class NewTaskComponent{

  minDate: Date = new Date();
  public task : Task;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<NewTaskComponent>,
    public datePipe: DatePipe) {
      this.task = data;
      const today = new Date();
      this.minDate.setDate(today.getDate()-1);
    }

    onAddNewtask(form: NgForm) {

      if(form.invalid) {
        return;
      }

      const task : Task= {
        id: form.value.id,
        title: form.value.title,
        notes: form.value.notes,
        label: form.value.label,
        dueDate: form.value.dueDate,
        dueDateString: this.datePipe.transform(form.value.dueDate, 'dd/MM/yyyy'),
        complete: form.value.complete
      };

      if(form.value.id) {
        this.dialogRef.close({event:'edit', data: task});
      }
      else {
        this.dialogRef.close({event:'add', data: task});
      }
    }

}
