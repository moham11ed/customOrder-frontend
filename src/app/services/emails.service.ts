import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

// Request Interfaces
interface OrderConfirmationRequest {
  toEmail: string;
  orderId: number;
}

interface OrderStatusUpdateRequest {
  toEmail: string;
  orderId: number;
  newStatus: string;
}

interface BulkEmailRequest {
  toEmails: string[];
  subject: string;
  body: string;
}

// Response Interface
interface ApiResponse {
  message: string;
  success: boolean;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly apiUrl = environment.apiURL + '/api/Email'; 

  constructor(private http: HttpClient) { }

 
  sendOrderConfirmation(toEmail: string, orderId: number): Observable<ApiResponse> {
    const request: OrderConfirmationRequest = { toEmail, orderId };
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/SendOrderConfirmation`, 
      request
    );
  }

  
  sendOrderStatusUpdate(toEmail: string, orderId: number, newStatus: string): Observable<ApiResponse> {
    const request: OrderStatusUpdateRequest = { toEmail, orderId, newStatus };
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/SendOrderStatusUpdate`, 
      request
    );
  }

  

  sendBulkEmail(toEmails: string[], subject: string, body: string): Observable<ApiResponse> {
    const request: BulkEmailRequest = { toEmails: toEmails, subject, body };
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/SendBulkEmail`, 
      request
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('EmailService error:', error);
    throw new Error('Email service error occurred. See console for details.');
  }
}

