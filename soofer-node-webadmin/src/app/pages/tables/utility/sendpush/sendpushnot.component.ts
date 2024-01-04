import { Component } from '@angular/core';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../table.service';
 
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  //  styleUrls: ['./form-inputs.component.scss'],
})

export class SendPushNotComponent {

  list: any = {};
  selectedDocs: any = {};
  showPushHistory: boolean = false;
  showSMSHistory: boolean = false;
  code: any;
  name: any;
  label: boolean;
  Page: any;
  showCity: any;
  serviceCity: any;

  constructor(
    private toastr: ButtonToasterService,
    private http: HttpClient,
    private uservice: UtilityService,
    private routing : ActivatedRoute,
    private service : TableService ) { 
      this.list.servicecity = ""
      this.selectedDocs.servicecity = ""
      this.routing.params.subscribe(params =>{
        if(params['Code'] && params['Name']){
          this.Page = 'true';
          this.code = params['Code']
          this.name= params['Name']
          this.list.forWhom = params['Code']
          this.selectedDocs.forWhom = params['Code']
        }
      })
      if(featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') == 'superadmin' )
      this.showCity = true
      else 
      this.showCity = false;
      this.service.getServiceCity()
      .then(res=>{
        this.serviceCity = res;
        if(localStorage.getItem('userType') == 'citywiseadmin'){
          this.selectedDocs.servicecity = res[0].label;
          this.list.servicecity = res[0].label
         }
      })
    }

  ngOnInit(): void { }

  sendPush(input): void {
    let data;
    if(this.Page == 'true' ){
      data={
        forWhom : 'Driver',
        message : input.message,
        code : this.code,
        name : this.name,
        scity : input.servicecity 
      }
    }
    else {
      data={
        forWhom : input.forWhom,
        message : input.message,
        scity : input.servicecity
      }
    }
 
    if (!input) { return; }
    this.uservice.sendpush(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.selectedDocs.forWhom = undefined;
        delete this.selectedDocs.message
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  sendSMS(input): void {
    let data;
    if(this.Page == 'true' ){
      data={
        forWhom : 'Driver',
        message : input.message,
        code : this.code,
        name : this.name ,
        scity : input.servicecity
      }
    }
    else {
      data={
        forWhom : input.forWhom,
        message : input.message,
        scity : input.servicecity
      }
    }
    if (!input) { return; }
    this.uservice.sendSMS(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.list.forWhom = undefined;
        delete this.list.message
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }

  goBack() {
    this.showPushHistory = false;
    this.showSMSHistory = false;
  }

  /** Show Table For Push Notification */

  pushSettings = {
    actions: false,
    columns: {
      forWhom: {
        title: 'Notifications Sent To',
        type: 'string',
      },
      message: {
        title: 'Message',
        type: 'string',
      },
      createdAt: {
        title: 'Created At',
        type: 'string',
      }
    },
  };

  pushSource: ServerDataSource;

  showPush() {
    this.showPushHistory = true;
    this.pushSource = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'getPushNotification' });
  }

  /** Show Table For SMS Notification */

  smsSettings = {
    actions: false,
    columns: {
      forWhom: {
        title: 'Notifications Sent To',
        type: 'string',
      },
      message: {
        title: 'Message',
        type: 'string',
      },
      createdAt: {
        title: 'Created At',
        type: 'string',
      }
    },
  };

  smsSource: ServerDataSource;

  showSMS() {
    this.showSMSHistory = true;
    this.smsSource = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'getSmsNotification' });
  }

}
