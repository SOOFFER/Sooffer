import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';

import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';

import { Router } from '@angular/router';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  },
  .invoice{
    padding-top: 45px !important;
  }
  `],
})

export class FaqComponent {
  title: string = "FAQ";
  faqId: string;
  initial: any = 0; // 0 for list, 1 for add, 2 for edit
  selectedDocs: any;
  list: any = {};
  language = LanguageSettings.defaultSelectedLang;
  baseurl: string = AppSettings.BASEURL;
  showTransOption = LanguageSettings.showTranslateOption;
  catary: any[] = [];
  selectedId: any;
  orderItems = [{ key: 1, value: 1 },
  { key: 2, value: 2 },
  { key: 3, value: 3 },
  { key: 4, value: 4 },
  { key: 5, value: 5 },
  { key: 6, value: 6 },
  { key: 7, value: 7 },
  { key: 8, value: 8 },
  { key: 9, value: 9 },
  { key: 10, value: 10 },

  ]

  settings = {

    // actions: false,
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
      iDisplayOrder: {
        title: 'Display Order',
      },
      ifaqcategorytitle: {
        title: 'Faq Title',
      },
      vTitle_EN: {
        title: 'Title',
      },

    },
  };

  source: ServerDataSource;
  defaultLang = LanguageSettings.defaultSelectedLang;


  constructor(
    private http: HttpClient, private router: Router,
    private service: TableService,
    private toastr: ButtonToasterService, private location: Location,
    private CommonSvc: CommonService, private translate: TranslateService) {
    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'faq' });
    // this.CommonSvc.
    this.CommonSvc.getfaqCat(this.language)
      .then(msg => this.catary = msg);
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    const lang = this.defaultLang
    translate.use(lang)

    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'ourDrivers' });
    this.getData(lang);
  }
  @ViewChild('dataForm1') from1: any;

  deleteMyFaq(id) {
    this.CommonSvc.deletefaq(id)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = 0;
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }


  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang)
  }

  getLangs(lang) {
    console.log(lang, "lang");
    this.language = lang;
    this.CommonSvc.getfaqCat(this.language)
      .then(msg => this.catary = msg);
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.CommonSvc.getfaqLang(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  getTitle(event: any): void {
    console.log('event', event);

    if (!event) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.ifaqcategorytitle = selectElementText;

    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.list.ifaqcategoryId = selectElementId;

  }

  selectedOrder(event: any) {
    console.log('event', event);
    this.list.iDisplayOrder = event.target.value;
    console.log('list : \n', this.list);

  }

  selectedCategory(event: any) {
    console.log('event', event);
    this.list.ifaqcategoryId = event.target.value;

  }

  getTitleED(event: any) {
    if (!event) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.selectedDocs.ifaqcategorytitle = selectElementText;

    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.selectedDocs.ifaqcategoryId = selectElementId;
    //console.log(this.selectedDocs.ifaqcategoryId)
  }

  route(event) {
    this.initial = 2;
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedDocs = data;
    this.selectedId = data._id
  }

  btnClick(): void {
    this.initial = 1;
    this.list = {};
  }

  btBack(): void {
    this.initial = 0;
  }

  addFaq(inputs: any): void {

    console.log('inputs : \n ', inputs);

    if (!inputs) { return; }
    inputs.language = this.language;

    this.CommonSvc.addFaq(inputs)// JSON.stringify(
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        // this.from1.reset();
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  editFaq(inputs: any): void {
    if (!inputs) { return; }
    this.CommonSvc.editFaq(inputs, this.selectedId)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }


}
