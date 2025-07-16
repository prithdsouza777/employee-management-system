import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.html',
  imports: [CommonModule, ReactiveFormsModule, Navbar, ToastModule],
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeForm implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = true;
  currentUserId: number | null = null;
  originalUsername: string = '';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private router: Router,
    private authService: Auth,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getisAdmin();

    this.employeeForm = this.fb.group({
    username: [{ value: '', disabled: !this.isAdmin }, Validators.required],
    is_staff: [false, Validators.required],
    first_name: [''],
    last_name: [''],
    email: ['', Validators.email],
    phone_number: [''],
    position: [''],
    department: [''],
    joining_date: [''],
    date_of_birth: [''],
    });

    if (this.isAdmin) {
      this.removeNonAdminValidators();

      this.route.queryParams.subscribe(params => {
        this.isEditMode = params['isEditMode'] !== 'false';
        this.currentUserId = params['currentUserId'] ? +params['currentUserId'] : null;
      });
    } 
    
    if (!this.currentUserId){
      this.currentUserId = this.authService.getUserId();
    }

    if (this.isEditMode === true) {
      this.loadCurrentUser();
    }  
    
  }

  private removeNonAdminValidators(): void {
    const fieldsToClear = ['first_name', 'last_name', 'email', 'phone_number',
      'position', 'department', 'joining_date','date_of_birth',
    ];

    for (const field of fieldsToClear) {
      const control = this.employeeForm.get(field);
      if (control) {
        control.clearValidators();
        control.setValue(''); 
        control.updateValueAndValidity();
      }
    }
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

          this.originalUsername = user.user?.username || '';
          console.log(this.originalUsername);
        },
        error: (err) => {
          console.error('Failed to load user data', err);
        },
      });
    }
  }

  submitForm(): void {

    const formData = this.employeeForm.value;
    formData.user = {};
    console.log(formData);

    if (this.isAdmin) {
      if (formData.first_name === '') delete formData.first_name;
      if (formData.last_name === '') delete formData.last_name;
      if (formData.email === '') delete formData.email;
      if (formData.phone_number === '') delete formData.phone_number;
      if (formData.position === '') delete formData.position;
      if (formData.department === '') delete formData.department;
      if (formData.joining_date === '') delete formData.joining_date;
      if (formData.date_of_birth === '') delete formData.date_of_birth;
      console.log(formData)
    }

    
    if (this.isEditMode ) {
      if (formData.username !== this.originalUsername) {
        formData.user.username = formData.username;
      } 
      formData.user.is_staff = formData.is_staff;
      delete formData.username;
      delete formData.is_staff;
      console.log(formData);
    }

    if (this.isEditMode && this.currentUserId) {
      this.api.updateEmployee(this.currentUserId, formData).subscribe({
        next: () => {
          this.router.navigate(['/employee-form'], {
            queryParams: { isEditMode: true, currentUserId: this.currentUserId },
          });
          this.messageService.add({
            severity: 'success',
            summary: 'Employee Updated',
            detail: `Employee ID ${this.currentUserId} has been updated.`,
            life: 3000
          });
        },
        error: (err) => {
          console.error('Update failed', err),
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: `Employee ID ${this.currentUserId} could not be updated}.`,
            life: 3000
          });
        }
      });
    } else {
      this.api.createEmployee(formData).subscribe({
        next: () => {
          alert('Employee Created Successfully!');
          this.messageService.add({
            severity: 'success',
            summary: 'Employee Created',
            detail: `Employee ID ${this.currentUserId} has been created.`,
            life: 3000
          });
          this.employeeForm.reset();
          this.router.navigate(['/employee-form'], { queryParams: { isEditMode: false } });
        },
        error: (err) => {
          console.error('Create failed', err),
          this.messageService.add({
            severity: 'error',
            summary: 'Create Failed',
            detail: `Employee ID ${this.currentUserId} was not created.`,
            life: 3000
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
