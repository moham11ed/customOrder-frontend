import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  getProductTypes(): Observable<ProductName[]> {
    return this.http.get<ProductName[]>(this.apiUrl);
  }
}
