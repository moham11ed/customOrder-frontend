import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Translation {
  key: string;
  values: {
    [language: string]: string;
  };
}

export interface TranslationsResponse {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = environment.apiURL + '/api/Translations';
  private translationsSubject = new BehaviorSubject<TranslationsResponse>({});
  public translations$ = this.translationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTranslations(language: string): Observable<TranslationsResponse> {
    return this.http.get<TranslationsResponse>(`${this.apiUrl}/${language}`).pipe(
      tap(translations => this.translationsSubject.next(translations))
    );
  }

  getTranslation(key: string): Observable<string | undefined> {
    return this.translations$.pipe(
      map(translations => translations[key])
    );
  }

  addOrUpdateTranslation(dto: Translation): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto).pipe(
      tap(() => {
        // Optionally refresh translations after update
        // You might want to make this more specific to only update the changed translation
        if (dto.values && Object.keys(dto.values).length > 0) {
          const firstLanguage = Object.keys(dto.values)[0];
          this.getTranslations(firstLanguage).subscribe();
        }
      })
    );
  }

  // Helper method to get current translations snapshot
  getCurrentTranslations(): TranslationsResponse {
    return this.translationsSubject.value;
  }
}