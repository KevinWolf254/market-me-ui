import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'public', loadChildren: () => import('./views/public/public.module').then(m => m.PublicModule)},
  {path:'private', loadChildren: () => import('./views/private/private.module').then(m => m.PrivateModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
