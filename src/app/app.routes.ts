import { Routes } from '@angular/router';
import { OrderComponent } from './components/order/order.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { TrakOrderComponent } from './components/trak-order/trak-order.component';
import { CategoryComponent } from './components/order/category/category.component';
import { OilsComponent } from './components/order/oils/oils.component';
import { ShapeComponent } from './components/order/shape/shape.component';
import { DesignComponent } from './components/order/design/design.component';
import { ConfirmDesignComponent } from './components/order/confirm-design/confirm-design.component';
import { ProductNameComponent } from './components/order/product-name/product-name.component';
import { ClientInfoComponent } from './components/order/client-info/client-info.component';
import { ProductAmountComponent } from './components/order/product-amount/product-amount.component';
import { OrderSummaryComponent } from './components/order/order-summary/order-summary.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { InvoiceComponent } from './components/order/invoice/invoice.component';

export const routes: Routes = [
    {
        path: '',
        component: OrderComponent,
        children: [
             ///// rout in order
                        {
                            path: '',
                            component: CategoryComponent,
                        },
                        {
                            path: 'category',
                            component: CategoryComponent,
                        },
                        {
                            path: 'oils',
                            component: OilsComponent,
                        },
                        {
                            path: 'shape',
                            component: ShapeComponent,
                        },
                        {
                            path: 'design',
                            component: DesignComponent,
                        },
                        {
                            path: 'confirm-design',
                            component: ConfirmDesignComponent,
                        },
                        {
                            path: 'product-name',
                            component: ProductNameComponent,
                        },
                        {
                            path: 'product-amount',
                            component: ProductAmountComponent,
                        },
                        {
                            path: 'client-info',
                            component: ClientInfoComponent,
                        },
                        {
                            path: 'summary',
                            component: OrderSummaryComponent,
                        },
                        {
                            path: 'invoice',
                            component: InvoiceComponent,
                        }
            ]
    },
    {
        path: 'how-to-use',
        component: HowToUseComponent,
    },
    {
        path: 'order',
        redirectTo: '',
        pathMatch: 'full'
        
    },
    {
        path: 'trak-order',
        component: TrakOrderComponent,
    },
    { path: 'login', component: LoginComponent },
     {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  }
   
];
