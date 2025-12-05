import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.error = '';
    this.loading = true;

    const { error } = await this.authService.signIn(this.email, this.password);

    if (error) {
      this.error = error.message || 'Login failed';
      this.loading = false;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}

