import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.html',
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeForm implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = true;
  currentUserId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private api: Api,
    private router: Router,
    private authService: Auth,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const isAdmin = this.authService.getisAdmin();

    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      is_staff: [false, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      joining_date: ['', Validators.required],
      date_of_birth: ['', Validators.required],
    });

    if (isAdmin) {
      this.route.queryParams.subscribe(params => {
        this.isEditMode = params['isEditMode'] !== 'false';
        this.currentUserId = params['currentUserId'] ? 
        +params['currentUserId'] : this.currentUserId = this.authService.getUserId();;
      });
    }

    if (this.isEditMode === true) {
      this.loadCurrentUser();
    }
    console.log(this.currentUserId)
  }

  loadCurrentUser(): void {

    if (this.currentUserId) {
      this.api.getEmployeeDetails(this.currentUserId).subscribe({
        next: (user) => {
          this.employeeForm.patchValue({
            username: user.user?.username || '',
            is_staff: user.user?.is_staff || false,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            position: user.position || '',
            department: user.department || '',
            joining_date: user.joining_date || '',
            date_of_birth: user.date_of_birth || '',
          });

          if (!this.authService.getisAdmin) {
            this.employeeForm.get('username')?.disable();
          }

          console.log('Loaded user data:', user);
        },
        error: (err) => {
          console.error('Failed to load user data', err);
        },
      });
    }
  }

  submitForm(): void {
    if (this.employeeForm.invalid) return;

    const formData = this.employeeForm.value;

    if (this.isEditMode && this.currentUserId) {
      this.api.updateEmployee(this.currentUserId, formData).subscribe({
        next: () => this.router.navigate(['/employee-form'], {
          queryParams: { isEditMode: true, currentUserId: this.currentUserId }
        }),
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.api.createEmployee(formData).subscribe({
        next: () => window.location.reload(),
        error: (err) => console.error('Create failed', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  logout() {
    this.authService.logout();
  }
}
