import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '@ctng/localization';

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.scss'],
})
export class LocalizationComponent implements OnInit {
  public now = new Date();

  constructor(private localizationService: LocalizationService) {}

  ngOnInit(): void {}

  public german(): void {
    this.localizationService.use('de');
  }

  public english(): void {
    this.localizationService.use('en');
  }
}
