import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../app.config';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ngx-review-reasons',
  templateUrl: './review-reasons.component.html',
})

export class ReviewReasonsComponent implements OnInit {

  settings1 = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      dataresult: {
        title: 'Reasons',
      },
    },
  };

  settings2 = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      dataresult: {
        title: 'Reasons',
      },
    },
  };

  source;
  source2;
  data: any;
  Drivermsg: any;
  diverdata = [];
  riderdata = [];
  a: any;
  b: any;

  constructor(private http: HttpClient,
    private service: TableService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService) {
    this.source = new LocalDataSource();
    this.source2 = new LocalDataSource();
    this.dispDriverReasons();
    this.dispRiderReasons();
  }

  dispDriverReasons() {
    this.spinnerLoad.show();
    this.http.get(AppSettings.API_ENDPOINT + 'firebaseValues/driverFeedbackReasons')
      .toPromise()
      .then(res => {
        this.a = res;
        this.a.forEach(element => {
          this.data = Object.keys(element);
        });
        this.diverdatagetter(this.data);
        this.source = this.diverdata;
        this.spinnerLoad.hide();
      })
      .catch(res => {
        this.spinnerLoad.hide();
        this.toastr.showtoast('error', res.message);
      });
  }

  dispRiderReasons() {
    this.spinnerLoad.show();
    this.http.get(AppSettings.API_ENDPOINT + 'firebaseValues/riderFeedbackReasons')
      .toPromise()
      .then(res => {
        this.b = res;
        this.b.forEach(element => {
          this.data = Object.keys(element);
        });
        this.riderdatagetter(this.data);
        this.source2 = this.riderdata;
        this.spinnerLoad.hide();
      })
      .catch(res => {
        this.spinnerLoad.hide();
        this.toastr.showtoast('error', res.message);
      });
  }

  ngOnInit() { }

  diverdatagetter(data) {
    const result = data.forEach(ele => {
      const res = {
        dataresult: ele,
      };
      this.diverdata.push(res);
    });
  }

  riderdatagetter(data) {
    const result = data.forEach(ele => {
      const res = {
        dataresult: ele,
      };
      this.riderdata.push(res);
    });
  }

  /** DRIVER */

  addRecord(event) {
    const dataupdate = {
      'value': event.newData.dataresult,
    };
    this.service.addDriverReviewReason(dataupdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  updateRecord(event) {
    const dataupdate = {
      'newValue': event.newData.dataresult,
      'oldValue': event.data.dataresult,
    };
    this.service.updateDriverReviewReason(dataupdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  onDeleteConfirm(event) {
    this.service.deleteDriverReviewReason(event.data.dataresult)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  /** RIDER */

  addRecordRider(event) {
    const dataupdate = {
      'value': event.newData.dataresult,
    };
    this.service.addRiderReviewReason(dataupdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  updateRecordRider(event) {
    const dataupdate = {
      'newValue': event.newData.dataresult,
      'oldValue': event.data.dataresult,
    };
    this.service.updateRiderReviewReason(dataupdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  onDeleteConfirmRider(event) {
    this.service.deleteRiderReviewReason(event.data.dataresult)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }
}
