import { Component, ElementRef, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { HeaderService } from '../header/header.service';
import { AppSettings, VerificationSettings } from '../../app.config';
import { CommonService } from '../common/common.service';
import { ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Service } from 'src/app/index/ridersignup/ridersignup.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from '../common/data-sharing.service';
import { Router } from '@angular/router';
@Component({
  selector: "riderprofile",
  templateUrl: './profile.html',
  styleUrls: ['./riderprofile.css'],
  providers: [ProfileService, HeaderService, CommonService, ButtonToasterService, DatePipe, Service]
})
export class RiderProfileComponent implements OnInit {
  documentMessage: string;
  selectedDocs: any;
  singleTaxi: any;
  selectedid: any;
  baseurl: string = AppSettings.BASEURL;
  private apiUrl = AppSettings.BASEURL;
  expandedprofile = true;
  expandededitpassword = false;
  expandededitmobile = false;
  expandedprofiledetail = false;
  expandedemaildetail = false;
  expandedemail = true;
  list: any = {};
  SetDetail: any = {};
  SelectedUser: any;
  SelectedUserPic: any;
  initial: boolean;
  pic: string;
  companyary: any[] = [];
  countryary: any[] = [];
  stateary: any[] = [];
  cityary: any[] = [];
  langary: any[] = [];
  currencyary: any[] = [];
  updatePic: any;
  localUrl: any[];
  filedata: any;
  profileData: any;

  showOtp = false;
  defaultOTP = '';
  newList = {};
  phoneNumInput = '';
  emailInput = '';
  verifyMeth = VerificationSettings.verifyMethod;
  defaultPhoneCode = AppSettings.defaultPhoneCode;
  showProfileSave = false;

  constructor(private eservice: ProfileService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private dataService: Service,
    private tost: ButtonToasterService,
    private spinner: NgxSpinnerService,
    private hService: HeaderService,
    private CommonSvc: CommonService) {
    this.disp();
  }

  disp() {
    this.spinner.show();
    this.eservice.getRiderDetails(localStorage.getItem('Tok'))
      .then(res => {
        if (res[0]) {
          this.SetDetail = res[0];
          this.SelectedUser = this.SetDetail !== undefined ? this.SetDetail.fname : '';
          this.selectedid = this.SetDetail._id,
            // this.profileData = res[0].profile;
            this.SelectedUserPic = this.baseurl + res[0].profile;
          this.SetDetail.updatingUserPic = '';
          this.getst(this.SetDetail.cnty);
          this.getCi(this.SetDetail.state);
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      })
      .catch(res => {
        this.spinner.hide();
        this.toastr.error('error', res.message);
      });
  }

  getst(data) {
    this.spinner.show();
    this.dataService.GetState(data)
      .then(msg => {
        this.stateary = msg[0]['states'];
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  getCi(data) {
    this.spinner.show();
    this.dataService.GetCity(data)
      .then(msg => {
        this.cityary = msg[0]['cities'];
        this.spinner.hide();
      })
      .catch(res => {
        this.spinner.hide();
        this.toastr.error('error', res.message);
      });
  }

  editpassword(event) {
    // this.tost.showtoast("success", "I am working");
    this.expandededitpassword = !this.expandededitpassword;
    this.expandededitmobile = false;
    this.expandedemaildetail = false;
    // this.expandededitpassword = false;
  }

  fileEvent2(e) {
    console.log(e.target.files[0]);
    this.profileData = e.target.files[0];
  }

  setProfile() {
    if (this.profileData) {
      this.spinner.show();
      const formdata = new FormData();
      formdata.append('file', this.profileData);
      this.eservice.uploadRiderImage(formdata)
        .then(msg => {
          this.spinner.hide();
          this.tost.showtoast('success', msg.message);
          this.showProfileSave = !this.showProfileSave;
          const element = document.getElementById('CloseButton') as any;
          element.click();
          this.SelectedUserPic = this.baseurl + msg.request.profile;
          // window.location.reload();
        })
        .catch(res => {
          this.spinner.hide();
          this.toastr.error('error', res.message);
        });
    }
  }

  editmobile(event) {
    // this.tost.showtoast("success", "I am working");
    this.expandededitmobile = !this.expandededitmobile;
    this.expandededitpassword = false;
    this.expandedemaildetail = false;
    this.showOtp = false;
    this.defaultOTP = '';
    this.newList = {};
    this.phoneNumInput = '';
    this.emailInput = '';
  }

  logout() {
    // localStorage.clear();
    localStorage.removeItem('Tok');
    this.dataSharingService.isUserLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  profiledetail(event) {
    this.expandedprofiledetail = !this.expandedprofiledetail;
    this.expandedprofile = !this.expandedprofile;
    this.showProfileSave = !this.showProfileSave;
    window.scroll(0, 0);
    this.disp();
  }

  editemail(event) {
    this.expandedemaildetail = !this.expandedemaildetail;
    this.expandededitpassword = false;
    this.expandededitmobile = false;
    this.expandedemail = !this.expandedemail;
    this.showOtp = false;
    this.defaultOTP = '';
    this.newList = {};
    this.phoneNumInput = '';
    this.emailInput = '';
  }

  updateRecord(type, inputs: any): void {
    console.log(type);
    this.spinner.show();
    if (!inputs) { return; }
    const riderId = localStorage.getItem('Id');
    const formdata = new FormData();
    formdata.append('file', this.profileData);
    formdata.append('fname', inputs.fname);
    formdata.append('lname', inputs.lname);
    formdata.append('cnty', inputs.cnty);
    formdata.append('state', inputs.state);
    formdata.append('city', inputs.city);
    formdata.append('lang', inputs.lang);
    formdata.append('cur', inputs.cur);
    formdata.append('phone', inputs.phone);
    formdata.append('email', inputs.email);
    // formdata.append('_id', riderId);
    //  console.log(inputs);
    this.eservice.eidtRiderDetails(formdata)
      .then(res => {
        if (res.success === false) {
          const err = JSON.parse(res._body);
          this.toastr.success('success', err.message);
        }
        if (res.success === true) {
          if (type === 'phone') {
            this.expandededitmobile = false;
          } else if (type === 'password') {
            this.expandededitpassword = false;
          } else if (type === 'email') {
            this.expandedemail = false;
          } else if (type === 'profile') {
            // this.expandedprofiledetail = false;
            this.expandedprofiledetail = !this.expandedprofiledetail;
            this.expandedprofile = true;
          }
          this.toastr.success('success', res.message);
        }
        this.spinner.hide();
      })
      .catch(res => {
        this.spinner.hide();
        this.toastr.error('error', res.message);
      });
    // console.log()
  }

  updateProfile(inputs) {
    this.spinner.show();
    const editObj = {
      fname: inputs.fname,
      lname: inputs.lname,
      cnty: inputs.cnty,
      state: inputs.state,
      city: inputs.city,
      lang: inputs.lang,
      cur: inputs.cur,
      email: inputs.email
    };
    this.eservice.eidtRiderDetails(editObj)
      .then(res => {
        this.spinner.hide();
        this.toastr.success('success', res.message);
        this.expandedprofiledetail = !this.expandedprofiledetail;
        this.expandedprofile = true;
      })
      .catch(res => {
        this.spinner.hide();
        this.toastr.error('error', res.message);
      });
  }

  checkEmailWithOTP(data) {
    this.spinner.show();
    this.emailInput = data;
    const emailObj = { email: data };
    this.dataService.verifyRider(emailObj)
      .then(res => {
        this.defaultOTP = (res.code).toString();
        this.toastr.success('success', res.message);
        this.showOtp = true;
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  checkPhoneWithOTP(data) {
    this.spinner.show();
    this.phoneNumInput = data;
    const phoneObj = { phone: data };
    this.dataService.verifyRider(phoneObj)
      .then(res => {
        this.defaultOTP = (res.code).toString();
        this.toastr.success('success', res.message);
        this.showOtp = true;
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  verifyOTP(type, data) {
    let upd = {};
    if (type === 'phone') {
      upd = { phone: this.phoneNumInput, phcode: this.defaultPhoneCode };
    } else if (type === 'email') {
      upd = { email: this.emailInput };
    }
    if (data === this.defaultOTP) {
      this.updateVerified(upd);
      this.toastr.success('success', 'OTP Verified Successfully');
      this.expandededitmobile = false;
      this.expandedemaildetail = false;
      this.showOtp = false;
      this.defaultOTP = '';
      this.newList = {};
    } else {
      this.toastr.error('error', 'Invalid OTP');
    }
  }

  updateVerified(data) {
    this.spinner.show();
    this.eservice.updateVerifiedRider(data)
      .then(res => {
        this.toastr.success('success', res.message);
        this.phoneNumInput = '';
        this.emailInput = '';
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  GetState(data: any): void {
    this.spinner.show();
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.SetDetail.cntyname = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.dataService.GetState(selectElementId)
      .then(msg => {
        this.spinner.hide();
        this.stateary = msg[0]['states'];
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  GetCity(data: any): void {
    if (!data) { return; }
    this.spinner.show();
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.SetDetail.statename = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    this.dataService.GetCity(selectElementId)
      .then(msg => {
        this.cityary = msg[0]['cities'];
        this.spinner.hide();
      })
      .catch(res => {
        this.toastr.error('error', res.message);
        this.spinner.hide();
      });
  }

  SetCity(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.SetDetail.cityname = selectElementText;
  }


  ngOnInit(): void {
    this.dataService.getCountries()
      .then(msg => this.countryary = msg[0]['countries']);
    this.dataService.getLangs()
      .then(msg => this.langary = msg[0]['datas']);
    this.dataService.getCurrency()
      .then(msg => this.currencyary = msg[0]['datas']);
  }


  // GetCity(data:any):void{
  //   if(!data){ return; }
  //   let selectElementText = event.target['options']
  //   [event.target['options'].selectedIndex].text;
  //   this.list.statename = selectElementText;

  //   let selectElementId = event.target['options']
  //   [event.target['options'].selectedIndex].value;

  //   this.CommonSvc.GetCity(selectElementId)
  //   .then(msg => {
  //     this.cityary =  msg[0]['cities'];
  //   })
  // }

  // SetCity(data:any):void{
  //   if(!data){ return; }
  //   let selectElementText = event.target['options']
  //   [event.target['options'].selectedIndex].text;
  //   this.list.cityname = selectElementText;
  // }

}
