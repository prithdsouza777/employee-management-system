import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Api } from '../../services/api';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    Navbar,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  employees: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private api: Api,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.api.getEmployees().subscribe({
      next: (data) => {
        this.employees = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.loading = false;
      }
    });
  }

  openEmployeeDetails(employee: any): void {
    if (employee) {
      this.router.navigate(['/view-details'], {
        queryParams: { userId: employee.user.id }
      });
    }
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
        this.employees = this.employees.filter(e => e.user.id !== employee.user.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Employee Deleted',
          detail: `Employee ID ${employee.user.id} has been deleted.`,
          life: 3000
        });
      },
      error: (err) => {
        console.error('Failed to delete employee', err);
        this.errorMessage = err?.error?.detail || 'Could not delete employee. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
          life: 4000
        });
      }
    });
  }
}
