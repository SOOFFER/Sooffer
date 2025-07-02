import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { TableService } from '../../table.service';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-cancellation-settings',
  templateUrl: './cancellation-settings.component.html',
  styleUrls: ['./cancellation-settings.component.scss']
})

export class CancellationSettingsComponent implements OnInit {

  initial: string = 'list';
  selectedDocs: any = {};
  noFilterThreshold: number = 3;
  yesOrNo = [
    {
      value: 'true',
      label: 'Yes'
    },
    {
      value: 'false',
      label: 'No'
    },
  ];

  constructor(http: HttpClient,
    private service: TableService,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.service.getCancellation()
      .then(res => {
        this.selectedDocs = res.data;
        this.selectedDocs.cancelExists = this.convertToString(this.selectedDocs.cancelExists);
        this.selectedDocs.ifcanceledAddCharge = this.convertToString(this.selectedDocs.ifcanceledAddCharge);
        this.selectedDocs.ifcanceledBlockUser = this.convertToString(this.selectedDocs.ifcanceledBlockUser);
      });
  }

  convertToString(data) {
    if (data) {
      return 'true';
    } else return 'false';
  }

  ngOnInit() {

  }

  goBack(): void {
    this.initial = 'detail';
  }

  editTemplate(inputs: any): void {
    if (!inputs) { return; }
    const updateObj = {
      'ifcanceledBlockUser': inputs.ifcanceledBlockUser,
      'ifcanceledAddCharge': inputs.ifcanceledAddCharge,
      'cancelExists': inputs.cancelExists,
      'cancelLimitForDays': inputs.cancelLimitForDays,
      'ifcancelExceedsBlockUserFor': inputs.ifcancelExceedsBlockUserFor,
      'noOfDriverCancelAllowed': inputs.noOfDriverCancelAllowed,
      'noOfRiderCancelAllowed': inputs.noOfRiderCancelAllowed
    };
    this.service.updateCancellation(updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
