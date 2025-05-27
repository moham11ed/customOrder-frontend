import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  private apiUrl = environment.apiURL+'/api/Images'; 

  constructor(private http: HttpClient) { }

 
  uploadImage(file: File): Observable<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ fileUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

 
  getImageUrl(fileName: string): string {
    return `${this.apiUrl}/${fileName}`;
  }
}