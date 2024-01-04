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
export class EpickDriverComponent {
  afterList: any = {};
  ourDriver: any = {};
  howItTwo: any = {};
  list: any = {};

  secondlist: any = {};
  thirdlist: any = {};
  firstlist: any = {};
  filedata: any;
  fourthlist: any = {};

  bannerImg: any;
  appImg: any;
  riderPage: any = {};
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
  HFMSappImageFourth: any = "";
  constructor(http: Http, private toastr: ButtonToasterService, private utility: UtilityService) {
    setTimeout(() => {
      this.config = {
        height: 200,
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
    this.GetHomeContent();
  }

  GetHomeContent(): void {
    this.utility.getHomecontents().then(res => {
      this.riderPage = res[0].driverPage;
      this.firstlist = res[0].driverPage;
      this.secondlist = res[0].driverPage;
      this.fourthlist = res[0].driverPage;
      this.thirdlist = res[0].driverPage;

      // this.HFMSappImage=res[0].driverPage.HFMSappImage;
      // this.HFMSappSecondImage=res[0].driverPage.HFMSappSecondImage;
      // this.HFMSappThirdImage=res[0].driverPage.HFMSappThirdImage;
      // this.HBImage=res[0].driverPage.HBImage;
      // this.listFoot = res[0];
      // if (this.list.home_banner_image != "" || this.list.home_banner_image != undefined) {
      //   this.bannerImg = this.list.home_banner_image;
      // } else {
      //   this.bannerImg = 0;

      // }
      // if (this.list.mobile_app_left_img != "" || this.list.mobile_app_left_img != undefined) {
      //   this.appImg = this.list.mobile_app_left_img;
      // } else {
      //   this.appImg = 0;
      // }
      // if (this.list.taxi_app_bg_img != "" || this.list.taxi_app_bg_img != undefined) {
      //   this.taxiImg = this.list.taxi_app_bg_img;
      // } else {
      //   this.taxiImg = 0;
      // }
    });
  }
  OurfileEvent(e) {
    this.homBannerFile = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.homBannerFile.push(e.target.files[i]);
    }
  }
  HowItWorksFirstfileEvent(e) {
    // console.log(this.HFMSappImage,typeof  e.target.files[0],typeof  e.target.files[0]  ==="undefined")
    if (typeof e.target.files[0] === "undefined") {
      this.HFMSappImage = "";
      //  console.log(this.HFMSappImage,typeof  e.target.files[0]  ===undefined)
    }
    else
      this.HFMSappImage = e.target.files[0];
  }
  HowItWorksSecondtfileEvent(e) {
    if (typeof e.target.files[0] == "undefined")
      this.HFMSappSecondImage = "";
    else
      this.HFMSappSecondImage = e.target.files[0];
  }
  HowItWorksFourthfileEvent(e) {
    this.HFMSappImageFourth = e.target.files[0];
  }
  HowItWorksThirdfileEvent(e) {
    if (typeof e.target.files[0] == "undefined")
      this.HFMSappThirdImage = "";
    else
      this.HFMSappThirdImage = e.target.files[0];
  }
  fileEvent(e) {
    if (typeof e.target.files[0] == "undefined")
      this.HBImage = "";
    else
      this.HBImage = e.target.files[0];

  }
  HomeSecondMiddlefileEvent(e) {
    this.HSMSappImage = e.target.files[0];
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

    this.utility.updateHowItsBlockForDriver(formdata).then(res => {
      this.toastr.showtoast("success", res.message);
    });
  }

  submitFooter(inputs: any) {
    if (this.HBImage == "" || this.HBImage == "undefined" || this.HBImage == undefined)
      this.toastr.showtoast("warn", "Please Select Image.");
    else {
      let formdata = new FormData();
      formdata.append("file", this.HBImage);
      formdata.append("aboutContent_first", inputs.aboutContent_first);
      formdata.append("footer_banner_text", inputs.footer_banner_text);
      formdata.append("aboutContent_second", inputs.aboutContent_second);
      formdata.append("serviceContent_second_title", inputs.serviceContent_second_title);
      formdata.append("serviceContent_second", inputs.serviceContent_second);
      formdata.append("serviceContent_first_title", inputs.serviceContent_first_title);
      formdata.append("serviceContent_first", inputs.serviceContent_first);
      formdata.append("serviceContent_third_title", inputs.serviceContent_third_title);
      formdata.append("serviceContent_third", inputs.serviceContent_third);
      formdata.append("banner_text", inputs.banner_text);


      this.utility.updateDriverPage(formdata).then(res => {
        this.toastr.showtoast("success", res.message);
      });
    }

  }

  // goBack():void {
  //   this.trip = "triplist";
  // }

  // filterRes(fromDate,toDate){
  // }
} //Export
