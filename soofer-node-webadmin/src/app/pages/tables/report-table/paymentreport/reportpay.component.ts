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

export class ReportPayComponent {
  title:string = "Payment Report"; 
 
 settings = { 

    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
    },

    columns: {
      triptyp:{
        title:'Trip Type',
      },
      rideno:{
        title:'Ride No',
      },
      driver: {
        title: 'Driver',
      },
      rider: {
        title: 'Rider',
      },
      createdAt: {
        title: 'Trip Date',
      },
     amttopay: {
        title: 'Total Fare',
      }, 
      
      commision: {
        title: 'Platform Fees',
      }, 

     promoamt: {
        title: 'Promo Code Discount',
      }, 

      walletdebit:{
        title:'D = Wallet Debit'
      },
      etip:{
        title:'E=Tip'
      },
      tripno: {
        title: 'Trip No',
      },
      tripoutamt:{
        title:'F=Trip Outstanding Amount'
      },
    
      amttodriver: {
        title: 'Driver pay Amount',
      }, 

      totalAmount2: {
        title: 'Ride Status',
        valuePrepareFunction: () =>  'Completed'
      }, 
       mtd: {
        title: 'Payment method',
      },
      todvr: {
        title: 'Driver Payment Status',
      }, 
    },
  };
 
  source: ServerDataSource; 

  constructor(_http:HttpClient , http: Http, private service: TableService) {
    this.source = new ServerDataSource(_http, { endPoint:  AppSettings.API_ENDPOINT + 'paymentReport' }); 
  }

  route(event) {   
    console.log(event.data._id); 
    console.log(event.data); 
    // this.SetDocsDetails(event.data);
  }

  filterRes(fromDate,toDate){ 
  }
   

}
