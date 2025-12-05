import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      // Admin routes
      {
        path: 'admin/courses',
        loadComponent: () => import('./components/admin/courses/courses.component').then(m => m.CoursesComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      {
        path: 'admin/classes',
        loadComponent: () => import('./components/admin/classes/classes.component').then(m => m.ClassesComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      {
        path: 'admin/assignments',
        loadComponent: () => import('./components/admin/assignments/assignments.component').then(m => m.AssignmentsComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      {
        path: 'admin/teachers',
        loadComponent: () => import('./components/admin/teachers/teachers.component').then(m => m.TeachersComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      {
        path: 'admin/students',
        loadComponent: () => import('./components/admin/students/students.component').then(m => m.StudentsComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      {
        path: 'admin/course-assignments',
        loadComponent: () => import('./components/admin/course-assignments/course-assignments.component').then(m => m.CourseAssignmentsComponent),
        canActivate: [roleGuard([UserRole.Admin])]
      },
      // Teacher routes
      {
        path: 'teacher/classes',
        loadComponent: () => import('./components/teacher/classes/classes.component').then(m => m.TeacherClassesComponent),
        canActivate: [roleGuard([UserRole.Teacher])]
      },
      {
        path: 'teacher/assignments',
        loadComponent: () => import('./components/teacher/assignments/assignments.component').then(m => m.TeacherAssignmentsComponent),
        canActivate: [roleGuard([UserRole.Teacher])]
      },
      {
        path: 'teacher/students',
        loadComponent: () => import('./components/teacher/students/students.component').then(m => m.TeacherStudentsComponent),
        canActivate: [roleGuard([UserRole.Teacher])]
      },
      // Student routes
      {
        path: 'student/courses',
        loadComponent: () => import('./components/student/courses/courses.component').then(m => m.StudentCoursesComponent),
        canActivate: [roleGuard([UserRole.Student])]
      },
      {
        path: 'student/classes',
        loadComponent: () => import('./components/student/classes/classes.component').then(m => m.StudentClassesComponent),
        canActivate: [roleGuard([UserRole.Student])]
      },
      {
        path: 'student/assignments',
        loadComponent: () => import('./components/student/assignments/assignments.component').then(m => m.StudentAssignmentsComponent),
        canActivate: [roleGuard([UserRole.Student])]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
