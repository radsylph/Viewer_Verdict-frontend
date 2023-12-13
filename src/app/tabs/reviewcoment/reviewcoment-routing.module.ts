import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewcomentPage } from './reviewcoment.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewcomentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewcomentPageRoutingModule {}
