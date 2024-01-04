import { Component, ViewChild, Inject } from '@angular/core';
import { SigninService } from '../signin/signin.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { AppSettings, VerificationSettings } from '../../app.config';
import { HeaderComponent } from '../header/header.component';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "riderforgotpassword",
  templateUrl: "./riderForgotPassword.component.html",
  providers: [SigninService],
})
export class RiderForgotPassWordComponent {
  list: any = {};
  state: any = false;
  apiMessage: string;
  decoded: any = {};
  fronturl = AppSettings.FEURL;
  newList: any = {};
  PasLISt: any = {};
  showOtp = false;
  emailId: any;

  otp: any;
  showForgetPass = true;
  showPassreset = false;
  list_phon_code = AppSettings.phone_code;

  verifyMeth = VerificationSettings.verifyMethod;
  methodName = VerificationSettings.methodName;

  constructor(
    private logService: SigninService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ButtonToasterService
  ) {
      this.newList.phcode = this.list_phon_code[1];
  }

  @ViewChild("dataForm") form: any;

  // hc = new HeaderComponent(null, null);

  clearMsg(): void {
    this.apiMessage = "";
  }

  // @Inject(HeaderComponent) hc: HeaderComponent;

  resetPass(input) {
    this.spinner.show();
    input.email = this.emailId;
    const resetObj = {
      newPwd: input.newpassword,
      conPwd: input.confirmpassword,
      email: this.emailId,
      otp: this.newList.otp,
    };
    this.logService
      .ResetPAss(resetObj)
      .then((res) => {
        if (res.success === true) {
          this.router.navigateByUrl("ridersignin");
          this.toastr.showtoast("success", res.message);
        } else {
          this.toastr.showtoast("error", res.message);
        }
        this.spinner.hide();
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
      });
  }

  getVerify(input) {
    if (input.otp === this.otp) {
      // console.log(this.otp)
      this.showPassreset = true;
      this.showOtp = false;
    } else {
      this.toastr.showtoast("error", "Invalid OTP");
    }
  }

  getRecoverEmail(input) {
    this.spinner.show();
    this.emailId = input.email;
    this.logService
      .forgotPASS(input)
      .then((res) => {
        if (res.success === true) {
          this.showForgetPass = false;
          this.toastr.showtoast("success", res.message);
          this.showOtp = true;
          this.otp = res.OTP;
          this.showPassreset = false;
        } else {
          this.toastr.showtoast("error", res.message);
        }
        this.spinner.hide();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
        this.spinner.hide();
      });
  }
}
