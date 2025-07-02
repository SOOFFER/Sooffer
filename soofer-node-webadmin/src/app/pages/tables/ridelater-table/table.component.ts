import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TableService } from './../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings } from '../../../app.config';
import { CommonService } from './../../common/common.service';
import { ButtonToasterService } from './../../buttontoaster/buttontoaster.service';
import { OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';

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

export class RideLaterComponent {
  trip: string = 'triplist';
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },

    columns: {

      'BookingNo': {
        title: 'Booking No',
        filter:false,

        valuePrepareFunction: (cell, row) => row.tripno
      },
      'triptype': {
        title: 'Trip Type',
      },
      rid: {
        title: 'Riders',
      },
      date: {
        title: 'Date',
        filter:false,

      },
      // dsp:{
      //   title:  'Expected Source Location',
      //   valuePrepareFunction: (dsp) => {
      //     return dsp[0].from
      //   }
      // }
      // dsp:{
      //   title:  'Expected Destination Location',
      //   valuePrepareFunction: (dsp) => {
      //     return dsp[0].to;
      //   }
      // },
      'adsp.from': {
        title: 'Pickup Location',
        filter:false,

        valuePrepareFunction: (cell, row) => row.dsp[0].from
      },
      'adsp.to': {
        title: 'Drop Location',
        filter:false,

        valuePrepareFunction: (cell, row) => row.dsp[0].to
      },
      dvr: {
        title: 'Driver',
        filter:false,

      },
      code: {
        title: 'Code',
        filter:false,

        valuePrepareFunction: (cell, row) => {
          if (row.code == undefined) return 'NA';
          return row.code;
        }
      },
      // tripno: {
      //   title: 'Click me',
      //   type: 'custom',
      //   renderComponent: ButtonViewComponent,
      // },
      'state': {
        title: 'Status',
        filter:false,

        valuePrepareFunction: (cell, row) => row.status
      },
    },
  };

  source: ServerDataSource;

  constructor(_http: HttpClient, http: Http, private service: TableService, private toastr: ButtonToasterService, private location: Location, private CommonSvc: CommonService, public router: Router, ) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'scheduletrips' });
  }
  route(event) {
    // this.trip = "";
    console.log(event.data._id);
    this.router.navigate(['/pages/taxidispatch/add', { tripid: event.data._id }]);

    console.log(event.data);
    // this.SetDocsDetails(event.data);
  }
  SetDocsDetails(data: any): void {
    if (!data) { return; }

    // this.selectedUser =  data.fname;
  }
}//Export of base class

@Component({
  selector: 'button-view',
  template: `
    <button (click)="onClick()">View</button>
  `,
})
export class ButtonViewComponent extends RideLaterComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  initial: string;

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    console.log(this.rowData._id);
    console.log('test');
    //this.router.navigate(['auth/logout']);

  }
}
