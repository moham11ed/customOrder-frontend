import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from '../../services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchEmail = '';
  statusFilter = '';

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  searchOrders(): void {
    if (this.searchEmail) {
      this.isLoading = true;
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
    } else {
      this.filteredOrders = [...this.orders];
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

  viewOrderDetails(id: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  updateOrderStatus(id: number, newStatus: string): void {
    if (!newStatus) return;

    this.isLoading = true;
    this.orderService.updateOrderStatus(id, newStatus).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = 'Order status updated successfully';
          this.loadOrders();
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  closeDetails(): void {
    this.selectedOrder = null;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}