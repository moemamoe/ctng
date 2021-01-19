import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private loggerService: LoggerService) {}

  public setItem(key: string, value: any): void {
    this.loggerService.silly('[LS]', 'Setting local storage item', key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): any {
    const item = JSON.parse(localStorage.getItem(key));
    this.loggerService.silly('[LS]', 'Getting local storage item', key);
    return item;
  }

  public key(index: number): string {
    const key = localStorage.key(index);
    this.loggerService.silly('[LS]', 'Getting key', index, key);
    return key;
  }

  public clear(): void {
    this.loggerService.silly('[LS]', 'Clearing local storage');
    localStorage.clear();
  }

  public removeItem(key: string): void {
    this.loggerService.silly('[LS]', 'Removing item', key);
    localStorage.removeItem(key);
  }
}
