import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductName {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductNameService {
  private apiUrl = '/api/ProductName';

  constructor(private http: HttpClient) {}

  // Get all product names
  getAll(): Observable<ProductName[]> {
    return this.http.get<ProductName[]>(this.apiUrl);
  }

  // Get product name by ID
  getById(id: number): Observable<ProductName> {
    return this.http.get<ProductName>(`${this.apiUrl}/${id}`);
  }

  // Create new product name
  create(productName: ProductName): Observable<ProductName> {
    return this.http.post<ProductName>(this.apiUrl, productName);
  }

  // Update product name
  update(id: number, productName: ProductName): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productName);
  }

  // Delete product name
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}