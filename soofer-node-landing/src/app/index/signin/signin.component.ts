import { Component, ViewChild, OnInit } from '@angular/core';
import { SigninService } from './signin.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { AppSettings } from '../../app.config';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { DataSharingService } from '../common/data-sharing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "signin",
  templateUrl: './signin.html',
  providers: [SigninService],
  styleUrls: ['./signin.css']
})

export class SigninComponent implements OnInit {

  @ViewChild('dataForm') form: any;

  list: any = {};
  state: any = false;
  apiMessage: string;
  decoded: any = {};
  fronturl = AppSettings.FEURL;
  clearMsg(): void {
    this.apiMessage = '';
  }


  constructor(private logService: SigninService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private toastr: ButtonToasterService) { }

  login(inputs: any): void {
    if (!inputs) { return; }
    this.spinner.show();
    const addDriver = {
      username: inputs.email,
      password: inputs.password
    };
    this.logService.Signme(addDriver)
      .then(msg => {
        if (msg.success === true) {
          this.state = true;
          localStorage.setItem('Tok', msg.token);
          this.decoded = jwtDecode(msg.token);
          localStorage.setItem('Type', this.decoded.type);
          localStorage.setItem('Id', this.decoded.id);
          this.dataSharingService.isUserLoggedIn.next(true);
          this.router.navigate(['/profile']);
          // window.location.href = '/#/profile';
          // window.location.reload();
        } else {
          this.toastr.showtoast('error', msg.message);
        }
        this.spinner.hide();
      })
      .catch(res => {
        // const err = JSON.parse(res._body);
        this.toastr.showtoast('error', res.error.message);
        this.spinner.hide();
      });
  }

  ngOnInit(): void {
  }

}
