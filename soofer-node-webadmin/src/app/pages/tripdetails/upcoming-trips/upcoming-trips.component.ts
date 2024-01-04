import { Component, OnInit } from '@angular/core';
import { featuresSettings, AppSettings } from '../../../app.config';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TripsService } from '../tripdetails.service';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-upcoming-trips',
  templateUrl: './upcoming-trips.component.html',
  styleUrls: ['./upcoming-trips.component.scss']
})
export class UpcomingTripsComponent implements OnInit {

  currentIndex: any = 0;
  navigationSubscription: any;
  settings = {
    // selectMode: 'multi',
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      tripno: {
        title: 'Trip No',

      },
      triptype: {
        title: 'Trip Type',
      },
      date: {
        title: 'Date Time',
      },
      dvr: {
        title: 'Driver',
        valuePrepareFunction: (dvr) => {
          return dvr ? dvr : 'N/A';
        }
      },
      rid: {
        title: 'Rider',
      },
      status: {
        title: 'Trip Status',
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [
              { value: "noresponse", title: "Noresponse" },
              { value: "Cancelled", title: "Cancelled" },
              { value: "processing", title: "Processing" },
              { value: "accepted", title: "Accepted" }
            ]
          },

        }
      },
      fare: {
        title: 'Fare',
      },
      vehicle: {
        title: 'Vehicle Type',
      },
      "csp.via": {
        title: "Payment Mode",
        //  type:"number",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [{ value: "card", title: "Card" }, { value: "cash", title: "Cash" }]
          }
        },
        valuePrepareFunction: (cell, row) => {
          return row.csp["via"];
        }
      },

    },
  };

  initial: number = 0;
  source: ServerDataSource;
  serviceCityArray: any = [];
  showCity: boolean;
  brobj; data: any;
  Doc: any = {};
  fields: any;
  tripdetailsId: string;

  constructor(public http: HttpClient,
    private toastr: ButtonToasterService,
    private router: Router,
    private tripservice: TripsService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'upcomingTrips' });
    this.showServiceCity();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });
  }

  showServiceCity() {
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin') {
      this.showCity = true;
    } else {
      this.showCity = false;
    }
    this.tripservice.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
  }

  SerachForCity(data): void {
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === 'undefined' || data.servicecity === 'all')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'upcomingTrips' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'upcomingTrips?scity_like=' + data.servicecity });

  }

  ngOnInit() {
  }

  /** Invoice Page */

  route(event) {
    this.initial = 1;
    const temp = document.querySelector('li.active');
    console.log(temp)
    if (temp) {
      const child = temp.children
      if (child[0] && child[0].childNodes[0] && child[0].childNodes[0].nodeValue) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    this.tripdetailsId = event.data._id;
    this.fields = this.tripdetailsId;
  }

  goBack() {
    this.initial = 0;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
  }

  getFields() {
    return this.fields;
  }

}
