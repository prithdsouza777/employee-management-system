import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  @Input() pageTitle: string = 'Dashboard'
  
  isAdmin = false;

   constructor(
    private authService: Auth,
  ) {}
  ngOnInit(): void {
    
    this.isAdmin = this.authService.getisAdmin();
    console.log(this.isAdmin);
  }

  logout() {
    this.authService.logout();
  }
}
