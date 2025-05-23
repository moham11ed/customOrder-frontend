import { Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { HowToUseComponent } from '../how-to-use/how-to-use.component';
import { TrakOrderComponent } from '../trak-order/trak-order.component';
import { CategoryComponent } from './category/category.component';
import { OilsComponent } from './oils/oils.component';
import { ShapeComponent } from './shape/shape.component';
import { DesignComponent } from './design/design.component';
import { ConfirmDesignComponent } from './confirm-design/confirm-design.component';
import { ProductNameComponent } from './product-name/product-name.component';
import { ProductAmountComponent } from './product-amount/product-amount.component';
import { ClientInfoComponent } from './client-info/client-info.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

export const routes: Routes = [
    {
        path: '',
        component: OrderComponent,
        children: [
            ///// rout in order
            {
                path: '',
                component: CategoryComponent
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
                path: 'summary',
                component: OrderSummaryComponent,
                
            },
            {
                path: 'client-info',
                component: ClientInfoComponent,
                
            },
        ]
    },
    {
        path: 'how-to-use',
        component: HowToUseComponent,
    },
    {
        path: 'order',
        component: OrderComponent,
    },
    {
        path: 'trak-order',
        component: TrakOrderComponent,
    },
];
