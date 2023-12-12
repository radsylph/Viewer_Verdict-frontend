import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreamSeriesPageRoutingModule } from './scream-series-routing.module';

import { ScreamSeriesPage } from './scream-series.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreamSeriesPageRoutingModule
  ],
  declarations: [ScreamSeriesPage]
})
export class ScreamSeriesPageModule {}
