import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewcomentPageRoutingModule } from './reviewcoment-routing.module';

import { ReviewcomentPage } from './reviewcoment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewcomentPageRoutingModule
  ],
  declarations: [ReviewcomentPage]
})
export class ReviewcomentPageModule {}
