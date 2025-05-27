// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from 'process';
import { environment } from '../../environments/environment.development';

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
  private apiUrl = environment.apiURL +'/api/Orders';
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

submitOrder(): Observable<{ success: boolean; orderId: number; message: string }> {
  const orderData = this.prepareOrderData();
  return this.http.post<{ 
    id: number; 
    success: boolean; 
    message: string 
  }>(this.apiUrl, orderData).pipe(
    map(response => ({
      success: response.success,
      orderId: response.id,
      message: response.message
    })),
    catchError((error: HttpErrorResponse) => {
      // Handle different error scenarios with proper typing
      const errorResponse = {
        success: false,
        orderId: 0,
        message: this.handleOrderError(error)
      };
      return throwError(() => errorResponse);
    })
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