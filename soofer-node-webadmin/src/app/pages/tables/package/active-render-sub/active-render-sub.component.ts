import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PackageService } from '../package.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-active-render-sub',
  providers: [PackageService],
  templateUrl: './active-render-sub.component.html',
  styleUrls: ['./active-render-sub.component.scss']
})
export class ActiveRenderSubComponent implements OnInit {

  @Input() value: any;
  @Input() rowData: any;

  checkActiveOption: boolean = false;
  checkDeactiveOption: boolean = false;
  notAvailableOption: boolean = false;

  @Output() emitBack = new EventEmitter();

  constructor(private packageService: PackageService,
    private toastr: ButtonToasterService) { }

  ngOnInit() {
    // console.log(this.rowData.status)
    if (this.rowData.status === 'Inactive') {
      this.checkActiveOption = true;
    }
    else if (this.rowData.status === 'Activated') {
      this.checkDeactiveOption = true;
    }
    else if (this.rowData.status === 'Expired' || this.rowData.status === 'Deactived') {
      this.notAvailableOption = true;
    }
  }

  renderCall() {
    const obj = {
      subscriptionID: this.rowData._id
    };
    this.packageService.activateDriverSubPackage(obj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.emitBack.emit();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  renderDeactivateCall() {
    const obj = {
      subscriptionID: this.rowData._id
    };
    if (window.confirm("Are you sure want to Deactivate this Package?")) {
      this.packageService.deactivateDriverSubPackage(obj)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.emitBack.emit();
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    } else {
    }

  }


}
