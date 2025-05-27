import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to admin
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    console.log('Login attempt with:', { username: this.username, password: this.password });

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        if (response && response.message === 'Login successful') {
          this.router.navigate(['/admin']).then(() => {
            console.log('Navigation to admin completed');
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        } else {
          this.error = 'Unexpected response from server';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 0) {
          this.error = 'Cannot connect to the server. Please check if the API is running.';
        } else if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = `Error: ${err.message || 'Unknown error occurred'}`;
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
