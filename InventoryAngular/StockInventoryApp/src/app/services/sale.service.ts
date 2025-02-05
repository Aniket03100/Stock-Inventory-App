import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'https://localhost:7176/api/StockInventory'; // Update base URL if necessary

  constructor(private http: HttpClient) {}

  // Get all sales
  getAllSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllSale`);
  }

  // Fetch all products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllProducts`);
  }

  checkStockByProductId(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkStockByProductId?productId=${productId}`);
  }
  
  // Create a new sale
  createSale(sale: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateNewSale`, sale);
  }
}
