import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { OfferService } from '../offer.service';
import { AppSettings, dropdown, featuresSettings } from '../../../../app.config';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Http } from '@angular/http';
import { ServerDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DatepickerOptions } from 'ng2-datepicker';
// import { Angular2Csv } from "angular2-csv";
import { HttpClient } from '@angular/common/http';
import { Angular2Csv } from 'angular2-csv';
import { TableService } from '../../table.service';
interface citiesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  providers: [OfferService, DatePipe, TableService, CommonService],
  selector: 'ngx-form-inputs',
  styleUrls: ['./expiry.component.scss'],
  templateUrl: './expiry.component.html',
})

export class ExpOffComponent {
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};
  navigationSubscription: any;
  initial: number = 0;
  list: any = {};
  baseurl: string = AppSettings.BASEURL;
  notValidEdate: boolean = false;
  spinner: boolean = true;
  filedata: any;
  dropdownSettings = dropdown.dropdownSettings;
  cities: Array<citiesDataList>;
  servicecity = featuresSettings.isServiceAvailable;
  selectedScID: any;
  visibleDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2051,
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

  endDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2051,
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

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['City', 'Title', 'Offer Visible To User Upto This Date', 'Offer End Date'],
    showTitle: true,
    title: 'Expired Offers Report',
    useBom: true,
    removeNewLines: false,
    keys: ['cityName', 'title', 'vdate', 'edate'],

  };
  reportname = 'Expired Offers Details' + Date();

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
      title: {
        title: 'Title',
      },
      vdate: {
        title: 'Offer Start Date',
        valuePrepareFunction: (cell, row) => {
          return this.datePipe.transform(row.vdate, 'dd-MM-y');
        }
      },
      edate: {
        title: 'Offer End Date',
        valuePrepareFunction: (cell, row) => {
          return this.datePipe.transform(row.edate, 'dd-MM-y');
        }
      },
      file: {
        title: 'Image',
        type: 'html',
        filter: false,
        valuePrepareFunction: (file: string) => `<img width="50px" src="${this.baseurl + file}" alt='icon' />`
      },
    },
  };

  source: ServerDataSource;

  constructor(
    private http: HttpClient,
    private offerservice: OfferService,
    private datePipe: DatePipe,
    private router: Router,
    private service: TableService,
    private commonservice: CommonService,
    private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'expireOffers' });
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initial = 0
        }
      });
  }
  SerachForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity == 'undefined' || data.servicecity == 'all')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'expireOffers' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'expireOffers?scIds.name_like=' + data.servicecity });

  }
  ExportAsCSV() {
    this.http.get(AppSettings.API_ENDPOINT + 'expireOffers?_page=1&_limit=1000')
      .toPromise()
      .then(res => {
        const data = res;
        this.export(data);
      })
      .catch(err => {
        this.toastr.showtoast('error', err.message);
      });
  }

  export(data) {
    new Angular2Csv(data, this.reportname, this.options);
  }

  ngOnInit(): void {
    this.commonservice.getServiceAvailableCity()
      .then(res => {
        this.cities = res;
        this.cities = this.commonservice.convertionOfServiceId(this.cities);
        this.cities = this.commonservice.dataforscids(this.cities);
      });
    //this.getCity()
    this.filedata = '';
  }

  getCity() {
    this.commonservice.getServiceAvailableCity()
      .then(response => {
        try {
          this.cities = response;
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  // CITIES

  selectedCity(option: citiesDataList) {
    this.list.cityName = option.label;
    this.list.cityId = option.value;
  }

  deSelectedCity(option: citiesDataList) {
    this.list.cityId = '';
    this.list.cityName = '';
  }

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  // DISABLE ERROR

  disableError(event) {
    this.notValidEdate = false;
  }

  route(event) {
    this.commonservice.doAddFormControlNgSelectClass();
    this.list = event.data;
    this.selectedScID = event.data.scIds;
    this.list.scIds = event.data.scIds;
    this.list.cityId = event.data.cityId;
    this.list.cityName = event.data.cityName;
    this.list.vdate = this.convertDateToTimeZone(event.data.vdate);
    this.list.edate = this.convertDateToTimeZone(event.data.edate);
    this.initial = 2;
  }

  convertDateToTimeZone(data) {
    const dateFormat = moment(data).format('YYYY-MM-DD HH:mm:ss');
    return new Date(dateFormat);
  }

  btnClick(num: number) {
    this.initial = num;
  }

  // CHECK DATE

  checkDate(from, to) {
    return moment(from).isSameOrBefore(to);
  }

  updateNewDoc(inputs: any): void {
    if (!inputs) { return; }
    if (inputs.scIds.length <= 0 && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      this.spinner = false;
      this.notValidEdate = false;
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      }
      inputs.oldScIds = this.selectedScID;
      this.list.vdate = moment(inputs.vdate).format('YYYY-MM-DD');
      this.list.edate = moment(inputs.edate).format('YYYY-MM-DD');
      if (this.checkDate(this.list.vdate, this.list.edate)) {
        const formdata = new FormData();
        formdata.append('file', this.filedata);
        formdata.append('_id', this.list._id);
        formdata.append('scIds', JSON.stringify(inputs.scIds));
        formdata.append('oldScIds', JSON.stringify(inputs.oldScIds));
        formdata.append('title', this.list.title);
        formdata.append('edate', this.list.edate);
        formdata.append('vdate', this.list.vdate);
        formdata.append('desc', this.list.desc);
        this.offerservice.UpdateNewDocEXP(formdata)
          .then(msg => {
            this.spinner = true;
            this.toastr.showtoast('success', msg.message);
            this.btnClick(0);
          })
          .catch(msg => {
            this.spinner = true;
            this.toastr.showtoast('error', msg.message);
          });
      } else {
        this.notValidEdate = true;
        this.spinner = true;
        this.toastr.showtoast('warn', 'Enter Valid Offer End Date');
      }
    }
  }

}
