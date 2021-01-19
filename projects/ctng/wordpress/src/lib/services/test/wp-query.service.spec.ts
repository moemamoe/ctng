import { inject, TestBed } from '@angular/core/testing';
import { LoggerService, loogerTestConfig } from '@ctng/core';
import { WPArguments } from '../../enum/wp-arguments.enum';
import { WPOrder } from '../../enum/wp-order.enum';
import { WPQueryParams } from '../../model/wp-query';
import { WpQueryService } from '../wp-query.service';
import { WPLanguage } from '../../enum/wp-language';


describe('WpQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WpQueryService, LoggerService, loogerTestConfig],
    });
  });

  it('should be created', inject([WpQueryService], (service: WpQueryService) => {
    expect(service).toBeTruthy();
  }));

  it('mapQueryToUrl() should return null, when no query object is passed to it', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query = null;

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toBeNull('Unexpected query Url. Should be null');
  }));

  it('mapQueryToUrl() should return correct query url for: "include"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      include: [1, 2],
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.include}=1&${WPArguments.include}=2`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "page"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      page: 1,
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.page}=1`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "status"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      status: 'publish',
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.status}=publish`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "perPage"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      perPage: 10,
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.perPage}=10`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "order"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      order: WPOrder.DESC,
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.order}=${WPOrder.DESC}`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "orderBy"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      orderBy: 'date',
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.orderBy}=date`);
    checkStartAndEndCharacter(queryUrl);
  }));

  it('mapQueryToUrl() should return correct query url for: "language"', inject([WpQueryService], (service: WpQueryService) => {
    // Arrange
    const query: WPQueryParams = {
      language: WPLanguage.de,
    };

    // Act
    const queryUrl = service.mapQueryToUrl(query);

    // Assert
    expect(queryUrl).toEqual(`?${WPArguments.language}=de`);
    checkStartAndEndCharacter(queryUrl);
  }));
});

function checkStartAndEndCharacter(queryUrl: string): void {
  expect(queryUrl.startsWith('?')).toBeTruthy('Unexpected start sign of query url');
  expect(queryUrl.endsWith('&')).toBeFalsy('Unexpected end sign of query url. "&" should be removed');
}
