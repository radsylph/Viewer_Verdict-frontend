import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreamSeriesPage } from './scream-series.page';

const routes: Routes = [
  {
    path: '',
    component: ScreamSeriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreamSeriesPageRoutingModule {}
