import { Component } from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";

import { TableService } from "../../table.service";
import { Location } from "@angular/common";
import { Http } from "@angular/http";
import { AppSettings } from "../../../../app.config";
import { CommonService } from "../../../common/common.service";
import { ButtonToasterService } from "../../../buttontoaster/buttontoaster.service";
import { UtilityService } from "../utility.service";

@Component({
  selector: "ngx-smart-table",
  providers: [TableService, CommonService],
  templateUrl: "./smart-table.component.html",
  styleUrls: ["./form-inputs.component.scss"]
})
export class EpickHomePageComponent {
  afterList: any = {};
  ourDriver: any = {};
  howItTwo: any = {};
  list: any = {};

  secondlist: any = {};
  thirdlist: any =
    {};
  firstlist: any = {};
  filedata: any;
  fourthlist: any = {};
  bannerImg: any;
  appImg: any;
  taxiImg: any;
  listFoot: any = {};
  selectedid: string;
  selectedDocs: any;
  baseurl: string = AppSettings.BASEURL;
  pages: any[] = [];
  config: any = {};
  homBannerFile: any = [];
  HFMSappImage: any = "";
  HFMSappSecondImage: any = "";
  HFMSappThirdImage: any = "";
  HSMSappImage: any = "";
  HBImage: any = "";
  HFMSappImageFourth; any = "";
  constructor(http: Http, private toastr: ButtonToasterService, private utility: UtilityService) {
    setTimeout(() => {
      this.config = {
        height: 500,
        theme: "modern",
        plugins: "code",
        toolbar:
          "code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
        image_advtab: true,
        imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
        templates: [{ title: "Test template 1", content: "Test 1" }, { title: "Test template 2", content: "Test 2" }],
        content_css: [
          "https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
          "https://www.tinymce.com/css/codepen.min.css"
        ]
      };
    }, 0);
    this.utility.getPages().then(res => {
      this.pages = res;
    });
  }

  ngOnInit(): void {
    this.ourDriver.bannerImagesHome = [];
    this.GetHomeContent();
  }

