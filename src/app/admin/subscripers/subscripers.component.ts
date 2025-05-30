import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/emails.service';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscripers.component.html',
  styles: [`
    .subscription-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
    }
    .error-message {
      color: #dc3545;
      margin-top: 0.5rem;
    }
    .success-message {
      color: #28a745;
      margin-top: 0.5rem;
    }
    .subscribers-list {
      margin-top: 2rem;
    }
    .table-responsive {
      margin-top: 1rem;
    }
    .send-bulk-btn {
      margin-bottom: 1rem;
    }
    /* Styles for the popup */
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .popup-content {
      background: white;
      padding: 20px;
      border-radius: 5px;
      width: 80%;
      max-width: 500px;
    }
  `]
})
export class SubscripersComponent implements OnInit {
  email = '';
  subscribers: any[] = [];
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  
  // Popup properties
  showPopup = false;
  emailSubject = '';
  emailBody = '';

  subscriberCount = 0;

  constructor(
    private subscriptionService: SubscriptionService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.loadSubscribers();
  }

  loadSubscribers(): void {
    this.isLoading = true;
    this.subscriptionService.getAll().subscribe({
      next: (subscribers) => {
        this.subscribers = subscribers;
        this.subscriberCount = subscribers.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.subscriptionService.subscribe(this.email).subscribe({
      next: (message) => {
        this.successMessage = message;
        this.email = '';
        this.loadSubscribers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.isLoading = false;
      }
    });
  }

  onUnsubscribe(email: string): void {
    if (confirm(`Are you sure you want to unsubscribe ${email}?`)) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.subscriptionService.unsubscribe(email).subscribe({
        next: (message) => {
          this.successMessage = message; 
          this.loadSubscribers();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err;
          this.isLoading = false;
        }
      });
    }
  }

  openBulkEmailPopup(): void {
    if (this.subscribers.length === 0) {
      this.errorMessage = 'No subscribers to send email to';
      return;
    }
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.emailSubject = '';
    this.emailBody = '';
  }

  sendBulkEmail(): void {
    if (!this.emailSubject || !this.emailBody) {
      this.errorMessage = 'Please fill both subject and body';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.emailService.sendBulkEmail(this.subscribers, this.emailSubject, this.emailBody).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = `Email sent successfully to ${this.subscribers.length} subscribers`;
          this.closePopup();
        } else {
          this.errorMessage = response.message || 'Failed to send bulk email';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to send bulk email';
      }
    });
  }
}