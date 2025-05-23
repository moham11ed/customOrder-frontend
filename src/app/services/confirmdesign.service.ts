import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ConfirmDesignService {
  private apiUrl1 = '/api/ShapeWithDesigns';
  //private apiUrl2 = '/api/ShapeWithDesigns/ByShapeAndDesign'; 

  constructor(private http: HttpClient) {}

  getShapeWithDesign(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl1);
  }

  // getShapeWithDesignById(shapeId: any, designId: any ): Observable<any> {
  //   const url = `${this.apiUrl2}/${shapeId}/${designId}/`;
  //   return this.http.get<any>(url);
  // }
}