import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from 'process';
import { environment } from '../../environments/environment.development';

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
  private apiUrl = environment.apiURL +'api/Oils'; 

  constructor(private http: HttpClient) {}

  // Get all oils
  getOils(): Observable<Oil[]> {
    return this.http.get<Oil[]>(this.apiUrl);
  }

  // Get oil by ID
  getOilById(id: number): Observable<Oil> {
    return this.http.get<Oil>(`${this.apiUrl}/${id}`);
  }

  // Create new oil
  createOil(oil: Oil): Observable<Oil> {
    return this.http.post<Oil>(this.apiUrl, oil);
  }

  // Update oil
  updateOil(id: number, oil: Oil): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, oil);
  }

  // Delete oil
  deleteOil(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Search oils by name
  searchOils(name: string): Observable<Oil[]> {
    return this.http.get<Oil[]>(`${this.apiUrl}/search?name=${name}`);
  }
}