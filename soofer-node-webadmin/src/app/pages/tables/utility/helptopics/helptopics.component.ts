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

export class HelpTopicsComponent {
  title: string = "Help Topics";
  trip: string = "Help Topics";
  initial: any = 0;
  selectedDocs: any;
  language = LanguageSettings.defaultSelectedLang;
  catary: any[] = [];
  category: any[] = [];
  showTransOption = LanguageSettings.showTranslateOption;
  list: any = {};
  selectedId: any;
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
      vTitle_EN: {
        title: 'Question',
      },
      iDisplayOrder: {
        title: 'Order',
      },
    },
  };

  source: ServerDataSource;
  defaultLang = LanguageSettings.defaultSelectedLang;

  constructor(http: HttpClient, private service: TableService, private toastr: ButtonToasterService, private location: Location, private CommonSvc: CommonService, private translate: TranslateService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    const lang = this.defaultLang
    translate.use(lang)
    this.getData(lang);
    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'help' });
    // New 
    //   this.CommonSvc.getHelp(this.language)
    //     .then(msg => this.catary = msg);
    this.CommonSvc.getHelp(this.language)
      .then(msg => this.catary = msg);

    this.CommonSvc.getHelpCat(this.language)
      .then(msg => this.category = msg);


  }

  @ViewChild('dataForm1') from1: any;

  deleteMyhelpTopic(id) {
    this.CommonSvc.deletefHelpTopic(id)
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
    this.CommonSvc.getHelp(this.language)
      .then(msg => this.catary = msg);
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.CommonSvc.getHelp(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }


  getTitle(event: any) {
    if (!event) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.ihelpcategorytitle = selectElementText;

    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.list.ihelpcategoryId = selectElementId;
  }

  getTitleED(event: any) {
    if (!event) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.selectedDocs.ihelpcategorytitle = selectElementText;

    let selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.selectedDocs.ihelpcategoryId = selectElementId;
  }

  tripdetailsId: string;

  route(event) {
    this.initial = 2;
    this.SetDocsDetails(event.data);
  }

  ngOnInit(): void { }


  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedDocs = data;
    this.selectedId = data._id
  }

  addHelp(inputs: any): void {
    if (!inputs) { return; }
    inputs.language = this.language;
    this.CommonSvc.addHelp(inputs)// JSON.stringify(
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        this.from1.reset();
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  editHelp(inputs: any): void {
    if (!inputs) { return; }
    this.CommonSvc.editHelp(inputs, this.selectedId)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.btBack()
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  goBack(): void {
    this.trip = "triplist";
  }

  btnClick(): void {
    // console.log('clicked');
    this.initial = 1;
    this.list = {};
  }

  btBack(): void {
    this.initial = 0;
  }

}//Export
