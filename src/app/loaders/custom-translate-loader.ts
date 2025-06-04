// src/app/loaders/custom-translate-loader.ts
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslationService } from '../services/translation.service'; // عدّل المسار حسب مكان الخدمة

export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private translationService: TranslationService
  ) {}

  getTranslation(lang: string): Observable<any> {
    const localFile$ = this.http.get(`/assets/i18n/${lang}.json`).pipe(
      catchError(() => {
        console.warn(`⚠️ Could not load local translation for ${lang}`);
        return of({});
      })
    );

    const apiData$ = this.translationService.getTranslations(lang).pipe(
      catchError(() => {
        console.warn(`⚠️ Could not load API translation for ${lang}`);
        return of({});
      })
    );

    return forkJoin([localFile$, apiData$]).pipe(
      map(([local, api]) => {
        return { ...local, ...api }; // دمج الملفين
      })
    );
  }
}
