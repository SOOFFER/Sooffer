import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';

import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'ngx-test',
  providers: [TableService, CommonService],
  styleUrls: ['./style.scss'],
  templateUrl: './smart-table.component.html',

})

export class FaqCatComponent {
  title: string = "Faq Category";
  initial: any = 0; // 0 for list, 1 for add, 2 for edit
  selectedDocs: any;
  list: any = {};
  language: any;
  baseurl: string = AppSettings.BASEURL;
  showTransOption = LanguageSettings.showTranslateOption;
  helpCatId: string;
  selectedId: any;
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
      eStatus:
      {
        title: 'Status',
      },
      iDisplayOrder: {
        title: 'Order',
      },
      vTitle_EN: {
        title: 'EN',
      },
      // vTitle_FN:{
      //   title: 'FN',
      // },

    },
  };

  source: ServerDataSource;
  defaultLang = LanguageSettings.defaultSelectedLang;

  constructor(private http: HttpClient, private service: TableService, private location: Location, private CommonSvc: CommonService, private toastr: ButtonToasterService, private translate: TranslateService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);    
    const lang = this.defaultLang
    translate.use(lang)
    this.getData(lang);
    // this.pageLoader()
  }


  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang)
  }

  getLangs(lang) {
    console.log(lang, "lang");
    this.language = lang;
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.CommonSvc.getfaqCat(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }


  pageLoader() {
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'faqcategory' });
  }

  @ViewChild('dataForm2') form1: any;

  route(event) {
    this.initial = 2;
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedDocs = data;
    this.selectedId = data._id;
  }


  btnClick(): void {
    this.initial = 1;
    this.list = {};
    this.list.eStatus = 'on';
  }

  btBack(): void {
    this.initial = 0;
  }

  addFaqCategory(inputs: any): void {
    if (!inputs) { return; }
    inputs.language = this.language;
    this.CommonSvc.addFaqCat(inputs)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.form1.reset();
        this.initial = 0;
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  editFaqCategory(inputs: any): void {
    if (!inputs) { return; }
    this.CommonSvc.editFaqCat(inputs, this.selectedId)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = 0;
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  deleteFaqCategory(inputs: any): void {
    this.CommonSvc.deletefaqCat(inputs)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = 0;
        this.pageLoader()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

}
