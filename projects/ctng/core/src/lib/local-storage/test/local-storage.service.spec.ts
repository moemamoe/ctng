import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../../logger/logger.service';
import { loogerTestConfig } from '../../logger/loggers/test/logger-test.config';
import { LocalStorageService } from '../local-storage.service';

const expectedItem = {
  id: 1,
  name: 'testName',
  value: 'testValue',
};
const testKey = 'TEST_KEY';

describe('LocalStorageService', () => {
  // service
  let localStorageService: LocalStorageService;

  // spies
  let keyLocalStorageSpy: jasmine.Spy;
  let getItemLocalStorageSpy: jasmine.Spy;
  let setItemLocalStorageSpy: jasmine.Spy;
  let clearLocalStorageSpy: jasmine.Spy;
  let removeItemLocalStorageSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService, LoggerService, loogerTestConfig],
      imports: [HttpClientTestingModule],
    });

    // services
    localStorageService = TestBed.inject(LocalStorageService);

    // spies
    keyLocalStorageSpy = spyOn(localStorage, 'key');
    getItemLocalStorageSpy = spyOn(localStorage, 'getItem');
    setItemLocalStorageSpy = spyOn(localStorage, 'setItem');
    clearLocalStorageSpy = spyOn(localStorage, 'clear');
    removeItemLocalStorageSpy = spyOn(localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(localStorageService).toBeTruthy();
  });

  it('setItem() should set item in localstorage', () => {
    // Arrange
    setItemLocalStorageSpy.and.callFake((key, item) => {
      expect(key).toEqual(testKey, 'Unexpected key found');
      expect(item).toEqual(JSON.stringify(expectedItem), 'Unexpected item found');
    });

    // Act
    localStorageService.setItem(testKey, expectedItem);

    // Assert
    expect(setItemLocalStorageSpy).toHaveBeenCalledTimes(1);
  });

  it('getItem() should get item from localstorage', () => {
    // Arrange
    getItemLocalStorageSpy.and.callFake(key => {
      expect(key).toEqual(testKey, 'Unexpected key found');
      return JSON.stringify(expectedItem);
    });

    // Act
    const item = localStorageService.getItem(testKey);

    // Assert
    expect(getItemLocalStorageSpy).toHaveBeenCalledTimes(1);
    expect(item).toEqual(expectedItem, 'Unexpted item found');
  });

  it('key() should return key from localstorage by index', () => {
    // Arrange
    const expectedIndex = 1;
    keyLocalStorageSpy.and.callFake(index => {
      expect(index).toEqual(expectedIndex, 'Unexpected index found');
      return testKey;
    });

    // Act
    const key = localStorageService.key(expectedIndex);

    // Assert
    expect(keyLocalStorageSpy).toHaveBeenCalledTimes(1);
    expect(key).toEqual(testKey, 'Unexpted key found');
  });

  it('clear() should clear the localstorage', () => {
    // Arrange
    clearLocalStorageSpy.and.callFake(() => {});

    // Act
    localStorageService.clear();

    // Assert
    expect(clearLocalStorageSpy).toHaveBeenCalledTimes(1);
  });

  it('removeItem() should remove the item in the localstorage by key', () => {
    // Arrange
    removeItemLocalStorageSpy.and.callFake(key => {
      expect(key).toEqual(testKey, 'Unexpected key found');
    });

    // Act
    localStorageService.removeItem(testKey);

    // Assert
    expect(removeItemLocalStorageSpy).toHaveBeenCalledTimes(1);
  });
});
