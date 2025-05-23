import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-order',
  imports: [
              TranslateModule,
              RouterOutlet
            ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  
    constructor(public translate: TranslateService,) {
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
    }
  
    switchLanguage(language: string) {
      this.translate.use(language);
    }
  
}


