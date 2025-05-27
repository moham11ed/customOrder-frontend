import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  `]
})
export class SubscripersComponent implements OnInit {
  email = '';
  subscribers: any[] = [];
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.loadSubscribers();


  }

  loadSubscribers(): void {
    this.isLoading = true;
    this.subscriptionService.getAll().subscribe({
      next: (subscribers) => {
        this.subscribers = subscribers;
        console.log(this.subscribers);

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
}
