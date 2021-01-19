import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WordpressComponent } from './component/wordpress/wordpress.component';

const routes: Routes = [
  {
    path: '',
    component: WordpressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordpressRoutingModule { }
