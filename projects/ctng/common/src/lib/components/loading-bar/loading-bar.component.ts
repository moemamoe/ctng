import { Component, Input } from '@angular/core';

@Component({
  selector: 'ct-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent {
  @Input()
  public loading = true;

  constructor(
  ) {
  }
}
