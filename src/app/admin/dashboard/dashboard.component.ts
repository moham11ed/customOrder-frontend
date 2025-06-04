import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UploadImageService } from '../../services/upload-image.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

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
  translationKey: string = '';
  arabicValue: string = '';
  englishValue: string = '';
  portugueseValue: string = '';
  isSavingTranslation: boolean = false;
  saveSuccess: boolean = false;

  constructor(
    private uploadService: UploadImageService,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  addTranslation(): void {
    if (!this.validateTranslationForm()) {
      return;
    }

    this.isSavingTranslation = true;
    this.errorMessage = '';
    this.saveSuccess = false;

    const translationData = {
      key: this.translationKey,
      values: {
        ar: this.arabicValue,
        en: this.englishValue,
        pt: this.portugueseValue
      }
    };

    this.translationService.addOrUpdateTranslation(translationData).subscribe({
      next: () => {
        this.handleTranslationSuccess();
      },
      error: (error) => {
        this.handleTranslationError(error);
      }
    });
  }

  private validateTranslationForm(): boolean {
    if (!this.translationKey || !this.arabicValue || !this.englishValue || !this.portugueseValue) {
      this.errorMessage = 'Please fill all translation fields';
      return false;
    }
    return true;
  }

  private handleTranslationSuccess(): void {
    this.isSavingTranslation = false;
    this.saveSuccess = true;
    this.resetTranslationForm();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }

  private handleTranslationError(error: any): void {
    this.isSavingTranslation = false;
    this.errorMessage = error.error?.message || 'Failed to save translation. Please try again.';
    console.error('Translation save error:', error);
  }

  private resetTranslationForm(): void {
    this.translationKey = '';
    this.arabicValue = '';
    this.englishValue = '';
    this.portugueseValue = '';
  }

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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}