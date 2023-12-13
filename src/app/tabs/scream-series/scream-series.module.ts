import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreamSeriesPageRoutingModule } from './scream-series-routing.module';

import { ScreamSeriesPage } from './scream-series.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreamSeriesPageRoutingModule,
  ],
  declarations: [ScreamSeriesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScreamSeriesPageModule {}
