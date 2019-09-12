import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { ScreenShareComponent } from './components/screen-share/screen-share.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ScreenShareComponent],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule, WebviewDirective]
})
export class SharedModule {}
