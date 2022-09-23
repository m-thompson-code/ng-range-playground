import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AnimeComponent } from './components/anime/anime.component';
import { RangeInputComponent } from './components/range-input/range-input.component';
import { RangeDirective } from './directives/range/range.directive';
import { TempComponent } from './components/temp/temp.component';
import { WooComponent } from './components/woo/woo.component';
import { GifsComponent } from './components/gifs/gifs.component';

@NgModule({
  declarations: [
    AppComponent,
    RangeInputComponent,
    AnimeComponent,
    RangeDirective,
    TempComponent,
    WooComponent,
    GifsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
