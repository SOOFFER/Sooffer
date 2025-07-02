import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../@core/data/smart-table.service';
import { HttpIntercept } from '../http.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { RoleProvider } from './role.provider';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AsyncPipe } from '@angular/common';
import { FirebaseConfig } from '../app.config';
import {MessagingService} from "./common/messaging.service";

const PAGES_COMPONENTS = [
  PagesComponent,
];

const firebase = FirebaseConfig.firebaseConfig;

@NgModule({
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(firebase),
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    Ng2SmartTableModule,
    NgxSpinnerModule,
    RouterModule,
    NbSecurityModule.forRoot({
      accessControl: {
        guest: {
          view: ['news', 'comments'],
        },
        superadmins: {
          parent: 'guest',
          create: 'comments',
        },
        superadmin: {
          parent: 'superadmins',
          create: 'news',
          superadminmenu: 'menu',
        },
        citywiseadmin: {
          parent: 'superadmins',
          cityf: 'city',
          citymenu: 'menu',
        },
      },
    }),
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    SearchComponent
  ],
  providers: [
    SmartTableService,
    MessagingService,
    AsyncPipe,
    { provide: NbRoleProvider, useClass: RoleProvider },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
  ],
  exports: [RouterModule]
})
export class PagesModule {
}
