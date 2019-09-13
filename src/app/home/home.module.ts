import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { ScreenShareComponent } from './screen-share/screen-share.component';

@NgModule({
  declarations: [HomeComponent, ScreenShareComponent],
  imports: [CommonModule, HomeRoutingModule]
})
export class HomeModule {}
