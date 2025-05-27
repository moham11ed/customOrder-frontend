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

  saveAndContinue(): void {
    if (!this.isFormValid()) {
      this.errorMessage = this.translate.instant('F.form_invalid');
      return;
    }

    // Update order data with client info
    this.orderService.updateOrderData({ clientInfo: this.user });
    this.router.navigate(['/summary']);
  }

  goToPreviousStep() {
    this.router.navigate(['/product-amount']);
  }
}