import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
})
export class ProtectedComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  public back() {
    this.location.back();
  }
}
