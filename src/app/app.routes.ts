import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'users/create',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'users/:id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];