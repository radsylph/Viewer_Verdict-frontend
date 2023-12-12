import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CataloguePage } from './catalogue.page';

const routes: Routes = [
  {
    path: '',
    component: CataloguePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CataloguePageRoutingModule {}
