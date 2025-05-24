// shape-with-design.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmDesignService, ShapeWithDesign } from '../../services/confirmdesign.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shape-with-design',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shape-with-design.component.html',
  styles: [
    `
      .img-thumbnail {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 0.25rem;
}

.table-responsive {
  margin-top: 20px;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
    `
  ]
})
export class ShapeWithDesignComponent implements OnInit {
  combinations: ShapeWithDesign[] = [];
  newCombination: Omit<ShapeWithDesign, 'id'> = {
    shapeId: 0,
    designId: 0,
    imageUrl: '',
    bottleDesign: { id: 0, imageUrl: '' },
    logoDesign: { id: 0, imageUrl: '' }
  };

  constructor(private designService: ConfirmDesignService) {}

  ngOnInit(): void {
    this.loadCombinations();
  }

  loadCombinations(): void {
    this.designService.getAll().subscribe({
      next: (data) => this.combinations = data,
      error: (err) => console.error('Error loading combinations:', err)
    });
  }

  addCombination(): void {
    this.designService.create(this.newCombination).subscribe({
      next: (newItem) => {
        this.combinations.push(newItem);
        this.resetForm();
      },
      error: (err) => console.error('Error adding combination:', err)
    });
  }

  deleteCombination(id: number): void {
    if (confirm('Are you sure you want to delete this combination?')) {
      this.designService.delete(id).subscribe({
        next: () => {
          this.combinations = this.combinations.filter(c => c.id !== id);
        },
        error: (err) => console.error('Error deleting combination:', err)
      });
    }
  }

  private resetForm(): void {
    this.newCombination = {
      shapeId: 0,
      designId: 0,
      imageUrl: '',
      bottleDesign: { id: 0, imageUrl: '' },
      logoDesign: { id: 0, imageUrl: '' }
    };
  }
}