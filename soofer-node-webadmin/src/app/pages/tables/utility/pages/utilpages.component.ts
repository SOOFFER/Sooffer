import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
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

export class UtilPagesComponent {
  title: string = "Pages";
  initial: number = 0;
  currentLanguage: any;
  showTransOption = LanguageSettings.showTranslateOption;

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


      title: {
        title: 'Page Title',
      },
      section: {
        title: 'Section',
      },

    },
  };
  list: any = {};
  source: ServerDataSource;
  lang: any;
  defaultLang = LanguageSettings.defaultSelectedLang;


  constructor(_http: HttpClient, http: Http, private service: TableService, private translate: TranslateService,
    private toastr: ButtonToasterService, private location: Location, private CommonSvc: CommonService, private uservie: UtilityService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    const lang = this.defaultLang
    translate.use(lang)

    this.getData(lang);
    // var getlanguage = localStorage.getItem("language");
    // console.log(getlanguage, "getlanguage")

    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'pages/' + browserLang });
  }

  tripdetailsId: string;
  config: any;
  dest: any;

  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang);
    localStorage.setItem("language", lang);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'pages/' + lang });
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.uservie.getPagesLang(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }


  route(event) {
    this.initial = 1;
    this.list = event.data;
    // console.log(event['data']._id);
    // this.tripdetailsId = event.data._id;
    // this.trip = "";
    // this.GetTripDetails(event.data._id);
    this.dest = setTimeout(() => {
      this.config = {
        height: 500,
        theme: 'modern',
        plugins: 'code',
        toolbar: 'code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      };
    }, 0);
  }

  ngOnInit(): void { }

  tripdetails: any[] = [];
  tripcspdetails: any[] = [];
  tripdspdetails: any[] = [];


  updateMyPage(inputs): void {
    this.uservie.updateMyPage(inputs)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  btBack(): void {
    this.initial = 0;
  }

  filterRes(fromDate, toDate) {
  }

  ngOnDestroy() {
    clearTimeout(this.dest);
  }


}//Export
