import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { EmployeeForm } from './components/employee-form/employee-form';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'employee-form', component: EmployeeForm, canActivate: [AuthGuard] },
    { path: 'employee-form/:id', component: EmployeeForm, canActivate: [AuthGuard] },
];

