import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductType {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private apiUrl = `${environment.apiURL}/api/ProductType`;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl); // ✅ دي هتطبع رابط الـ API وقت التشغيل
  }

  // Get all product types
  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  // Get single product type by id
  getProductType(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.apiUrl}/${id}`);
  }

  // Create new product type
  createProductType(productType: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, productType);
  }

  // Update existing product type
  updateProductType(id: number, productType: ProductType): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productType);
  }

  // Delete product type
  deleteProductType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
