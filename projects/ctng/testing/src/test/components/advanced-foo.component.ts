import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { LocalStorageService } from '@ctng/core';

@Component({
  selector: 'ct-ng-adv-foo',
  template: `
    <p>{{ formattedFooValue }}</p>
    <button class="foo-values" (click)="getFooValues()"></button>
  `,
})
export class AdvancedFooComponent {
  public formattedFooValue: string;

  @Input() set fooValue(fooValue: string) {
    if (!fooValue) {
      return;
    }

    this.formattedFooValue = fooValue.replace(' ', '');
  }

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getFooValues() {
    this.http.get('/foovalues').subscribe(res => {
      this.fooValue = this.formattedFooValue;
    });
  }

  public getLocalStorageItem() {
    return this.localStorageService.getItem('testinger');
  }
}
