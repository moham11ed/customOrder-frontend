import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { CategoriesComponent } from './categories/categories.component';
import { OilsComponent } from './oils/oils.component';
import { ShapesComponent } from './shapes/shapes.component';
import { DesignsComponent } from './designs/designs.component';
import { ShapeWithDesignComponent } from './shape-with-design/shape-with-design.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductNamesComponent } from './product-names/product-names.component';
import { SubscripersComponent } from './subscripers/subscripers.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    OrdersComponent,
    CategoriesComponent,
    OilsComponent,
    ShapesComponent,
    DesignsComponent,
    ShapeWithDesignComponent,
    DashboardComponent,
    ProductNamesComponent,
    SubscripersComponent
    
  ]
})
export class AdminModule { }
