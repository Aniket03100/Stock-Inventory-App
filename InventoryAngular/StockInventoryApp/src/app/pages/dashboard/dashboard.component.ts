import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalStock = 0;
  lowStockCount = 0;
  totalSales = 0;
  totalPurchases = 0;
  recentActivities: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Fetch Total Products
    this.http.get<any>('https://localhost:7176/api/StockInventory/GetAllProducts')
      .subscribe((response) => {
        this.totalProducts = response.data.length;
      });

    // Fetch Stock Data
    this.http.get<any>('https://localhost:7176/api/StockInventory/GetAllStock')
      .subscribe((response) => {
        const stocks = response.data || [];
        this.totalStock = stocks.reduce((total: number, stock: any) => total + stock.quantity, 0);
        this.lowStockCount = stocks.filter((stock: any) => stock.quantity === 0).length;
      });

    // Fetch Sales Data
    this.http.get<any>('https://localhost:7176/api/StockInventory/GetAllSale')
      .subscribe((response) => {
        const sales = response.data || [];
        this.totalSales = sales.length;

        const recentSales = sales.map((sale: any) => ({
          date: sale.saleDate,
          type: 'Sale',
          productName: sale.productName,
          quantity: sale.quantity,
        }));

        // Fetch Purchases Data
        this.http.get<any>('https://localhost:7176/api/StockInventory/GetAllPurchase')
          .subscribe((purchaseResponse) => {
            const purchases = purchaseResponse.data || [];
            this.totalPurchases = purchases.length;

            const recentPurchases = purchases.map((purchase: any) => ({
              date: purchase.purchaseDate,
              type: 'Purchase',
              productName: purchase.productName,
              quantity: purchase.quantity,
            }));

            // Combine and sort by date
            this.recentActivities = [...recentSales, ...recentPurchases]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10); // Limit to 10 entries
          });
      });
  }
}
