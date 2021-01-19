import { HttpTestingController } from '@angular/common/http/testing';
import { CommonTestContext } from '../../../test/localization-test-context';

/**
 * Specific Ngx Integration Test Context
 */
export interface NgxIntegrationTestContext<T> extends CommonTestContext<T> {
  httpMock: HttpTestingController;
}
