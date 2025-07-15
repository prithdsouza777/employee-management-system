import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../../services/auth';
import { EmployeeList } from '../employee-list/employee-list';
import { EmployeeForm } from '../employee-form/employee-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, EmployeeList], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  constructor(private authService: Auth) {} 

  logout() {
    this.authService.logout();
  }
}