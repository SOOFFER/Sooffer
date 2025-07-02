import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings, dropdown, featuresSettings } from '../../../../../app.config';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';
import { OfferService } from '../../offer.service';
import { Http } from '@angular/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../common/common.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';

import { Router,NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Angular2Csv } from 'angular2-csv';
import { TableService } from '../../../table.service';

interface citiesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}
interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'viewcurrentoffers',
  providers: [OfferService, CommonService, DatePipe, TableService],
  templateUrl: './viewcurrentoffers.component.html',
})

export class ViewcurrentoffersComponent implements OnInit {
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};
  initial: number = 0;
  list: any = {};
  baseurl = AppSettings.BASEURL;
  notValidEdate: boolean = false;
  spinner: boolean = true;
  filedata: any;
  ncityadmin = [];
  editadmin = [];
  selectedDocs: any;
  filtercity: any;
  navigationSubscription: any;
  selectedScID: any;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  dropdownList = [];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['City', 'Title', 'Offer Visible Date', 'Offer End Date'],
    showTitle: true,
    title: 'Current Offers Report',
    useBom: true,
    removeNewLines: false,
    keys: ['cityName', 'title', 'vdate', 'edate'],

  };
  reportname = 'Current Offers Details' + Date();
  cities: Array<commonDataList>;
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
          return moment.utc(moment(row.vdate)).format('DD-MM-YYYY');
        }
      },
      edate: {
        title: 'Offer End Date',
        valuePrepareFunction: (cell, row) => {
          return moment.utc(moment(row.edate)).format('DD-MM-YYYY');
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

  constructor(public http: HttpClient,
    private offerservice: OfferService,
    private service: TableService,
    private CommonSvc: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'offers' });
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
      console.log(this.baseurl)
    // this.commonservice.generalfunFor('AvailbleserviceCity')
    // .then(res => {
    //   this.filtercity = res;
    //   this.filtercity.forEach(el => {
    //     let gettingval = {"scId":el.value , "name":el.label }
    //       this.editadmin.push(gettingval);
    //       this.ncityadmin.push(el)
    //   })
    // })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });

  }
  SerachForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity == 'undefined')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'offers' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'offers?scIds.name_like=' + data.servicecity });

  }
  ExportAsCSV() {
    this.http.get(AppSettings.API_ENDPOINT + 'offers?_page=1&_limit=1000')
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
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        this.cities = res;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
      });
    this.filedata = '';
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
    this.SetDocsDetails(event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.list = event.data;
    this.list.scIds = event.data.scIds;
    this.list.cityId = event.data.cityId;
    this.list.cityName = event.data.cityName;
    this.list.vdate = this.convertDateToTimeZone(event.data.vdate);
    this.list.edate = this.convertDateToTimeZone(event.data.edate);
    this.initial = 1;
  }

  SetDocsDetails(data: any): void {
    this.selectedScID = data.scIds;
    this.selectedDocs = data;
    this.selectedDocs.vdate = moment.utc(moment(data.vdate)).format('YYYY-MM-DD');
    this.selectedDocs.edate = moment.utc(moment(data.edate)).format('YYYY-MM-DD');
    this.selectedDocs.loc = data.scIds;
    if(localStorage.getItem('userType') == 'citywiseadmin'){
      this.list.scIds = this.CommonSvc.dataforscids(this.serviceCityArray)
    }
  }
  deleteRecord() {
    this.service.DeleteCurrentOffers(this.list._id)
    .then(res=>{
      this.toastr.showtoast('success',res.message)
    })
    .catch(res=>{
      this.toastr.showtoast('error',res.message)
    })
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

  updateOffer(inputs: any): void {
    if (!inputs) { return; }
    if (inputs.scIds.length <= 0 && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      }
      inputs.oldScIds = this.selectedScID;
      this.spinner = false;
      this.notValidEdate = false;
      this.list.vdate = moment(inputs.vdate).format('YYYY-MM-DD');
      this.list.edate = moment(inputs.edate).format('YYYY-MM-DD');
      if (this.checkDate(this.list.vdate, this.list.edate)) {
        const formdata = new FormData();
        formdata.append('file', this.filedata);
        formdata.append('_id', this.list._id);
        formdata.append('oldScIds', JSON.stringify(inputs.oldScIds));
        formdata.append('scIds', JSON.stringify(inputs.scIds));
        formdata.append('title', this.list.title);
        formdata.append('edate', this.list.edate);
        formdata.append('vdate', this.list.vdate);
        formdata.append('desc', this.list.desc);
        this.offerservice.UpdateNewDoc(formdata)
          .then(msg => {
            this.spinner = true;
            const body = msg.json();
            this.toastr.showtoast('success', body.message);
            this.btnClick(0);
          })
          .catch(msg => {
            this.spinner = true;
            const body = msg.json();
            this.toastr.showtoast('error', body.message);
          });
      } else {
        this.notValidEdate = true;
        this.spinner = true;
        this.toastr.showtoast('warn', 'Enter Valid Offer End Date');
      }
    }
  }

}
