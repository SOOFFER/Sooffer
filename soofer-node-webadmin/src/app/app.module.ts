/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ButtonToasterService } from './pages/buttontoaster/buttontoaster.service';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, NbAuthJWTInterceptor, NbAuthService } from '@nebular/auth';
import { AuthGuard } from './auth-guard.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpModule } from '@angular/http';
//import { HttpClientTokenService } from './app-http.service';
import { VerifyService } from './pages/verifykey/verify.service';
import { TokenInterceptor } from './app-httpclient.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpIntercept } from './http.interceptor';
import { AppSettings, LanguageSettings } from './app.config';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';



export function HttpLoaderFactory(httpClient: HttpClient) {
  const checkLang = LanguageSettings['fetchTranslateFilesFromAPI'] ? LanguageSettings['fetchTranslateFilesFromAPI'] : false;
  if (checkLang) {
    return new TranslateHttpLoader(httpClient, `${AppSettings.BASEURL}` + 'public/adminLanguageFile/', '.json');
  } else {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    HttpModule,
    NgIdleKeepaliveModule.forRoot(),
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    ToastrModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "email",
          baseEndpoint: AppSettings.API_ENDPOINT,
          login: {
            endpoint: "login",
            method: "post",
            redirect: {
              success: "/",
              failure: null,
            },
            defaultErrors: [
              "Login/Email combination is not correct, please try again.",
            ],
            defaultMessages: ["You have been successfully logged in."],
          },
          register: {
            endpoint: "/auth/sign-up",
            method: "post",
          },
          logout: {
            endpoint: "logout",
            method: "get",
            redirect: {
              success: "/auth/login",
              failure: null,
            },
          },
          requestPass: {
            endpoint: "forgotPassword",
            method: "put",
          },
          resetPass: {
            endpoint: "/auth/reset-pass",
            method: "post",
          },
          token: {
            class: NbAuthJWTToken,
            key: "data.token", // this parameter tells where to look for the token
          },
        }),
      ],
      forms: {
        login: {
          rememberMe: false,
          strategy: "email",
          redirectDelay: 2000,
          showMessages: {
            success: true,
            error: true,
          },
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    AuthGuard,
    NbAuthService,
    ButtonToasterService,
    VerifyService,
  ],
})
export class AppModule { }
