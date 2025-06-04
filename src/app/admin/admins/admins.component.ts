import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  styles: [

    `
    .container {
  max-width: 800px;
}

.card {
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-header {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.table-responsive {
  overflow-x: auto;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.spinner-border {
  vertical-align: middle;
}`
  ]
})
export class AdminsComponent implements OnInit {
  admins: any[] = [];
  registerForm: FormGroup;
  isLoading = false;
  alertMessage = '';
  alertType = '';

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

 loadAdmins(): void {
  this.isLoading = true;
  this.adminService.getAllAdmins().subscribe(
    (data) => {
      
      this.admins = data.filter(admin => admin.username !== 'MainAdmin');
      this.isLoading = false;
    },
    (error) => {
      this.showError('Failed to load admins');
      this.isLoading = false;
    }
  );
}
  registerAdmin(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const adminData = this.registerForm.value;
    
    this.adminService.register(adminData).subscribe(
      (response) => {
        this.showSuccess('Admin registered successfully');
        this.registerForm.reset();
        this.loadAdmins();
      },
      (error) => {
        this.showError(error.error || 'Registration failed');
        this.isLoading = false;
      }
    );
  }

  deleteAdmin(id: number): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.isLoading = true;
      this.adminService.deleteAdmin(id).subscribe(
        (response) => {
          this.showSuccess('Admin deleted successfully');
          this.loadAdmins();
        },
        (error) => {
          this.showError('Failed to delete admin');
          this.isLoading = false;
        }
      );
    }
  }

  private showSuccess(message: string): void {
    this.alertMessage = message;
    this.alertType = 'success';
    setTimeout(() => this.clearAlert(), 3000);
  }

  private showError(message: string): void {
    this.alertMessage = message;
    this.alertType = 'danger';
    setTimeout(() => this.clearAlert(), 3000);
  }

  public clearAlert(): void {
    this.alertMessage = '';
    this.alertType = '';
  }
}