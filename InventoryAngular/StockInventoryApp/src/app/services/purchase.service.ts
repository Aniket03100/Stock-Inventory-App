import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'https://localhost:7176/api/StockInventory'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAllPurchases(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllPurchase`).pipe(
      tap((response) => console.log('API Response:', response))
    );
  }

   // Fetch all products
   getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllProducts`);
  }

  // Save new purchase
  createNewPurchase(purchaseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateNewPurchase`, purchaseData);
  }


 
}
