import { Component, OnInit } from '@angular/core';
import { ProductTypeService, ProductType } from '../../../services/product-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  productTypes: ProductType[] = [];
  productTypeId: ProductType[] =[];
  selectedType: string | undefined;
  selectedTypeId: number | undefined;

 
  

  constructor(
    private productTypeService: ProductTypeService,
    private router: Router,
    private orderService: OrderService,
    
  ) {
    
  }

  ngOnInit(): void {
    this.productTypeService.getProductTypes().subscribe({
      next: (data) => {
        this.productTypes = data;
        
 
      },
      error: (err) => {
        console.error('Error fetching product types:', err);
      }

      
    });

  

  }
   selectType(typeName: string, typeId: number): void {
    this.selectedType = typeName;
    this.selectedTypeId = typeId;
  }

 
    
  
  goToNextStep() {
  this.orderService.updateOrderData({ 
    productType: this.selectedType,
    productTypeId: this.selectedTypeId 
  });
  console.log(this.productTypes);
  this.router.navigate(['/oils']);
}
}