import { Component } from '@angular/core';
import { TableService } from '../../table.service';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './alert-setting.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class AlertSettingComponent {
  initial: string = 'list';
  selectedDocs: any = {};
  lists: any = {};

  constructor(http: HttpClient,
    private service: TableService,
    private toastr: ButtonToasterService) {
    this.service.getAlert()
      .then(res => {
        this.selectedDocs = res[0];
      });
    this.service.getStripe()
      .then(res => {
        this.lists = res.data;
      })
  }

  goBack(): void {
    this.initial = 'detail';
  }

  editTemplate(inputs: any): void {
    if (!inputs) { return; }
    this.service.updateAlert(inputs)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  editStrike(inputs: any): void {
    if (!inputs) { return; }
    this.service.updateStrike(inputs)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }
}
