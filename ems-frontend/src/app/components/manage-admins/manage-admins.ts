import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Router, RouterLink } from '@angular/router';
import { UiComponents } from '../../ui/ui-components';
import { Navbar } from '../navbar/navbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-admins',
  imports: [
    FormsModule,
    CommonModule,
    Navbar,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    MessageModule,
    CardModule,
    ToggleSwitchModule,
  ],
  templateUrl: './manage-admins.html',
  styleUrl: './manage-admins.scss'
})
export class ManageAdmins {
  employees: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private api: Api,
    private router: Router,
    private uicomponents: UiComponents,
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

  async removeAdminAccess(event: Event, employee: any): Promise<void> {
    const formData = { user: { is_staff: false }};

    const confirmed = await this.uicomponents.confirmDelete(
      event,
      `Do you wish to Remove Admin access for employee ID: ${employee.user.id}?`,
      'Confirmation'
    );

    if (!confirmed) return;

    this.api.updateEmployee(employee.user.id, formData).subscribe({
      next: () => {
        this.router.navigate(['/manage-admins'])
        this.uicomponents.success('Removed Admin Access', `Employee ID: ${employee.user.id} is no more an Admin.`);
      },
      error: (err) => {
        const errorMessage = err?.error?.detail || 'Could not delete employee. Please try again.';
        this.uicomponents.error('Failed to Remove Admin Access', `Employee ID: ${employee.user.id} is still an Admin.`);
      }
    });
  }
}