import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css'],
})
export class SaleListComponent implements OnInit  {
  sales: any[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  

  loadSales(): void {
    this.saleService.getAllSales().subscribe(
      (data: any) => {
        if (data.result) {
          this.sales = data.data;
        } else {
          console.error('Failed to fetch sales data:', data.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  
}
