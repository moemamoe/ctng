import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterEvent, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() menuToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  private menuOpen = false;
  public toolbarTitle = 'Test';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.menuToggle.emit(this.menuOpen);
  }

  private navigationInterceptor(event: RouterEvent): void {

    if (event instanceof ActivationEnd) {
      if (event['snapshot'].data && event['snapshot'].data.title) {
        this.toolbarTitle = event['snapshot'].data.title;
        return;
      }
    }

  }

}
