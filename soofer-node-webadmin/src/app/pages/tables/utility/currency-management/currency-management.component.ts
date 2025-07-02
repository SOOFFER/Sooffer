import { Component } from '@angular/core';
import { TableService } from '../../table.service';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './currency-management.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class CurrencyManagementComponent {
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
    this.service.getCurrency()
      .then(res => {
        //console.log(res.data)
        this.selectedDocs = res.data;
        this.selectedDocs.secondarycur = this.convertToString(this.selectedDocs.secondarycur);
      });
  }

  convertToString(data) {
    if (data === true) {
      return 'true';
    } else return 'false';
  }

  goBack(): void {
    this.initial = 'detail';
  }

  editTemplate(inputs: any): void {
    if (!inputs) { return; }
    const updateObj = {
      'primarycur': inputs.primarycur,
      'secondarycur': inputs.secondarycur,
      'secondarycurName': inputs.secondarycurName,
      'secondarycurSymbol': inputs.secondarycurSymbol,
      'conversionRate': inputs.conversionRate,
    };
    this.service.updateCurrency(updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
