import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiURL+'/api/Admin';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Attempting login with:', { username, password });

    return this.http.post(`${this.baseUrl}/Login`, { username, password }, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);
          // If login is successful, set authentication state
          if (response && response.message === 'Login successful') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => {
          console.error('Login error details:', error);
          throw error;
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/Register`, { username, password }, { headers })
      .pipe(
        tap(response => console.log('Register response:', response)),
        catchError(error => {
          console.error('Register error details:', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
