import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./profile.service";
import { AppSettings } from "../../app.config";
import { CommonService } from "../common/common.service";
import { ButtonToasterService } from "../buttontoaster/buttontoaster.service";
import { DatePipe } from "@angular/common";
import { Service } from "../ridersignup/ridersignup.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataSharingService } from "../common/data-sharing.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";

@Component({
  selector: "profile",
  templateUrl: "./profile.html",
  styleUrls: ["./profile.css"],
  providers: [
    ProfileService,
    CommonService,
    ButtonToasterService,
    DatePipe,
    Service,
  ],
})
export class ProfileComponent implements OnInit {
  documentMessage: string;
  selectedDocs: any;
  singleTaxi: any;
  selectedid: any;
  baseurl: string = AppSettings.BASEURL;
  private apiUrl = AppSettings.FEURL;
  expandedprofile = true;
  expandededitpassword = false;
  expandededitmobile = false;
  expandedprofiledetail = false;
  expandedemaildetail = false;
  expandedemail = true;
  list: any = {};
  SetDetail: any = {};
  SetBankDetail: Object = {}
  SelectedUser: any;
  SelectedUserPic: any;
  driverLicencePic: any;
  taxiPassingPic: any;
  insuranceDocPic: any;
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
  filedataProfile: any = [];
  filedataPassing: any = [];
  filedataInsurance: any = [];
  filedataLicence: any = [];
  filedataPassingN: any;
  filedataInsuranceN: any;
  filedataLicenceN: any;
  expiryDate: any;
  profileData: any;
  showProfileSave = false;
  taxiFirstDocset: any[];
  multipleDriDoc: any = {};
  multipleDriDocExpiryDate: any = {};
  finalDriverDocs: any;
  documnet_set_api: any = [];
  opendialog: any;
  constructor(
    private eservice: ProfileService,
    private dataService: Service,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private bt: ButtonToasterService,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private tost: ButtonToasterService,
    private CommonSvc: CommonService
  ) {
    this.list = localStorage.getItem("Id");
    this.getDriver();
  }
  driver_documnt: any = {};
  getDriver() {
    this.spinner.show();
    this.eservice
      .getDetails()
      .then((res) => {
        this.SetDetail = res[0];
        this.SelectedUser = this.SetDetail.fname;
        (this.selectedid = this.SetDetail._id),
          (this.SelectedUserPic = this.baseurl + res[0].profile);
        this.SetDetail.updatingUserPic = ""; // SetDetail.cntySetDetail.state
        this.dynamicDriverDocumentFlow()
        // this.getDocumentsettings(this.SetDetail._id)
        this.driver_documnt = {};
        if (this.SetDetail.document)
          if (this.SetDetail.document.length)
            for (var i = 0; i < this.SetDetail.document.length; i++) {
              this.driver_documnt[
                this.SetDetail.document[i].fileFor
              ] = this.SetDetail.document[i];
            }
        this.spinner.hide();
        this.dataService.GetState(this.SetDetail.cnty).then((msg) => {
          this.stateary = msg[0]["states"];
        });
        this.dataService.GetCity(this.SetDetail.state).then((msg) => {
          this.cityary = msg[0]["cities"];
        });
      })
      .catch((res) => {
        this.tost.showtoast("error", res.message);
        this.spinner.hide();
      });
  }
  docDoc(string) {
    console.log(string);
  }
  submitMultipleDriverDoc(filefor, filefor2, ind) {
    console.log(this.multipleDriDoc);
    console.log(filefor, ind);
    // this.taxiFirstDocset[ind] = false;
    console.log(this.finalDriverDocs[ind].fileFor);
    if (
      this.finalDriverDocs[ind].docExp &&
      this.multipleDriDoc.docExp === undefined
    ) {
      this.tost.showtoast("warn", "Please Choose  Date For " + filefor);
      return;
    }
    if (
      this.finalDriverDocs[ind].docFrontImg &&
      this.multipleDriDoc.docFrontImg === undefined
    ) {
      this.tost.showtoast("warn", "Please Choose  Front Image  For " + filefor);
      return;
    }
    if (
      this.finalDriverDocs[ind].docBackImg &&
      this.multipleDriDoc.docBackImg === undefined
    ) {
      this.tost.showtoast("warn", "Please Choose  Back Image  For " + filefor);
      return;
    }

    const formdata = new FormData();
    formdata.append("filefor", filefor2);
    formdata.append("expDate", this.multipleDriDoc.docExp);
    formdata.append("fileFront", this.multipleDriDoc.docFrontImg);
    formdata.append("fileBack", this.multipleDriDoc.docBackImg);
    formdata.append("driverId", this.SetDetail._id);

    this.eservice
      .uploadDriverDocsDynamic(formdata)
      .then((msg) => {
        this.multipleDriDoc = {};
        this.updateFinalDriverDocs(msg.data, filefor, ind)
        this.tost.showtoast("success", msg.message);
        this.opendialog.close()
      })
      .catch((err) => {
        this.tost.showtoast("error", err.message);
      });
    // }
  }
  async dynamicDriverDocumentFlow(lang = "en") {
    //DRIVER DOCS Execution
    let _id = this.SetDetail._id;
    await this.CommonSvc
      .getDocumentsettings(_id)
      .then((res) => {
        this.finalDriverDocs = [...res.driverDocs] || [];
        this.patchDriverDocumentDetails(this.SetDetail.document)
      })
      .catch((err) => {
        console.warn("Driver Docs", err)
      });
  }

