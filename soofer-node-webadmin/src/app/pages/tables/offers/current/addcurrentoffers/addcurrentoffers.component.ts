import { Component, OnInit } from "@angular/core";
import { OfferService } from "../../offer.service";
import { ButtonToasterService } from "../../../../buttontoaster/buttontoaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatepickerOptions } from "ng2-datepicker";
import { Router } from "@angular/router";
import { CommonService } from "../../../../common/common.service";
import * as moment from 'moment';
import { dropdown, featuresSettings } from "../../../../../app.config";

interface citiesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: "addcurrentoffers",
  providers: [OfferService],
  templateUrl: "./addcurrentoffers.component.html"
})
export class AddcurrentoffersComponent implements OnInit {
  list: any = {};
  filedata: any;
  spinner: boolean = true;
  notValidEdate: boolean = false;
  emarr = [];
  filtercity: any;
  dropdownList = [];
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  ncityadmin = [];
  cities: Array<citiesDataList>;

  visibleDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2051,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    fieldId: "my-date-picker",
    useEmptyBarTitle: false
  };

  endDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2051,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    fieldId: "my-date-picker",
    useEmptyBarTitle: false
  };

  constructor(
    private offerservice: OfferService,
    private router: Router,
    private commonservice: CommonService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService
  ) {

    this.commonservice.doAddFormControlNgSelectClass();


  }

  // getcdata(data){
  //   this.commonservice.generalfunFor(data)
  //   .then(res => {
  //     console.log(res)
  //     this.filtercity = res;
  //     this.filtercity.forEach(el => {
  //         this.ncityadmin.push(el)
  //     })
  //     this.dropdownList = this.ncityadmin;
  //     console.log(this.ncityadmin)
  //   })
  // }

  ngOnInit(): void {
    this.commonservice.getServiceAvailableCity()
      .then(res => {
        //  console.log(res)
        this.cities = res
        this.cities = this.commonservice.convertionOfServiceId(this.cities)
        this.cities = this.commonservice.dataforscids(this.cities)
        if(localStorage.getItem('userType')=='citywiseadmin'){
          this.list.scIds = this.commonservice.dataforscids(this.cities)
        }
        // console.log(this.cities)
      })







    // this.list = {};
    // this.list.vdate = "";
    // this.list.edate = "";
    // this.filedata = "";
  }

  // getCity() {
  //   this.commonservice
  //     .getServiceAvailableCity()
  //     .then(response => {
  //       try {
  //         this.cities = response;
  //         console.log(this.cities)
  //       } catch (e) {
  //         this.toastr.showtoast("error", e.toString());
  //       }
  //     })
  //     .catch(response => {
  //       this.spinnerLoad.hide();
  //       let errorMessage = "Something went wrong.";
  //       errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(
  //         errorMessage,
  //         response
  //       );
  //       this.toastr.showtoast("error", errorMessage.toString());
  //     });
  // }

  // FILE DATA

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  // DISABLE ERROR

  disableError(event) {
    this.notValidEdate = false;
  }

  // CHECK DATE

  checkDate(from, to) {
    return moment(from).isSameOrBefore(to);
  }

  // CITIES

  selectedCity(option: citiesDataList) {
    this.list.getCity = option.label;
    this.list.cityId = option.value;
  }

  deSelectedCity(option: citiesDataList) {
    this.list.cityId = "";
    this.list.getCity = "";
  }

  // POST DATA

  addNewOffer(inputs: any): void {

    if (!inputs) { return; }
    if ((typeof inputs.scIds === "undefined" || inputs.scIds === '') && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      }
      else {
        inputs.scIds = this.commonservice.convertionOfServiceId(inputs.scIds);
      }
      this.spinner = false;
      this.notValidEdate = false;
      this.list.vdate = moment(inputs.vdate).format("YYYY-MM-DD");
      this.list.edate = moment(inputs.edate).format("YYYY-MM-DD");
      if (this.checkDate(this.list.vdate, this.list.edate)) {
        this.notValidEdate = false;
        let formdata = new FormData();
        formdata.append("file", this.filedata);
        formdata.append("scIds", JSON.stringify(inputs.scIds));
        formdata.append("title", this.list.title);
        formdata.append("edate", this.list.edate);
        formdata.append("vdate", this.list.vdate);
        formdata.append("desc", this.list.desc);
        this.offerservice.createDoc(formdata)
          .then(msg => {
            this.spinner = true;
            let body = msg.json();
            this.toastr.showtoast('success', body.message);
            this.router.navigate(['/pages/tables/offers/current/viewcurrentoffers']);
          })
          .catch(msg => {
            this.spinner = true;
            let body = msg.json();
            this.toastr.showtoast("error", body.message);
          })
      } else {
        this.notValidEdate = true;
        this.spinner = true;
        this.toastr.showtoast("warn", 'Enter Valid Offer End Date')
      }
    }
  }
}
