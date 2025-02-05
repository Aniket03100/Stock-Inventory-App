import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.css'],
})
export class NewPurchaseComponent implements OnInit {
  products: any[] = []; // For dropdown options
  purchaseDate: string = '';
  productId: number = 0;
  quantity: number = 0;
  supplierName: string = '';
  invoiceAmount: number = 0;
  invoiceNo: string = '';

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  // Fetch all products for dropdown
  fetchAllProducts() {
    this.purchaseService.getAllProducts().subscribe({
      next: (response: any) => {
        if (response.result) {
          this.products = response.data;
        } else {
          console.error('Error fetching products:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  // Save new purchase
  savePurchase() {
    const purchaseData = {
      purchaseId: 0,
      purchaseDate: this.purchaseDate,
      productId: this.productId,
      quantity: this.quantity,
      supplierName: this.supplierName,
      invoiceAmount: this.invoiceAmount,
      invoiceNo: this.invoiceNo,
    };

    this.purchaseService.createNewPurchase(purchaseData).subscribe({
      next: (response: any) => {
        if (response.result) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                    showConfirmButton: true,
                  }).then(() => {
                    this.resetForm();
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error: ${response.message}`,
                    showConfirmButton: true,
                  });
                }
      },
      error: (error) => {
              console.error('Error saving purchase: ', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while saving the purchase.',
                showConfirmButton: true,
              });
             },
    });
  }

  resetForm() {
    this.purchaseDate = '';
    this.productId = 0;
    this.quantity = 0;
    this.supplierName = '';
    this.invoiceAmount = 0;
    this.invoiceNo = '';
  }
}
