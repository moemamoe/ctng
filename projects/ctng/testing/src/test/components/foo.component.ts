import { Component, Input } from '@angular/core';

@Component({
  selector: 'ct-ng-foo',
  template: `
    <p>{{ formattedFooValue }}</p>
  `,
})
export class FooComponent {
  public formattedFooValue: string;

  @Input() set fooValue(fooValue: string) {
    if (!fooValue) {
      return;
    }

    this.formattedFooValue = fooValue.replace(' ', '');
  }

  constructor() {}
}
