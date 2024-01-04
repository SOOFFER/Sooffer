
import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';


import { FormControl, FormGroup } from '@angular/forms';
import { DatepickerOptions } from 'ng2-datepicker';
import { Observable } from 'rxjs/Observable';

import { TableService } from '../table.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../../app.config';

import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-smart-table',
  // styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './emailconfig.component.html',
  providers: [TableService, DatePipe],
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
    `],
})

export class EmailSettingComponent {

  list: any = {};
  initial: any = 0;
  listE: any = {};
  TempList: any = {};
  selectedId: any;
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

      emailid: {
        title: 'Email',
      },
      key: {
        title: 'PassWord',
      },

    },
  };

  source: ServerDataSource;
  constructor(_http: HttpClient, http: Http, private datservice: TableService, private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'mailconfig/' });

    this.datservice.getData().then(
      res => {
        this.TempList = res;
        if (this.TempList.length == 0) {
          this.initial = 1;
        }
        else {
          this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'mailconfig/' });

        }
      }
    )
    console.log(this.source);
  }
  @ViewChild('dataForm') form: any;

  route(event) {
    this.initial = 2;
    this.listE = event.data;
    this.SetDocsDetails(event.data);
  }
  goBack() {
    var http: Http;
    //  this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'key/' });

    this.initial = 0;

  }
  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.list = data;
    this.selectedId = data._id;
  }

  AddKey(inputs: any): void {
    if (!inputs) { return; }
    console.log(inputs);
    this.datservice.addKey(inputs)
      .then(msg => {
        if (msg.success == false) {
          this.toastr.showtoast("error", msg.message);
        } else {
          this.toastr.showtoast("success", msg.message);
          this.form.reset();
        }
      })
  }
  DeleteIt(data) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.datservice.DeletKey(data)
        .then(msg => {
          if (msg.success == false) {
            this.toastr.showtoast("error", msg.message);
          } else {
            this.toastr.showtoast("success", msg.message);
            this.form.reset();
          }
        })
    }
  }
  EditKey(inputs: any): void {
    if (!inputs) { return; }
    console.log(inputs);
    // console.log(this.listE);

    this.datservice.editKey(inputs)
      .then(msg => {
        if (msg.success == false) {
          this.toastr.showtoast("error", msg.message);
        } else {
          this.toastr.showtoast("success", msg.message);
          this.form.reset();
        }
      })
  }

}


