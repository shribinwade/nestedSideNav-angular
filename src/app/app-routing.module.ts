import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/components/LandingPage/home/home.component';
import { LayoutComponent } from './pages/top-and-side-layout/layout/layout.component';


import { LoginComponent } from './modules/auth/auth-components/login/login.component';
import { SignupComponent } from './modules/auth/auth-components/signup/signup.component';
import { AuthGuardService } from './modules/auth/auth-guard/auth-guard.service';

const routes: Routes = [
  
  { path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },

  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate:[AuthGuardService],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
      },
      // {
      //   path: 'amazon-product',
      //   loadChildren: () => import('./modules/amazon-product/amazon-product.module').then(m =>m.AmazonProductModule),
      // }
    ]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
