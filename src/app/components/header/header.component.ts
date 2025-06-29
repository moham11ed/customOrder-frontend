import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true, 
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

  constructor(public translate: TranslateService,
     private router: Router,
     private dbtranslate: TranslationService
    ) {}

  switchLanguage(language: string) {
    this.translate.use(language);
    
  }

  onDoubleClick() {
  this.router.navigate(['/admin']);
}
}