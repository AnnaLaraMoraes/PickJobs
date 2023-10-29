import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiKey = 'AIzaSyAAPzQ4x5nbEQOFe1iJ8BI1NZNpDhGXvWw'; // TODO: add em .env
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.checkAuthentication();
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
          localStorage.setItem('userToken', data.idToken);
          this.router.navigate(['/home']);
        } else {
          localStorage.setItem('userToken', '');
        }
      });
  }

  checkAuthentication(): void {
    const userToken = localStorage.getItem('userToken');
    this.isAuthenticatedSubject.next(!!userToken);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
