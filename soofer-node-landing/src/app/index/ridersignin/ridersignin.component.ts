import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { SigninService } from '../signin/signin.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { AppSettings } from '../../app.config';
import { HeaderComponent } from '../header/header.component';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { DataSharingService } from '../common/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "ridersignin",
  templateUrl: './ridersignin.html',
  providers: [SigninService],
  styleUrls: ['./ridersignin.css']
})

export class RiderSigninComponent implements OnInit {
  list: any = {};
  state: any = false;
  apiMessage: string;
  otp: any;
  showForgetPass = false;
  decoded: any = {};
  fronturl = AppSettings.FEURL;
  newList: any = {};
  PasLISt: any = {};
  showOtp = false;
  clearMsg(): void {
    this.apiMessage = '';
  }

  constructor(private logService: SigninService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private toastr: ButtonToasterService) { }

  loginRider(inputs: any): void {
    this.spinner.show();
    if (!inputs) { return; }
    const addRider = {
      username: inputs.email,
      password: inputs.password
    };
    console.log('addRider : ', addRider);

    this.logService.riderSignme(addRider)
      .then(msg => {
        if (msg.success === true) {
          this.state = true;
          localStorage.setItem('Tok', msg.token);
          this.decoded = jwtDecode(msg.token);
          localStorage.setItem('Id', this.decoded.id);
          localStorage.setItem('Type', this.decoded.type);
          this.dataSharingService.isUserLoggedIn.next(true);
          this.router.navigate(['/dashboard-section']);
          this.spinner.hide();
          // window.location.href = '/#/dashboard-section';
          // window.location.reload();
        }
      })
      .catch(res => {       
        this.toastr.showtoast('error', res.error.message);
        this.spinner.hide();
      });
  }

  resetPass(input) {
    this.spinner.show();
    this.logService.forgotPASS(input)
      .then(res => {
        // console.log(res)
        if (res.success === true) {
          this.showForgetPass = false;
          this.toastr.showtoast('success', res.message);
          this.showOtp = true;
          this.otp = res.OTP;
        } else {
          this.toastr.showtoast('error', res.message);
        }
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  getVerify(input) {
    if (input.otp === this.otp) {
      console.log('Match');
    }
  }

  getRecoverEmail(input) {
    this.spinner.show();
    this.logService.forgotPASS(input)
      .then(res => {
        if (res.success == true) {
          this.showForgetPass = false;
          this.toastr.showtoast('success', res.message);
          this.showOtp = true;
          this.otp = res.OTP;
        } else {
          this.toastr.showtoast('error', res.message);
        }
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  getfORGOTpASSWORD() {
    this.showForgetPass = true;
  }

  login(inputs: any): void {
    this.spinner.show();
    if (!inputs) { return; }
    this.logService.Signme(inputs)
      .then(msg => {
        if (msg.success == true) {
          this.state = true;
          localStorage.setItem('Tok', msg.token);
          this.decoded = jwtDecode(msg.token);
          localStorage.setItem('Type', this.decoded.type);
          localStorage.setItem('Id', msg.datas[0].status[0]._id);
          this.router.navigate(['/profile']);
        }
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  ngOnInit(): void {
  }

}
