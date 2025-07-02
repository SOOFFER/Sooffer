import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-server-config',
  templateUrl: './server-config.component.html',
})

export class ServerConfigComponent implements OnInit {

  list: any = {};

  generalsettingsInput: any = {};
  firebaseSettingsInput: any = {};
  smsSettingsInput: any = {};
  emailSettingsInput: any = {};
  paymentSettingsInput: any = {};

  paymentnameArray = [{ label: 'Stripe', value: 'stripe' }, { label: 'Paypal', value: 'paypal' }, { label: 'BrainTree', value: 'braintree' }, { label: 'None', value: 'none' }];
  smsgatewayArray = [{ label: 'Twilio', value: 'twilio' }, { label: 'None', value: 'none' }];
  emailgatewayArray = [{ label: 'Gmail', value: 'gmail' }, { label: 'Sendgrid', value: 'sendgrid' }, { label: 'None', value: 'none' }];


  constructor(
    private tableservice: TableService,
    private toastr: ButtonToasterService) {
    this.getData();
  }

  getData() {
    this.tableservice.getServerConfig()
      .then(res => {
        this.list = res['data'];
        this.fetchGeneralSettings(this.list);
        this.firebaseSettingsInput = this.list.firebasekey;
        this.firebaseSettingsInput.project_id = this.list.project_id;
        this.firebaseSettingsInput.fcmServer = this.list.fcmServer;
        this.firebaseSettingsInput.googleApi = this.list.googleApi;
        this.smsSettingsInput = this.list.smsGateway;
        this.emailSettingsInput = this.list.smtpConfig;
        this.emailSettingsInput.authUser = this.emailSettingsInput.auth.user;
        this.emailSettingsInput.authPass = this.emailSettingsInput.auth.pass;
        this.emailSettingsInput.emailGateway = this.list.emailGateway;
        this.emailSettingsInput.sgAcessKey = this.list.sgAcessKey;
        this.emailSettingsInput.mailFrom = this.list.mailFrom;
        this.emailSettingsInput.supportNo = this.list.supportNo;
        this.paymentSettingsInput = this.list.paymentGateway;
      });
  }

  fetchGeneralSettings(data) {
    this.generalsettingsInput = {
      'appName': data.appName,
      'resetPasswordTo': data.resetPasswordTo,
      'utcOffset': data.utcOffset,
      'phoneCode': data.phoneCode,
      'companyaddress': data.companyaddress,
      'companymail': data.companymail,
      'requestRadius': data.requestRadius,
      'noOfDriverCancelAllowed': data.noOfDriverCancelAllowed,
      'noOfRiderCancelAllowed': data.noOfRiderCancelAllowed,
      'currency': data.currency,
      'currencySymbol': data.currencySymbol,
      'distanceUnit': data.distanceUnit,
      'distanceSymbol': data.distanceSymbol,
      'driversNeedToCallForATrip': data.driversNeedToCallForATrip,
      'requestTime': this.convertMilliSecondsToSeconds(data.requestTime),
      'userCancelTime': this.convertMilliSecondsToSeconds(data.userCancelTime),
      'isRiderEmailVerifyNeeded': data.isRiderEmailVerifyNeeded,
      'isDriverEmailVerifyNeeded': data.isDriverEmailVerifyNeeded,
    };
  }

  convertMilliSecondsToSeconds(data) {
    return (data / 1000);
  }

  convertSecondsToMilliSeconds(data) {
    return (data * 1000);
  }

  ngOnInit() { }

  updateRecord(type: any, inputs: any): void {
    // console.log(type, inputs);
    let updateObj;
    if (type === 'generalSettings') {
      inputs.requestTime = this.convertSecondsToMilliSeconds(inputs.requestTime);
      inputs.userCancelTime = this.convertSecondsToMilliSeconds(inputs.userCancelTime);
      updateObj = inputs;
    } else if (type === 'firebaseSettings') {
      updateObj = {
        'project_id': inputs.project_id,
        'firebasekey': {
          'appName': inputs.appName,
          'authDomain': inputs.authDomain,
          'databaseURL': inputs.databaseURL,
          'storageBucket': inputs.storageBucket
        },
        'fcmServer': inputs.fcmServer,
        'googleApi': inputs.googleApi
      };
    } else if (type === 'emailconfig') {
      updateObj = {
        'emailGateway': inputs.emailGateway,
        'smtpConfig': {
          'host': 'smtp.gmail.com',
          'port': 465,
          'secure': true,
          'auth': {
            'user': inputs.authUser,
            'pass': inputs.authPass,
          },
          'sgAcessKey': inputs.sgAcessKey
        },
        'mailFrom': inputs.mailFrom,
        'supportNo': inputs.supportNo
      };
    } else if (type === 'smsConfig') {
      updateObj = {
        smsGateway: inputs
      };
    } else if (type === 'paymentSettings') {
      updateObj = {
        paymentGateway: inputs
      };
    }
    this.tableservice.updateServerConfig(updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.getData();
        updateObj = {};
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
