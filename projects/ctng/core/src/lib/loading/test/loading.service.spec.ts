import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoadingService } from '../loading.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'ct-fake-component',
  template: '',
  styles: [''],
})
class FakeComponent {}

describe('LoadingService', () => {
  let loadingService: LoadingService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeComponent],
      providers: [LoadingService],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'feed', component: FakeComponent },
          { path: 'edit', component: FakeComponent },
          { path: 'dealer', component: FakeComponent },
        ]),
      ],
    });

    loadingService = TestBed.inject(LoadingService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(loadingService).toBeTruthy();
  });

  it('constructor() should handle navigation events and set the loading spinner', fakeAsync(() => {
    // Arrange
    let iterator = 0;
    const expectedLoadingEvents = [true, true, false]; // first entry is the default event from the behaviour subject
    loadingService.isLoading().subscribe(loading => {
      expect(loading).toEqual(expectedLoadingEvents[iterator], 'Unexpected loading event detected');
      iterator++;
    });

    // Act
    router.navigate(['/feed']);
    tick();
  }));

  it(`constructor() should handle navigation events and set the loading spinner,
      when an Navigation Cancel Event is triggered`, fakeAsync(() => {
    // Arrange
    let iterator = 0;
    const expectedLoadingEvents = [true, true, false, true, false]; // first entry is the default event from the behaviour subject
    loadingService.isLoading().subscribe(loading => {
      expect(loading).toEqual(expectedLoadingEvents[iterator], 'Unexpected loading event detected');
      iterator++;
    });

    // Act
    router.navigate(['/feed']);
    router.navigate(['/edit']);
    tick();
  }));

  it('setLoading() should trigger isLoading event with correct loading indicator', () => {
    // Arrange
    let iterator = 0;
    const expectedLoadingEvents = [true, true, false]; // first entry is the default event from the behaviour subject
    loadingService.isLoading().subscribe(loading => {
      expect(loading).toEqual(expectedLoadingEvents[iterator], 'Unexpected loading event detected');
      iterator++;
    });

    // Act
    loadingService.setLoading(true);
    loadingService.setLoading(false);
  });
});
