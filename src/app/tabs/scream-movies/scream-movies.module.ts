import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreamMoviesPageRoutingModule } from './scream-movies-routing.module';

import { ScreamMoviesPage } from './scream-movies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreamMoviesPageRoutingModule
  ],
  declarations: [ScreamMoviesPage]
})
export class ScreamMoviesPageModule {}
