import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { EmployeeForm } from './components/employee-form/employee-form';
import { MyDetails } from './components/my-details/my-details';
import { ResetCredentials } from './components/reset-credentials/reset-credentials';
import { ManageAdmins } from './components/manage-admins/manage-admins';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'employee-form', component: EmployeeForm, canActivate: [AuthGuard] },
    { path: 'employee-form/:id', component: EmployeeForm, canActivate: [AuthGuard] },
    { path: 'manage-admins', component: ManageAdmins, canActivate: [AuthGuard] },
    { path: 'view-details', component: MyDetails, canActivate: [AuthGuard] },
    { path: 'view-details/:id', component: MyDetails, canActivate: [AuthGuard] },
    { path: 'reset-credentials', component: ResetCredentials, canActivate: [AuthGuard] },
];