  GetHomeContent(): void {
    this.utility.getHomecontents().then(res => {
      this.ourDriver = res[0];
      this.ourDriver.bannerImagesHome = res[0].bannerImagesHome;
      this.firstlist = res[0];
      this.secondlist = res[0];
      this.thirdlist = res[0];
      this.afterList = res[0];
      this.listFoot = res[0];
      this.fourthlist = res[0];
      // this.homBannerFile=res[0].bannerImagesHome;
      // this.HFMSappImage=res[0].HFMSappImage;
      // this.HFMSappSecondImage=res[0].HFMSappSecondImage;
      // this.HFMSappThirdImage=res[0].HFMSappThirdImage;
      // this.HSMSappImage=res[0].HSMSappImage;
      // this.HBImage=res[0].HBImage;
    });
  }
  OurfileEvent(e) {
    this.homBannerFile = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.homBannerFile.push(e.target.files[i]);
    }
  }
  HowItWorksFirstfileEvent(e) {
    this.HFMSappImage = e.target.files[0];
  }
  HowItWorksSecondtfileEvent(e) {
    this.HFMSappSecondImage = e.target.files[0];
  }
  HowItWorksThirdfileEvent(e) {
    this.HFMSappThirdImage = e.target.files[0];
  }
  HowItWorksFourthfileEvent(e) {
    this.HFMSappImageFourth = e.target.files[0];
  }
  fileEvent(e) {
    this.HBImage = e.target.files[0];
  }
  HomeSecondMiddlefileEvent(e) {
    this.HSMSappImage = e.target.files[0];
  }
  submitafterListBlock(inputs: any): void {
    let formdata = new FormData();
    formdata.append("file", this.HSMSappImage);
    formdata.append("home_second_middle_app_title", inputs.home_second_middle_app_title);
    formdata.append("home_second_middle_desc", inputs.home_second_middle_desc);
    this.utility.submitHomeSeconMiddle(formdata).then(res => {
      this.toastr.showtoast("success", res.message);
    });
  }
  submitFirstBlock(inputs: any): void {
    let formdata = new FormData();
    for (var i = 0; i < this.homBannerFile.length; i++) {
      formdata.append("file", this.homBannerFile[i]);
    }
    console.log(inputs, "inputs");
    formdata.append("ourDriverTitle", inputs.ourDriverTitle);
    formdata.append("_id", this.list._id);


    this.utility.HomeBannerAndOurDriver(formdata).then(res => {
      this.toastr.showtoast("success", res.message);
    });
  }
  submitHowItWorksBlock(fourthData, thirdData, secondData, firstData): void {
    console.log(thirdData, secondData, firstData);
    //console.log(inputs);
    let formdata = new FormData();
    // formdata.append("file", this.filedata);
    formdata.append("HFMSappImage", this.HFMSappImage);
    formdata.append("HFMSappSecondImage", this.HFMSappSecondImage);
    formdata.append("HFMSappThirdImage", this.HFMSappThirdImage);
    formdata.append("HFMSappImageFourth", this.HFMSappImageFourth);


    //first 
    formdata.append("home_first_middle_app_desc_first", firstData.home_first_middle_app_desc_first);
    formdata.append("home_first_middle_app_title_first", firstData.home_first_middle_app_title_first);
    //second
    formdata.append("home_first_middle_app_title_second", secondData.home_first_middle_app_title_second);
    formdata.append("home_first_middle_app_desc_second", secondData.home_first_middle_app_desc_second);
    //third
    formdata.append("home_first_middle_app_title_third", thirdData.home_first_middle_app_title_third);
    formdata.append("home_first_middle_app_desc_third", thirdData.home_first_middle_app_desc_third);

    formdata.append("home_first_middle_app_title_fourth", fourthData.home_first_middle_app_title_fourth);
    formdata.append("home_first_middle_app_desc_fourth", fourthData.home_first_middle_app_desc_fourth);

    this.utility.updateHowItsBlock(formdata).then(res => {
      this.toastr.showtoast("success", res.message);
    });
  }
  submitSecondBlock(inputs: any): void {
    //console.log(inputs);
    let formdata = new FormData();
    formdata.append("file", this.filedata);
    formdata.append("mobile_app_moreinfo", inputs.mobile_app_moreinfo);
    formdata.append("mobile_app_right_title", inputs.mobile_app_right_title);
    formdata.append("mobile_app_right_desc", inputs.mobile_app_right_desc);
    // this.utility.updateSecondBlock(formdata).then(res => {
    //   this.toastr.showtoast("success", res.message);
    // });
  }

  submitThirdBlock(inputs: any): void {
    //console.log(inputs);
    let formdata = new FormData();
    formdata.append("file", this.filedata);
    formdata.append("taxi_app_moreinfo", inputs.taxi_app_moreinfo);
    formdata.append("taxi_app_right_title", inputs.taxi_app_right_title);
    formdata.append("taxi_app_right_desc", inputs.taxi_app_right_desc);
    // this.utility.updateThirdBlock(formdata).then(res => {
    //   this.toastr.showtoast("success", res.message);
    // });
  }
  submitFooter(inputs: any) {
    console.log(inputs);
    let formdata = new FormData();
    formdata.append("file", this.HBImage);
    formdata.append("contactAdd", inputs.contactAdd);
    formdata.append("contactNo", inputs.contactNo);
    formdata.append("contactEmail", inputs.contactEmail);
    formdata.append("driver_link_Android", inputs.driver_link_Android);
    formdata.append("footer_banner_text", inputs.footer_banner_text);
    formdata.append("rider_link_Android", inputs.rider_link_Android);
    formdata.append("driver_link_Ios", inputs.driver_link_Ios);
    formdata.append("rider_link_Ios", inputs.rider_link_Ios);
    formdata.append("social_link_twitter", inputs.social_link_twitter);
    formdata.append("driver_link_Google", inputs.driver_link_Google);
    formdata.append("driver_link_Google", inputs.driver_link_Google);
    // this.utility.updateHomeFooter(formdata).then(res => {
    //   this.toastr.showtoast("success", res.message);
    // });
  }


}  
