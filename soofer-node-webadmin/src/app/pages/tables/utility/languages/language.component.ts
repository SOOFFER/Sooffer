import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

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

export class LanguageAddComponent {
  title: string = "Languages";
  initial: number = 0;
  selectedid: any;
  private baseurl = AppSettings.BASEURL;
  selectedDocs: any = {};
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
      id: {
        title: 'Ext',
      },
      name: {
        title: 'Languages',
      },
    },
  };

  source: ServerDataSource;
  filedata: any;
  list: any = {};
  constructor(_http: HttpClient, http: Http, private service: TableService,
    private toastr: ButtonToasterService, private utility: UtilityService, private location: Location, private CommonSvc: CommonService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'languagesForAdminUiCRUD' });
  }
  @ViewChild('dataForm1') form: any;


  route(event) {
    //console.log(event.data);
    this.btBack(2);
    this.selectedDocs = event.data;
    this.selectedDocs.sym = event.data.id;
    this.selectedid = event.data._id;
    this.selectedDocs.languages = event.data.name
  }

  updateLanguages(data) {
    let ndata = { "id": data.sym, "_id": data._id, "name": data.languages, }
    this.CommonSvc.UpdateLangval(ndata).then((res) => {
      this.toastr.showtoast("success", res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast("error", err.error.message);
      });
  }

  deleteLanguages(data) {

    this.CommonSvc.DeleteLangval(data).then((res) => {
      this.toastr.showtoast("success", res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast("error", err.error.message);
      });
  }

  AddLanguages(data) {
    let nval = { "id": data.sym, "name": data.languages }
    this.CommonSvc.AddLanguageval(nval).then((res) => {
      this.toastr.showtoast("success", res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast("error", err.error.message);
      });
  }


  ngOnInit(): void { }

  btBack(num: number): void {
    this.initial = num;
    this.list = {};
  }


}
