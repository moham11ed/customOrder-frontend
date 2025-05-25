import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrdersService } from '../../services/orders.service'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-trak-order',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './trak-order.component.html',
  styleUrl: './trak-order.component.css'
})
export class TrakOrderComponent {
  constructor(
    public translate: TranslateService,
    private ordersService: OrdersService
  ) {}

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  isVisible = false;
  userInput = '';
  isLoading = false;
  orderStatus: string | null = null;
  errorMessage: string | null = null;

  showData() {
    // Reset previous state
    this.orderStatus = null;
    this.errorMessage = null;
    this.isLoading = true;

    // Convert input to number (assuming userInput is order ID)
    const orderId = parseInt(this.userInput);

    if (isNaN(orderId)) {
      this.errorMessage = 'Please enter a valid order ID';
      this.isLoading = false;
      return;
    }

    this.ordersService.getOrderStatus(orderId)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.orderStatus = response.status;
          this.isVisible = true;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to get order status';
          this.isVisible = true;
        }
      });
  }
}