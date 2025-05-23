import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ShapeService } from '../../../services/shape.service';
import { CommonModule } from '@angular/common';
import { Shape } from '../../../services/shape.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-shape',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './shape.component.html',
  styleUrl: './shape.component.css'
})
export class ShapeComponent implements OnInit {
  shapes: Shape[] = [];
  selectedShapeId: number | null = null;
  selectedShapeImageUrl: string | null = null;

  constructor(
    private router: Router,
    private shapeService: ShapeService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadShapes();
  }

  loadShapes(): void {
    this.shapeService.getOils().subscribe({
      next: (shapes) => {
        this.shapes = shapes;
      },
      error: (err) => {
        console.error('Error loading shapes:', err);
      }
    });
  }

  selectShape(shapeId: number , shapeImageUrl: string): void {
    this.selectedShapeId = shapeId;
    this.selectedShapeImageUrl = shapeImageUrl;
    this.orderService.updateOrderData({ shapeId, shapeImageUrl });
    
  }

  goToNextStep() {
      this.router.navigate(['/design']);
  }

  goToPreviousStep() {
    this.router.navigate(['/oils']);
  }
}