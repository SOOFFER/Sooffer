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

export class ReferralComponent {
  title:string = "Referral Report"; 
 
 settings = { 

    actions:false,

    columns: {
      'userinfo.fname': {
        title: 'Name',
        valuePrepareFunction: (cell, row) => { return row.userinfo.fname }
      }, 
      'userinfo.phone': {
        title: 'Phone',
        valuePrepareFunction: (cell, row) => { return row.userinfo.phone }
      },
      trx: {
        title: 'Total',
        valuePrepareFunction: (trx) =>  trx.length
      },

      'trx.sum': {
        title: 'Amount Earned',
        valuePrepareFunction: (cell, row) => { 

          var total = 0;
          for ( var i = 0, _len = row.trx.length; i < _len; i++ ) {
            total += row.trx[i]['amt']
          }
          return total;
          } 
      },
 
    },
  };
 
  source: ServerDataSource; 

  constructor(_http:HttpClient , http: Http, private service: TableService) {
    this.source = new ServerDataSource(_http, { endPoint:  AppSettings.API_ENDPOINT + 'referrer' }); 
  }

  route(event) {   
    console.log(event.data._id); 
    console.log(event.data); 
    // this.SetDocsDetails(event.data);
  }
  
   filterRes(fromDate,toDate){ 
  }   

}
