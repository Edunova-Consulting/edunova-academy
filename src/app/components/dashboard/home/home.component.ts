import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user: User | null = null;
  UserRole = UserRole;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  get isAdmin() {
    return this.user?.role === UserRole.Admin;
  }

  get isTeacher() {
    return this.user?.role === UserRole.Teacher;
  }

  get isStudent() {
    return this.user?.role === UserRole.Student;
  }
}

