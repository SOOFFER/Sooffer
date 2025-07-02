import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { ReportService } from '../../../common/report.service'; 

import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';  

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService,ReportService], 
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class CompanyPaymentComponent {
  title:string = "Company Payment"; 
 
 settings = { 
    // selectMode: 'multi',  
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }] 
    },

    columns: {

      dvrfname: {
        title: 'Company',
      },

      commision: {
        title: 'Total Trip Commission',
      },

      inhand: {
        title: 'Total Trip Amount Paid to Company',
      },
 
      digital: {
        title: 'Total Digital Amount Pay to Company',
      }, 

      toSettle: {
        title: 'Final Amount to Settle',
      }, 
  
    },
  };
 
  source: ServerDataSource; 

  constructor(private _http:HttpClient , private http: Http, private service: TableService, private toastr:ButtonToasterService,private RepSvc: ReportService) {
    this.loadTable();
  }

  loadTable(){
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'companyPayReport/no' });  
  }

  apiMessage:string;
  clearMsg():void{ 
    this.apiMessage = "";
  }

  route(event) {   
    if (window.confirm('Are you sure you want to Pay To Company(s)?')) { 
      let body = new URLSearchParams();
      body.set('companyId', event.data._id);
      body.set('amount', event.data.toSettle); 
      console.log(body);

      this.RepSvc.markSettledCompanyPayment(body)
       .then(res => { 
         this.toastr.showtoast("success", res.message); 
        this.loadTable(); 
       }) 
    }
  } 

  // selected: any;
  // onUserRowSelect(event) {
  //   console.log('user row select: ', event); 
  //   this.selected = event.selected;
  // }
 
  // applyBulkAction() {
  //   if (window.confirm('Are you sure you want to Pay To Company(s)?')) {
  //     //  this.RepSvc.markSettledDvrPayment(this.selected)
  //     //  .then(res => {
  //     // //this.toastr.showtoast("success",res.message);

  //     //     this.loadTable(); 
  //     //  }) 
  //     console.log(this.selected);
  //   }
  // }
  
 
}
