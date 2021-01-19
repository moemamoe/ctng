import { Component, OnInit } from '@angular/core';
import { WPDataService } from '@ctng/wordpress';

@Component({
  selector: 'app-wordpress',
  templateUrl: './wordpress.component.html',
  styleUrls: ['./wordpress.component.scss']
})
export class WordpressComponent implements OnInit {

  constructor(private wpDataService: WPDataService) { }

  ngOnInit() {
  }

}
