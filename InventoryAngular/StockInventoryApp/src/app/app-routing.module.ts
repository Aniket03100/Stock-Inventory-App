import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPurchaseComponent } from './pages/new-purchase/new-purchase.component';
import { NewSaleComponent } from './pages/new-sale/new-sale.component';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';
import { SaleListComponent } from './pages/sale-list/sale-list.component';
import { StockComponent } from './pages/stock/stock.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

const routes: Routes = [
  {
    path:'new-purchase',
    component:NewPurchaseComponent
},
{
    path:'new-sale',
    component:NewSaleComponent
},
{
    path:'purchase-list',
    component:PurchaseListComponent
},
{
    path:'sale-list',
    component:SaleListComponent
},
{
    path:'stock',
    component:StockComponent
},
{
    path:'dashboard',
    component:DashboardComponent
},

{
    path:'product-list',
    component:ProductListComponent
},
{
    path:'new-product',
    component:NewProductComponent
},
{ 
    path: 'login', 
    component: LoginComponent 
},

{ 
    path: '', redirectTo: '/login', pathMatch: 'full' 
},
{
    path: '**', redirectTo: '/login' 
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
