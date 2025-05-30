import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmailService } from '../../../services/emails.service';
import { finalize } from 'rxjs/operators';

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
  isSendingEmail = false;
  errorMessage: string | null = null;
  emailSuccess = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private translate: TranslateService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.orderData = this.orderService.getCurrentOrder();
  }

  private sendOrderConfirmationEmail(id: number): void {
    this.isSendingEmail = true;
    this.emailSuccess = false;
    
    this.emailService.sendOrderConfirmation(
      this.orderData.clientInfo.email , 
      id
    )
    .pipe(
      finalize(() => this.isSendingEmail = false)
    )
    .subscribe({
      next: (res) => {
        this.emailSuccess = true;
        console.log('Confirmation email sent successfully:', res);
      },
      error: (err) => {
        console.error('Failed to send confirmation email:', err);
        // Don't show error to user since order was successfully submitted
        // Just log it for debugging
      }
    });
  }

  submitOrder(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;

    this.orderService.submitOrder().subscribe({
      next: (response) => {
        if (response.success) {
          this.orderService.updateOrderData({ id: response.orderId });
          this.sendOrderConfirmationEmail(response.orderId);
          
          this.router.navigate(['/invoice'], { 
            queryParams: { orderId: response.orderId } 
          });
        } else {
          this.handleOrderError('F.order_submission_failed');
        }
      },
      error: (err) => {
        this.handleOrderError(err.message || 'F.order_error');
        console.error('Order submission failed:', err);
      },
    });
  }

  private handleOrderError(messageKey: string): void {
    this.isSubmitting = false;
    this.errorMessage = this.translate.instant(messageKey);
  }

  goBack(): void {
    this.router.navigate(['/client-info']);
  }

  printOrder(): void {
    window.print();
  }
}