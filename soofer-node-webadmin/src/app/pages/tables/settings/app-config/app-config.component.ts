import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-app-config',
  templateUrl: './app-config.component.html',
})
export class AppConfigComponent implements OnInit {
  list: any = {};
  constructor(
    private tableservice: TableService,
    private toastr: ButtonToasterService) {
    this.getData();
  }

  getData() {
    this.tableservice.getAppConfig()
      .then(res => {
        this.list = res
      })
  }

  ngOnInit() { }

  updateRecord(inputs: any): void {
    let updateObj = {
      data: inputs.data
    }
    this.tableservice.updateAppConfig(this.list.etag, updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.getData();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

}
