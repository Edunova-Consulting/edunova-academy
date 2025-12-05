import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (!allowedRoles.includes(user.role)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

