import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectFormatterComponent} from "./components/project-formatter/project-formatter.component";

const routes: Routes = [
  { path: 'formatter', component: ProjectFormatterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
