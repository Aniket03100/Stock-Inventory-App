import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'https://localhost:7176/api/StockInventory'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  getAllStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllStock`);
  }
}
