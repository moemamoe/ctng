import { Component } from '@angular/core';
import { EnvironmentService, LoggerService } from '@ctng/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private environmentService: EnvironmentService, private loggerService: LoggerService) {
    const environment = this.environmentService.getEnv();
    this.loggerService.info('[ENVIRONMENT]', 'Fetch environment: ', environment);
  }
}
