import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UploadImageService } from '../../services/upload-image.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedFile: File | null = null;
  imageUrl: string = '';
  isLoading: boolean = false;
  uploadSuccess: boolean = false;
  errorMessage: string = '';

  constructor(private uploadService: UploadImageService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    this.isLoading = true;
    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.imageUrl = response.fileUrl;
        this.uploadSuccess = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to upload image. Please try again.';
        this.isLoading = false;
        console.error('Upload error:', err);
      }
    });
  }

  copyImageUrl(): void {
    navigator.clipboard.writeText(this.imageUrl).then(() => {
      // You can add a toast notification here if you have one
      console.log('Image URL copied to clipboard');
    });
  }

  resetUploadState(): void {
    this.selectedFile = null;
    this.imageUrl = '';
    this.isLoading = false;
    this.uploadSuccess = false;
    this.errorMessage = '';
  }
}
