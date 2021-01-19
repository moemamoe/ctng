import { LocalStorageService } from '@ctng/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Random, a bit more advanced, service which we want to test.
 */
@Injectable({
  providedIn: 'root',
})
export class AdvancedFooService {
  constructor(private localStorageService: LocalStorageService, private http: HttpClient) {}

  public getLocalStorageItem() {
    return this.localStorageService.getItem('testinger');
  }

  public getFoo() {
    return this.http.get('/testinger');
  }
}
