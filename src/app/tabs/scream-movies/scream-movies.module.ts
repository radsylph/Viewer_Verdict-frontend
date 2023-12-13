import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreamMoviesPageRoutingModule } from './scream-movies-routing.module';

import { ScreamMoviesPage } from './scream-movies.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreamMoviesPageRoutingModule,
  ],
  declarations: [ScreamMoviesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScreamMoviesPageModule {}
