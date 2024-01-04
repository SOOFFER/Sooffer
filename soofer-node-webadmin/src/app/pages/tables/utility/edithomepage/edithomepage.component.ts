import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';

import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { UtilityService } from '../utility.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService],
  templateUrl: './smart-table.component.html',
  styleUrls: ['./form-inputs.component.scss'],
})

export class EditHomePageComponent implements OnInit {

  list: any = {};
  secondlist: any = {};
  thirdlist: any = {};
  filedata: any;
  bannerImg: any;
  htmlBody: any;
  htmlHeader: any;
  position: any;
  htmlFooter: any;
  appImg: any;
  browserLang: any;
  taxiImg: any;
  listFoot: any = {};
  selectedid: string;
  selectedDocs: any;
  baseurl: string = AppSettings.BASEURL;
  pages: any[] = [];
  showTransOption = LanguageSettings.showTranslateOption;
  defaultLang = LanguageSettings.defaultSelectedLang;
  language: any;

  constructor(http: Http, private toastr: ButtonToasterService, private tableservice: TableService, private utility: UtilityService, private translate: TranslateService) {
    // this.browserLang = translate.getBrowserLang();
    // translate.use(this.browserLang);
    // this.GetHomeContent(this.browserLang);

    this.language = this.defaultLang
    translate.use(this.language)

    this.utility.getPages()
      .then(res => {
        this.pages = res;
      });
  }

  getLang(lang) {
    console.log(lang, "lang");
    this.GetHomeContent(lang)
  }


  ngOnInit(): void {
    this.GetHomeContent(this.language);
  }

  GetHomeContent(value): void {
    localStorage.setItem("language", value);
    this.utility.getHomecontent(value)
      .then(res => {
        this.list = res[0];
        this.listFoot = res[0];
        if (this.list.home_banner_image != "" || this.list.home_banner_image != undefined) {
          this.bannerImg = this.list.home_banner_image;
        } else {
          this.bannerImg = 0;
        }
        if (this.list.mobile_app_left_img != "" || this.list.mobile_app_left_img != undefined) {
          this.appImg = this.list.mobile_app_left_img;
        } else {
          this.appImg = 0;
        }
        if (this.list.taxi_app_bg_img != "" || this.list.taxi_app_bg_img != undefined) {
          this.taxiImg = this.list.taxi_app_bg_img;
        } else {
          this.taxiImg = 0;
        }
      })
  }


  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  submitFirstBlock(inputs: any): void {
    var getlanguage = localStorage.getItem("language");
    let formdata = new FormData();
    formdata.append("file", this.filedata);
    formdata.append("header_first_label", inputs.header_first_label);
    formdata.append("header_second_label", inputs.header_second_label);
    formdata.append("home_second_title", inputs.home_second_title);
    formdata.append("home_yellow_one", inputs.home_yellow_one);
    formdata.append("home_yellow_two", inputs.home_yellow_two);
    formdata.append("third_mid_title_one", inputs.third_mid_title_one);
    formdata.append("third_mid_desc_one", inputs.third_mid_desc_one);
    formdata.append("third_mid_title_two", inputs.third_mid_title_two);
    formdata.append("third_mid_desc_two", inputs.third_mid_desc_two);
    formdata.append("third_mid_title_three", inputs.third_mid_title_three);
    formdata.append("third_mid_desc_three", inputs.third_mid_desc_three);
    this.utility.updateFirstBlock(formdata, getlanguage)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        // this.GetHomeContent(getlanguage);

      });
  }

  submitSecondBlock(inputs: any): void {
    //console.log(inputs);
    var getlanguage = localStorage.getItem("language");
    let formdata = new FormData();
    formdata.append("file", this.filedata);
    formdata.append("mobile_app_moreinfo", inputs.mobile_app_moreinfo);
    formdata.append("mobile_app_right_title", inputs.mobile_app_right_title);
    formdata.append("mobile_app_right_desc", inputs.mobile_app_right_desc);
    this.utility.updateSecondBlock(formdata, getlanguage)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        // this.GetHomeContent(getlanguage);
      });
  }

  submitThirdBlock(inputs: any): void {
    //console.log(inputs);
    var getlanguage = localStorage.getItem("language");
    let formdata = new FormData();
    formdata.append("file", this.filedata);
    formdata.append("taxi_app_moreinfo", inputs.taxi_app_moreinfo);
    formdata.append("taxi_app_right_title", inputs.taxi_app_right_title);
    formdata.append("taxi_app_right_desc", inputs.taxi_app_right_desc);
    this.utility.updateThirdBlock(formdata, getlanguage)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        // this.GetHomeContent(getlanguage);
      });
  }
  submitFooter(inputs: any) {
    var getlanguage = localStorage.getItem("language");
    this.utility.updateFooter(inputs, getlanguage)
      .then(res => {
        this.toastr.showtoast("success", res.message);
      });
  }

  // goBack():void {
  //   this.trip = "triplist";
  // }

  // filterRes(fromDate,toDate){
  // }

}//Export
