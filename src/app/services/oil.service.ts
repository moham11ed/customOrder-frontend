import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum OilType {
  Shampoo = 1,
  Conditioner = 2
}

export interface Oil {
  id: number;
  name: string;
  imageUrl: string;
  type: OilType;  
}
@Injectable({
  providedIn: 'root'
})
export class OilService {
  private apiUrl = 'api/Oils'; 

  constructor(private http: HttpClient) {}

  getOils(): Observable<Oil[]> {
    return this.http.get<Oil[]>(this.apiUrl);
  }
}