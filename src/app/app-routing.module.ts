import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InitiatorComponent} from './initiator/initiator.component';

const routes: Routes = [
  {
    path: 'initiator/:param',
    component: InitiatorComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
