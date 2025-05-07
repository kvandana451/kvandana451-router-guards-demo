import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { CourseDetailsComponent } from '../components/course-details/course-details.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { AdminComponent } from '../components/admin/admin.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard] },
  {
    path: 'course-details/:id',
    component: CourseDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
];
