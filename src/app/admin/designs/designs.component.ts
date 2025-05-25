import { Component, OnInit } from '@angular/core';
import { Design, DesignService } from '../../services/design.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-designs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designs.component.html',
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
    .design-image {
      max-width: 100px;
      max-height: 100px;
    }
  `]
})
export class DesignsComponent implements OnInit {
  designs: Design[] = [];
  newDesign: Design = {
    id: 0,
    imageUrl: '',
  };
  editDesign: Design | null = null;

  constructor(private designService: DesignService) {}

  ngOnInit(): void {
    this.loadDesigns();
  }

  loadDesigns(): void {
    this.designService.getDesigns().subscribe({
      next: (designs) => this.designs = designs,
      error: (err) => console.error('Error loading designs:', err)
    });
  }

  startEdit(design: Design): void {
    this.editDesign = { ...design };
  }

  cancelEdit(): void {
    this.editDesign = null;
  }

  createDesign(): void {
    const formData = new FormData();
    formData.append('imageUrl', this.newDesign.imageUrl);

    this.designService.createDesign(formData).subscribe({
      next: (design) => {
        this.designs.push(design);
        this.newDesign = { id: 0, imageUrl: '' };
      },
      error: (err) => console.error('Error creating design:', err)
    });
  }

  updateDesign(): void {
    if (!this.editDesign) return;
    
    const formData = new FormData();
    formData.append('imageUrl', this.editDesign.imageUrl);

    this.designService.updateDesign(this.editDesign.id, formData).subscribe({
      next: () => {
        const index = this.designs.findIndex(d => d.id === this.editDesign?.id);
        if (index !== -1) {
          this.designs[index] = { ...this.editDesign! };
        }
        this.editDesign = null;
      },
      error: (err) => console.error('Error updating design:', err)
    });
  }

  deleteDesign(id: number): void {
    if (confirm('Are you sure you want to delete this design?')) {
      this.designService.deleteDesign(id).subscribe({
        next: () => {
          this.designs = this.designs.filter(d => d.id !== id);
        },
        error: (err) => console.error('Error deleting design:', err)
      });
    }
  }
}