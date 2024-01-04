import { ExtraOptions, RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';
import { NbVerifyComponent } from './pages/verifykey/nbverify.component';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { ThemeModule } from './@theme/theme.module';
import { VerifyService } from './pages/verifykey/verify.service';

const url = VerifyService.prototype.genreateUrl();

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
    loadChildren: 'app/pages/pages.module#PagesModule'
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        //   canActivate:[VerifyService],
        component: NbLoginComponent,
      },
      {
        path: 'login',
        //  canActivate:[VerifyService],
        component: NbLoginComponent,
        // skipLocationChange:true
      },
      {
        path: 'login2',
        component: NbLoginComponent,
        // skipLocationChange:true
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
        // skipLocationChange:true
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
        // skipLocationChange:true
      },
      {
        path: 'verify',
        component: NbVerifyComponent,
        // skipLocationChange:true
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
  onSameUrlNavigation: 'reload',
  // preloadingStrategy: PreloadAllModules
  // enableTracing:true
  // skipLocationChange:false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config),
    ThemeModule],
  exports: [RouterModule],
  declarations: [
    NbVerifyComponent
  ],
  providers: [VerifyService]
})
export class AppRoutingModule {
  // public  ulrString=VerifyService.prototype.genreateUrl();
}
