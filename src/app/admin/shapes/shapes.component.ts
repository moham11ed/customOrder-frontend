import { Component, OnInit } from '@angular/core';
import { Shape, ShapeService } from '../../services/shape.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shapes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shapes.component.html',
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
    .shape-image {
      max-width: 100px;
      max-height: 100px;
    }
  `]
})
export class ShapesComponent implements OnInit {
  shapes: Shape[] = [];
  newShape: Shape = {
    id: 0,
    imageUrl: ''
  };
  editShape: Shape | null = null;

  constructor(private shapeService: ShapeService) {}

  ngOnInit(): void {
    this.loadShapes();
  }

  loadShapes(): void {
    this.shapeService.getShapes().subscribe({
      next: (shapes) => this.shapes = shapes,
      error: (err) => console.error('Error loading shapes:', err)
    });
  }

  startEdit(shape: Shape): void {
    this.editShape = { ...shape };
  }

  cancelEdit(): void {
    this.editShape = null;
  }

  createShape(): void {
    this.shapeService.createShape(this.newShape).subscribe({
      next: (shape) => {
        this.shapes.push(shape);
        this.newShape = { id: 0, imageUrl: '' };
      },
      error: (err) => console.error('Error creating shape:', err)
    });
  }

  updateShape(): void {
    if (!this.editShape) return;
    
    this.shapeService.updateShape(this.editShape.id, this.editShape).subscribe({
      next: () => {
        const index = this.shapes.findIndex(s => s.id === this.editShape?.id);
        if (index !== -1) {
          this.shapes[index] = { ...this.editShape! };
        }
        this.editShape = null;
      },
      error: (err) => console.error('Error updating shape:', err)
    });
  }

  deleteShape(id: number): void {
    if (confirm('Are you sure you want to delete this shape?')) {
      this.shapeService.deleteShape(id).subscribe({
        next: () => {
          this.shapes = this.shapes.filter(s => s.id !== id);
        },
        error: (err) => console.error('Error deleting shape:', err)
      });
    }
  }
}