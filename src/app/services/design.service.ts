import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Design {
  id: number;
  imageUrl: string;
  customImage: any | null;
}

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private apiUrl = '/api/LogoDesigns'; 

  constructor(private http: HttpClient) {}

  getOils(): Observable<Design[]> {
    return this.http.get<Design[]>(this.apiUrl);
  }
}