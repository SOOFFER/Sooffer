import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { CommonService } from '../../../common/common.service';
import { TableService } from '../../table.service';
import * as moment from 'moment';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

interface commonDataList {
  value: string;
  label: string;
}

@Component({
  selector: "ngx-driversettlements",
  templateUrl: "./driversettlements.component.html",
})
export class DriversettlementsComponent implements OnInit {
  showCity: boolean;
  serviceCityArray: any = [];
  Via = AppSettings.via;
  navigationSubscription: any;
  isSHowPayout = AppSettings.isSHowPayout;
  paymnetlist: any = {};
  currentIndex: any = 0;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      columnTitle: "Add Payment",
      class: "action-column",
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      child: {
        title: "View Transaction Details",
        type: "html",
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          const drname = row.fname;
          return `<a title="View Transaction Details" href="#/pages/tables/settlement/drtransdetails;driverId=${row._id};driverName=${drname};walletAmt=${row.wallet}">
                  <i class="ion-clipboard"></i></a>`;
        },
      },
      idx: {
        title: "View Wallet Details",
        type: "html",
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          const drname = row.fname;
          return `<a title="View Wallet Details" href="#/pages/tables/settlement/driverwalletdetails;driverId=${row._id};driverName=${drname};walletAmt=${row.wallet}">
                  <i class="ion-cash"></i></a>`;
        },
      },
      fname: {
        title: "Driver Name",
      },
      code: {
        title: "Driver Code",
      },

      cityname: {
        title: "City",
      },
      phone: {
        title: "Phone",
      },
      wallet: {
        title: "Wallet",
      },
    },
  };
  Doc: any = {};
  source: ServerDataSource;
  pageNo: number = 0;
  list: any = {};
  payment: Array<commonDataList> = [
    {
      label: "Debit",
      value: "debit",
    },
    {
      label: "Credit",
      value: "credit",
    },
  ];
  // new Date().getFullYear()
  visibleDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2101,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0,
    //minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    useEmptyBarTitle: false,
  };

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private commonservice: CommonService,
    private tableservice: TableService,
    private toastr: ButtonToasterService
  ) {
    if (featuresSettings.referenceCode == true) {
      this.settings.columns["referenceCode"] = {
        title: "Reference Code",
      };
    }
    this.list = {};
    this.list.paymentDate = "";
    this.tableservice.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + "driver",
    });
    if (
      featuresSettings.isCityWise == true &&
      featuresSettings.isServiceAvailable == true &&
      localStorage.getItem("userType") == "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.pageNo = 0;
      }
    });
  }
  SerachDriverForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity == "undefined")
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "driver",
      });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint:
          AppSettings.API_ENDPOINT + "driver?scity_like=" + data.servicecity,
      });
  }
  ngOnInit() { }

  route(event) {
    this.btnClick(1);
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
    this.commonservice.doAddFormControlNgSelectClass();
    this.selectedDocs(event.data);
  }

  selectedDocs(data) {
    this.list = data;
    this.list.driverName = data.fname;
    this.list.driverId = data._id;
    this.list.type = "credit";
    this.list.wallet = data.wallet;
    this.paymnetlist.driverId = this.list.driverId;
    this.paymnetlist.addDataFrom = "admin";
    this.generateCode();
  }

  generateCode(): void {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
    this.list = {};
    this.list.paymentDate = "";
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.showtoast("warn", "Please Enter Valid Amount");
    } else {
      const date = moment(inputs.paymentDate).format("YYYY-MM-DD");
      const sendPay = {
        driverId: inputs.driverId,
        driverName: inputs.driverName,
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
      this.tableservice
        .sendDriverSettlement(sendPay)
        .then((res) => {
          this.toastr.showtoast("success", res.message);
          this.btnClick(0);
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.error.message);
        });
    }
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: "lg" });
  }

  submitted(d) {
    d("Cross click");
  }

  closed(d) {
    d("Cross click");
  }

  addFund() {
    console.log(this.paymnetlist);

    this.tableservice
      .payoutviarazorpay(this.paymnetlist)
      .then((msg) => {
        //console.log(msg);

        this.toastr.showtoast("success", msg.message);
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.message);
      });
  }
}
