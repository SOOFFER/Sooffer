import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Service } from './ridersignup.service';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { VerificationSettings, AppSettings } from 'src/app/app.config';
import { NgxSpinnerService } from 'ngx-spinner';
import * as jwtDecode from 'jwt-decode';
import { DataSharingService } from '../common/data-sharing.service';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: "ridersignup",
  templateUrl: "./ridersignup.html",
  providers: [ButtonToasterService, Service],
})
export class RidersignupComponent implements OnInit, OnDestroy {
  disable = false;
  list: any = {};
  filedata: any;
  countryary: any[] = [];
  langary: any[] = [];
  stateary: any[] = [];
  cityary: any[] = [];
  currencyary: any[] = [];

  initial = "";
  list_phon_code = AppSettings.phone_code;

  showVerify = VerificationSettings.isVerify;
  verifyMeth = VerificationSettings.verifyMethod;

  defaultOTP;
  defaultPhone;

  verifyinputs = {};
  otpInputs = {};
  decoded: any = {};

  interval;
  showTimer: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private dataService: Service,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataSharingService: DataSharingService,
    private toastr: ButtonToasterService
  ) {
    this.verifyinputs = {};
    this.verifyinputs["phcode"] = this.list_phon_code[1];
    this.otpInputs = {};
    this.defaultOTP = "";
    if (this.showVerify) {
      this.initial = "showVerify";
    } else {
      this.initial = "addRiderScreen";
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
      .verifyRider(data)
      .then((res) => {
        this.defaultOTP = res.code ? res.code.toString() : "";
        this.toastr.showtoast("success", res.message);
        this.initial = "showOTP";
        this.spinner.hide();
        this.disableTime();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
        this.spinner.hide();
      });
  }

  disableTime() {
    this.showTimer.asObservable();
    const start = 30;
    this.interval = timer(1000, 1000)
      .map((i) => start - i)
      // .take(start + 1)
      .subscribe((i) => {
        if (i === 0) {
          this.showTimer.next("");
          this.interval.unsubscribe();
          this.disable = true;
        } else {
          const str = "in 00:" + ("0" + i).slice(-2);
          this.showTimer.next(str);
          this.disable = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.showTimer.complete();
    if (this.interval) {
      this.interval.unsubscribe();
    }
  }

  verifyOTP(data) {
    if (data === this.defaultOTP) {
      this.toastr.showtoast("success", "OTP Verified Successfully");
      this.initial = "addRiderScreen";
    } else {
      this.toastr.showtoast("error", "Invalid OTP");
    }
  }

  @ViewChild("dataForm") form: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  AddNewDoc(inputs: any): void {
    this.spinner.show();
    if (!inputs) {
      return;
    }
    const formdata = new FormData();
    // formdata.append("file",this.filedata);
    formdata.append("fname", inputs.fname);
    formdata.append("lname", inputs.lname);
    formdata.append("email", inputs.email);
    formdata.append("phone", inputs.phone);
    formdata.append("password", inputs.password);
    formdata.append("cnty", inputs.cnty);
    formdata.append("lang", inputs.lang);
    formdata.append("cur", inputs.cur);
    formdata.append("gender", inputs.gender);
    this.dataService
      .createDoc(inputs)
      .then((msg) => {
        if (msg.success) {
          this.toastr.showtoast("success", msg.message);
          localStorage.setItem("Tok", msg.token);
          this.decoded = jwtDecode(msg.token);
          localStorage.setItem("Id", this.decoded.id);
          localStorage.setItem("Type", this.decoded.type);
          this.dataSharingService.isUserLoggedIn.next(true);
          this.router.navigate(["/dashboard-section"]);
          this.spinner.hide();
        }
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
      });
  }

  GetState(data: any): void {
    this.spinner.show();
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.cntyname = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.dataService
      .GetState(selectElementId)
      .then((msg) => {
        this.stateary = msg[0]["states"];
        this.spinner.hide();
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
      });
  }

  GetCity(data: any): void {
    this.spinner.show();
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.statename = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.dataService
      .GetCity(selectElementId)
      .then((msg) => {
        this.cityary = msg[0]["cities"];
        this.spinner.hide();
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
      });
  }

  SetCity(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.cityname = selectElementText;
  }

  ngOnInit(): void {
    this.dataService
      .getCountries()
      .then((msg) => {
        this.countryary = msg[0]["countries"];
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    this.dataService
      .getLangs()
      .then((msg) => {
        this.langary = msg[0]["datas"];
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    this.dataService
      .getCurrency()
      .then((msg) => {
        this.currencyary = msg[0]["datas"];
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    setInterval(() => {
      this.disable = true;
    }, 30000);
  }
}
