import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }


  getAllProducts(): void{
    this.productService.getAllProducts().subscribe(
      (response: any) =>{
        if(response.result){
          this.products = response.data;
        }
        else{
          alert('Error fetching products: ' + response.message);
        }
      },
      (error) => {
        console.error('Error fetching productd: ', error);
      }
    );
  }




}
