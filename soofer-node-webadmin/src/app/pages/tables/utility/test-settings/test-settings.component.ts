import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-test-settings',
  templateUrl: './test-settings.component.html',
})
export class TestSettingsComponent implements OnInit {

  emailvalidate: string = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$";
  firstDocs: any = {};
  secondDocs: any = {};
  thirdDocs: any = {};
  ridersList = [];
  sendObj: any;
  fcmIdObj: any;
  dropdownSettings = {
    singleSelection: true,
    idField: 'fcmId',
    textField: 'fname',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };

  constructor(private service: UtilityService,
    private toastr: ButtonToasterService) {
    this.getRider();
  }

  getRider() {
    this.service.getRidersList()
      .then(res => {
        this.ridersList = res
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  ngOnInit() {
  }

  onItemSelect(event) {
    this.fcmIdObj = event
  }

  onItemDeSelect(event) {
    this.fcmIdObj = {};
  }

  test(testFor, inputs) {
    if (testFor === 'sms') {
      this.sendObj = { phone: inputs.phone, phcode: inputs.phcode };
    } else if (testFor === 'email') {
      this.sendObj = { email: inputs.email };
    } else if (testFor === 'fcm') {
      this.sendObj = { fcmId: this.fcmIdObj.fcmId };
    } else this.sendObj = undefined;
    return this.sendObj
  }

  sendPush(test: any, inputs: any) {
    let value = this.test(test, inputs);
    if (value !== undefined) {
      this.service.sendTest(test, value)
        .then(res => {
          this.toastr.showtoast('success', res.message);
  		 	this.clearText(test);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        })
    } else this.toastr.showtoast('error', 'Please Enter the Value');
  }

  clearText(test) {
  	if(test === 'sms') {
  		this.secondDocs.phone = ''; 
  		this.secondDocs.phcode = '';
  	} else if(test === 'email') {
  		this.firstDocs.email = '';
  	} else if(test === 'fcm') {
  		this.thirdDocs.fcmId = '';
  	}
  }

}
