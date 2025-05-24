import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Order {
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
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    street: string;
  };
  createdAt?: Date;
  status?: string;
}

export interface OrderData {
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
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    street: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = '/api/Orders';

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
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get orders by email
  getOrdersByEmail(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/by-email/${encodeURIComponent(email)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Update order status
  updateOrderStatus(id: number, status: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}/status`,
      { status }
    ).pipe(
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