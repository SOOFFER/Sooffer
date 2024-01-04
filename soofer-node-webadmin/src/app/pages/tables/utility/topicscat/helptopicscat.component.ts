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

export class HelpTopicsCatComponent {
  title: string = "Help Topics";
  initial: any = 0; // 0 for list, 1 for add, 2 for edit
  selectedDocs: any;
  list: any = {};
  baseurl: string = AppSettings.BASEURL;
  showTransOption = LanguageSettings.showTranslateOption;
  helpCatId: string;
  selectedId: string;
  language = LanguageSettings.defaultSelectedLang;
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

  pageLoader() {
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'helpcategory' });
  }

  @ViewChild('dataForm1') form1: any;

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
    this.CommonSvc.getHelpCat(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }


  btBack(): void {
    this.initial = 0;
  }

  addHelpCategory(inputs: any): void {
    if (!inputs) { return; }
    inputs.language = this.language;
    this.CommonSvc.addHelpCat(inputs)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.form1.reset();
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  editHelpCategory(inputs: any): void {
    if (!inputs) { return; }
    this.CommonSvc.editHelpCat(inputs, this.selectedId)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  deleteHelpCategory(inputs: any): void {
    this.CommonSvc.deleteHelpCat(inputs)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = 0;
        this.pageLoader();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

}
