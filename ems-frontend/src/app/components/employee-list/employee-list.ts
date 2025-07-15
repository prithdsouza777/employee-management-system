import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.html',
  imports: [RouterLink],
  styleUrls: ['./employee-list.scss']
})
export class EmployeeList implements OnInit {
  employees: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.api.getEmployees().subscribe({
      next: (data) => {
        this.employees = [...data];
        this.employees = data;
        this.loading = false;
        console.log('Employees loaded', this.employees);
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.loading = false;
      }
    });
  }

  openEmployeeForm(employee: any): void {    
   if (employee) {
      this.router.navigate(['/employee-form'], {
        queryParams: { currentUserId: employee.user.id }
      });
    }
  }

  deleteEmployee(employee: any): void {
  const confirmed = confirm(`Delete employee ID ${employee.user.id}?`);
  if (!confirmed) return;

  this.api.deleteEmployee(employee.user.id).subscribe({  
    next: () => {
      this.employees = this.employees.filter(e => e.id !== employee.user.id);
      window.location.reload();
    },
    error: (err) => {
      console.error('Failed to delete employee', err);
      this.errorMessage = err?.error?.detail || 'Could not delete employee. Please try again.';
    }
  });
}
}
