import { Component, OnInit } from '@angular/core';
import { OrdersService, OrderData } from '../../services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../services/emails.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {
  orders: OrderData[] = [];
  filteredOrders: OrderData[] = [];
  selectedOrder: any;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchEmail = '';
  searchOrderId: number | null = null;
  statusFilter = '';
  showModal = false;
  isSendingEmail = false;
  statusCounts: { [key: string]: number } = {};

  constructor(
    private orderService: OrdersService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.calculateStatusCounts();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  calculateStatusCounts(): void {
    this.statusCounts = {};
    this.orders.forEach(order => {
      const status = order.status?.toLowerCase() || 'unknown';
      this.statusCounts[status] = (this.statusCounts[status] || 0) + 1;
    });
  }

  searchOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.searchOrderId) {
      this.orderService.getOrderById(this.searchOrderId).subscribe({
        next: (order) => {
          this.filteredOrders = order ? [order] : [];
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.filteredOrders = [];
          this.isLoading = false;
        }
      });
    } 
    else if (this.searchEmail) {
      this.orderService.getOrdersByEmail(this.searchEmail).subscribe({
        next: (orders) => {
          this.filteredOrders = orders;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = false;
        }
      });
    } 
    else {
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    }
  }

  filterByStatus(): void {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(order => 
        order.status?.toLowerCase() === this.statusFilter.toLowerCase()
      );
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  resetSearch(): void {
    this.searchEmail = '';
    this.searchOrderId = null;
    this.statusFilter = '';
    this.searchOrders();
  }

  viewOrderDetails(id: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.selectedOrder = {
          ...order,
          selectedOils: JSON.parse(order.selectedOilsJson)
        };
        this.showModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  updateOrderStatus(id: number, newStatus: string, email: string): void {
    if (!newStatus) return;
    
    if (confirm(`Are you sure you want to update the status to ${newStatus}?`)) {
      this.isLoading = true;
      this.orderService.updateOrderStatus(id, newStatus).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Order status updated successfully';
          this.loadOrders();
          this.sendStatusUpdateEmail(email, id, newStatus);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message || 'Failed to update order status';
          this.isLoading = false;
        }
      });
    }
  }

  private sendStatusUpdateEmail(toEmail: string, orderId: number, newStatus: string): void {
    this.isSendingEmail = true;
    this.emailService.sendOrderStatusUpdate(toEmail, orderId, newStatus)
      .subscribe({
        next: () => {
          this.successMessage += ' Status update email sent successfully.';
          this.isSendingEmail = false;
        },
        error: (err) => {
          console.error('Failed to send status email:', err);
          this.errorMessage = 'Status updated but failed to send email notification.';
          this.isSendingEmail = false;
        }
      });
  }

  closeDetails(): void {
    this.showModal = false;
    this.selectedOrder = null;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
  getStatusKeys(): string[] {
  return Object.keys(this.statusCounts);
}
}