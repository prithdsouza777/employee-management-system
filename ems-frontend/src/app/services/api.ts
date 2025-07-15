import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}employees/`);
  }

  getEmployeeDetails(employeeUserId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}employees/${employeeUserId}/`);
  }

  createEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}employees/create_full_employee/`, employeeData);
  }

  updateEmployee(employeeUserId: number, employeeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}employees/${employeeUserId}/`, employeeData);
  }

  deleteEmployee(employeeUserId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}users/${employeeUserId}/`);
  }
}