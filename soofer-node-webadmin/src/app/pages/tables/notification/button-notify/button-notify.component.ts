import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableService } from '../../table.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-button-notify',
  templateUrl: './button-notify.component.html',
  styleUrls: ['./button-notify.component.scss']
})
export class ButtonNotifyComponent implements OnInit {

  constructor(private tableService: TableService,
    private toaster: ToastrService,) { }

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    console.log('Button Component Works!');

    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    console.log('ROW DATA : ', this.rowData);
    this.save.emit(this.rowData);

    this.rowData.model ? this.notifyTaxi(this.rowData) : this.notifyDriver(this.rowData);

  }

  notifyDriver(rowData: any) {
    let payLoad = {
      name: rowData.fname, email: rowData.email, fcmId: rowData.fcmId, expDate: rowData.document[0].docExp,
      ExpName: "Driving License",
    }
    this.tableService.notifyIndividualDriver(payLoad)
      .then((res) => {
        this.toaster.success("success", res.message);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  notifyTaxi(rowData: any) {

    const taxiInsuranceDate = rowData.document.find(item => { return item.docName === "Insurance" });
    console.log('taxiInsuranceDate : ', taxiInsuranceDate);
    let insuranceExpiryDate = taxiInsuranceDate.docExp.split('T')[0];


    let payLoad = {
      name: rowData.fname, email: rowData.email, fcmId: rowData.fcmId, expDate: insuranceExpiryDate,
      ExpName: "Driving License",
    }
    this.tableService.notifyIndividualTaxi(payLoad)
      .then((res) => {
        this.toaster.success("success", res.message);
      })
      .catch((err) => {
        console.error(err);
      })
  }
}


