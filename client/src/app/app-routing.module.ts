import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectFormatterComponent} from "./components/project-formatter/project-formatter.component";
import {HomeComponent} from "./components/home/home.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'formatter', component: ProjectFormatterComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
