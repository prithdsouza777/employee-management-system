import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Auth } from '../../services/auth';
import { UiComponents } from '../../ui/ui-components';

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
    private uicomponents: UiComponents,
  ) {}

  ngOnInit() {
    /*this.route.queryParams.subscribe(params => {
        this.userId = params['userId'] ? +params['userId'] : null;
    });

    if (!this.userId) {
      this.userId = this.auth.getUserId();
      
    }*/
    this.userId = this.auth.getUserId();

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

      if (this.userId !== null) {
        this.api.changeUserPassword(this.userId, new_password).subscribe({
          next: () => {
            this.uicomponents.success('Update Successful',
              `Employee ID ${this.userId} Password was updated.`
            );
            this.passwordForm.reset();
          },
          error: (err) => {
            console.error('Update failed', err),
            this.uicomponents.error('Update Failed',
              `Employee ID ${this.userId} Password was not update.`
            );
          } 
        });
      } else {
        alert('User ID is not available.');
      }
    }
  }
}
