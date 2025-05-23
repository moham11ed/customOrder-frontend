import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `/api/Subscriptions`;

  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<void> {
    return this.http.post<void>(
      this.apiUrl, 
      `"${email}"`, 
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text' as 'json' // Special handling for string response
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => new Error('F.subscribe_exists'));
        }
        return throwError(() => new Error('F.subscribe_error'));
      })
    );
  }
}