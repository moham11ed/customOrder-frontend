import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from 'process';
import { environment } from '../../environments/environment.development';

interface Admin {
  id: number;
  username: string;
}

interface AdminLoginDto {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiURL + '/api/Admin';

  constructor(private http: HttpClient) { }

 

  // Register new admin
  register(registerDto: AdminLoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, registerDto);
  }

  // Get all admins
  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
  }

  // Delete admin
  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}