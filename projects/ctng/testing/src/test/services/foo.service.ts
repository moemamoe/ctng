import { Injectable } from '@angular/core';

/**
 * Random service which we want to test.
 */
@Injectable({
  providedIn: 'root',
})
export class FooService {
  constructor() {}

  public multiply(x, y) {
    return x * y;
  }
}
