import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trak-order',
  imports:  [CommonModule, FormsModule , TranslateModule],
  templateUrl: './trak-order.component.html',
  styleUrl: './trak-order.component.css'
})
export class TrakOrderComponent {
    constructor(public translate: TranslateService) {}
  
    switchLanguage(language: string) {
      this.translate.use(language);
    }
  isVisible = false;
   userInput = '';
   showData() {
    this.isVisible = !this.isVisible;
  }
}
