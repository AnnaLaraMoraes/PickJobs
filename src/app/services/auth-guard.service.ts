import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private router: Router,
    public auth: AuthService,
  ) {}

  canActivate() {
    return this.auth.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
    );
  }
}

export const authGuardGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivate();
};
