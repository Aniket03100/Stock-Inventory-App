import { Component } from '@angular/core';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  stocks: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getAllStocks();
  }

  getAllStocks(): void {
    this.stockService.getAllStock().subscribe(
      (response: any) => {
        if (response.result) {
          this.stocks = response.data;
        } else {
          alert('Error fetching stocks: ' + response.message);
        }
      },
      (error) => {
        console.error('Error fetching stocks:', error);
      }
    );
  }
}


