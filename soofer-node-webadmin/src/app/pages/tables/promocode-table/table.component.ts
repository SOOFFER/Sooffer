import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { Http } from '@angular/http';
import { AppSettings, featuresSettings, dropdown } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { PromoService } from '../../promocode/promocode.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NgbTimeStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerOptions } from 'ng2-datepicker';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

interface commonArrayDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService, DatePipe],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class PromoCodeTableComponent implements OnInit {
  Doc: any = {};
  serviceCityArray: any = [];
  showCity: boolean;
  initial: string = 'list';
  selectedid: string;
  Promocode: any;
  seconds: true;
  list: any = {};
  TripType = [];
  navigationSubscription: any;


  baseurl: string = AppSettings.BASEURL;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  time1: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  filternames = [
    {
      name: 'Mon',
      checked: false
    },
    {
      name: 'Tue',
      checked: false
    },

    {
      name: 'Wed',
      checked: false
    },
    {
      name: 'Thu',
      checked: false
    },
    {
      name: 'Fri',
      checked: false
    },
    {
      name: 'Sat',
      checked: false
    },
    {
      name: 'Sun',
      checked: false
    },
  ];

  selectedDocs: any;
  dayList: any = [];

  visibleDateOptions: DatepickerOptions = {
    minYear: new Date().getFullYear(),
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

  dropdownSettings = dropdown.dropdownSettings;
  cities: Array<commonArrayDataList>;
  servicecity = featuresSettings.isServiceAvailable;
  selectedScID: any;

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      code: {
        title: 'Promo Code',
      },
      start: {
        title: 'Activation Date',
        valuePrepareFunction: (start) => {
          console.log("--------------->start",start)
          return moment.utc(moment(start)).format('DD MMMM, y');
        },
      },
      end: {
        title: 'Expiry Date',
        valuePrepareFunction: (end) => {
          return moment.utc(moment(end)).format('DD MMMM, y');
        },
      },
      startTime: {
        title: 'Start Time',
        valuePrepareFunction: (end) => {
          const d = this.convertToTime(end);
          return moment(d, 'H:m:s').format('hh:mm:ss a');
        }
      },
      endTime: {
        title: 'End  Time',
        valuePrepareFunction: (end) => {
          const d = this.convertToTime(end);
          return moment(d, 'H:m:s').format('hh:mm:ss a');
        }
      },
      noofuse: {
        title: 'Usage Limit',
      },
      amount: {
        title: "Discount Amount",
        valuePrepareFunction: (cell, row) => {
          if (row.amountType == "amount" || row.amountType == "flat") return row.amount;
          else return "-";
        }
      },
      percentage: {
        title: "Discount Percentage",
        valuePrepareFunction: (cell, row) => {
          if (row.amountType == "percentage") return row.percentage;
          else return "-";
        }
      }
    },
  };

  source: ServerDataSource;
  page: string;
  totalCount: any;
  data: any;
  TripDropDown: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  tripType: any = [];

  constructor(private _http: HttpClient,
    private service: TableService,
    config: NgbTimepickerConfig,
    private datePipe: DatePipe,
    private router: Router,
    private toastr: ButtonToasterService,
    private CommonSvc: CommonService,
    private promoservice: PromoService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'promocode' });
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });

    this.TripType = [
      { key: 'daily', value: "Daily" },
      { key: 'rental', value: 'Rental' },
      { key: 'outstation', value: 'Outstation' }
    ];
    this.TripDropDown = {
      singleSelection: false,
      idField: 'key',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });

  }

  convertToTime(data) {
    const hours = Math.floor(data / 3600);
    const minutes = Math.floor((data - (hours * 3600)) / 60);
    let seconds = data - (hours * 3600) - (minutes * 60);
    seconds = Math.round(seconds * 100) / 100;
    let result = (hours < 10 ? '0' + hours : hours);
    result += '-' + (minutes < 10 ? '0' + minutes : minutes);
    result += '-' + (seconds < 10 ? '0' + seconds : seconds);
    return hours + ':' + minutes + ':' + seconds;
  }

  ngOnInit(): void {
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        this.cities = res;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
      });
  }

  SerachForCity(data): void {
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === 'undefined')
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'promocode' });
    else
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'promocode?scIds.name_like=' + data.servicecity });
  }

  route(event) {
    this.initial = 'detail';
    this.SetDocsDetails(event.data);
  }

  RouteToTable() {
    this.initial = 'tableData';
    this.promoservice.TableDetails(this.selectedid)
      .then(res => {
        this.totalCount = res.noOfUserUsed
        this.data = res['data'];
        console.log(this.data)
        console.log(res.data)
      })
  }

  SetDocsDetails(data: any) {
    if (!data) { return; }
    this.seconds = true;
    // this.selectedDocs.tripType = data.tripType
    this.selectedid = data._id;
    this.selectedScID = data.scIds;
    this.Promocode = data.code;
    this.selectedDocs = data;
    this.selectedDocs.start = moment.utc(moment(data.start)).format('YYYY-MM-DD');
    this.selectedDocs.end = moment.utc(moment(data.end)).format('YYYY-MM-DD');
    console.log("striji99999999",this.selectedDocs.start)
    console.log("striji99999999",this.selectedDocs.end)

    this.selectedDocs.startTime = moment(this.convertToTime(data.startTime), 'H:m:s').format('YYYY-MM-DDTHH:mm:ss');
    this.selectedDocs.endTime = moment(this.convertToTime(data.endTime), 'H:m:s').format('YYYY-MM-DDTHH:mm:ss');
    const a = this.selectedDocs.days.split(/,/);
    this.dayList = a;
    console.log(a, "a");

    // var datas = await a.map(element => {
    //   for (const j of this.filternames) {
    //     if (element === j.name) {
    //       j.checked = true;
    //     }
    //   }
    // })

    // console.log(datas, "datas");


    for (let i = 0; i < a.length; i++) {
      for (const j of this.filternames) {
        console.log(a[i], "a[i]", j.name, "j.name");

        if (a[i] === j.name) {
          j.checked = true;
        }
      }
    }
    console.log(this.filternames, "filternames");

  }

  onItemSelect(data) {
    this.tripType.push(data.key)
    // console.log(this.tripType)
  }

  onItemDeSelect(data) {
    this.tripType.splice(this.tripType.indexOf(data.key), 1)
    // console.log(this.tripType)
  }

  onSelectAll(data) {
    this.tripType = [];
    for (let i = 0; i < data.length; i++) {
      this.tripType.push(data[i].key)
    }
    // console.log(this.tripType)
  }

  onDeSelectAll(data) {
    this.tripType = [];
    // console.log(this.tripType)
  }




  goBack(): void {
    this.initial = 'list';
  }

  change(e, type) {
    const index = this.dayList.indexOf(type);
    if (index === -1) {
      this.dayList.push(type);
    } else {
      this.dayList.splice(index, 1);
    }
  }

  updateRecord(inputs: any): void {
    // if (!inputs) { return; }
    // if (inputs.scIds.length <= 0 && this.servicecity === true) {
    //   this.toastr.showtoast('warn', 'Enter Service Available City');
    // } else {
    //   if (this.servicecity === false) {
    //     inputs.scIds = this.cities;
    //   }
    inputs.oldScIds = this.selectedScID;
    const index = this.dayList.indexOf('');
    if (index !== -1) {
      this.dayList.splice(index, 1);
    }
    inputs.days = this.dayList;
    inputs.status = true;
    inputs.start = this.datePipe.transform(inputs.start, 'MMM d, y');
    inputs.end = this.datePipe.transform(inputs.end, 'MMM d, y');
    const endTimeFormat = moment(inputs.endTime, 'YYYY-MM-DDTHH:mm:ss').format('H:m:s');
    const startTimeFormat = moment(inputs.startTime, 'YYYY-MM-DDTHH:mm:ss').format('H:m:s');
    const promoUpdate = {
      scIds: JSON.stringify(inputs.scIds),
      oldScIds: JSON.stringify(inputs.oldScIds),
      amount: inputs.amount,
      start: inputs.start,
      end: inputs.end,
      status: inputs.status,
      startTime: startTimeFormat,
      endTime: endTimeFormat,
      days: inputs.days,
      code: inputs.code,
      forFirst: inputs.forFirst,
      noofuse: inputs.noofuse,
      _id: inputs._id,
      tripType: this.tripType,
      percentage: inputs.percentage,
      amountType: inputs.amountType
    };
    this.promoservice.updatePromoCodeData(promoUpdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);

        this.filternames = [
          {
            name: 'Mon',
            checked: false
          },
          {
            name: 'Tue',
            checked: false
          },
          {
            name: 'Wed',
            checked: false
          },
          {
            name: 'Thu',
            checked: false
          },
          {
            name: 'Fri',
            checked: false
          },
          {
            name: 'Sat',
            checked: false
          },
          {
            name: 'Sun',
            checked: false
          },
        ];
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }



  deleteRecord(data: any): void {
    this.promoservice.deletePromoCodeData(data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }

}
