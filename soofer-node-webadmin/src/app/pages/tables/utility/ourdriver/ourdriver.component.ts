import { Component, ViewChild, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService, ButtonToasterService, UtilityService],
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

export class OurDriverComponent implements OnInit {
  title: string = 'Our Driver';
  initial: number = 0;
  baseurl = AppSettings.BASEURL;
  htmlBody: any;
  htmlHeader: any;
  language = LanguageSettings.defaultSelectedLang;
  defaultLang = LanguageSettings.defaultSelectedLang;
  htmlFooter: any;
  selectedDocs: any = {};
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
      name: {
        title: 'Driver',
      },
      image: {
        title: 'Profile',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (image: string) => `<img width="50px" src="${this.baseurl + image}" alt='icon' />`
      },
    },
  };

  source: ServerDataSource;
  filedata: any;
  list: any = {};
  showTransOption = LanguageSettings.showTranslateOption;

  constructor(http: HttpClient, private service: TableService,
    private toastr: ButtonToasterService, private utility: UtilityService, private location: Location, private CommonSvc: CommonService, private translate: TranslateService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    const lang = this.defaultLang
    translate.use(lang)

    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'ourDrivers' });
    this.getData(lang);
  }

  @ViewChild('dataForm1') form: any;

  route(event) {
    this.btBack(2);
    this.selectedDocs = event.data;
  }

  fileEvent(e) {
    // console.log(e.target.files[0]);
    this.filedata = e.target.files[0];
  }

  getLang(lang) {
    this.getData(lang)
  }

  getLangs(lang) {
    this.language = lang;
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.utility.getDriverLang(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  ngOnInit(): void { }

  AddDriver(inputs) {
    if (this.filedata !== undefined
      && this.filedata !== null && this.filedata !== '') {
      const formdata = new FormData();
      formdata.append('file', this.filedata);
      formdata.append('name', inputs.name);
      formdata.append('desc', inputs.desc);
      formdata.append('language', this.language);
      this.utility.addHomeDriver(formdata)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.form.reset();
          this.btBack(0);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    } else {
      this.toastr.showtoast('warn', 'Please Upload Image');
    }
  }

  EditDriver(inputs) {
    if (this.filedata === undefined
      || this.filedata === ''
      || this.filedata === null) {
      this.filedata = this.selectedDocs.image;
    }
    const formdata = new FormData();
    formdata.append('file', this.filedata);
    formdata.append('name', inputs.name);
    formdata.append('desc', inputs.desc);
    formdata.append('_id', inputs._id);
    this.utility.updateHomeDriver(formdata)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.btBack(0);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  deleteDriver(id) {
    this.utility.DeleteHomeDriver(id)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.initial = 0;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  btBack(num: number): void {
    this.initial = num;
    this.filedata = '';
    this.list = {};
  }

}
