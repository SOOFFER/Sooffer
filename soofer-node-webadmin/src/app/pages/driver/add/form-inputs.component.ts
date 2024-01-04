import { Component, OnInit } from '@angular/core';
import { DriverService } from '../driver.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';
import { featuresSettings, inputValidation, AppSettings, documentSettings } from '../../../app.config';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';

interface CommonInter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: "ngx-form-inputs",
  styleUrls: ["./form-inputs.component.scss"],
  templateUrl: "./form-inputs.component.html",
})
export class FormInputsComponent implements OnInit {
  companyary: any[] = [];
  langary: any[] = [];
  list: any = {};
  bankList: any = {};
  // Tmsg: any = "";
  currencyary: any[] = [];
  countries: Array<CommonInter>;
  states: Array<CommonInter>;
  cities: Array<CommonInter>;
  serviceCity: Array<CommonInter>;
  baseurl = AppSettings.BASEURL;
  // Tcount: boolean = true;
  // Tcode: any = {};
  lengthservicecities: number;
  itemdata = [];
  selectedItems = [];
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  DefaultState = featuresSettings.DefaultState;
  DefaultCountry = featuresSettings.DefaultCountry;
  list_phon_code = featuresSettings.phcode;
  dropdownSettings = {
    singleSelection: true,
    idField: "_id",
    textField: "label",
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };
  validation = inputValidation;

  visibleDateOptions: DatepickerOptions = {
    minYear: 1950,
    maxYear: this.getMaxYearForDOB().getFullYear(),
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0,
    maxDate: this.getMaxYearForDOB(),
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    useEmptyBarTitle: false,
  };

  filedata: string | Blob;
  driverId: string;
  optionalField = documentSettings.showOptionalFieldDriver;
  initial = "driverAdd";
  disableFirstForm: boolean = false;
  Admin: string;

