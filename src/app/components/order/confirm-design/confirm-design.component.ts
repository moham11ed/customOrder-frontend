import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ConfirmDesignService } from '../../../services/confirmdesign.service';

@Component({
  selector: 'app-confirm-design',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './confirm-design.component.html',
  styleUrl: './confirm-design.component.css'
})
export class ConfirmDesignComponent implements OnInit {
  allImages: any[] = [];
  filteredImage: any; // To store the single matching image
  isLoading = true;
  error: string | null = null;
  selectionComplete = false;
  generatedShape: any;

  constructor(
    private router: Router,
    private confirmDesign: ConfirmDesignService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.fetchShapesWithDesign();
  }

  fetchShapesWithDesign(): void {
    this.isLoading = true;
    this.error = null;
    
    this.confirmDesign.getAll().subscribe({
      next: (data) => {
        this.allImages = data;
        console.log(this.allImages);
        this.filterShapes(); // Call filter after data is loaded
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load designs. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching designs:', err);
      }
    });
  }

  filterShapes(): void {
    if (!this.allImages || this.allImages.length === 0) {
      this.error = 'No designs available';
      return;
    }

    const currentOrder = this.orderService.getCurrentOrder();
    if (!currentOrder?.shapeId || !currentOrder?.designId) {
      this.error = 'Shape or design not selected';
      return;
    }

    const filtered = this.allImages.filter(
      (image: any) => 
        image.shapeId === currentOrder.shapeId && 
        image.designId === currentOrder.designId
    );

    if (filtered.length > 0) {
      this.filteredImage = filtered[0];
      this.generatedShape = this.filteredImage.imageUrl; // Store the URL for later use
      console.log('Found matching design:', this.filteredImage.imageUrl);
    } else {
      this.error = 'No matching design found';
    }
  }

  goToNextStep() {
    if (this.generatedShape) {
      this.orderService.updateOrderData({ customImage: this.generatedShape });
      this.router.navigate(['/product-name']);
      console.log('Proceeding with image:', this.generatedShape);
    } else {
      this.error = 'Please select a valid design before proceeding';
    }
  }

  goToPreviousStep() {
    this.router.navigate(['/design']);
  }
}