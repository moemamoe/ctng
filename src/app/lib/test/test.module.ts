import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [TestComponent],
  imports: [CommonModule, TestRoutingModule, MarkdownModule.forChild()],
})
export class TestModule {}
