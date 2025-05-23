import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductName, ProductNameService } from '../../../services/product-name.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-product-name',
  imports: [
    CommonModule, FormsModule,TranslateModule
  ],
  templateUrl: './product-name.component.html',
  styleUrl: './product-name.component.css'
})
export class ProductNameComponent {

    productNames: ProductName[] = [];
    selectedName: string | null = null;
  
    
  constructor( 
    private productNameService: ProductNameService,
    private router: Router,
    private orderService: OrderService
  ) {}

   ngOnInit(): void {
    this.productNameService.getProductTypes().subscribe({
      next: (data) => {
        this.productNames = data;
        
      },
      error: (err) => {
        console.error('Error fetching product Names:', err);
      }
    });
  }

 
  goToNextStep() {

    this.orderService.updateOrderData({ productName: this.selectedName });
    this.router.navigate(['/product-amount']);
  }
  goToPreviousStep() {
 
    this.router.navigate(['/confirm-design']);
  }

}
