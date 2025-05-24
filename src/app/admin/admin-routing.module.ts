import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { OilsComponent } from './oils/oils.component';
import { ShapesComponent } from './shapes/shapes.component';
import { DesignsComponent } from './designs/designs.component';
import { ShapeWithDesignComponent } from './shape-with-design/shape-with-design.component';
import { ProductNamesComponent } from './product-names/product-names.component';
import { SubscripersComponent } from './subscripers/subscripers.component';

const routes: Routes = [
  { path: '', component: DashboardComponent ,
    children: [
      { path: 'orders', component: OrdersComponent},
  { path: 'categories',component: CategoriesComponent },
  { path: 'oils', component : OilsComponent },
  { path: 'shapes', component: ShapesComponent},
  { path: 'designs', component: DesignsComponent},
  { path: 'shape-with-design', component: ShapeWithDesignComponent },
  { path: 'product-names', component: ProductNamesComponent },
  { path: 'subscripers', component: SubscripersComponent },


    ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }