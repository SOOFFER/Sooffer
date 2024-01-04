import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../../../app.config';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-seo-settings',
  templateUrl: './seo-settings.component.html',
  styles: [``]
})

export class SeoSettingsComponent implements OnInit {

  @ViewChild('dataForm') seoForm: any;

  list: any = {};

  constructor(
    private uservice: UtilityService,
    private toastr: ButtonToasterService,
    private http: HttpClient) {
    this.pageLoad();
  }

  ngOnInit() { }

  pageLoad() {
    this.http.get(AppSettings.API_ENDPOINT + 'seosettings')
      .toPromise()
      .then(el => {
        this.list = el[0];
      })
      .catch(error => {
        this.toastr.showtoast('error', 'Something went Wrong');
      });
  }

  AddNewDoc(inputs) {
    console.log('inputs : ', inputs);

    this.uservice.updateSeoSettings(inputs)
      .then(res => {
        // console.log(res);
        this.toastr.showtoast('success', res.message);
        // this.list = res.data;
      }).catch(error => {
        this.toastr.showtoast('error', error.message);
      });
  }

}
