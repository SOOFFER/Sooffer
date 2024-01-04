import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { AppSettings, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { Service } from '../../rider/rider.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, ButtonToasterService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class DriverBankTranxComponent {
  initial: string = 'list';
  selectedid: string;
  selectedDocs: any;
  selectedDocsTrax: any;
  selectedtrxid: string;
  selecteddvrid: string;
  selectedpackid: string;
  list: any = {};
  driverName: string;
  packagetype: string;
  baseurl: string = AppSettings.BASEURL;
  navigationSubscription: any;

  apiMessage: string;
  showCity: boolean;
  ServiceCity: any;
  clearMsg(): void {
    this.apiMessage = '';
  }

  settings = {

    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    sort: true,
    pager: {
      display: true,
      perPage: 10,

    },

    columns: {
      'userinfo.fname': {
        title: 'Driver',
        valuePrepareFunction: (cell, row) => row.userinfo.fname
      },
      'userinfo.code': {
        title: 'Driver Code',
        valuePrepareFunction: (cell, row) => row.userinfo.code
      },
      'userinfo.phone': {
        title: 'Phone',
        valuePrepareFunction: (cell, row) => row.userinfo.phone
      },
      trx: {
        title: 'Pending Transactions',
        valuePrepareFunction: (trx) => {
          let pending = 0;
          trx.forEach(function (item) {
            item.isVerified == false ? pending++ : '';
          });
          return pending;
        }
      },
    },
  };

  source: ServerDataSource;
  amt: any;
  constructor(private _http: HttpClient, http: Http, private router: Router, private service: TableService, private CommonSvc: CommonService, private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driverBankTransactions' });

    if(featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin' ) 
    this.showCity = true;
    else
    this.showCity = false; 
    this.service.getServiceCity()
    .then(res=>{
      this.ServiceCity =res;
    })

    // this.CommonSvc.minimumBalance()
    //   .then(msg => {
    //     this.amt = msg.balance;
    // })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });
  }

  ngOnInit(): void {
  }

  FilterRes(data) {
    if(data == 'all')
   this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverBankTransactions' });
   else 
   this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverBankTransactions?scity_like='+data });


 }

  // updateMbal(){
  //   let body = new URLSearchParams();
  //   body.set('balance', this.amt);
  //   this.CommonSvc.updateminimumBalance(body)
  //     .then(msg => {
  //       this.toastr.showtoast("success", msg.message);
  //     })
  // }

  route(event) {
    this.initial = '';
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.selectedDocsTrax = data.trx;
    this.selectedtrxid = data.trx._id;
    this.driverName = data.userinfo.fname;
    this.selecteddvrid = data.dvrid;

  }

  approveDriverTranx(Tranx: any): void {
    if (window.confirm('Comfirm to Add Amount to Driver Wallet ?')) {
      const formdata = {
        trxId: Tranx._id,
        driverBankTransId: this.selectedDocs
      };
      this.CommonSvc.approveDriverTranxDetails(formdata)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.selectedDocsTrax = msg.drivertaxis.trx;
        })
    }
  }
  routetoCredit(data): void {
    console.log(data);
    this.router.navigate([
      'pages/tables/package/drivercredits',
      { dvrid: this.selecteddvrid, driverName: this.driverName, packageId: data.packageId, type: data.type, trxid: data._id }
    ]);
  }
  goBack(): void {
    this.initial = 'list';
  }



}
