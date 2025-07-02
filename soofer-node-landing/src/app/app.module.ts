import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiMapModule } from '@ngui/map';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {
  MatProgressSpinnerModule,
  MatMenuModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatCheckboxModule,
  MatDialogModule,
  MatPaginatorModule
} from '@angular/material';
import { NgModule, ReflectiveInjector, Injectable } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { ButtonToasterService } from './index/buttontoaster/buttontoaster.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './index/header/header.component';
import { FooterComponent } from './index/footer/footer.component';
import { SectionComponent } from './index/section/section.component';
import { RouterModule, Routes, NoPreloading } from '@angular/router';
import { SigninComponent } from './index/signin/signin.component';
// import { DriverProfileComponent } from "./index/driverProfile/driverProfile.component";
import { HelpComponent } from './index/help/help.component';
import { AboutComponent } from './index/about /about.component';
import { ContactComponent } from './index/contact /contact.component';
import { DriversignupComponent } from './index/driversignup/driversignup.component';
import { HomesigninComponent } from './index/homesignin/homesignin.component';
import { RidersignupComponent } from './index/ridersignup/ridersignup.component';
import { RiderSigninComponent } from './index/ridersignin/ridersignin.component';
import { FaqComponent } from './index/faq/faq.component';
import { PrivacypolicyComponent } from './index/privacypolicy/privacypolicy.component';
import { TermsconditionComponent } from './index/termscondition/termscondition.component';
import { HowitworksComponent } from './index/howitworks/howitworks.component';
import { InsuranceComponent } from './index/insurance/insurance.component';
import { LegalComponent } from './index/legal/legal.component';
import { ProfileComponent } from './index/profile/profile.component';
import { FormsModule } from '@angular/forms';
// Import your library
import { OwlModule } from 'ngx-owl-carousel';
import { TaxiComponent } from './index/taxi/taxi.component';
import { TripsComponent } from './index/trips/trips.component';
import { EarningsComponent } from './index/earnings/earnings.component';
import { RiderTripsComponent } from './index/ridertrips/trips.component';
import { RiderProfileComponent } from './index/riderprofile/profile.component';
import { RiderWalletComponent } from './index/riderwallet/riderwallet.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RiderForgotPassWordComponent } from './index/riderforgotpassword/riderForgotPassword.component';
import { DriverForgotPassWordComponent } from './index/driverForgotPassword/driverForgotPassword.component';
import { DashboardSectionComponent } from './index/dashboard-section/dashboard-section.component';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { mergeMap } from 'rxjs/operators';
import { AppSettings, LanguageSettings } from './app.config';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { NgxInputStarRatingModule } from 'ngx-input-star-rating';
import { ServicecitiesComponent } from './index/servicecities/servicecities.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FareEstimationPageComponent } from './index/fare-estimation-page/fare-estimation-page.component';
import { ProcessingTripsComponent } from './index/processing-trips/processing-trips.component';
import { CityAddressComponent } from './index/city-address/city-address.component'
import { SafeHtmlPipe } from './@shared/pipes/safe.pipe';
import { HttpIntercept } from './interceptor/Auth-interceptor';
import { AuthGuard } from './services/auth.gurad';
import { DownloadSectionComponent } from './index/download-section/download-section.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  const checkLang = LanguageSettings['fetchTranslateFilesFromAPI'] ? LanguageSettings['fetchTranslateFilesFromAPI'] : false;
  console.log('checkLang', checkLang);
  if (checkLang) {
    return new TranslateHttpLoader(httpClient, `${AppSettings.BASEURL}` + 'public/landingLanguageFile/', '.json');
  } else {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
  }
}

const firebase = {
  // Express Track
  appName: "gomytaxiapp",
  authDomain: "gomytaxiapp.firebaseapp.com",
  databaseURL: "https://gomytaxiapp.firebaseio.com/",
  storageBucket: "gomytaxiapp.appspot.com",
};

@Injectable()
export class SeoSettingsService {
  private apiUrl = AppSettings.API_ENDPOINT;

