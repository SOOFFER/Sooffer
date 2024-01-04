import { Component, OnInit } from '@angular/core';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { CommonService } from '../../../common/common.service';
import { TableService } from '../../table.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';

interface commonDataList {
  value: string;
  label: string;
}

@Component({
  selector: 'ngx-ridersettlements',
  providers: [DatePipe],
  templateUrl: './ridersettlements.component.html',
  styleUrls: ['./ridersettlements.component.scss']
})
export class RidersettlementsComponent implements OnInit {

  showCity: boolean;
  currentIndex: any = 0;
  serviceCityArray: any = [];
  navigationSubscription: any;

  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      columnTitle: 'View Transaction Details',
      class: 'action-column',
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      child: {
        title: 'Add Payment',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          const drname = row.fname;
          return `<a title="Add Payment" href="#/pages/tables/settlement/ridersettlements;riderId=${row.riderId};riderName=${drname};walletAmt=${row.bal}">
                  <i class="ion-clipboard"></i></a>`;
        }
      },
      fname: {
        title: 'Customer Name',
      },
      phone: {
        title: 'Phone',
      },
      bal: {
        title: 'Wallet'
      }
    },
  };
  Doc: any = {};
  source: ServerDataSource;
  pageNo: number = 0;
  list: any = {};
  payment: Array<commonDataList> = [
    {
      label: 'Debit',
      value: 'debit'
    },
    {
      label: 'Credit',
      value: 'credit'
    }
  ];
  // new Date().getFullYear()
  visibleDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2101,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    barTitleIfEmpty: 'Click to Select a Date',
    placeholder: 'Click to Select a Date',
    addClass: 'form-control',
    useEmptyBarTitle: false
  };

  constructor(private http: HttpClient,
    private commonservice: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private actRoute: ActivatedRoute,
    private tableservice: TableService,
    private toastr: ButtonToasterService) {
    this.list = {};
    this.list.paymentDate = '';

    this.actRoute.params.subscribe(params => {
      if (params['riderId']) {
        this.list.riderId = params['riderId'];
        this.list.riderName = params['riderName'];
        this.list.wallet = params['walletAmt'] ? params['walletAmt'] : 'N/A';
        this.dispPayment();
      }
    });

    this.tableservice.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet' });
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.pageNo = 0;
      }
    });
  }

  SerachDriverForCity(data): void {
    if (data.servicecity === 'undefined' || data.servicecity === 'all')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet?scity_like=' + data.servicecity });
  }

  trxSource: LocalDataSource;

  ngOnInit() {
  }

  trxSettings = {
    actions: false,
    columns: {
      trxid: {
        title: 'Transaction ID',
      },
      type: {
        title: 'Type',
      },
      amt: {
        title: 'Amount',
      },
      date: {
        title: 'Date',
        valuePrepareFunction: (date) => {
          if (date !== 'Invalid date') {
            const dt = this.datePipe.transform(date, 'MMMM d, y');
            return dt;
          } else return 'N/A';
        }
      }
    },
  };

  title1 = 'Rider Transaction Details';

  route(event) {
    this.trxSource = new LocalDataSource();
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
    this.selectedDocs(event.data);
  }

  selectedDocs(data) {
    this.pageNo = 2;
    this.trxSource.load(data.trx);
  }

  dispPayment() {
    // console.log(this.list);
    this.commonservice.doAddFormControlNgSelectClass();
    this.list.type = 'credit';
    this.generateCode();
    this.pageNo = 1;
  }

  generateCode(): void {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.list.trxId = text;
  }

  lesserThanZero(e) {
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.list[ObjectName] = value;
  }

  btnClick(num: number) {
    this.pageNo = num;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    console.log(this.currentIndex);
    this.list = {};
    this.list.paymentDate = '';
    // this.router.navigate(['/pages/tables/settlement/ridersettlements']);
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.showtoast('warn', 'Please Enter Valid Amount');
    } else {
      const date = moment(inputs.paymentDate).format('YYYY-MM-DD');
      const sendPay = {
        riderId: this.list.riderId,
        trxId: this.list.trxId,
        description: inputs.description,
        amt: inputs.amt,
        type: inputs.type,
        paymentDate: date,
      };
      this.tableservice.sendRiderSettlement(sendPay)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.btnClick(0);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    }
  }

}
