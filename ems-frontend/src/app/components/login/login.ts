import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Auth } from '../../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';
  isAdmin = false;

  constructor(private authService: Auth, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isAdmin = this.authService.getisAdmin();
        if (this.isAdmin) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/view-details']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}


