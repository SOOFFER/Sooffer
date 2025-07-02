import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { TableService } from '../../table.service';
import { database } from 'firebase';

@Component({
  selector: 'ngx-driver-incentives',
  templateUrl: './driver-incentives.component.html',
  styleUrls: ['./driver-incentives.component.scss']
})
export class DriverIncentivesComponent implements OnInit {

  initial: number = 0;

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
      targetFor: {
        title: 'Target For',
      },
      targetName: {
        title: 'Target Name',
      },
      targetTime: {
        title: 'Target Time',
      },
      targetType: {
        title: 'Target Amount',
        valuePrepareFunction: (targetType) => {
          return targetType[0].targetAmt;
        }
      },
      'targetType.target': {
        title: 'Target',
        valuePrepareFunction: (cell, row) => row.targetType[0].target
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (status) => { if (status) return 'Active'; else 'Inactive'; }
      },
    },
  };

  source: ServerDataSource;

  noFilterThreshold: number = 3;

  tripTime = [{ value: 'weekly', label: 'Weekly' }, { value: 'daily', label: 'Daily' }];
  tripFor = [{ value: 'trips', label: 'Trips' }, { value: 'earnings', label: 'Earnings' }];
  tripStatus = [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }];

  selectedList1: any = {};
  selectedList2: any = {};

  constructor(private _http: HttpClient,
    private commonservice: CommonService,
    private tableservice: TableService,
    private toastr: ButtonToasterService) {
    this.initial = 0;
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'incentive/incentiveCalculation' });
  }

  ngOnInit() {
  }

  route(event) {
    this.initial = 1;
    this.selectedDocs(event.data);
    this.commonservice.doAddFormControlNgSelectClass();
  }

  goBack() {
    this.initial = 0;
  }

  selectedDocs(data) {
    this.selectedList1.id = data._id;
    this.selectedList1.targetName = data.targetName;
    this.selectedList1.status = this.convertToString(data.status);
    this.selectedList1.targetFor = data.targetFor;
    this.selectedList1.targetTime = data.targetTime;
    this.selectedList2 = data.targetType[0];
    this.selectedList2.id = this.selectedList2._id;
    this.selectedList2.status = this.convertToString(this.selectedList2.status);
  }

  convertToString(data) {
    if (data) {
      return 'true';
    } else return 'false';
  }

  updateList1(data) {
    const updObj = {
      targetTime: data.targetTime,
      targetFor: data.targetFor,
      status: data.status,
      targetName: data.targetName
    };
    this.tableservice.updateIncentiveForTarget(this.selectedList1.id, updObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  updateList2(data) {
    const updObj2 = {
      target: data.target,
      targetAmt: data.targetAmt,
      status: data.status
    };
    this.tableservice.updateIncentiveForTargetDetails(this.selectedList1.id, updObj2)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
