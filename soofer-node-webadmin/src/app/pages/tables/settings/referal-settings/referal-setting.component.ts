import { Component } from '@angular/core';
import { TableService } from '../../table.service';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './referal-setting.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class ReferalSettingsComponent {
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
    this.service.getReferal()

      .then(res => {
        //console.log(res.data)
        this.selectedDocs = res.data;

      });
  }

  goBack(): void {
    this.initial = 'detail';
  }

  editTemplate(inputs: any): void {
    if (!inputs) { return; }
    const updateObj = {

      'referalSettings': {
        'isRiderReferalCodeAvailable': inputs.isRiderReferalCodeAvailable,
        'riderReferalAmount': inputs.riderReferalAmount,
        'riderRefererAmount': inputs.riderRefererAmount,
        'isDriverReferalCodeAvailable': inputs.isDriverReferalCodeAvailable,
        'driverRefererAmount': inputs.driverRefererAmount,
        'driverReferalAmount': inputs.driverReferalAmount
      },

    };
    this.service.updateReferal(updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
