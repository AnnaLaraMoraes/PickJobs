import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiKey = 'AIzaSyAAPzQ4x5nbEQOFe1iJ8BI1NZNpDhGXvWw'; // TODO: add em .env

  private userToken$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(localStorage.getItem('userToken'));

  private userTokenExpiresIn$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(
      localStorage.getItem('userTokenExpiresIn'),
    );

  private isAuthenticated$ = combineLatest([
    this.userToken$,
    this.userTokenExpiresIn$,
  ]).pipe(
    map(([userToken, expiresIn]) => {
      return new Date().getTime() < Number(expiresIn) && !!userToken;
    }),
  );

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  getUserTokenObservable(): Observable<string | null> {
    return this.userToken$.asObservable();
  }

  updateUserToken(newToken: string | null) {
    if (newToken === null) {
      localStorage.removeItem('userToken');
    } else {
      localStorage.setItem('userToken', newToken);
    }
    this.userToken$.next(newToken);
  }

  updateUserTokenExpiresIn(expiresIn: string | null) {
    const currentDateTime = new Date();

    currentDateTime.setSeconds(Number(expiresIn));

    expiresIn = currentDateTime.getTime().toString();

    if (expiresIn === null) {
      localStorage.removeItem('userTokenExpiresIn');
    } else {
      localStorage.setItem('userTokenExpiresIn', expiresIn);
    }
    this.userTokenExpiresIn$.next(expiresIn);
  }

  login(email: string, password: string): void {
    const body = {
      email: 'janedoe@ocff-greenduck-git.com', // TODO: fix here
      password: 'KKk9ipStRvUJMGF',
      returnSecureToken: true,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.httpClient
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        body,
        { headers: headers },
      )
      .subscribe((data: any) => {
        if (data && data.idToken) {
          this.updateUserToken(data.idToken);
          this.updateUserTokenExpiresIn(data.expiresIn);
          this.router.navigate(['/home']);
        } else {
          localStorage.setItem('userToken', '');
        }
      });
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }
}
