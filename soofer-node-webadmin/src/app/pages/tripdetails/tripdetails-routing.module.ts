import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripDetailsComponent } from './tripdetails.component';
import { TripsService } from './tripdetails.service';
import { AllTripsComponent } from './all-trips/all-trips.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PastTripsComponent } from './past-trips/past-trips.component';
import { OngoingTripsComponent } from './ongoing-trips/ongoing-trips.component';
import { UpcomingTripsComponent } from './upcoming-trips/upcoming-trips.component';
import { NoresponseTripsComponent } from './noresponse-trips/noresponse-trips.component';
import { PendingReqTripsComponent } from './pending-req-trips/pending-req-trips.component';
import { RideLaterTripsComponent } from './ride-later-trips/ride-later-trips.component';
import { PaymentFailedTripsComponent } from './payment-failed-trips/payment-failed-trips.component';

const routes: Routes = [{
  path: '',
  component: TripDetailsComponent,
  children: [
    {
      path: 'all-trips',
      component: AllTripsComponent,
    },
    {
      path: 'invoice-details',
      component: InvoiceDetailsComponent
    },
    {
      path: 'past-trips',
      component: PastTripsComponent
    },
    {
      path: 'noresponse-trips',
      component: NoresponseTripsComponent
    },
    {
      path: 'ongoing-trips',
      component: OngoingTripsComponent
    },
    {
      path: 'upcoming-trips',
      component: UpcomingTripsComponent
    },
    {
      path: 'pending-req-trips',
      component: PendingReqTripsComponent
    },
    {
      path: 'ride-later-trips',
      component: RideLaterTripsComponent,
    },
    {
      path: 'payment-failed-trips',
      component: PaymentFailedTripsComponent
    },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [TripsService],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  TripDetailsComponent,
  AllTripsComponent,
  PaymentFailedTripsComponent,
  InvoiceDetailsComponent,
  PastTripsComponent,
  OngoingTripsComponent,
  UpcomingTripsComponent,
  NoresponseTripsComponent,
  PendingReqTripsComponent,
  RideLaterTripsComponent
];
