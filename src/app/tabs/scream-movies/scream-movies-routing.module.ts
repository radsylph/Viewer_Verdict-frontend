import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreamMoviesPage } from './scream-movies.page';

const routes: Routes = [
  {
    path: '',
    component: ScreamMoviesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreamMoviesPageRoutingModule {}
