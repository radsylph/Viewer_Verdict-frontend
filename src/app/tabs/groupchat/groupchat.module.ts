import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupchatPageRoutingModule } from './groupchat-routing.module';

import { GroupchatPage } from './groupchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupchatPageRoutingModule
  ],
  declarations: [GroupchatPage]
})
export class GroupchatPageModule {}
