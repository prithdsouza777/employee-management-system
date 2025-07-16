import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-reset-credentials',
  standalone: true,
  imports: [CommonModule, ToastModule, ReactiveFormsModule, Navbar],
  templateUrl: './reset-credentials.html',
  styleUrls: ['./reset-credentials.scss']
})
export class ResetCredentials {
  passwordForm!: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: Api,
    private auth: Auth,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userId = this.auth.getUserId();

    if (!this.userId) {
      this.route.queryParams.subscribe(params => {
        this.userId = params['userId'] ? +params['userId'] : null;
      });
    }

    this.passwordForm = this.fb.group({
      new_password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      confirm_password: this.fb.control('', Validators.required),
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const new_password  = this.passwordForm.value;
      console.log('Password updated to:', new_password, this.userId);

      if (this.userId !== null) {
        this.api.changeUserPassword(this.userId, new_password).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Password Changed',
              detail: `Employee ID ${this.userId} password has been update.`,
              life: 3000
            });
             this.router.navigate(['/change-credentials']);
          },
          error: (err) => {
            console.error('Update failed', err),
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: `Employee ID ${this.userId} password not be updated}.`,
              life: 3000
          });
          }
        });
      } else {
        alert('User ID is not available.');
      }
    }
  }
}
