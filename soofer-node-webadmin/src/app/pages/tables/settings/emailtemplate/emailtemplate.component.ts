import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';

import { TableService } from '../../table.service';
import { AdminService } from '../../../admin/admin.service';

import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, AdminService],
  templateUrl: './emailtemplate.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  .mce-content-body table {
    width: 95%;
  }
  `],
})
export class EditTemplateComponent {
  initial: string = "list";
  selectedEsubject: string;
  selectedEbody: any;
  selectedDocs: any = {};
  selectedid: any;
  // selectedUser:string;
  list: any = {};
  list2: boolean = true;
  selectedTaxi: any;
  singleTaxi: any;
  baseurl: string = AppSettings.BASEURL;
  showTransOption = LanguageSettings.showTranslateOption;

  apiMessage: string;
  clearMsg(): void {
    this.apiMessage = "";
  }

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
      description: {
        title: 'Title',
      },
      subject: {
        title: 'Email Subject',
      },

    },
  };

  source: ServerDataSource;
  config: any;
  defaultLang = LanguageSettings.defaultSelectedLang;


  constructor(http: HttpClient, private service: TableService, private adminservice: AdminService, private toastr: ButtonToasterService, private translate: TranslateService) {
    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'email' });
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    // console.log(browserLang, "browserLang");
    const lang = this.defaultLang
    translate.use(lang)
    this.getData(lang);
    setTimeout(() => {
      this.config = {
        height: 500,
        theme: 'modern',
        plugins: 'code',
        toolbar: 'code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        templates: [
          { title: 'Test template 1', content: 'Test 1' },
          { title: 'Test template 2', content: 'Test 2' }
        ],
        content_css: [
          'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          'https://www.tinymce.com/css/codepen.min.css'
        ]
      };
    }, 0);
  }

  route(event) {
    this.initial = "";
    // console.log(event.data._id);
    // console.log(event.data);
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedDocs = data;
    this.selectedid = data._id;
    this.selectedDocs = data;
    // console.log(this.selectedEsubject);
    // this.selectedUser =  data.fname;
  }

  goBack(): void {
    this.initial = "detail";
  }


  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang)
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.service.emailTemplateLang(value)
      .then(res => {
        this.source = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  editTemplate(inputs: any): void {
    inputs['id'] = this.selectedid;
    // console.log(inputs)
    if (!inputs) { return; }
    this.service.updateEmailTemplate(inputs)
      .then(res => {
        //console.log(res.message);
        //this.apiMessage = res.message;
        this.toastr.showtoast("success", res.message);
        // this.goBack();
        //event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  //   deleteRecord(data:any):void {
  //     if (window.confirm('Are you sure you want to delete?')) {

  //       this.adminservice.deleteAdminData(data)
  //       .then(res => {
  //      //   this.apiMessage = res.message;
  //           this.toastr.showtoast("success",res.message);
  //       })

  //     }
  //   }

}
