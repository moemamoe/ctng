import { NgModule } from '@angular/core';
import { CommonModule as NgCommon } from '@angular/common';

// Pipes
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TrimWhitespacePipe } from './pipes/trim-whitespace.pipe';

// Components
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { CircleSpinnerComponent } from './components/circle-spinner/circle-spinner.component';

@NgModule({
  declarations: [
    // Pipes
    SafeUrlPipe,
    TrimWhitespacePipe,
    // Components
    LoadingBarComponent,
    CircleSpinnerComponent
  ],
  imports: [
    NgCommon
  ],
  exports: [
    // Pipes
    SafeUrlPipe,
    TrimWhitespacePipe,
    // Components
    LoadingBarComponent,
    CircleSpinnerComponent
  ]
})
export class CommonModule { }
