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

  constructor(private http: HttpClient) {}

  getOils(): Observable<Shape[]> {
    return this.http.get<Shape[]>(this.apiUrl);
  }
}