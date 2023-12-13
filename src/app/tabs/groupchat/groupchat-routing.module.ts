import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupchatPage } from './groupchat.page';

const routes: Routes = [
  {
    path: '',
    component: GroupchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupchatPageRoutingModule {}
