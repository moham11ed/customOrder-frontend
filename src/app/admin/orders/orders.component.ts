import { Component, OnInit } from '@angular/core';
import { OrdersService, OrderData } from '../../services/orders.service';
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
  orders: OrderData[] = [];
  filteredOrders: OrderData[] = [];
  selectedOrder: any;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchEmail = '';
  statusFilter = '';
  showModal = false;

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
        console.log(this.orders);
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
        this.showModal = true; // Show the modal
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
  
  if (confirm(`Are you sure you want to update the status to ${newStatus}?`)) {
    this.isLoading = true;
    this.orderService.updateOrderStatus(id, newStatus).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Order status updated successfully';
        this.loadOrders();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Failed to update order status';
        this.isLoading = false;
      }
    });
  }
}

 closeDetails(): void {
    this.showModal = false; // Hide the modal
    this.selectedOrder = null;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}