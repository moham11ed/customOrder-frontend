// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Order {
  id?: number;
  productType: string;
  productTypeId: number;
  selectedOils: any[];
  shapeId?: number | null;
  shapeImageUrl?: string | null;
  designId?: number | null;
  designUrl?: string | null;
  customImage?: any | null;
  productName?: string | null;
  quantity: number;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    street: string;
  };
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/Orders';
  private orderDataSubject = new BehaviorSubject<Partial<Order>>({});
  public orderData$ = this.orderDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateOrderData(update: Partial<Order>): void {
    const currentData = this.orderDataSubject.value;
    this.orderDataSubject.next({ ...currentData, ...update });
  }

  getCurrentOrder(): Partial<Order> {
    return this.orderDataSubject.value;
  }

  submitOrder(): Observable<{ success: boolean; orderId?: number }> {
    const orderData = this.prepareOrderData();
    return this.http.post<{ id: number }>(this.apiUrl, orderData).pipe(
      map(response => ({ success: true, orderId: response.id })),
      catchError(this.handleOrderError)
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleOrderError)
    );
  }

  getOrdersByEmail(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/by-email/${email}`).pipe(
      catchError(this.handleOrderError)
    );
  }

  updateOrderStatus(id: number, status: string): Observable<boolean> {
    return this.http.patch<{ success: boolean }>(
      `${this.apiUrl}/${id}/status`, 
      `"${status}"`,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      map(response => response.success),
      catchError(this.handleOrderError)
    );
  }

  private prepareOrderData(): Order {
    const currentData = this.orderDataSubject.value;
    return {
      productType: currentData.productType || '',
      productTypeId: currentData.productTypeId || 0,
      selectedOils: currentData.selectedOils || [],
      shapeId: currentData.shapeId || null,
      shapeImageUrl: currentData.shapeImageUrl || null,
      designId: currentData.designId || null,
      designUrl: currentData.designUrl || null,
      customImage: currentData.customImage || null,
      productName: currentData.productName || null,
      quantity: currentData.quantity || 1,
      clientInfo: {
        name: currentData.clientInfo?.name || '',
        email: currentData.clientInfo?.email || '',
        phone: currentData.clientInfo?.phone || '',
        country: currentData.clientInfo?.country || '',
        city: currentData.clientInfo?.city || '',
        street: currentData.clientInfo?.street || ''
      }
    };
  }

  private handleOrderError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'F.order_error';
    
    if (error.status === 400) {
      errorMessage = 'F.invalid_order_data';
    } else if (error.status === 404) {
      errorMessage = 'F.order_not_found';
    } else if (error.status === 409) {
      errorMessage = 'F.order_conflict';
    }

    return throwError(() => new Error(errorMessage));
  }

  clearOrder(): void {
    this.orderDataSubject.next({});
  }
}