import { Component } from '@angular/core';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    TranslateModule,
    RouterOutlet,
    CommonModule,
    MatIconModule  // Add this import
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  currentRoute: string = '';
  routes = [
    { path: 'category', icon: 'list', label: 'Category' },
    { path: 'oils', icon: 'water_drop', label: 'Oils' },
    { path: 'shape', icon: 'crop', label: 'Shape' },
    { path: 'design', icon: 'design_services', label: 'Design' },
    { path: 'confirm-design', icon: 'check_circle', label: 'Confirm Design' },
    { path: 'product-name', icon: 'title', label: 'Product Name' },
    { path: 'product-amount', icon: 'numbers', label: 'Amount' },
    { path: 'client-info', icon: 'person', label: 'Client Info' },
    { path: 'summary', icon: 'summarize', label: 'Summary' }
  ];

  constructor(
    public translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('ar');
    this.translate.use('ar');
    
    // Track route changes
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects.split('/').pop() || 'category';
      }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  isStepCompleted(routeIndex: number): boolean {
    const currentIndex = this.routes.findIndex(r => r.path === this.currentRoute);
    return routeIndex < currentIndex;
  }

  isCurrentStep(routeIndex: number): boolean {
    return this.routes[routeIndex].path === this.currentRoute;
  }
}