  getSEO(callback): void {
    fromPromise(fetch(this.apiUrl + 'seosettings/'))
      .pipe(mergeMap(response => response.json()))
      .subscribe(data => {
        callback(data[0]);
      });
  }
}

// import { DataTableModule } from 'angular-4-data-table';
const routes: Routes = [
  {
    path: '',
    component: SectionComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'city-address',
    component: CityAddressComponent
  },
  {
    path: 'fare-estimation-page',
    component: FareEstimationPageComponent
  },
  {
    path: 'servicecities',
    component: ServicecitiesComponent
  },
  {
    path: 'dashboard-section',
    component: DashboardSectionComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'processing-trips',
    component: ProcessingTripsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'driversignin',
    component: SigninComponent
  },
  {
    path: 'ridersignin',
    component: RiderSigninComponent
  },
  // {
  //   path: "driverProfile",
  //   component: DriverProfileComponent
  // },

  {
    path: 'help',
    component: HelpComponent
  },

  {
    path: 'section',
    component: SectionComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'driversignup',
    component: DriversignupComponent
  },

  {
    path: 'ridersignup',
    component: RidersignupComponent
  },

  // end.........................
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'sign-in',
    component: HomesigninComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacypolicyComponent
  },
  {
    path: 'terms-condition',
    component: TermsconditionComponent
  },
  {
    path: 'how-it-works',
    component: HowitworksComponent
  },
  {
    path: 'trust-safty-insurance',
    component: InsuranceComponent
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'earnings',
    component: EarningsComponent
  },
  {
    path: 'taxi',
    component: TaxiComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'trips',
    component: TripsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'ridertrips',
    component: RiderTripsComponent
  },
  {
    path: 'riderwallet',
    component: RiderWalletComponent
  },
  {
    path: 'riderprofile',
    component: RiderProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'riderforgotpassword',
    component: RiderForgotPassWordComponent
  },
  {
    path: 'driverforgotpassword',
    component: DriverForgotPassWordComponent
  },
  {
    path: '**',
    component: SectionComponent
  },

];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SafeHtmlPipe,
    SectionComponent,
    AboutComponent,
    ContactComponent,
    SigninComponent,
    HelpComponent,
    DriversignupComponent,
    ServicecitiesComponent,
    FareEstimationPageComponent,
    // DriverProfileComponent,
    HomesigninComponent,
    FaqComponent,
    PrivacypolicyComponent,
    TermsconditionComponent,
    HowitworksComponent,
    InsuranceComponent,
    LegalComponent,
    ProfileComponent,
    EarningsComponent,

    RidersignupComponent,
    RiderSigninComponent,
    TaxiComponent,
    TripsComponent,
    RiderTripsComponent,
    RiderProfileComponent,
    RiderWalletComponent,
    RiderForgotPassWordComponent,
    DriverForgotPassWordComponent,
    DashboardSectionComponent,
    FareEstimationPageComponent,
    ProcessingTripsComponent,
    CityAddressComponent,
    DownloadSectionComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(firebase),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserModule,
    BrowserAnimationsModule,
    OwlModule,
    HttpModule,

    HttpClientModule,
    NgxSpinnerModule,
    TimePickerModule,
    NgxInputStarRatingModule,
    CarouselModule,
    OwlModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    Ng2SmartTableModule,
    RouterModule.forRoot(routes, { useHash: true }), // IndexModule
    ToastrModule.forRoot(),
    // MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatSortModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    NguiMapModule.forRoot({
      apiUrl:
        'https://maps.google.com/maps/api/js?libraries=visualization,places,drawing'
    })
    // RecaptchaModule,
    // RecaptchaModule.forRoot(),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true
    },
    ButtonToasterService,
    AsyncPipe,
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// tslint:disable-next-line: deprecation
const injector = ReflectiveInjector.resolveAndCreate([SeoSettingsService]);
const sr = injector.get(SeoSettingsService);

sr.getSEO(data => {
  if (data) {
    document
      .getElementById('description')
      .setAttribute('content', data.description);
    document.getElementById('keywords').setAttribute('content', data.keyword);
    document.getElementById('title').innerHTML = data.tag;
  }
});
