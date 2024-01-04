import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { DriverService } from './driver.service';
import { CommonService } from '../common/common.service';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { VerificationSettings, AppSettings } from 'src/app/app.config';
import { NgxSpinnerService } from 'ngx-spinner';
import * as jwtDecode from 'jwt-decode';
import { DataSharingService } from '../common/data-sharing.service';
import { Router } from '@angular/router';
import { timer, BehaviorSubject } from 'rxjs';

@Component({
  selector: "driversignup",
  templateUrl: './driversignup.html',
  providers: [ButtonToasterService, DriverService]
})
export class DriversignupComponent implements OnInit, OnDestroy {
  disable = false;
  companyary: any[] = [];
  countryary: any[] = [];
  stateary: any[] = [];
  cityary: any[] = [];
  langary: any[] = [];
  currencyary: any[] = [];

  list: any = {};
  apiMessage: string;
  Tmsg: any = '';
  Tcount = true;
  Tcode: any = {};

  initial = '';

  showVerify = VerificationSettings.isVerify;
  verifyMeth = VerificationSettings.verifyMethod;

  defaultOTP;
  defaultPhone;

  verifyinputs = {};
  otpInputs = {};
  decoded: any = {};
  interval;

  showTimer: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private dataService: DriverService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataSharingService: DataSharingService,
    private toastr: ButtonToasterService
  ) {
    this.verifyinputs = {};
    this.verifyinputs['phcode'] = AppSettings.defaultPhoneCode;
    this.otpInputs = {};
    this.defaultOTP = '';
    if (this.showVerify) {
      this.initial = 'showVerify';
    } else {
      this.initial = 'addDriverScreen';
    }
  }

  verifyUser(data) {
    this.disable = false;
    this.spinner.show();
    this.list = {};
    if (data.phone) {
      this.list.phone = data.phone;
      data.phcode = data.phcode;
    } else if (data.email) {
      this.list.email = data.email;
    }
    this.dataService
      .verifyDriver(data)
      .then(res => {
        this.defaultOTP = res.code ? res.code.toString() : '';
        this.toastr.showtoast('success', res.message);
        this.initial = 'showOTP';
        this.spinner.hide();
        this.disableTime();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  disableTime() {
    this.showTimer.asObservable();
    const start = 30;
    this.interval = timer(1000, 1000)
      .map(i => start - i)
      // .take(start + 1)
      .subscribe(i => {
        if (i === 0) {
          this.showTimer.next('');
          this.interval.unsubscribe();
          this.disable = true;
        } else {
          const str = 'in 00:' + ('0' + i).slice(-2);
          this.showTimer.next(str);
          this.disable = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.showTimer.complete();
    if (this.interval) { this.interval.unsubscribe(); }
  }

  verifyOTP(data) {
    if (data === this.defaultOTP) {
      this.toastr.showtoast('success', 'OTP Verified Successfully');
      this.initial = 'addDriverScreen';
    } else {
      this.toastr.showtoast('error', 'Invalid OTP');
    }
  }

  @ViewChild('dataForm') form: any;

  clearMsg(): void {
    this.apiMessage = '';
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    this.spinner.show();
    this.dataService
      .createDoc(inputs)
      .then(msg => {
        this.toastr.showtoast('success', msg.message);
        localStorage.setItem('Tok', msg.token);
        this.decoded = jwtDecode(msg.token);
        localStorage.setItem('Type', this.decoded.type);
        localStorage.setItem('Id', this.decoded.id);
        this.dataSharingService.isUserLoggedIn.next(true);
        this.router.navigate(['/profile']);
        this.spinner.hide();
      })
      .catch(msg => {
        console.log(msg);
        const err = JSON.parse(msg._body);
        console.log(err.message);
        this.toastr.showtoast('error', err.message);
        this.spinner.hide();
      });
  }

  ngOnInit(): void {
    this.dataService.getCompanies().then(msg => (this.companyary = msg));
    this.dataService
      .getCountries()
      .then(msg => (this.countryary = msg[0]['countries']));
    this.dataService.getLangs().then(msg => (this.langary = msg[0]['datas']));
    this.dataService
      .getCurrency()
      .then(msg => (this.currencyary = msg[0]['datas']));
  }

  GetState(data: any): void {
    if (!data) {
      return;
    }
    this.spinner.show();
    const selectElementText =
      event.target['options'][event.target['options'].selectedIndex].text;
    this.list.cntyname = selectElementText;

    const selectElementId =
      event.target['options'][event.target['options'].selectedIndex].value;

    this.dataService
      .GetState(selectElementId)
      .then(msg => {
        this.stateary = msg[0]['states'];
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  testCode(inp) {
    this.spinner.show();
    this.Tcode.code = inp;
    this.Tcount = true;
    console.log(inp);
    this.dataService
      .AvailCode(this.Tcode)
      .then(res => {
        //  console.log(res);
        if (res.success === false) {
          this.Tcount = false;
          this.Tmsg = res.message;
          this.list.code = '';
          this.Tcount = true;
          this.toastr.showtoast('error', res.message);
          //  console.log("false ZM");

          //   console.log(this.Tmsg);
        } else if (res.success == true) {
          this.Tcount = true;
          // console.log("true ZM");

          //   console.log(res.message);
        }
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  GetCity(data: any): void {
    if (!data) {
      return;
    }
    this.spinner.show();
    const selectElementText =
      event.target['options'][event.target['options'].selectedIndex].text;
    this.list.statename = selectElementText;

    const selectElementId =
      event.target['options'][event.target['options'].selectedIndex].value;

    this.dataService
      .GetCity(selectElementId)
      .then(msg => {
        this.cityary = msg[0]['cities'];
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  SetCity(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target['options'][event.target['options'].selectedIndex].text;
    this.list.cityname = selectElementText;
  }
}
