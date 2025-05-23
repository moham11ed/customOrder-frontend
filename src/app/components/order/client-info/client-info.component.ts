import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-client-info',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css'],
})
export class ClientInfoComponent {
  user: Order['clientInfo'] = {
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    street: '',
  };

  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private translate: TranslateService
  ) {
    const currentOrder = this.orderService.getCurrentOrder();
    if (currentOrder.clientInfo) {
      this.user = { ...currentOrder.clientInfo };
    }
  }

  isFormValid(): boolean {
    return !!(
      this.user.name.trim() &&
      this.user.email.trim() &&
      this.user.phone.trim() &&
      this.user.country.trim() &&
      this.user.city.trim() &&
      this.user.street.trim() &&
      this.isValidEmail(this.user.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submitForm(): void {
    if (!this.isFormValid()) {
      this.errorMessage = this.translate.instant('F.form_invalid');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    // Update order data with client info
    this.orderService.updateOrderData({ clientInfo: this.user });

    // Submit the order
    this.orderService.submitOrder().subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.orderService.clearOrder(); // Clear order data after success
          this.router.navigate(['/summary'], { queryParams: { orderId: response.orderId } });
        } else {
          this.errorMessage = this.translate.instant('F.order_submission_failed');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = this.translate.instant(err.message || 'F.order_error');
        console.error('Order submission failed:', err);
      },
    });
  }

  goToPreviousStep() {
    this.router.navigate(['/product-amount']);
  }
}