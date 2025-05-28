import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OilService } from '../../../services/oil.service'; 
import { Oil } from '../../../services/oil.service'; 
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-oils',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './oils.component.html',
  styleUrl: './oils.component.css'
})
export class OilsComponent implements OnInit {
  allOils: Oil[] = [];
  filteredOils: Oil[] = [];
  selectedOils: Oil[] = [];
  isLoading = true;
  error: string | null = null;
  selectionComplete = false;
  productTypeId: number | undefined;
  minSelection = 1; // Minimum number of oils required
  maxSelection = 3; // Maximum number of oils allowed

  constructor(
    private router: Router,
    private oilService: OilService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getProductTypeAndFetchOils();
  }

  getProductTypeAndFetchOils(): void {
    this.isLoading = true;
    const orderData = this.orderService.getCurrentOrder();
    this.productTypeId = orderData.productTypeId;
    
    if (!this.productTypeId) {
      console.warn('Product type ID is not available');
      this.error = 'Product type not selected. Please select a product type.';
      this.isLoading = false;
      this.router.navigate(['/']);
      return;
    }
    
    this.fetchOils();
  }

  fetchOils(): void {
    this.isLoading = true;
    this.error = null;
    
    this.oilService.getOils().subscribe({
      next: (data) => {
        this.allOils = data;
        this.filterOilsByProductType();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load oils. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching oils:', err);
      }
    });
  }

  filterOilsByProductType(): void {
    console.log('Selected productTypeId:', this.productTypeId);
    this.filteredOils = this.allOils.filter(oil => oil.type === this.productTypeId);
  }

  toggleOilSelection(oil: Oil): void {
    const index = this.selectedOils.findIndex(o => o.id === oil.id);
    
    if (index > -1) {
      this.selectedOils.splice(index, 1);
    } else {
      if (this.selectedOils.length < this.maxSelection) {
        this.selectedOils.push(oil);
      }
    }

    // Update completion status based on min selection
    this.selectionComplete = this.selectedOils.length >= this.minSelection;
  }

  isSelected(oil: Oil): boolean {
    return this.selectedOils.some(o => o.id === oil.id);
  }

  goToNextStep() {
    if (this.selectedOils.length >= this.minSelection) {
      this.orderService.updateOrderData({ selectedOils: this.selectedOils });
      this.router.navigate(['/shape']);
    } else {
      // Show error or alert that at least 1 oil must be selected
      this.error = `Please select at least ${this.minSelection} oil(s).`;
    }
  }

  goToPreviousStep() {
    this.router.navigate(['/category']);
  }
}