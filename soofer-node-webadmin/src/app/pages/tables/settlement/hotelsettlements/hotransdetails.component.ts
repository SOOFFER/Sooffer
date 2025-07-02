 import { Component, ViewChild, ElementRef} from '@angular/core';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { HotelService } from '../../../hotel/hotel.service';
import { NbToastrService } from '@nebular/theme';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { RouterEvent, Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../../common/common.service';
import { AppSettings, inputValidation } from '../../../../app.config';
import { TableService } from '../../../tables/table.service';
import { featuresSettings } from '../../../../app.config';
import * as moment from 'moment';

interface commonDataList {
  value: string;
  label: string;
}
@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, HotelService, CommonService],
  templateUrl: './hotransdetails.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})
export class HoteltransdetailsComponent {
  initial: number = 1;
  list: any = {};
  selectedid: string;
  selectedDocs: any;
  showservicecity = featuresSettings.isServiceAvailable;
  selectedUser: string;
  dropdownList;

  defaultValue;
  changeingarr = [];
  defaultName;
  baseurl: string = AppSettings.BASEURL;


  dropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'label',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  validation = inputValidation;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="ion-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      child: {
        title: 'View Transaction Details',
        type: 'html',
        filter: false,
        sort: false,

          valuePrepareFunction: (cell, row) => {
            return `<a title="View Transaction Details" href="#/pages/tables/settlement/hottrxdetails;hotelId=${row._id};">
                    <i class="ion-clipboard"></i></a>`;
          }
      },
      fname: {
        title: 'First Name',
      },
      lname: {
        title: 'Last Name',
      },

      email: {
        title: 'Email',
      },
      phone: {
        title: 'Phone',
      },
      amount: {
        title: 'Balance to Pay',
      },
    },
  };
  public positions = [];
  @ViewChild('search')
  public searchElementRef: ElementRef;

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
  source: ServerDataSource;

  constructor(private http: HttpClient,
    private service: TableService,
    private CommonSvc: CommonService,
    private hotelservice: HotelService,
    private toastr: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'hotel' });


  }

  show_more_menu(): void{
console.log('Wow');
// this.initial=1;
  }
  ngOnInit(): void {



  }


  lessDate;
  updateMbal() {
    const body = new URLSearchParams();
    body.set('dateless', this.lessDate);
    this.CommonSvc.deactivateAllUsers(body)
      .then(msg => {
        this.toastr.success (msg.message);
      });
  }

  generateCode(): void {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.list.trxId = text;
  }
  route(event) {
    // console.log(event);
    this.initial = 2;
    this.SetDocsDetails(event.data);
    this.generateCode();
    this.CommonSvc.doAddFormControlNgSelectClass();
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
    this.initial = num;
    this.list = {};
    this.list.paymentDate = '';
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    // console.log(data);
    this.selectedid = data._id;
    this.list = data;
   // this.selectedUser = data.fname;



  }




  goBack(): void {
    this.initial = 1;
  }

  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
    console.log(  this.filedata);
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.warning( 'Please Enter Valid Amount');
    } else {
      const date = moment(inputs.paymentDate).format('YYYY-MM-DD');
      const sendPay = {
        balancetopay: this.list.amount,
        hotelId:  this.selectedid ,
        hotelName: inputs.fname,
        trxId: this.list.trxId,
        description: inputs.description,
        amt: inputs.amt,
        type: inputs.type,
        paymentDate: date,
        email: this.list.actMail,
        holdername: this.list.actHolder,
        acctNo: this.list.actNo,
        banklocation: this.list.actLoc,
        bankname: this.list.actBank,
        swiftCode: this.list.actCode,
      };
      console.log(sendPay);
      this.service.sendHotelSettlement(sendPay)
        .then(res => {
          this.toastr.success(res.message);
          this.btnClick(1);
        })
        .catch(res => {
          this.toastr.warning(res.error.message);
        });
    }
  }


}

