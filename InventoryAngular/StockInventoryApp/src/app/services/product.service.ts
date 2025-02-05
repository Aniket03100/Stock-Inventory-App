import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7176/api/StockInventory';



  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any>{
    return this.http.get(`${this.apiUrl}/GetAllProducts`);
  }

  createNewProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateNewProduct`, productData);
  }
}
