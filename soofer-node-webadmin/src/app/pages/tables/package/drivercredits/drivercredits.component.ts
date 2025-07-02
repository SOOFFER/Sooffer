import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { PackageService } from '../../package/package.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { TableService } from '../../table.service';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';
import { DriverService } from '../../../driver/driver.service';
import { Router } from '@angular/router';

interface commonDataList {
  value: string;
  label: string;
}

@Component({
  selector: 'ngx-drivercredits',
  providers: [PackageService, DriverService],
  templateUrl: './drivercredits.component.html',
  styleUrls: ['./drivercredits.component.scss']
})
export class DrivercreditsComponent implements OnInit {

  initial: number = 0;
  currentIndex: any = 0;
  list: any = {};
  apiMessage: string;
  submitdoc: boolean = false;
  baseurl: string = AppSettings.BASEURL;
  driverAry: any[] = [];
  packAry: any[] = [];
  subAry: any[] = [];
  comAry: any[] = [];
  driverDoc: any = {};
  navigationSubscription: any;
  packageType: any[] = featuresSettings.payPackageTypes;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }],
      history: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },

    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },

    columns: {
      child: //or something
      {
        title: 'Driver History',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="Histroy of Driver"  href="#/pages/tables/driverhistory;dvrid=${row._id}" >
                  <i class="ion-clipboard"></i></a>`;
        },
      },
      fname: {
        title: 'Driver',
      },
      code: {
        title: 'Code',
      },
      // referenceCode:{
      //   title:'Reference Code'
      // },
      phone: {
        title: 'Phone',
      },
      wallet: {
        title: 'Balance Credit',
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (status) => {
          //console.log(status.docs)
          return status[0].docs;
        }
      },
    },
  };
  serviceCityArray: any = [];

  itemdata = [];
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  showCity: boolean;
  source: ServerDataSource;
  valueEntered: boolean = false;
  codeOfDriver: string;
  vehicleList: any = [];

  visibleDateOptions: DatepickerOptions = {
    minYear: new Date().getFullYear(),
    maxYear: 2101,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to Select a Date',
    placeholder: 'Click to Select a Date',
    addClass: 'form-control',
    fieldId: 'my-date-picker',
    useEmptyBarTitle: false
  };

  manuallyAddCreditList: any;
  noFilterThreshold = 3;
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

  constructor(private _http: HttpClient, private routeT: ActivatedRoute, private router: Router,
    private toastr: ButtonToasterService, private dvrservice: DriverService,
    private Service: TableService, private packService: PackageService) {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    //console.log(this.source)
    this.manuallyAddCreditList = {};
    this.list = {};
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;

    this.Service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });

    this.startApi();

    this.routeT.params.subscribe(params => {
      if (params['dvrid'] && params['driverName'] && params['packageId'] && params['type']) {
        this.list.driverId = params['dvrid'];
        this.list.driverName = params['driverName'];
        this.list.packageId = params['packageId'];
        console.log(this.list.packageId);
        this.submitdoc = true;
        this.list.type = params['type'];
        console.log(this.list.type);
        this.list.trxid = params['trxid'];
        this.initial = 1;
        this.valueEntered = true;
        this.packService.GetSelectedPack(this.list.packageId)
          .then(msg => {
            this.list.type = msg.type;
          });
      }
    });

    this.routeT.params.subscribe(el => {
      if (el['dvrid'] && el['code']) {
        this.list.driverId = el['dvrid'];
        this.codeOfDriver = el['code'];
        this.valueEntered = true;
        this.initial = 1;
      }
    });
    if (featuresSettings.referenceCode === true) {
      this.settings.columns['referenceCode'] = {
        title: 'Reference Code'
      };
    }
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });
  }

  generateCode(): void {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.manuallyAddCreditList.trxId = text;
  }

  @ViewChild('dataForm1') form1: any;
  SerachDriverForCity(data): void {
    console.log(data.servicecity);
    if (data.servicecity === 'all') {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    } else
      this.dvrservice.getDriversListForService(data)
        .then(msg => {
          this.source = msg;
        });
  }
  // routeClick(){
  //   // this.routeR.navigateByUrl('pages/drivertaxi/add');
  // }
  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  route(event) {
    // console.log(event)
    this.list = event.data;
    //  console.log(this.list)
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
    this.list.driverId = this.list._id;
    this.initial = 1;
    this.codeOfDriver = this.list.code;
    //  console.log(this.codeOfDriver)
  }

  btnClick(num: number) {
    // console.log(num);
    if (num === 2) {
      this.list = {};
      // this.list.startDate = Date.now();
      this.codeOfDriver = undefined;
      this.valueEntered = false;
    }
    this.initial = num;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    // this.router.navigate(['/pages/tables/package/drivercredits']);
    this.manuallyAddCreditList = {};
    this.manuallyAddCreditList.type = 'credit';
    this.generateCode();
    this.startApi();
  }

  changePackage(e) {
    console.log(this.list);

    const label = e.target.value;
    if (label === 'subscription') {
      this.Service.getDrivertaxi(this.list.driverId)
        .then(msg => {
          this.vehicleList = msg;

        });
    } else {
      this.Service.commonfunctionforAll('getComPackage')
        .then(msg => {
          this.comAry = msg;
        });
    }
  }

  ngOnInit(): void {
  }

  startApi() {
    this.Service.commonfunctionforAll('getDrivers')
      .then(msg => {
        this.driverAry = msg;
        //console.log(msg)
      });

    // this.Service.commonfunctionforAll('getpayPackage')
    //   .then(msg => {
    //     this.packAry = msg;
    //     // console.log(msg)
    //   });



  }

  getSubPakageDetail(data): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    this.list.packageName = selectElementText;
  }

  getComPakageDetail(data): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    this.list.packageName = selectElementText;
  }

  // getPakageDetail(data): void {
  //   if (!data) { return; }
  //   const selectElementText = event.target['options']
  //   [event.target['options'].selectedIndex].text;
  //   // console.log(selectElementText);
  //   this.list.packageName = selectElementText;
  // }

  getDriverDetail(data): void {
    if (!data) { return; }
    // const selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    // this.list.driverName = selectElementText;
    const name = data.target.value;
    for (const item of this.driverAry) {
      if (item.id === name) {
        this.list.driverName = item.name;
      }
    }
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) { return; }
    // console.log(inputs);
    this.Service.activatePackToDriver(inputs)
      .then(msg => {
        this.apiMessage = msg.message;
        this.toastr.showtoast('success', this.apiMessage);
        this.btnClick(0);
      })
      .catch(msg => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast('error', this.apiMessage);
      });
  }

  selectedDriver(e) {
    const name = e.target.value;
    for (const item of this.driverAry) {
      if (item.id === name) {
        this.manuallyAddCreditList.driverName = item.name;
      }
    }
  }

  Getverified(inputs: any): void {
    if (!inputs) { return; }
    console.log(this.submitdoc);
    let editObj = {};
    if (inputs.type === "topup") {
      editObj = {
        packageId: inputs.packageId,
        driverId: inputs.driverId,
        type: inputs.type,
        startDate: moment(inputs.startDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      };
    } else {
      editObj = {
        packageId: inputs.packageId,
        driverId: inputs.driverId,
        type: inputs.type,
        vehicletype: inputs.vehicleId,
        startDate: moment(inputs.startDate, "YYYY-MM-DDTHH:mm:ss").format(
          "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        ),
        purchaseDate: moment(inputs.purchaseDate, "YYYY-MM-DDTHH:mm:ss").format(
          "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        ),
      };
    }

    // console.log(editObj);
    if (this.submitdoc === true) {
      this.Service.approveTransVerified(editObj, this.list.trxid)
        .then(msg => {
          this.apiMessage = msg.message;
          if (msg.success === true) {
            this.Service.activatePackToDriver(editObj)
              .then(msg => {
                this.apiMessage = msg.message;
                this.toastr.showtoast('success', this.apiMessage);
                this.btnClick(0);
              })
              .catch(msg => {
                this.apiMessage = msg.message; // handle unknow err
                this.toastr.showtoast('error', this.apiMessage);
              });
          }
          this.toastr.showtoast('success', this.apiMessage);
          this.router.navigate(['pages/tables/bankTransaction']);
        })
        .catch(msg => {
          this.apiMessage = msg.message; // handle unknow err
          this.toastr.showtoast('error', this.apiMessage);

        });
    } else {
      this.Service.activatePackToDriver(editObj)
        .then(msg => {
          this.apiMessage = msg.message;
          this.toastr.showtoast('success', this.apiMessage);
          this.btnClick(0);
        })
        .catch(msg => {
          this.apiMessage = msg.message; // handle unknow err
          this.toastr.showtoast('error', this.apiMessage);
        });
    }
  }

  getPackages(data) {
    this.list.packageId = '';
    if (this.list.type === "subscription") {
      this.Service.commonfunctionforAll(
        "getSubPackage/" + this.list.vehicleId
      ).then((msg) => {
        this.subAry = msg;
      });
    } else {
      this.Service.commonfunctionforAll("getComPackage").then((msg) => {
        this.comAry = msg;
      });
    }
  }


  lesserThanZero(e) {
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.manuallyAddCreditList[ObjectName] = value;
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.showtoast('warn', 'Please Enter Valid Amount');
    } else {
      const date = moment(inputs.paymentDate).format('YYYY-MM-DD');
      const sendPay = {
        driverId: inputs.driverId,
        driverName: inputs.driverName,
        trxId: this.manuallyAddCreditList.trxId,
        description: inputs.description,
        amt: inputs.amt,
        type: inputs.type,
        paymentDate: date,
      };
      this.packService.sendDriverSettlement(sendPay)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.btnClick(0);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.error.message);
        });
    }
  }

  history(data) {
    //console.log(data)
  }


}
