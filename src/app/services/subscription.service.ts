import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from 'process';
import { environment } from '../../environments/environment.development';

export interface Subscription {
  id: number;
  email: string;
  subscriptionDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = environment.apiURL + '/api/Subscriptions';

  constructor(private http: HttpClient) { }

  // Subscribe with email
  subscribe(email: string): Observable<string> {
    return this.http.post(
      this.apiUrl, 
      `"${email}"`, 
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'  // Proper plain text handling
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get all subscriptions
  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Unsubscribe - fixed implementation
  unsubscribe(email: string): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${encodeURIComponent(email)}`,
      {
        responseType: 'text'  // Crucial for plain text responses
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => 'This email is already subscribed');
    } else if (error.status === 404) {
      return throwError(() => 'Email not found');
    } else if (error.status === 400) {
      return throwError(() => 'Invalid email format');
    }
    return throwError(() => error.error || 'An unexpected error occurred');
  }
}