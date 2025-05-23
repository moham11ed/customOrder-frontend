import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-product-amount',
  imports: [
    TranslateModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './product-amount.component.html',
  styleUrl: './product-amount.component.css'
})
export class ProductAmountComponent {
  constructor(
    private router: Router,
    private orderService: OrderService
  
  ) {}

  quantity: number = 0;

  ensurePositiveNumber(): void {
    if (this.quantity < 0) {
      this.quantity = 0;
    }
  }
  goToNextStep() {
 
    this.orderService.updateOrderData({ quantity: this.quantity });
    this.router.navigate(['/client-info']);
  }
  goToPreviousStep() {
 
    this.router.navigate(['/product-name']);
  }
}
