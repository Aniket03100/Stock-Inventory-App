import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

  productId: number = 0;
  productName: string ='';
  categoryName: string ='';
  createdDate: string ='';
  price:number = 0;
  productDetails: string ='';


  constructor(private productService: ProductService, private toastr: ToastrService) {}



  // saveProduct(){
    // const productData = {
    //   productId: 0,
    //   productName: this.productName,
    //   categoryName: this.categoryName,
    //   createdDate: this.createdDate,
    //   price: this.price,
    //   productDetails: this.productDetails,

    // };

  //   this.productService.createNewProduct(productData).subscribe({
  //     next: (response: any) => {
  //       if (response.result){
  //         this.toastr.success(response.message, 'Success');
  //         this.resetForm();
  //       }
  //       else{
  //         this.toastr.error(`Error: ${response.message}`);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error saving product: ', error);
  //       this.toastr.error('An error occurred while saving the product.');
  //     },
  //   })
  // }




  saveProduct() {

    const productData = {
      productId: 0,
      productName: this.productName,
      categoryName: this.categoryName,
      createdDate: this.createdDate,
      price: this.price,
      productDetails: this.productDetails,

    };


    this.productService.createNewProduct(productData).subscribe({
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
        console.error('Error saving product: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the product.',
          showConfirmButton: true,
        });
      },
    });
  }
  




  resetForm() {
    this.productId = 0;
    this.productName = '';
    this.categoryName = '';
    this.createdDate = '';
    this.price = 0;
    this.productDetails = '';
  }



}
