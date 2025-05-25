// confirm-design.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ShapeWithDesign {
  id: number;
  shapeId: number;
  designId: number;
  imageUrl: string;
  bottleDesign: {
    id: number;
    imageUrl: string;
  };
  logoDesign: {
    id: number;
    imageUrl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDesignService {
  private apiUrl = environment.apiURL+'/api/ShapeWithDesigns';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ShapeWithDesign[]> {
    return this.http.get<ShapeWithDesign[]>(this.apiUrl);
  }

  create(shapeWithDesign: Omit<ShapeWithDesign, 'id'>): Observable<ShapeWithDesign> {
    return this.http.post<ShapeWithDesign>(this.apiUrl, shapeWithDesign);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}