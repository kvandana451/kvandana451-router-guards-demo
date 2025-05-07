import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.userInfo.role) {
    router.navigate(['/home']);
    return false;
  }
  // router.navigate(['/dashboard']);
  return true;
};
