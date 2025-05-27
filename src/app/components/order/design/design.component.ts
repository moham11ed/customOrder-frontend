import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DesignService } from '../../../services/design.service';
import { CommonModule } from '@angular/common';
import { Design } from '../../../services/design.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { UploadImageService } from '../../../services/upload-image.service'; // Add this import

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
  uploadedImageUrl: string | null = null;
  designUrl: string | null = null;
  uploadInProgress = false;
  uploadError: string | null = null;

  constructor(
    private router: Router,
    private designService: DesignService,
    private orderService: OrderService,
    private uploadService: UploadImageService 
  ) {}

  ngOnInit(): void {
    this.loadDesigns();
  }

  loadDesigns(): void {
    this.designService.getDesigns().subscribe({
      next: (designs) => {
        this.designs = designs;
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
      this.designUrl = null;
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.uploadError = null; // Reset error when new file selected
      
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
    this.uploadError = null;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select an image first';
      return;
    }

    this.uploadInProgress = true;
    this.uploadError = null;

    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImageUrl = response.fileUrl;
        console.log('Image uploaded successfully:', this.uploadedImageUrl);//for test 
        this.orderService.updateOrderData({ 
          customImage: null,
          designId: null,
          designUrl: this.uploadedImageUrl
        });
        this.selectedDesignId = null;
        this.designUrl = null;
        this.uploadInProgress = false;
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        this.uploadError = 'Failed to upload image. Please try again.';
        if (err.status === 413) {
          this.uploadError = 'File is too large. Please choose a smaller image.';
        } else if (err.status === 415) {
          this.uploadError = 'Unsupported file type. Please use JPEG, PNG, or GIF.';
        }
        this.uploadInProgress = false;
      }
    });
  }

  selectDesign(designId: number, designUrl: string): void {
    this.selectedDesignId = designId;
    this.uploadedImageUrl = null;
    this.designUrl = designUrl;
    this.orderService.updateOrderData({ 
      designId,
      designUrl,
      customImage: null
    });
  }

  goToNextStep() {
    if (this.selectedDesignId || this.uploadedImageUrl) {
      if (this.selectedDesignId) {
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