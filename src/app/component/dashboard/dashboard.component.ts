import { Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../model/task';
import { CrudService } from '../../service/crud.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  taskObj: Task = new Task();
  taskArr: Task[] = [];

  addTaskValue: string = '';
  editTaskValue: string = '';
  crudService = inject(CrudService);

  ngOnInit(): void {
    this.editTaskValue = '';
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.taskArr = [];
    this.getAllTask();
  }

 

  getAllTask() {
    this.crudService.getAllTask().subscribe(
      (res:Task[]) => {
  
        this.taskArr = res;
      },
      (err) => {
        alert('Unable to get list of tasks');
      }
    );
  }

  addTask() {
    // Check if there are existing tasks and get the max id, then increment
    const maxId =
      this.taskArr.length > 0
        ? Math.max(...this.taskArr.map((task) => task.id))
        : 0;
    this.taskObj.id = maxId + 1; // Increment the id

    this.taskObj.task_name = this.addTaskValue;
    this.crudService.addTask(this.taskObj).subscribe(
      (res) => {
        this.ngOnInit();
        this.addTaskValue = '';
      },
      (err) => {
        alert(err);
      }
    );
  }

  editTask() {
    this.taskObj.task_name = this.editTaskValue;
    this.crudService.editTask(this.taskObj).subscribe(
      (res) => {
        this.ngOnInit();
      },
      (err) => {
        alert('Failed to update task');
      }
    );
  }

  deleteTask(task: Task) {
    this.crudService.deleteTask(task).subscribe(
      (res) => {

        this.ngOnInit();
      },
      (err) => {
        alert('Failed to delete task');
      }
    );
  }

  call(etask: Task) {
    this.taskObj = etask;
    this.editTaskValue = etask.task_name;
  }
}
