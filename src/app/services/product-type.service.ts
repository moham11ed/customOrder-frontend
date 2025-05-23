import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductType {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private apiUrl = 'api/ProductType'; 

  constructor(private http: HttpClient) {}

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }
}