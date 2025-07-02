import { Component, OnInit } from '@angular/core';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';
import { TableService } from '../../table.service';

@Component({
  selector: 'ngx-reset-pass',
  templateUrl: './reset-pass.component.html',
})

export class ResetPassComponent implements OnInit {
  list: any = {};
  constructor(
    private tableservice: TableService,
    private router: Router,
    private toastr: ButtonToasterService
  ) {
    this.list.userEmailId = localStorage.getItem('userEmail')
    this.list.userId = localStorage.getItem('userId')
  }

  ngOnInit() {
  }

  updateResetPass(inputs: any) {
    if (!inputs) { return; }
    if (inputs.newPassword === inputs.confirmPassword) {
      let resetPass = {
        id: this.list.userId,
        newpassword: inputs.newPassword,
        confirmpassword: inputs.confirmPassword,
        oldpassword: inputs.oldPassword
      }
      this.tableservice.updateReset(resetPass)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.router.navigate(['auth/logout']);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        })
    } else {
      this.toastr.showtoast('warn', 'New Password and Confirm Password Must be Same!')
    }

  }

}