  getMaxYearForDOB() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
    // d.getFullYear()
  }

  constructor(
    private dataService: DriverService,
    private router: Router,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService
  ) {
    this.initial = "driverAdd";
    this.list.phcode = featuresSettings.selectedPhcode;
    this.Admin = localStorage.getItem("userType");
    this.getMaxYearForDOB();
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.CommonSvc.generalfunFor("AvailbleserviceCity").then((res) => {
      this.serviceCity = res;
      this.serviceCity = this.CommonSvc.dataforscids(this.serviceCity);
      if (this.Admin == "citywiseadmin") {
        this.list.scIds = this.CommonSvc.dataforscids(this.serviceCity);
        // this.list.scIds = this.serviceCity[0].label
      }
    });
  }

  checkNICAvailability(input): void {
    this.dataService
      .checkNIC(input)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
      })
      .catch((msg) => {
        this.toastr.showtoast("warn", msg.message);
        this.list.nic = "";
      });
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then((msg) => {
        this.countries = msg[0]["countries"];
        this.list.cnty = this.DefaultCountry;
        this.getStateofSelectedCountry(this.list.cnty);
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    // this.CommonSvc.getLangs()
    //   .then(msg => {
    //     this.langary = msg[0]['datas'];
    //   });
    this.CommonSvc.getCompanies().then((msg) => (this.companyary = msg));
    // this.CommonSvc.getCurrency()
    //   .then(msg => {
    //     // console.log(msg);
    //     this.currencyary = msg[0]['datas'];
    //   });
    // this.list.cmpy = '5c4ea3a354aa3637b4dfa3c7'
  }

  onItemSelect(item: any) {
    this.dispCurr(item);
    let currentCur;
    this.serviceCity.forEach((el) => {
      if (el._id === item._id) {
        currentCur = el.currency;
      }
    });
    this.list.cur = currentCur;
  }

  onItemDeSelect(item: any) {
    this.dispCurr("");
  }

  dispCurr(data) {
    if (data.label === "Default") {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.list.cur = "";
    }
  }

  selectedCountry(option: CommonInter) {
    this.list.cntyname = option.label;
    this.list.city = "";
    this.list.state = "";
    this.getStateofSelectedCountry(option.value);
  }

  deSelectedCountry(option: CommonInter) {
    this.list.cntyname = "";
    this.list.city = "";
    this.list.state = "";
    this.list.cnty = "";
  }

  selectedState(option: CommonInter) {
    this.list.statename = option.label;
    this.list.city = "";
    this.getCityofSelectedState(option.value);
  }

  deSelectedState(option: CommonInter) {
    this.list.statename = "";
    this.list.city = "";
    this.list.state = "";
  }

  selectedCity(option: CommonInter) {
    this.list.cityname = option.label;
  }

  deSelectedCity(option: CommonInter) {
    this.list.cityname = "";
    this.list.city = "";
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.GetStateofSelectedCountry(id)
      .then((response) => {
        try {
          this.states = response[0]["states"];
          this.list.state = this.DefaultState;
          this.getCityofSelectedState(this.list.state);
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  getCityofSelectedState(id) {
    this.CommonSvc.GetCity(id)
      .then((response) => {
        try {
          this.cities = response[0]["cities"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  // testCode(inp) {
  //   this.Tcode.code = inp;
  //   this.Tcount = true;
  //   this.dataService.AvailCode(this.Tcode).then(
  //     res => {
  //       if (res.success == false) {
  //         this.Tcount = false;
  //         this.Tmsg = res.message;
  //         this.list.code = "";
  //         this.Tcount = true;
  //         this.toastr.showtoast("error", res.message);
  //       }
  //       else if (res.success == true) {
  //         this.Tcount = true;
  //       }
  //     }
  //   );
  // }

  AddNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (
      (typeof inputs.scIds === "undefined" || inputs.scIds === "") &&
      this.showservicecity === true
    ) {
      this.toastr.showtoast("warn", "Enter Service Available City");
    } else {
      if (this.showservicecity === false) {
        const scIds = this.CommonSvc.convertionOfServiceId(this.serviceCity);
        (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);
      } else {
        const scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
        (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);
      }
      if (inputs.DOB !== undefined) {
        inputs.DOB = moment(inputs.DOB).format("YYYY-MM-DD");
      } else inputs.DOB = "";
      this.dataService
        .createDoc(inputs)
        .then((msg) => {
          this.toastr.showtoast("success", msg.message);
          this.driverId = msg["datas"][0]._id;
          this.disableFirstForm = true;
          this.secondScreen();
          // this.router.navigate(['/pages/tables/driver-table']);
        })
        .catch((msg) => {
          this.disableFirstForm = false;
          this.toastr.showtoast("error", msg.message);
        });
    }
  }

  firstScreen() {
    this.initial = "driverAdd";
  }

  secondScreen() {
    this.initial = "bankDetailsAdd";
  }

  addBankDetail(inputs) {
    if (!inputs) {
      return;
    }
    inputs._id = this.driverId;
    inputs.addDataFrom = "admin";

    this.dataService
      .addDriverBankDetails(inputs)
      .then((msg) => {
        this.toastr.showtoast("success", msg.message);
        this.router.navigate(["/pages/tables/driver-table"]);
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  profileImage: any;
  blockBtn: boolean = false;

  fileEvent(e) {
    this.blockBtn = false;
    this.profileImage = "";
    this.profileImage = e.target.files[0];
    this.uploadImg();
  }

  uploadImg() {
    if (this.profileImage) {
      const formData = new FormData();
      formData.append("file", this.profileImage);
      this.dataService
        .uploadDriverImage(formData)
        .then((res) => {
          this.list.profile = res.data;
          this.profileImage.profile = res.data;
          // this.toastr.showtoast('success', res.message);
          this.blockBtn = true;
        })
        .catch((res) => {
          this.blockBtn = false;
          this.toastr.showtoast("error", res.message);
        });
    } else {
      this.toastr.showtoast("error", "Please Upload Profile Image");
    }
  }

  addFile() {
    const formData = new FormData();
    formData.append("file", this.filedata);
    this.dataService
      .AddFile(formData)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.list = {};
        // this.btBack(0);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  fileChangeListener($event: any): void {
    // const files = $event.srcElement.files;
    this.filedata = $event.target.files[0];
  }
}
