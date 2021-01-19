import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export const fakeWindow = {
  pageYOffset: 1500,
  innerHeight: 1200,
  innerWidth: 1800,
  location: {
    origin: 'http://origin.de',
    hostname: 'origin.de',
    protocol: 'http:',
    port: 1234,
  },
  navigator: {
    language: 'de-DE',
  },

  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void => {},
  requestAnimationFrame: (callback: FrameRequestCallback) => {
    callback(0);
  },
  open: (link: string, target: string, options: string) => {},
  ga() {},
};

@Injectable()
export class WindowServiceMock {
  public isAppVisible: Observable<boolean> = of(true);

  get nativeWindow(): any {
    return fakeWindow;
  }

  public open(link: string, target?: string, options?: string): void {}
  public navigate(href: string): void {}
}
