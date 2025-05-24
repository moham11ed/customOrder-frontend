import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductTypeService, ProductType } from '../../services/product-type.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: []
})
export class CategoriesComponent implements OnInit {
  productTypes: ProductType[] = [];
  newProductType: ProductType = { id: 0, type: '' };
  editingProductType: ProductType | null = null;
  isEditing: boolean = false;

  constructor(private productTypeService: ProductTypeService) {}

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.productTypeService.getProductTypes().subscribe({
      next: (data) => {
        this.productTypes = data;
      },
      error: (error) => {
        console.error('Error loading product types:', error);
      }
    });
  }

  createProductType(): void {
    this.productTypeService.createProductType(this.newProductType).subscribe({
      next: (data) => {
        this.productTypes.push(data);
        this.newProductType = { id: 0, type: '' };
      },
      error: (error) => {
        console.error('Error creating product type:', error);
      }
    });
  }

  editProductType(productType: ProductType): void {
    this.editingProductType = { ...productType };
    this.isEditing = true;
  }

  updateProductType(): void {
    if (!this.editingProductType) return;

    const editingId = this.editingProductType.id;
    const updatedProductType = { ...this.editingProductType };

    this.productTypeService.updateProductType(editingId, updatedProductType).subscribe({
      next: () => {
        const index = this.productTypes.findIndex(pt => pt.id === editingId);
        if (index !== -1) {
          this.productTypes[index] = updatedProductType;
        }
        this.cancelEdit();
        this.loadProductTypes(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating product type:', error);
      }
    });
  }

  deleteProductType(id: number): void {
    if (confirm('Are you sure you want to delete this product type?')) {
      this.productTypeService.deleteProductType(id).subscribe({
        next: () => {
          this.productTypes = this.productTypes.filter(pt => pt.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product type:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingProductType = null;
  }
}