import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ButtonToasterService {


  constructor(private toastr: ToastrService) {
  }

  showtoast(type: string, msg: string, title: string = ''): void {
    if (type === 'success') {
      title !== '' ? title : 'Success';
      this.toastr.success(msg, title, {
        closeButton: true, positionClass: 'toast-top-right', disableTimeOut: false
      });
    } else if (type === 'error') {
      title !== '' ? title : 'Error';
      this.toastr.error(msg, title, {
        closeButton: true, positionClass: 'toast-top-right', disableTimeOut: false
      });
    } else if (type === 'warn') {
      title !== '' ? title : 'Warn';
      this.toastr.warning(msg, title, {
        closeButton: true, positionClass: 'toast-top-right', disableTimeOut: false
      });
    }
  }

}
