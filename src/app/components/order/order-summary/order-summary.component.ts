import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  orderData: any;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.orderData = this.orderService.getCurrentOrder();
  }

  submitOrder(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.orderService.submitOrder().subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.orderService.updateOrderData({ id: response.orderId });
          // You might want to navigate to a confirmation page here
          this.router.navigate(['/invoice'], { 
            queryParams: { orderId: response.orderId } 
          });
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

  goBack(): void {
    this.router.navigate(['/client-info']);
  }

  printOrder(): void {
    window.print();
  }
}