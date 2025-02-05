import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
})
export class PurchaseListComponent implements OnInit {
  purchases: any[] = [];
  errorMessage: string = '';

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.getPurchases();
  }

  getPurchases(): void {
    this.purchaseService.getAllPurchases().subscribe(
      (response) => {
        console.log('Fetched Purchases:', response);
        if (response.result) {
          this.purchases = response.data;
        } else {
          this.errorMessage = 'Failed to fetch purchases.';
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching purchases.';
        console.error('Error fetching purchases:',error);
      }
    );
  }
}
