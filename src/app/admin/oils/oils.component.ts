import { Component, OnInit } from '@angular/core';
import { Oil, OilService, OilType } from '../../services/oil.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-oils',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oils.component.html',
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
export class OilsComponent implements OnInit {
  oils: Oil[] = [];
  filteredOils: Oil[] = [];
  searchTerm: string = '';
  newOil: Oil = {
    id: 0,
    name: '',
    imageUrl: '',
    type: OilType.Shampoo
  };
  editOil: Oil | null = null;
  oilTypes = Object.values(OilType).filter(value => typeof value === 'number');

  constructor(private oilService: OilService) {}

  ngOnInit(): void {
    this.loadOils();
  }

  loadOils(): void {
    this.oilService.getOils().subscribe({
      next: (oils) => {
        this.oils = oils;
        this.filteredOils = [...this.oils];
      },
      error: (err) => console.error('Error loading oils:', err)
    });
  }

  searchOils(): void {
    if (this.searchTerm.trim()) {
      this.oilService.searchOils(this.searchTerm).subscribe({
        next: (oils) => this.filteredOils = oils,
        error: (err) => console.error('Error searching oils:', err)
      });
    } else {
      this.filteredOils = [...this.oils];
    }
  }

  startEdit(oil: Oil): void {
    this.editOil = { ...oil };
  }

  cancelEdit(): void {
    this.editOil = null;
  }

  createOil(): void {
    this.oilService.createOil(this.newOil).subscribe({
      next: (oil) => {
        this.oils.push(oil);
        this.filteredOils = [...this.oils];
        this.newOil = { id: 0, name: '', imageUrl: '', type: OilType.Shampoo };
      },
      error: (err) => console.error('Error creating oil:', err)
    });
  }

  updateOil(): void {
    if (!this.editOil) return;
    
    this.oilService.updateOil(this.editOil.id, this.editOil).subscribe({
      next: () => {
        const index = this.oils.findIndex(o => o.id === this.editOil?.id);
        if (index !== -1) {
          this.oils[index] = { ...this.editOil! };
          this.filteredOils = [...this.oils];
        }
        this.editOil = null;
      },
      error: (err) => console.error('Error updating oil:', err)
    });
  }

  deleteOil(id: number): void {
    if (confirm('Are you sure you want to delete this oil?')) {
      this.oilService.deleteOil(id).subscribe({
        next: () => {
          this.oils = this.oils.filter(o => o.id !== id);
          this.filteredOils = this.filteredOils.filter(o => o.id !== id);
        },
        error: (err) => console.error('Error deleting oil:', err)
      });
    }
  }

  getOilTypeName(type: OilType): string {
    return OilType[type];
  }
}