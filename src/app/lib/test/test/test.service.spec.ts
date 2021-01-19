import { ServiceTestContext } from '@ctng/testing';
import { testHelper } from 'src/app/test-helper';
import { TestService } from './test.service';

describe('TestService', () => {
  testHelper.createServiceTestSetup(TestService);

  it('should be created and work', function(this: ServiceTestContext<TestService>) {
    expect(this.service.multiply(2, 3)).toBe(6);
  });
});
