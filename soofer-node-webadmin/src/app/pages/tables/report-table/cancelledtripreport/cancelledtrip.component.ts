import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  },
  .invoice{
    padding-top: 45px !important;
  }
  `],
})

export class CancelledtripComponent {
  title: string = "Canceled Trip Report";
  trip: string = "triplist";
  settings = {

    // actions: false,
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },

    pager: {
      display: true,
      perPage: 10,
    },

    columns: {

      triptype: {
        title: 'Trip Type',
      },
      date: {
        title: 'Trip Date',
      },
      review:
      {
        title: 'Cancel Reason',
      },
      dvr: {
        title: 'Driver',
      },
      code: {
        title: 'Code',
        valuePrepareFunction: (cell, row) => {
          if (row.code == undefined) return 'NA'
          return row.code;
        }
      },
      tripno: {
        title: 'Trip No',
      },
      dsp: {
        title: 'Address',
        valuePrepareFunction: (dsp) => {
          return dsp[0].from + " -> " + dsp[0].to;
        }
      },

    },
  };

  source: ServerDataSource;

  constructor(_http:HttpClient ,http: Http, private service: TableService, private location: Location, private CommonSvc: CommonService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'canceledTrips' });
  }

  tripdetailsId: string;

  route(event) {
    // console.log(event.data); 
    // console.log(event['data']._id); 
    this.tripdetailsId = event.data._id;
    this.trip = "";
    this.GetTripDetails(event.data._id);

  }

  ngOnInit(): void { }

  tripdetails: any[] = [];
  tripcspdetails: any[] = [];
  tripdspdetails: any[] = [];

  GetTripDetails(data: any): void {
    if (!data) { return; }
    this.CommonSvc.GetTripDetails(data)
      .then(msg => {
        this.tripdetails = msg[0];
        this.tripdspdetails = msg[0].dsp[0];
        this.tripcspdetails = msg[0].csp[0];
      })
  }

  deleteATripDetails(): void {
    this.CommonSvc.deleteATripDetails(this.tripdetailsId)
      .then(msg => {
        this.goBack();
      })
  }

  goBack(): void {
    this.trip = "triplist";
  }

  filterRes(fromDate, toDate) {
  }

}//Export