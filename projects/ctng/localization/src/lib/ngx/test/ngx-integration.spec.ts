import { LocalizationService } from '../../services';
import { NgxIntegrationTestContext } from './ngx-integration-test-context';
import { ngxIntegrationTestHelper } from './ngx-test-helper';

describe('NgxLocalizationIntegration ', () => {
  ngxIntegrationTestHelper.createServiceTestSetup(LocalizationService, {
    beforeEach: (testContext: NgxIntegrationTestContext<LocalizationService>) => {
      testContext.localizationConfig.httpLocaleFolder = '/assets/i18n/';
    },
  });

  it(`Ngx implementation should be integrated with default settings`, function(this: NgxIntegrationTestContext<LocalizationService>) {
    // Arrange
    this.httpMock.expectOne(`${this.localizationConfig.httpLocaleFolder}${this.localizationConfig.defaultLocale}.json`);
    expect(this.service).toBeDefined();
  });
});
