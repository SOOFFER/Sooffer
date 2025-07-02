import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../app.config';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ngx-cancellation-reasons',
  templateUrl: './cancellation-reasons.component.html',
})
export class CancellationReasonsComponent implements OnInit {

  initial: number = 0;

  settings = {
    actions: {
      edit: false, //as an example
      delete: false,
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      language: {
        title: 'Language'
      }
    }
  };

  source: ServerDataSource;
  selectedDocs: any = {};
  selectedid: any;
  list: any = {};
  Language: any = [];

  constructor(
    private http: HttpClient,
    private service: TableService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + 'cancelReasonFromDB'
    });

    this.getLang();
  }

  route(event) {
    this.selectedDocs = {};
    this.selectedid = '';
    if (event.action === 'deleteAction') {
      // this.deleteCat(event.data._id);
    } else {
      this.selectedList(event.data);
    }
  }

  selectedList(data) {
    this.btBack(2);
    this.selectedDocs = data;
    this.selectedid = data._id;
  }
  btBack(num: number): void {
    this.initial = num;
    this.list = {};
  }

  getLang() {
    this.service
      .getlang()
      .then(res => {
        this.Language = res.data;
        console.log(this.Language);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  addCat(data) {
    const addObj = {
      language: data.language,
      driverCancelReason: data.driverCancelReason,
      riderCancelReason: data.riderCancelReason
    };
    this.service
      .addnewdocs(addObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.btBack(0);
      })
      .catch(res => {
        let errorMessage = 'Something went wrong.';
        errorMessage = res.message !== undefined ? res.message : errorMessage;
        this.toastr.showtoast('error', errorMessage);
      });
  }

  updateCat(data) {
    const updObj = {
      language: data.language,
      driverCancelReason: data.driverCancelReason,
      riderCancelReason: data.riderCancelReason
    };
    this.service
      .updateddocs(this.selectedid, updObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.btBack(0);
      })
      .catch(res => {
        let errorMessage = 'Something went wrong.';
        errorMessage = res.message !== undefined ? res.message : errorMessage;
        this.toastr.showtoast('error', errorMessage);
      });
  }

  UpdateNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    this.service
      .updaterecord(inputs)
      .then(msg => {
        const body = msg;
        this.toastr.showtoast('success', body.message);
        this.initial = 0;
      })
      .catch(msg => {
        const body = msg;
        this.toastr.showtoast('error', body.message);
      });
  }

  ngOnInit() { }

  // onDeleteConfirmRider(event) {
  //   if (window.confirm("Are you sure you want to Delete?")) {
  //     this.service
  //       .deleteRiderCancelReason(event.data.dataresult)
  //       .then(res => {
  //         this.toastr.showtoast("success", res.message);
  //         event.confirm.resolve(event.newData);
  //       })
  //       .catch(res => {
  //         this.toastr.showtoast("error", res.message);
  //       });
  //   } else {
  //   }
  // }

}
