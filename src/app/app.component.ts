import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    TranslateModule, 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
 

  constructor(public translate: TranslateService) {
    this.translate.use('ar');
    this.translate.setDefaultLang('ar');

  
  }




  title = 'ETABEMA';
}