import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { Api } from '../../services/api';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-details',
  imports: [Navbar, CommonModule,
    CardModule, ToolbarModule, ButtonModule, DividerModule
  ],
  templateUrl: './my-details.html',
  styleUrl: './my-details.scss'
})
export class MyDetails implements OnInit{

  employee: any;
  id: number | null = null;

  constructor(
    private router: Router,
    private api: Api,
    private auth: Auth,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    const isAdmin = this.auth.getisAdmin();


    if (isAdmin) {
      this.route.queryParams.subscribe(params => {
        this.id= params['userId'] ? +params['userId'] : null;
      });
    } 

    if (!this.id){
      this.id = this.auth.getUserId();
    }
    
    if (this.id) {
      this.api.getEmployeeDetails(this.id).subscribe({
        next: (data) => {
          this.employee = data;
        },
        error: () => this.router.navigate(['/employees'])
      });
    }
  }
}
