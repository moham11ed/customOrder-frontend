import { Component, OnInit } from '@angular/core';
import { ProductName, ProductNameService } from '../../services/product-name.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-names',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-names.component.html',
  styles: [`
    .table-container {
      margin: 20px;
    }
    .action-btn {
      margin: 0 5px;
    }
    .form-group {
      margin-bottom: 15px;
    }
  `]
})
export class ProductNamesComponent implements OnInit {
  productNames: ProductName[] = [];
  newProductName: ProductName = {
    id: 0,
    name: ''
  };
  editProductName: ProductName | null = null;

  constructor(private productNameService: ProductNameService) {}

  ngOnInit(): void {
    this.loadProductNames();
  }

  loadProductNames(): void {
    this.productNameService.getAll().subscribe({
      next: (names) => this.productNames = names,
      error: (err) => console.error('Error loading product names:', err)
    });
  }

  startEdit(productName: ProductName): void {
    this.editProductName = { ...productName };
  }

  cancelEdit(): void {
    this.editProductName = null;
  }

  createProductName(): void {
    this.productNameService.create(this.newProductName).subscribe({
      next: (productName) => {
        this.productNames.push(productName);
        this.newProductName = { id: 0, name: '' };
      },
      error: (err) => console.error('Error creating product name:', err)
    });
  }

  updateProductName(): void {
    if (!this.editProductName) return;
    
    this.productNameService.update(this.editProductName.id, this.editProductName).subscribe({
      next: () => {
        const index = this.productNames.findIndex(p => p.id === this.editProductName?.id);
        if (index !== -1) {
          this.productNames[index] = { ...this.editProductName! };
        }
        this.editProductName = null;
      },
      error: (err) => console.error('Error updating product name:', err)
    });
  }

  deleteProductName(id: number): void {
    if (confirm('Are you sure you want to delete this product name?')) {
      this.productNameService.delete(id).subscribe({
        next: () => {
          this.productNames = this.productNames.filter(p => p.id !== id);
        },
        error: (err) => console.error('Error deleting product name:', err)
      });
    }
  }
}