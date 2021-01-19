import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
})
export class PublicComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  public back() {
    this.location.back();
  }
}
