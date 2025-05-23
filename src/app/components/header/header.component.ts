import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true, // Add standalone: true
  imports: [
    RouterModule,
    TranslateModule, 
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  styles: [
    
  ]
})
export class HeaderComponent {
  constructor(public translate: TranslateService) {}

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}