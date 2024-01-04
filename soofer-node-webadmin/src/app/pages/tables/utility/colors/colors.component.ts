import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
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

export class ColorsAddComponent {
  title: string = 'Vehicle Availability Colors';
  initial: number = 0;
  private baseurl = AppSettings.BASEURL;
  selectedid: any;
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
      name: {
        title: 'Vehicle Availability Colors',
      },
    },
  };

  source: ServerDataSource;
  filedata: any;
  list: any = {};

  constructor(private router: Router, _http: HttpClient, http: Http, private service: TableService,
    private toastr: ButtonToasterService, private utility: UtilityService, private location: Location, private CommonSvc: CommonService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'colorForAdminUiCRUD' });
  }

  @ViewChild('dataForm1') form: any;


  route(event) {
    this.btBack(2);
    this.selectedDocs = event.data;
    this.selectedid = event.data._id;
    this.selectedDocs.name = event.data.name;
  }

  AddColors(data) {
    this.CommonSvc.AddColorval(data).then((res) => {
      this.toastr.showtoast('success', res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast('error', err.error.message);
      });
  }

  updateColors(data) {
    const ndata = { '_id': data._id, 'name': data.name };
    this.CommonSvc.UpdateColorval(ndata).then((res) => {
      this.toastr.showtoast('success', res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast('error', err.error.message);
      });
  }

  deleteColors(data) {
    //console.log(data);
    this.CommonSvc.DeleteColorval(data).then((res) => {
      this.toastr.showtoast('success', res.message);
      this.initial = 0;
    })
      .catch(err => {
        this.toastr.showtoast('error', err.error.message);
      });
  }

  ngOnInit(): void { }

  btBack(num: number): void {
    this.initial = num;
    this.list = {};
  }


}
