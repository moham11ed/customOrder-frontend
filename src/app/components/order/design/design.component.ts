import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DesignService } from '../../../services/design.service';
import { CommonModule } from '@angular/common';
import { Design } from '../../../services/design.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-design',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent implements OnInit {
  designs: Design[] = [];
  selectedDesignId: number | null = null;
  showExistingDesigns: boolean = true;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploadedImageUrl: any | null = null;
  designUrl: any | null = null

  constructor(
    private router: Router,
    private designService: DesignService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDesigns();
  }

  loadDesigns(): void {
    this.designService.getDesigns().subscribe({
      next: (designs) => {
        this.designs = designs;``
      },
      error: (err) => {
        console.error('Error loading designs:', err);
      }
    });
  }

  toggleView(showExisting: boolean): void {
    this.showExistingDesigns = showExisting;
    if (!showExisting) {
      this.selectedDesignId = null;
      this.designUrl = null
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;
    
    // In a real app, you would upload to a server here
    // For demo, we'll just use the preview as the "uploaded" image
    this.uploadedImageUrl = this.imagePreview as any;
    this.orderService.updateOrderData({ 
      customImage: this.uploadedImageUrl as any,
      designId: null,
      designUrl: null
    } as any);
    this.selectedDesignId = null;
    this.designUrl = null
  }

  selectDesign(designId: number, designUrl: string): void {
    console.log(designUrl)
    this.selectedDesignId = designId;
    this.uploadedImageUrl = null as any;
    this.designUrl = designUrl
    this.orderService.updateOrderData({ 
      designId,
      designUrl,
      customImage: null as any
    } as any);
  }

  goToNextStep() {
    if (this.selectedDesignId || this.uploadedImageUrl) {
      if(this.selectedDesignId){
        this.router.navigate(['/confirm-design']);
      } else {
        this.router.navigate(['/product-name']);
      }
      
    }
  }

  goToPreviousStep() {
    this.router.navigate(['/shape']);
  }
}