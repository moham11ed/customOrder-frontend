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
    .upload-area {
      border: 2px dashed #ccc;
      padding: 20px;
      text-align: center;
      margin-bottom: 15px;
      cursor: pointer;
    }
    .upload-area:hover {
      border-color: #aaa;
    }
  `]
})
export class DesignsComponent implements OnInit {
  designs: Design[] = [];
  newDesign: Design = {
    id: 0,
    imageUrl: '',
    customImage: null
  };
  editDesign: Design | null = null;
  selectedFile: File | null = null;

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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editDesign) {
          this.editDesign.imageUrl = e.target.result;
        } else {
          this.newDesign.imageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  startEdit(design: Design): void {
    this.editDesign = { ...design, customImage: null };
    this.selectedFile = null;
  }

  cancelEdit(): void {
    this.editDesign = null;
    this.selectedFile = null;
  }

  createDesign(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.designService.createDesign(formData).subscribe({
      next: (design) => {
        this.designs.push(design);
        this.resetForm();
      },
      error: (err) => console.error('Error creating design:', err)
    });
  }

  updateDesign(): void {
    if (!this.editDesign || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.designService.updateDesign(this.editDesign.id, formData).subscribe({
      next: () => {
        const index = this.designs.findIndex(d => d.id === this.editDesign?.id);
        if (index !== -1) {
          this.designs[index] = { ...this.editDesign! };
        }
        this.cancelEdit();
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

  private resetForm(): void {
    this.newDesign = {
      id: 0,
      imageUrl: '',
      customImage: null
    };
    this.selectedFile = null;
  }
}