import { Observable, of } from 'rxjs';

export class WindowServiceMock {
  public isAppVisible: Observable<boolean> = of(true);

  get nativeWindow(): any {
    return {};
  }

  public open(link: string, target?: string, options?: string): void {}
  public navigate(href: string): void {}
}
