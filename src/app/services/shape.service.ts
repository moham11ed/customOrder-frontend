import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shape {
  id: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private apiUrl = '/api/BottleDesigns'; 
  private apiUrl2 = 'https://localhost:7176/api/BottleDesigns';

  constructor(private http: HttpClient) {}

  // Get all shapes
  getShapes(): Observable<Shape[]> {
    return this.http.get<Shape[]>(this.apiUrl);
  }

  // Get shape by ID
  getShapeById(id: number): Observable<Shape> {
    return this.http.get<Shape>(`${this.apiUrl2}/${id}`);
  }

  // Create new shape
  createShape(shape: Shape): Observable<Shape> {
    return this.http.post<Shape>(this.apiUrl2, shape);
  }

  // Update shape
  updateShape(id: number, shape: Shape): Observable<any> {
    return this.http.put(`${this.apiUrl2}/${id}`, shape);
  }

  // Delete shape
  deleteShape(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/${id}`);
  }
}