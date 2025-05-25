import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Shape {
  id: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private apiUrl = environment.apiURL +'/api/BottleDesigns'; 

  constructor(private http: HttpClient) {}

  // Get all shapes
  getShapes(): Observable<Shape[]> {
    return this.http.get<Shape[]>(this.apiUrl);
  }

  // Get shape by ID
  getShapeById(id: number): Observable<Shape> {
    return this.http.get<Shape>(`${this.apiUrl}/${id}`);
  }

  // Create new shape
  createShape(shape: Shape): Observable<Shape> {
    return this.http.post<Shape>(this.apiUrl, shape);
  }

  // Update shape
  updateShape(id: number, shape: Shape): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, shape);
  }

  // Delete shape
  deleteShape(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}