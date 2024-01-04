import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';

import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService], 
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class TripvarianceComponent {
  title:string = "Trip Variance Report"; 
 
 settings = { 

    actions: false, 

    columns: {

      tripno:{
        title:'Booking No',
      },
      adsp:{
        title:'Address',
        valuePrepareFunction: (adsp) => {
          return adsp['from'] + "->" + adsp['to'];
        }
      },
      date:{
        title:'Trip Date',
      },
      dvr: {
        title: 'Driver',
      }, 
      code: {
        title: 'Driver Code',
        // valuePrepareFunction: (cell, row) => { return row.code[0] }
      }, 

      estTime: {
        title: 'Estimated Time',
      },

      acsp: {
        title: 'Actual Time',
        valuePrepareFunction: (acsp) => {
          return  acsp['time'] + ' mins';
        }
      },

      actual:{
        title:'Variance',
        valuePrepareFunction: (cell, row) => { 
          var estMin = row.estTime.split(" "); 
          return estMin[0] - row.acsp['time'] + ' mins';
        } 
      },
    },
  };
 
  source: ServerDataSource; 

  constructor(_http:HttpClient , http: Http, private service: TableService) {
    this.source = new ServerDataSource(_http, { endPoint:  AppSettings.API_ENDPOINT + 'tripTimeVariance' }); 
  }

  route(event) {   
    console.log(event.data._id); 
    console.log(event.data); 
    // this.SetDocsDetails(event.data);
  }
  
   filterRes(fromDate,toDate){ 
  }   

}
