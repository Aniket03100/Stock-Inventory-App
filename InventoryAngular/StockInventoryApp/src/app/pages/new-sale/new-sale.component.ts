import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.css'],
})
export class NewSaleComponent implements OnInit {
  products: any[] = [];
  productId: number = 0;
  customerName: string = '';
  saleDate: string = '';
  quantity: number = 0;
  mobileNo: string = '';
  invoiceNo: string = '';
  totalAmount: number = 0;

  stockMessage: string = ''; // To store stock availability message
  isStockAvailable: boolean = true; // To manage stock availability

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.saleService.getAllProducts().subscribe({
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

  checkStock(): void {
    if (this.productId) {
      this.saleService.checkStockByProductId(this.productId).subscribe(
        (response: any) => {
          if (response.result) {
            this.stockMessage = 'Stock Available: ' + response.data.quantity;
            this.isStockAvailable = true;
          } else {
            this.stockMessage = response.message; // "No Stock Available"
            this.isStockAvailable = false;
          }
        },
        (error) => {
          console.error('Error:', error);
          this.stockMessage = 'Error checking stock';
          this.isStockAvailable = false;
        }
      );
    } else {
      this.stockMessage = '';
      this.isStockAvailable = true;
    }
  }

  saveSale(): void {
    const newSale = {
      productId: this.productId,
      customerName:this.customerName,
      saleDate: this.saleDate,
      quantity: this.quantity,
      mobileNo: this.mobileNo,
      invoiceNo: this.invoiceNo,
      totalAmount: this.totalAmount,
    };

    this.saleService.createSale(newSale).subscribe({
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
            console.error('An error occurred while sale the product: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while sale the product.',
              showConfirmButton: true,
            });
          },
        });
  }

  resetForm() {
    this.productId = 0;
    this.customerName = '';
    this.saleDate = '';
    this.quantity = 0;
    this.mobileNo = '';
    this.invoiceNo = '';
    this.totalAmount = 0;
  }





}
