import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule, 
    CommonModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  subscriptionForm: FormGroup;
  message: string = '';
  messageType: 'success'|'error'|null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private translate: TranslateService
  ) {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 onSubmit() {
  if (this.subscriptionForm.invalid || this.isLoading) return;

  this.isLoading = true;
  const email = this.subscriptionForm.value.email;

  this.subscriptionService.subscribe(email).subscribe({
    next: () => {
      this.showMessage(this.translate.instant('F.subscribe_success'), 'success');
      this.subscriptionForm.reset();
      this.isLoading = false;
    },
    error: (err: Error) => {
      this.showMessage(
        this.translate.instant(err.message), 
        'error'
      );
      this.isLoading = false;
    }
  });
}

  private handleSuccess(): void {
    this.showMessage('F.subscribe_success', 'success');
    this.subscriptionForm.reset();
    this.isLoading = false;
  }

  private handleError(error: HttpErrorResponse): void {
    let translationKey = 'F.subscribe_error';
    
    if (error.status === 400) {
      translationKey = 'F.invalid_email';
    } else if (error.status === 409) {
      translationKey = 'F.subscribe_exists';
    } else if (error.status === 0) {
      translationKey = 'F.network_error';
    }

    this.showMessage(translationKey, 'error');
    this.isLoading = false;
  }

  private showMessage(translationKey: string, type: 'success'|'error'): void {
    this.message = this.translate.instant(translationKey);
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage(): void {
    this.message = '';
    this.messageType = null;
  }
}