  patchDriverDocumentDetails(driverData) {
    driverData.forEach(el => {
      this.finalDriverDocs.forEach((drv, i) => {

        if (drv.fileFor === el.fileFor) {
          if (drv.front) {
            this.finalDriverDocs[i].docFrontImg = el.docFrontImg;
          }
          if (drv.back) {
            this.finalDriverDocs[i].docBackImg = el.docBackImg;
          }
          if (drv.exp) {
            this.finalDriverDocs[i].docExp = el.docExp;
          }
        }
      });
    });

  }
  updateFinalDriverDocs(data, fileFor, ind) {
    this.finalDriverDocs.forEach(el => {
      if (el.fileFor === fileFor) {
        this.finalDriverDocs[ind].docExp = data.docExp === 'Invalid date' ? null : new Date(data.docExp).toISOString();
        this.finalDriverDocs[ind].docFrontImg = data.docFrontImg;
        this.finalDriverDocs[ind].docBackImg = data.docBackImg;
      }
    });
  }


  multipleDriverDate(msg) {
    this.multipleDriDocExpiryDate[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
    this.multipleDriDoc.docExp = this.datePipe.transform(
      msg.input.value,
      "MM/dd/yyyy"
    );
  }
  multipleDriverFile(e) {
    this.multipleDriDoc[e.target.name] = e.target.files[0];
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then((response) => {
        this.countryary = response[0]["countries"];
      })
      .catch((res) => {
        this.tost.showtoast("error", res.message);
      });
    this.dataService
      .getLangs()
      .then((msg) => (this.langary = msg[0]["datas"]))
      .catch((res) => {
        this.tost.showtoast("error", res.message);
      });
    this.dataService
      .getCurrency()
      .then((msg) => (this.currencyary = msg[0]["datas"]))
      .catch((res) => {
        this.tost.showtoast("error", res.message);
      });
  }

  GetState(data: any): void {
    if (!data) {
      return;
    }
    this.spinner.show();
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.SetDetail.cntyname = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.dataService
      .GetState(selectElementId)
      .then((msg) => {
        this.stateary = msg[0]["states"];
        this.spinner.hide();
      })
      .catch((res) => {
        this.tost.showtoast("error", res.message);
        this.spinner.hide();
      });
  }

  GetCity(data: any): void {
    if (!data) {
      return;
    }
    this.spinner.show();
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.SetDetail.statename = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.dataService
      .GetCity(selectElementId)
      .then((msg) => {
        this.cityary = msg[0]["cities"];
        this.spinner.hide();
      })
      .catch((res) => {
        this.tost.showtoast("error", res.message);
        this.spinner.hide();
      });
  }

  SetCity(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.SetDetail.cityname = selectElementText;
  }

  uplaodDriverProfile(input) { }

  updatePassWord(input) {
    // input.emai=this.SetDetail.email;
    // this.eservice.resetPassWord(input)
    // .then(res=>{
    // })
  }

  editpassword(event) {
    // this.tost.showtoast("success", "I am working");
    this.expandededitpassword = !this.expandededitpassword;
    this.expandededitmobile = false;
    this.expandedemaildetail = false;
    // this.expandededitpassword = false;
  }

  editmobile(event) {
    // this.tost.showtoast("success", "I am working");
    this.expandededitmobile = !this.expandededitmobile;
    this.expandededitpassword = false;
    this.expandedemaildetail = false;
  }

  profiledetail(event) {
    this.expandedprofiledetail = !this.expandedprofiledetail;
    this.expandedprofile = !this.expandedprofile;
    this.showProfileSave = !this.showProfileSave;
    window.scroll(0, 0);
    this.getDriver();
    this.getBankDetails();
  }

  getBankDetails(){
    this.eservice.getDriverBankDetails(this.selectedid).then(res => {
      this.SetBankDetail = res.bankDetails      
    })
  }

  logout() {
    // localStorage.clear();
    localStorage.removeItem('Tok');
    this.dataSharingService.isUserLoggedIn.next(false);
    this.router.navigate(["/"]);
  }

  editemail(event) {
    this.expandedemaildetail = !this.expandedemaildetail;
    this.expandededitpassword = false;
    this.expandededitmobile = false;
    this.expandedemail = !this.expandedemail;
  }

  getFilePath(e) {
    console.log(e.target.files[0]);
    this.profileData = e.target.files[0];
  }



  updateRecord(type, inputs: any): void {
    if (!inputs) {
      return;
    }
    this.spinner.show();
    this.eservice
      .updateDriverData(inputs)
      .then((res) => {
        const err = JSON.parse(res._body);
        if (err.success === true) {
          this.tost.showtoast("success", err.message);
          if (type === "profile") {
            this.profiledetail("e");
          } else if (type === "phone") {
            this.expandededitmobile = !this.expandededitmobile;
          } else if (type === "bank") {
            this.expandedemaildetail = !this.expandedemaildetail;
          }
        }
        this.spinner.hide();
      })
      .catch((res) => {
        this.tost.showtoast("error", res.message);
        this.spinner.hide();
      });
  }

  updateBank(type, inputs: any) {
    if (!inputs) {
      return;
    }
    console.log("selected id", this.selectedid);
    inputs._id = this.selectedid
    this.spinner.show();
    this.eservice.updateDriverBankDetails(this.selectedid, inputs).
      then((res) => {
        console.log("response",res);
        this.spinner.hide();
        this.expandedemaildetail = !this.expandedemaildetail;
      }).
      catch(res => {
        this.tost.showtoast("error", res.message);
        this.spinner.hide();
      })



  }


  logDate(msg) {
    // console.log(msg);
    this.expiryDate = this.datePipe.transform(msg.target.value, "dd-MM-yyyy");
  }

  fileEvent2(e) {
    console.log(e.target.files[0]);
    this.profileData = e.target.files[0];
  }

  fileEvent(e) {
    console.log(e.target.files[0]);
    this.filedata = e.target.files[0];
  }

  fileEventProfile(e) {
    // console.log(e.target.files[0]);
    this.filedataProfile = e.target.files[0];
  }

  setProfile() {
    if (this.profileData) {
      this.spinner.show();
      const formdata = new FormData();
      formdata.append("file", this.profileData);
      formdata.append("email", this.SetDetail.email);
      formdata.append("fname", this.SetDetail.fname);
      formdata.append("lname", this.SetDetail.lname);
      this.eservice
        .uploadDriverProfile(formdata)
        .then((msg) => {
          this.tost.showtoast("success", msg.message);
          this.SelectedUserPic = this.baseurl + msg.request.profile;
          this.showProfileSave = !this.showProfileSave;
          const element = document.getElementById("CloseButton") as any;
          element.click();
          this.spinner.hide();
        })
        .catch((res) => {
          this.tost.showtoast("error", res.message);
          this.spinner.hide();
        });
    }
  }
  openModal(content) {
    this.opendialog = this.dialog.open(content)
  }
}
