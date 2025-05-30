import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-how-to-use',
  imports: [
    TranslateModule
  ],
  templateUrl: './how-to-use.component.html',
  styleUrl: './how-to-use.component.css'
})
export class HowToUseComponent {
  constructor(private translate: TranslateService) {}



}
