import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Design {
  id: number;
  imageUrl: string;
  customImage?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private apiUrl = '/api/LogoDesigns'; 

  constructor(private http: HttpClient) {}

  // Get all designs
  getDesigns(): Observable<Design[]> {
    return this.http.get<Design[]>(this.apiUrl);
  }

  // Get design by ID
  getDesignById(id: number): Observable<Design> {
    return this.http.get<Design>(`${this.apiUrl}/${id}`);
  }

  // Create new design
  createDesign(design: FormData): Observable<Design> {
    return this.http.post<Design>(this.apiUrl, design);
  }

  // Update design
  updateDesign(id: number, design: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, design);
  }

  // Delete design
  deleteDesign(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}