import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageServiceMock {
  private returnNull = false;

  public setReturnNull() {
    this.returnNull = true;
  }

  constructor() {}

  public setItem(key: string, value: any): void {}

  public getItem(key: string): any {}

  public key(index: number): string {
    throw new Error('Not implemented');
  }

  public clear(): void {}

  public removeItem(key: string): void {}
}
