import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from 'process';
import { environment } from '../../environments/environment.development';

export interface OrderData {
  id?: number;
  productType: string;
  productTypeId: number;
  productName: string;
  quantity: number;
  selectedOilsJson: string;
  shapeId?: number;
  shapeImageUrl?: string;
  designId?: number;
  designUrl?: string;
  customImage?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCountry: string;
  clientCity: string;
  clientStreet: string;
  clientZip: string;
  createdAt?: Date;
  status?: string;
}



@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiURL +'/api/Orders';


  constructor(private http: HttpClient) { }

  // Create a new order
  createOrder(orderData: OrderData): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      this.apiUrl,
      orderData
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get order by ID
  getOrderById(id: number): Observable<OrderData> {
    return this.http.get<OrderData>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get orders by email
  getOrdersByEmail(email: string): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(`${this.apiUrl}/by-email/${encodeURIComponent(email)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all orders
  getAllOrders(): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Update order status
 updateOrderStatus(id: number, status: string): Observable<any> {
  const url = `${this.apiUrl}/${id}/status`;
  
  
  return this.http.patch(url, `"${status}"`, { 
    headers: {
      'Content-Type': 'application/json'  
    }
  });
}

// get order status
  getOrderStatus(id: number): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.apiUrl}/${id}/status`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400) {
        errorMessage = error.error || 'Bad request';
      } else if (error.status === 404) {
        errorMessage = error.error || 'Resource not found';
      } else if (error.status === 409) {
        errorMessage = error.error || 'Conflict occurred';
      } else if (error.status === 500) {
        errorMessage = error.error || 'Internal server error';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}