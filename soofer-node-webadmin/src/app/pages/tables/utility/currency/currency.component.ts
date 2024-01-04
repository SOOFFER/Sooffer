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

export class CurrencyAddComponent {
  title: string = "Currencies";
  initial: number = 0;
  selectedid: any;
  private baseurl = AppSettings.BASEURL;
  selectedDocs: any = {};
  settings = {
    hideSubHeader: true,
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
      datas: {
        title: 'Currencies',
        filter: false,
        valuePrepareFunction: (value) => {
          return value.name
        },
      },
    },
  };

  source: ServerDataSource;
  filedata: any;
  list: any = {};
  constructor(_http: HttpClient, http: Http, private service: TableService,
    private toastr: ButtonToasterService, private utility: UtilityService, private location: Location, private CommonSvc: CommonService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'currencyForAdminUiCRUD' });
  }
  @ViewChild('dataForm1') form: any;

  AddCurrency(data) {
    this.CommonSvc.AddCurrencyval(data).then((res) => {
      this.toastr.showtoast("success", res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast("error", err.error.message);
      });
  }

  route(event) {
    this.btBack(2);
    this.selectedDocs = event.data;
    this.selectedid = event.data.datas._id;
    this.selectedDocs.currency = event.data.datas.name
  }


  updateCurrency(data) {
    let ndata = { "_id": data.datas._id, "currency": this.selectedDocs.currency }
    this.CommonSvc.UpdateCurrencyval(ndata).then((res) => {
      this.toastr.showtoast("success", res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast("error", err.error.message);
      });

  }

  deleteCurrency(data) {
    this.CommonSvc.DeleteCurrencyval(data).then((res) => {
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
