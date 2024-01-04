import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { TaxiDispatchService } from "../taxidispatch.service";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../common/common.service";
import {
  AppSettings,
  featuresSettings,
  inputValidation,
  FarefieldConfig,
} from "../../../app.config";
import * as moment from "moment";
import { FareInvoiceDetails, FareStructure } from "../../../fare.config";
import { Subject } from "rxjs";
import { DeprecatedI18NPipesModule } from "@angular/common";
import * as _ from "lodash";
import { enableRipple } from "@syncfusion/ej2-base";
import { TimePickerComponent } from "@syncfusion/ej2-angular-calendars";
import { ToastrService } from "ngx-toastr";
import { access } from "fs";

//enable ripple style
enableRipple(true);
interface triptypeData {
  value: string;
  label: string;
}

interface ngSelectOptionsDataStructure {
  value: string;
  label: string;
  disabled?: boolean;
}

interface packageData {
  distance: number;
  duration: number;
  name: string;
  price: number;
  _id: string;
}

@Component({
  selector: "ngx-form-inputs",
  styleUrls: ["./form-inputs.component.scss"],
  templateUrl: "./form-inputs.component.html",
})
export class FormInputsComponent implements OnInit {
  fareList: FareStructure[] = FareInvoiceDetails.availableFare.filter(
    (data) => data.isShow == true
  );
  fareListCopy = [];
  time: Date;
  list_phon_code = featuresSettings.phcode;

  list: any = {
    fareDetails: {
      distance: 0,
      packageFare: 0,
      BaseFare: 0.0,
      bookingFare: 0.0,
      currency: AppSettings.defaultcur,
      tax: 0,
      minFare: 0,
      travelRate: 0,
      DetuctedFare: 0,
      perKMRate: 0,
      KMFare: 0,
      waitingCharge: 0,
      waitingFare: 0,
      pickupCharge: 0,
      travelFare: 0,
      totalFare: 0,
      fareType: "N/A",
      inSecondaryCur: 0,
      surgePercent: 0,
      surgeLabel: "N/A",
      packageName: "N/A",
      packageDuration: 0,
      packageDistance: 0.0,
      baseFare: 0.0,
      additionalFareLabel: "N/A",
      additionalTimeLabel: "N/A",
      bkm: 0.0,
      timeFare: 0.0,
      fare: 0.0,
      noOfNights: 0,
      nightRate: 0.0,
      nightFare: 0.0,
      noOfDays: 0,
      dayFare: 0.0,
      dayRate: 0.0,
      googleRate: 0.0,
      backupFare: 0.0,
    },
    distanceDetails: {
      timeLable: "0 Mins",
    },
    unit: 0,
  };
  departArray: any = [];
  returnArray: any = [];
  TripType: Array<triptypeData>;
  PackageList: Array<packageData>;
  pickupformatAdd: any;
  getfareData: any;
  DataTobeAdded: boolean = false;
  dropformatAdd: any;
  vehicleArray: any;
  driverArray: any;
  showVehicle: boolean = false;
  showEstimatedFare: boolean = false;
  showFareDetails: boolean = false;
  safeRidestatus: boolean = false;
  showSecondCurrency = AppSettings.toShowSeocndCurrency;
  secondCurrecny = AppSettings.secondCurrency;
  showError: any;
  icon: any;
  temp: string = AppSettings.BASEURL;
  availableTrips = featuresSettings.tripsAvailable;
  defaultUnit = featuresSettings.distanceUnit;
  noFilterThreshold: number = 4;
  public min = new Date();
  requestType: number = 1;
  requestData: number = 1;
  driverAssignmentTypes: Array<ngSelectOptionsDataStructure>;
  drivers: Array<ngSelectOptionsDataStructure>;
  bookingTypes: Array<ngSelectOptionsDataStructure>;
  isDTS = featuresSettings.isDTS;
  promoCodeValues: any = {};
  blockPromo: boolean = false;
  showFareConfig = FarefieldConfig.showFareFromConfig;

  pickupChargeValues: any = {};
  blockPickup: boolean = false;
  className: string = "col-md-6";
  showPickupCharge = FarefieldConfig.showManuallyAddPickupCharge;
  serviceDatilsrental: any = {};
  minDate: any; // Date;// = new Date('8/3/2017 9:15 AM');
  maxDate: any; //Date;// = new Date('8/3/2017 11:30 AM');

  returnMinDate: any;
  returnMaxDate: any;
  totalReturnHours: any = "";
  convertedTripDates: any = {};

  rideLaterMaxDate: any;
  rideLaterMinDate: any;
  rideLaterDateArray: any = [];
  rideLaterConvertedDate = "today";

  constructor(
    private dataService: TaxiDispatchService,
    private toastr: ButtonToasterService,
    private spinner: NgxSpinnerService,
    private CommonSvc: CommonService,
    private cd: ChangeDetectorRef,
    private ngxToastr: ToastrService
  ) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.convertTripType(this.availableTrips);
    this.promoCodeValues = {
      discountAmt: 0,
    };
    this.pickupChargeValues = {
      pickupCharge: null,
    };
    this.rideLaterConvertedDate = this.convertDate("today");
    this.list.tripType = "daily";
    this.getTripBookingTypes();
    this.list.unit = this.defaultUnit;
    this.list.driverAssignmentType = "auto-assign";
    this.list.bookingType = "rideNow";
    this.fareListCopy = this.fareList;
    this.showJourneyCard = false;
    this.initializeTripFunctions();
    this.list.acneeded = true;
  }

  setPickupCharge(data) {
    this.blockPickup = true;
    this.setCallCenterCharge();
    this.setFinalFare();
  }

  changePickup() {
    this.blockPickup = false;
    this.pickupChargeValues.pickupCharge = null;
    this.setCallCenterCharge();
    this.setFinalFare();
  }

  changePromo() {
    this.blockPromo = false;
    this.promoCodeValues.promoCode = this.promoCodeValues.promoCode;
    this.promoCodeValues.discountAmt = 0;
    this.setPromoCodeValues("", "0.00");
  }

  checkUser(user, exists) {
    if (exists) {
      return user._id ? true : false;
    } else {
      return true;
    }
  }

  checkPromo(data) {
    this.spinner.show();
    data.userId = this.list.user ? this.list.user._id : "";
    (data.pickupLat = this.list.pickupLat),
      (data.pickupLng = this.list.pickupLng),
      (data.tripType = this.list.tripType),
      this.dataService
        .validatePromoCode(data)
        .then((res) => {
          this.spinner.hide();
          this.toastr.showtoast("success", res.message);
          this.promoCodeValues.discountAmt = res.discountAmt;
          this.setPromoCodeValues(data.promoCode, res.discountAmt);
          this.blockPromo = true;
        })
        .catch((res) => {
          this.spinner.hide();
          res = res.error;
          this.blockPromo = false;
          this.setPromoCodeValues("", "0.00");
          let errorMessage = "Something went wrong.";
          errorMessage = res !== undefined ? res.message : errorMessage;
          this.toastr.showtoast("error", errorMessage);
        });
  }

  setPromoCodeValues(sideVal, val) {
    const index = this.fareListCopy.findIndex((p) => p.ref === "discountAmt");
    if (index !== -1) {
      this.fareListCopy[index].value = val;
      this.fareListCopy[index].sideVal = sideVal;
    } else {
    }
  }

  ngOnInit() {
    this.initialize();
    this.initializeDrop();
    this.list.phcode = featuresSettings.selectedPhcode;
    //setting for drop down for india loction only(1st perference)
    // this.getAllDrivers();
  }

  convertTripType(data) {
    const typeArr = [];
    data.forEach((el) => {
      typeArr.push({
        label: el,
        value: el.toLowerCase(),
      });
    });
    this.TripType = typeArr;
  }

  tripTypeDoAssignSelected(option: triptypeData) {
    this.getDriverAssignmentModes();
    if (option.value === "daily") {
      this.className = "col-md-6";
      this.resetFare();
    } else if (option.value === "rental") {
      this.className = "col-md-6";
      this.list.bookingType = "rideLater";
      this.list.rideLaterDate = "today";
      this.generateRideLaterTime("today");
      this.generateRideLaterDate();
      this.resetFare();
    } else if (option.value === "outstation") {
      this.className = "col-md-3";
      this.list.journeyTrip = "oneway";
      this.list.bookingType = "rideLater";
      this.resetFare();
      this.list.departDate = "today";
      this.convertedTripDates = {
        startDate: moment().format("DD MMM YYYY"),
        startTime: "",
        endDate: moment().format("DD MMM YYYY"),
        endTime: "",
        startDay: "",
        endDay: "",
      };
    }
    this.getTripBookingTypes();
    this.list.rentalPackage = "";
    this.list.pickupLocation = "";
    this.list.serviceTypeId = "";
    this.PackageList = [];
    this.vehicleArray = [];
  }

  tripTypeDoUnassignDeselected(option: triptypeData) { }

  rentalPackageDoUnassignDeselected(option: packageData) { }

  rentalPackageDoAssignSelected(option: packageData) {
    this.spinner.show();
    this.list.rentalPackage = option._id;
    const dataToSend = {
      packageId: option._id,
      serviceId: this.serviceDatilsrental,
      tripTypeCode: "rental",
    };
    this.dataService
      .getVehicleForrental(dataToSend)
      .then((res) => {
        this.showVehicle = true;
        this.list.serviceTypeId = undefined;
        this.vehicleArray = res.data;
        this.showEstimatedFare = false;
        this.showFareDetails = false;

        this.list.fareDetails = {
          packageFare: 0,

          distance: 0,
          BaseFare: 0,
          currency: AppSettings.defaultcur,
          tax: 0,
          taxAmount: 0,
          fareBeforeTax: 0,
          minFareAdded: 0,
          taxPercentage: 0,
          minFare: 0,
          travelRate: 0,
          DetuctedFare: 0,
          perKMRate: 0,
          KMFare: 0,
          waitingCharge: 0,
          waitingFare: 0,
          pickupCharge: 0,
          travelFare: 0,
          fareType: "N/A",
          totalFare: 0,
          bookingFare: 0,
          inSecondaryCur: 0,
          surgePercent: 0,
          surgeLabel: "N/A",
          packageName: "N/A",
          packageDuration: 0,
          packageDistance: 0.0,
          baseFare: 0.0,
          additionalFareLabel: "N/A",
          additionalTimeLabel: "N/A",
          // fareBeforeTax:0,
          bkm: 0.0,
          timeFare: 0.0,
          fare: 0.0,
          noOfNights: 0,
          nightRate: 0.0,
          nightFare: 0.0,
          noOfDays: 0,
          dayFare: 0.0,
          dayRate: 0.0,
          googleRate: 0.0,
          backupFare: 0.0,
        };
        (this.list.distanceDetails = {
          timeLable: "0 Mins",
        }),
          (this.list.unit = 0);
        this.blockPromo = false;
        this.promoCodeValues = {};
        this.promoCodeValues = {
          discountAmt: 0,
        };
        this.list.unit = this.defaultUnit;
        this.list.driverAssignmentType = "auto-assign";
        this.list.bookingType = "rideLater";
        this.totalReturnHours = res.returnHours;
        this.showFareConfig = FarefieldConfig.showFareFromConfig;
        delete this.fareListCopy;
        this.fareListCopy = [];
        this.fareListCopy = this.fareList;
        this.spinner.hide();
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.error.message);
        this.spinner.hide();
      });
  }

  async handleChange1(data) {
    if (data === "oneway") {
      await this.generateDateArrayForOneWay();
      await this.generateTimeArrayForOneWay("today");
      await this.getfare();
    } else {
      this.list.returnDate = moment(
        this.getInitialReturnDay(),
        "DD MMM YYYY, hh:mm A"
      ).format("ddd, DD MMM");
      await this.generateRoundTripDate();
      await this.generateRoundTripTime();
      await this.getfare();
    }
  }

  getOneWayStartDay() {
    let stDay;
    this.convertedTripDates.startTime = moment(
      this.list.time,
      "YYYY-MM-DDTHH:mm:ss"
    ).format("hh:mm A");
    stDay =
      this.convertedTripDates.startDate +
      ", " +
      this.convertedTripDates.startTime;
    this.convertedTripDates.startDay = stDay;
    return this.convertedTripDates.startDay;
  }

  getInitialReturnDay() {
    return moment(this.getOneWayStartDay(), "DD MMM YYYY, hh:mm A")
      .add(this.totalReturnHours, "hour")
      .format("DD MMM YYYY, hh:mm A");
  }

  generateRoundTripDate() {
    const st = this.getInitialReturnDay();
    const startDate = moment(st, "DD MMM YYYY, hh:mm A").format("YYYY-MM-DD");
    const endDate = moment(st, "DD MMM YYYY, hh:mm A")
      .add(10, "days")
      .format("YYYY-MM-DD");
    const current = moment().format("YYYY-MM-DD");
    const dateArrays = [];
    let currentDate = moment(startDate);
    const stopDate = moment(endDate);
    while (currentDate <= stopDate) {
      dateArrays.push({
        label: moment(currentDate).format("ddd, DD MMM"),
        value: moment(currentDate).format("ddd, DD MMM"),
      });
      currentDate = moment(currentDate).add(1, "days");
    }
    this.returnArray = dateArrays;
    this.list.returnDate = this.returnArray[0].value;
  }

  generateRoundTripTime() {
    const st = this.getInitialReturnDay();
    this.list.returnTime = moment(st, "DD MMM YYYY, hh:mm A").format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    let CurrentHour, CurrentMinutes;
    CurrentHour = moment(st, "DD MMM YYYY, hh:mm A").hour();
    CurrentMinutes = moment(st, "DD MMM YYYY, hh:mm A").minutes();
    this.returnMinDate = moment(st, "DD MMM YYYY, hh:mm A").format(
      "MM/DD/YYYY hh:mm A"
    );
  }

  SetDepartType(event, listDAta) {
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.convertedTripDates.startDate = this.convertDate(selectElementText);
    if (selectElementText !== "Today") {
      this.generateTimeArrayForOneWay("someOtherDay");
    } else {
      this.generateTimeArrayForOneWay("today");
    }
    this.generateRoundTripDate();
    this.generateRoundTripTime();
    this.getfare();
  }

  convertDate(date) {
    if (date === "Today" || date === "today") {
      return moment().format("DD MMM YYYY");
    } else if (date === "Tomorrow" || date === "tomorrow") {
      return moment().add(1, "day").format("DD MMM YYYY");
    } else {
      return moment(date, "ddd, DD MMM").format("DD MMM YYYY");
    }
  }

  generateDateArrayForOneWay() {
    const dateArray = [];
    const dayToExclude = moment().day();
    for (let d1 = 1; d1 <= 8; d1++) {
      if (d1 !== dayToExclude && d1 !== dayToExclude + 1) {
        if (d1 < dayToExclude && d1 + 8 !== dayToExclude) {
          dateArray.push({
            label: moment()
              .day(d1 + 8)
              .format("ddd, DD MMM"),
            value: d1 + 8,
          });
        } else {
          dateArray.push({
            label: moment().day(d1).format("ddd, DD MMM"),
            value: d1,
          });
        }
      }
    }
    this.departArray = _.sortBy(dateArray, ["value"]);
  }

  generateTimeArrayForOneWay(day) {
    if (day === "today") {
      let timeArray = [],
        CurrentHour,
        CurrentMinutes;
      const currentDate = moment().format("DD/MM/YYYY hh:mm A");
      CurrentHour = moment().hour();
      CurrentMinutes = moment().minutes();
      const diffOfMinute = CurrentMinutes >= 30 ? 30 : 0o0;
      if (CurrentMinutes >= 30) {
        const temp = 30; //CurrentMinutes-30;
        const temp2 = 60 - CurrentMinutes;
        // this.minDate =  (moment().subtract((CurrentMinutes-30),"minute").format('MM/DD/YYYY hh:mm A'));
        this.minDate = moment()
          .add(temp + temp2, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.time = moment(this.minDate, "MM/DD/YYYY hh:mm A").format(
          "YYYY-MM-DDTHH:mm:ss"
        );
      } else {
        const temp = 60 - CurrentMinutes;
        this.minDate = moment()
          .add(temp, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.time = moment(this.minDate, "MM/DD/YYYY hh:mm A").format(
          "YYYY-MM-DDTHH:mm:ss"
        );
      }
      this.minDate = new Date(this.minDate);
      this.list.time = moment(this.minDate, "MM/DD/YYYY hh:mm A").format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    } else {
      const tomorrow = moment(new Date()).add(1, "days").startOf("day");
      const tomorrowEnd = moment(new Date()).add(1, "days").endOf("day");
      this.minDate = new Date(tomorrow.toString());
      this.maxDate = new Date(tomorrowEnd.toString());
      this.list.time = this.minDate;
    }
  }

  changeDepartTime(e) {
    this.list.time = e.value;
    this.getfare();
    this.generateRoundTripDate();
    this.generateRoundTripTime();
  }

  changeReturnTime(e) {
    this.list.returnTime = e.value;
    this.getfare();
  }

  /** Round Trip */

  setReturnType(event, listDAta) {
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.returnDate = selectElementText;
    this.generateRoundTripTimeForChangedDate();
    this.getfare();
  }

  generateRoundTripTimeForChangedDate() {
    if (this.list.returnDate !== this.returnArray[0].value) {
      const tomorrow = moment(new Date()).add(1, "days").startOf("day");
      const tomorrowEnd = moment(new Date()).add(1, "days").endOf("day");
      this.returnMinDate = new Date(tomorrow.toString());
      this.returnMaxDate = new Date(tomorrowEnd.toString());
      this.list.returnTime = this.returnMinDate;
    } else {
      this.generateRoundTripDate();
      this.generateRoundTripTime();
    }
  }

  userExist;
  validation = inputValidation;

  doCheckRiderPhoneAlreadyExistsOrNot() {
    this.userExist = "";
    if (
      this.list.phone !== null &&
      this.list.phone !== undefined &&
      this.list.phone !== ""
    ) {
      if (
        this.list.phone.toString().length >=
        inputValidation.phoneValid.minlength &&
        this.list.phone.toString().length <=
        inputValidation.phoneValid.maxlength
      ) {
        const checkPhone = { phone: this.list.phone, phcode: this.list.phcode };
        this.dataService
          .SelectedDriverCheckDataPresent(checkPhone)
          .then((responce) => {
            if (responce["users"].length === 1) {
              this.list.user = responce["users"][0];
              this.list.name = responce["users"][0].fname;
              this.list.lname = responce["users"][0].lname;
              this.list.email = responce["users"][0].email;
              this.DataTobeAdded = true;
              this.userExist = 1;
              this.list.isAutoRegistrationNededForThisRider = false;
            } else if (responce["users"].length >= 1) {
              this.toastr.showtoast(
                "error",
                `${responce["users"].length} Users Found. Please Check Ur Phone Number`
              );
              this.changePromo();
            } else {
              this.toastr.showtoast(
                "error",
                `${this.list.phone} OOPS User Not Found. So Please Type the Name`
              );
              this.DataTobeAdded = true;
              this.userExist = 0;
              this.list.isAutoRegistrationNededForThisRider = true;
              this.list.user = undefined;
              this.list.name = "";
              this.list.email = "";
              this.changePromo();
            }
          })
          .catch((err) => {
            const data = err.json();
            this.toastr.showtoast(
              "error",
              `${this.list.phone} OOPS User Not Found. So Please Type the Name`
            );
            this.list.isAutoRegistrationNededForThisRider = true;
            this.DataTobeAdded = true;
            this.list.user = undefined;
            this.list.name = "";
            this.list.email = "";
            this.changePromo();
          });
      } else this.toastr.showtoast("warn", "Enter Valid Phone Number");
    }
    // else this.toastr.showtoast('warn', 'Enter Valid Phone Number');
  }

  listenPickupLocation(event) {
    try {
      if (
        typeof event.formatted_address !== "undefined" &&
        event.formatted_address !== ""
      ) {
        delete this.list.pickupLat;
        delete this.list.pickupLng;
        if (event.formatted_address === undefined) {
          this.list.pickupLocation = "";
        } else {
          console.log("Pickup Location", event);
          this.list.pickupLocation = this.doReturnFormattedAddress(event);
          this.pickupformatAdd = this.list.pickupLocation;
          const pickup = event.geometry.location;
          this.list.pickupLat = pickup.lat();
          this.list.pickupLng = pickup.lng();
          if (this.list.tripType === "rental") {
            //PackageList
            const data = {
              pick: this.list.pickupformatAdd,
              pickupLat: this.list.pickupLat,
              pickupLng: this.list.pickupLng,
            };
            this.dataService
              .getPackageList(data)
              .then((res) => {
                this.PackageList = res.packageDetail;
                this.serviceDatilsrental =
                  res.serviceDetail[0] + "," + res.serviceDetail[1];
              })
              .catch((err) => {
                this.toastr.showtoast("error", err.error.message);
              });
          }
        }
      }
    } catch (error) {
      this.list.pickupLocation = "";
    }
    this.pickupout();
  }

  getErrorMsg() {
    if (
      (this.list.pickupLocation === undefined ||
        this.list.pickupLocation === "") &&
      this.list.tripType === "rental"
    )
      return "Select PickUp Locaction.";
    else return "No Package Found.";
  }

  listenDropLocation(event) {
    delete this.list.dropLat;
    delete this.list.dropLng;
    if (event.formatted_address === undefined) {
      this.list.dropLocation = " ";
    } else {
      console.log("drop Location", event);
      const Dropdown = event.geometry.location;
      this.list.dropLocation = this.doReturnFormattedAddress(event);
      this.dropformatAdd = this.list.dropLocation;
      const Dropdownlat = Dropdown.lat();
      const Dropdownlng = Dropdown.lng();
      if (
        this.list.pickupLat === Dropdownlat &&
        this.list.pickupLng === Dropdownlng
      ) {
        this.checklocation();
      } else {
        this.list.dropLat = Dropdownlat;
        this.list.dropLng = Dropdownlng;
      }
    }
    this.dropout();
  }

  checklocation() {
    this.toastr.showtoast("error", `OOPS!!!Check the Pickup & Drop Location`);
  }

  initialize() {
    const options = {
      types: ["(cities)"],
      componentRestrictions: { country: "in" },
      fields: ["formatted_address", "geometry"],
    };
    const input = <HTMLInputElement>document.getElementById("pickupLocation");
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    // autocomplete.setFields(['address_components', 'formatted_address', 'geometry', 'icon', 'name']);

    // console.log(autocomplete);
  }

  initializeDrop() {
    const options = {
      types: ["(cities)"],
      componentRestrictions: { country: "in" },
      fields: ["formatted_address", "geometry"],

      // fields: ['name', 'geometry.location', 'place_id', 'formatted_address']
    };
    const input = <HTMLInputElement>document.getElementById("dropLocation");
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    // autocomplete.setFields(['address_components', 'formatted_address', 'geometry', 'icon', 'name']);
  }

  pickupout() {
    if (this.list.pickupLocation !== this.pickupformatAdd) {
      this.list.pickupLocation = "";
    }
  }

  dropout() {
    if (this.list.dropLocation !== this.dropformatAdd) {
      this.list.dropLocation = "";
    }
  }

  doReturnFormattedAddress(location) {
    if (
      typeof location.name !== "undefined" &&
      location.name !== "" &&
      location.formatted_address.indexOf(location.name) < 0
    ) {
      const formattedAddressArray = location.formatted_address.split(", ");
      formattedAddressArray.shift();
      return location.name + ", " + formattedAddressArray;
    } else {
      return location.formatted_address;
    }
  }

  showJourneyCard: boolean = false;

  checkOutStationAddr() {
    if (this.list.tripType === "outstation") {
      if (this.list.pickupLocation && this.list.dropLocation) {
        this.showJourneyCard = true;
        this.list.journeyTrip = "oneway";
        this.list.bookingType = "rideLater";
        this.handleChange1("oneway");
      } else {
        this.checklocation();
        this.showVehicle = false;
        this.showJourneyCard = false;
      }
    }
  }

  /***************************** */

  getfare() {
    if (this.list.tripType === "daily") {
      this.spinner.show();
      if (
        this.list.dropLat === undefined &&
        this.list.dropLng === undefined &&
        this.list.pickupLat !== this.list.dropLat &&
        this.list.pickupLng !== this.list.dropLng
      ) {
        this.checklocation();
        this.showVehicle = false;
        this.spinner.hide();
      } else {
        const getVehicles = {
          tripType: this.list.tripType,
          pickupLat: this.list.pickupLat,
          pickupLng: this.list.pickupLng,
          dropLat: this.list.dropLat,
          dropLng: this.list.dropLng,
        };
        this.spinner.hide();
        this.dataService
          .Getfaredetails(getVehicles)
          .then((res) => {
            this.list.serviceTypeId = undefined;
            this.showEstimatedFare = false;
            this.showFareDetails = false;
            this.list.fareDetails = {
              distance: 0,
              BaseFare: 0,
              currency: AppSettings.defaultcur,
              tax: 0,
              taxAmount: 0,
              fareBeforeTax: 0,
              minFareAdded: 0,
              taxPercentage: 0,
              minFare: 0,
              travelRate: 0,
              DetuctedFare: 0,
              perKMRate: 0,
              KMFare: 0,
              waitingCharge: 0,
              waitingFare: 0,
              pickupCharge: 0,
              travelFare: 0,
              fareType: "N/A",
              totalFare: 0,
              inSecondaryCur: 0,
              surgePercent: 0,
              surgeLabel: "N/A",
              packageName: "N/A",
              packageDuration: 0,
              packageDistance: 0.0,
              baseFare: 0.0,
              additionalFareLabel: "N/A",
              additionalTimeLabel: "N/A",
              bkm: 0.0,
              timeFare: 0.0,
              fare: 0.0,
              noOfNights: 0,
              nightRate: 0.0,
              nightFare: 0.0,
              noOfDays: 0,
              dayFare: 0.0,
              dayRate: 0.0,
              googleRate: 0.0,
              backupFare: 0.0,
              taxTDSPercentage: 0.0,
              taxTDS: 0.0,
            };
            (this.list.distanceDetails = {
              timeLable: "0 Mins",
            }),
              (this.list.unit = 0);
            this.blockPromo = false;
            this.promoCodeValues = {};
            this.promoCodeValues = {
              discountAmt: 0,
            };
            this.list.unit = this.defaultUnit;
            this.list.driverAssignmentType = "auto-assign";
            this.list.bookingType = "rideNow";
            this.vehicleArray = res.vehicleCategories;
            this.showVehicle = true;
            this.showFareConfig = FarefieldConfig.showFareFromConfig;
            delete this.fareListCopy;
            this.fareListCopy = [];
            this.fareListCopy = this.fareList;
            this.spinner.hide();
          })
          .catch((err) => {
            this.toastr.showtoast("error", err.error.message);
            this.spinner.hide();
            this.showError = err.error.message;
          });
      }
      this.CommonSvc.doAddFormControlNgSelectClass();
    } else if (this.list.tripType === "outstation") {
      this.spinner.show();
      if (
        this.list.dropLat === undefined &&
        this.list.dropLng === undefined &&
        this.list.pickupLat !== this.list.dropLat &&
        this.list.pickupLng !== this.list.dropLng
      ) {
        this.checklocation();
        this.showVehicle = false;
        this.spinner.hide();
      } else {
        const getVehicles = {
          tripTypeCode: this.list.tripType,
          pickupLat: this.list.pickupLat,
          pickupLng: this.list.pickupLng,
          dropLat: this.list.dropLat,
          dropLng: this.list.dropLng,
          outstationType: this.list.journeyTrip,
          startDay: "",
          startTime: "",
          returnDay: "",
          returnTime: "",
          acneeded: this.list.acneeded,
        };
        if (this.list.journeyTrip === "oneway") {
          getVehicles.outstationType = "oneway";
          this.convertedTripDates.startTime = moment(
            this.list.time,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("hh:mm A");
          getVehicles.startDay =
            this.convertedTripDates.startDate +
            ", " +
            this.convertedTripDates.startTime;
          this.convertedTripDates.startDay = getVehicles.startDay;
        } else if (this.list.journeyTrip === "roundtrip") {
          console.log(this.list.returnDate);
          getVehicles.outstationType = "round";
          this.convertedTripDates.startTime = moment(
            this.list.time,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("hh:mm A");
          this.convertedTripDates.endTime = moment(
            this.list.returnTime,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("hh:mm A");
          this.convertedTripDates.endDate = moment(
            this.list.returnDate,
            "ddd, DD MMM"
          ).format("DD MMM YYYY");
          getVehicles.startDay =
            this.convertedTripDates.startDate +
            ", " +
            this.convertedTripDates.startTime;
          getVehicles.returnDay =
            this.convertedTripDates.endDate +
            ", " +
            this.convertedTripDates.endTime;
        }
        this.dataService
          .getVehicleForOutstation(getVehicles)
          .then((res) => {
            this.list.serviceTypeId = undefined;
            this.showEstimatedFare = false;
            this.showFareDetails = false;
            this.list.fareDetails = {
              distance: 0,
              BaseFare: 0,
              currency: AppSettings.defaultcur,
              tax: 0,
              taxPercentage: 0,
              minFare: 0,
              travelRate: 0,
              DetuctedFare: 0,
              perKMRate: 0,
              KMFare: 0,
              waitingCharge: 0,
              waitingFare: 0,
              pickupCharge: 0,
              travelFare: 0,
              fareType: "N/A",
              totalFare: 0,
              inSecondaryCur: 0,
              surgePercent: 0,
              surgeLabel: "N/A",
              packageName: "N/A",
              packageDuration: 0,
              packageDistance: 0.0,
              baseFare: 0.0,
              additionalFareLabel: "N/A",
              additionalTimeLabel: "N/A",
              bkm: 0.0,
              timeFare: 0.0,
              fare: 0.0,
              noOfNights: 0,
              nightRate: 0.0,
              nightFare: 0.0,
              noOfDays: 0,
              dayFare: 0.0,
              dayRate: 0.0,
              googleRate: 0.0,
              backupFare: 0.0,
            };
            (this.list.distanceDetails = {
              timeLable: "0 Mins",
            }),
              (this.list.unit = 0);
            this.blockPromo = false;
            this.promoCodeValues = {};
            this.promoCodeValues = {
              discountAmt: 0,
            };
            this.list.unit = this.defaultUnit;
            this.list.driverAssignmentType = "auto-assign";
            this.list.bookingType = "rideLater";
            this.vehicleArray = res.vehicleList;
            this.totalReturnHours = res.returnHours;
            this.showVehicle = true;
            this.showFareConfig = FarefieldConfig.showFareFromConfig;
            delete this.fareListCopy;
            this.fareListCopy = [];
            this.fareListCopy = this.fareList;
            this.spinner.hide();
          })
          .catch((err) => {
            this.toastr.showtoast("error", err.error.message);
            this.spinner.hide();
            this.showError = err.error.message;
          });
      }
    }
  }

  showNearByDriversList: boolean = false;

  getNearByDrivers(i) {
    this.list.driverName = "";
    this.list.driverId = "";
    if (
      this.showNearByDriversList &&
      typeof this.list.vehicletype !== "undefined"
    ) {
      const getDrivers = {
        serviceName: this.list.vehicletype,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng,
        triptype: this.list.tripType,
      };
      this.dataService
        .getNearestDrivers(getDrivers)
        .then((res) => {
          this.spinner.hide();
          this.driverArray = res.drivers;
          this.list.fname = res.fname;
          this.list.lname = res.lname;
          this.list.code = res.code;
        })
        .catch((err) => {
          this.toastr.showtoast("error", err.error.message);
          this.spinner.hide();
          this.showError = err.error.message;
        });
    } else if (
      this.showNearByDriversList &&
      typeof this.list.vehicletype === "undefined"
    ) {
      this.toastr.showtoast("warn", "Please Select Vehicle");
    }
  }

  // SetVehicleType(selectedVehicle: any, inputs: any) {
  //   if (!selectedVehicle) {
  //     return;
  //   }
  //   this.showEstimatedFare = true;
  //   this.showFareDetails = true;
  //   const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
  //   this.list.vehicletype = selectElementText;
  //   if (this.list.tripType === 'rental') {
  //     const dataTorental = {
  //       packageId: this.list.rentalPackage,
  //       tripTypeCode: 'rental',
  //       vehicleTypeId: inputs.serviceTypeId,
  //       acneeded: inputs.acneeded
  //     };
  //     this.getNearByDrivers('');
  //     this.dataService
  //       .getFareForRental(dataTorental)
  //       .then(res => {
  //         // console.log(res);
  //         this.showFareConfig = FarefieldConfig.showFareFromConfig;
  //         this.list.fareDetails = res.data;
  //         this.spinner.hide();
  //         if (this.list.fareDetails.currency === undefined || this.list.fareDetials.currency === 'undefined') {
  //           this.list.fareDetails.currency = AppSettings.defaultcur;
  //           this.list.fareDetails.fareType = 'N/A';
  //         }
  //       })
  //       .catch(err => {
  //         this.showFareDetails = false;
  //         this.spinner.hide();
  //         this.toastr.showtoast('error', err.message);
  //         this.showError = err.message;
  //       });
  //   } else if (this.list.tripType === 'daily') {
  //     for (const item of this.vehicleArray) {
  //       if (item.type === selectElementText) {
  //         this.icon = this.temp + item.file;
  //       }
  //       if (item.isRideLater) {
  //         this.bookingTypes = [];
  //         this.getRideLaterType();
  //       }
  //     }
  //     this.getNearByDrivers('');
  //     const getEstimated = {
  //       serviceType: this.list.vehicletype,
  //       time: '',
  //       tripType: this.list.tripType,
  //       pickupLat: this.list.pickupLat,
  //       pickupLng: this.list.pickupLng,
  //       dropLat: this.list.dropLat,
  //       dropLng: this.list.dropLng,
  //       serviceTypeId: this.list.serviceTypeId,
  //       pickupCity: '',
  //       acneeded: this.list.acneeded
  //     };
  //     //list.fareDetails.currency
  //     this.showFareConfig = FarefieldConfig.showFareFromConfig;
  //     this.dataService
  //       .estimatedfare(getEstimated) // estimationFare
  //       .then(res => {
  //         this.showFareDetails = true;
  //         this.list.estimationId = res.estimationId;
  //         this.list.vehicleDetailsAndFare = res.vehicleDetailsAndFare;
  //         this.list.distanceDetails = res.distanceDetails;
  //         this.spinner.hide();
  //         this.list.fareDetails = res.vehicleDetailsAndFare.fareDetails;
  //         this.list.fareDetails.timeLable = res.distanceDetails.timeLable;
  //         this.checkFare(res.vehicleDetailsAndFare.fareDetails);
  //         this.checkSurge(res.vehicleDetailsAndFare.fareDetails);
  //         this.setFare(this.list.fareDetails);
  //       })
  //       .catch(err => {
  //         this.showFareDetails = false;
  //         this.spinner.hide();
  //         this.toastr.showtoast('error', err.message);
  //         this.showError = err.message;
  //       });
  //   } else if (this.list.tripType === 'outstation') {
  //     for (const item of this.vehicleArray) {
  //       if (item.type === selectElementText) {
  //         this.showFareConfig = FarefieldConfig.showFareFromConfig;
  //         this.list.fareDetails = {
  //           packageName: item.packageName,
  //           packageDuration: item.timeLable,
  //           packageDistance: item.distanceLable,
  //           baseFare: item.fareDetails.baseFare,
  //           additionalFareLabel: item.fareDetails.remainingFareLabel,
  //           additionalTimeLabel: item.fareDetails.remainingTimeFareLabel,
  //           bkm: item.fareDetails.remainingFare,
  //           timeFare: item.fareDetails.extraTimeFare,
  //           fare: item.fareDetails.totalFare,
  //         };
  //         if (this.list.fareDetails.currency === undefined || this.list.fareDetials.currency === 'undefined') {
  //           this.list.fareDetails.currency = AppSettings.defaultcur;
  //           this.list.fareDetails.fareType = 'N/A';
  //         }
  //       }
  //     }
  //     this.getNearByDrivers('');
  //     const outstationFare = {
  //       tripTypeCode: this.list.tripType,
  //       vehicleTypeId: inputs.serviceTypeId
  //     };
  //     // console.log(outstationFare);
  //   }
  // }

  SetVehicleType(selectedVehicle: any, inputs: any) {
    if (!selectedVehicle) {
      return;
    }
    this.showEstimatedFare = true;
    this.showFareDetails = true;
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.vehicletype = selectElementText;
    if (this.list.tripType === "rental") {
      this.getRentalFare();
    } else if (this.list.tripType === "daily") {
      for (const item of this.vehicleArray) {
        if (item.type === selectElementText) {
          this.icon = this.temp + item.file;
        }
        if (item.isRideLater) {
          this.bookingTypes = [];
          this.getRideLaterType();
        }
      }
      this.getNearByDrivers("");
      this.getDailyFareWithTime();
    } else if (this.list.tripType === "outstation") {
      for (const item of this.vehicleArray) {
        if (item.type === selectElementText) {
          this.showFareConfig = FarefieldConfig.showFareFromConfig;
          this.list.fareDetails = {
            packageName: item.packageName,
            packageDuration: item.timeLable,
            packageDistance: item.distanceLable,
            BaseFare: item.fareDetails.BaseFare,

            baseFare: item.fareDetails.baseFare,
            bookingFare: item.fareDetails.bookingFare,
            taxTDS: item.fareDetails.taxTDS,
            taxTDSPercentage: item.fareDetails.taxTDSPercentage,

            // packageFare: item.fareDetails.packageFare,

            additionalFareLabel: item.fareDetails.remainingFareLabel,
            additionalTimeLabel: item.fareDetails.remainingTimeFareLabel,
            bkm: item.fareDetails.remainingFare,
            timeFare: item.fareDetails.extraTimeFare,
            fare: item.fareDetails.totalFare,
            tax: item.fareDetails.tax,
            taxPercentage: item.fareDetails.taxPercentage,
            noOfNights: item.fareDetails.noOfNights,
            nightRate: item.fareDetails.nightRate,
            nightFare: item.fareDetails.nightFare,
            noOfDays: item.fareDetails.noOfDays,
            dayFare: item.fareDetails.dayFare,
            dayRate: item.fareDetails.dayRate,
            googleRate: item.fareDetails.googleCharge,
            backupFare: item.fareDetails.totalFare,
          };
          this.setFinalFare();
          console.log(
            this.checkIfGoogleRateisZero(this.list.fareDetails.googleRate)
          );
          if (
            this.list.fareDetails.currency === undefined ||
            this.list.fareDetials.currency === "undefined"
          ) {
            this.list.fareDetails.currency = AppSettings.defaultcur;
            this.list.fareDetails.fareType = "N/A";
          }
        }
      }
      this.getNearByDrivers("");
      const outstationFare = {
        tripTypeCode: this.list.tripType,
        vehicleTypeId: inputs.serviceTypeId,
      };
      // console.log(outstationFare);
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setFare(data) {
    const inputArr = this.fareList;
    this.fareListCopy = [];
    inputArr.forEach((el) => {
      this.fareListCopy.push({
        label: el.label,
        value: data[el.ref] ? data[el.ref] : "0",
        ref: el.ref,
        unit: el.unit
          ? el.unit === "KM" || el.unit === "Miles" || el.unit === "%"
            ? el.unit
            : ""
          : "",
        currency: el.currency ? el.currency : "",
        type: el.type,
        typeValue: el.type ? data[el.type] : "",
        sideValLabel: el.sideValLabel,
        sideVal: data[el.sideValLabel] ? data[el.sideValLabel] : "",
        sideValUnit: this.splitUnit(AppSettings.defaultcur, el.sideValUnit),
      });
    });
    this.setCallCenterCharge();
    this.setFinalFare();
  }

  setCallCenterCharge() {
    const arr = this.fareListCopy.map((el) =>
      el.ref === "callCenterFee"
        ? (el.value = this.pickupChargeValues.pickupCharge
          ? this.pickupChargeValues.pickupCharge
          : "0.00")
        : el
    );
  }

  setFinalFare() {
    if (this.list.tripType === "daily") {
      const arr = this.fareListCopy.map((el) =>
        el.ref === "totalFare"
          ? (el.value = this.blockPickup
            ? this.convertNum(
              this.list.fareDetails.backupFare,
              this.pickupChargeValues.pickupCharge
            )
            : this.list.fareDetails.backupFare)
          : el
      );
    } else {
      this.list.fareDetails.fare = this.blockPickup
        ? this.convertNum(
          this.list.fareDetails.backupFare,
          this.pickupChargeValues.pickupCharge
        )
        : this.list.fareDetails.backupFare;
    }
  }

  convertNum(cost, valueTobeAdded) {
    return parseFloat(cost) + parseFloat(valueTobeAdded);
  }

  splitUnit(data, val) {
    let retVal = "";
    if (val) {
      const spl = val.split("/");
      if (spl.length > 1) {
        spl[0] = data;
        retVal = spl.join("/");
      } else {
        retVal = spl[0];
      }
    }
    return retVal;
  }

  checkFare(data) {
    if (data.fareType === "flatrate") {
      this.list.fareDetails.KMFare = data.flatFare;
    }
  }

  checkSurge(data) {
    if (data.nightObj.isApply) {
      this.list.fareDetails.surgePercent = data.nightObj.percentageIncrease;
      this.list.fareDetails.surgeLabel = data.nightObj.alertLable;
    } else if (data.peakObj.isApply) {
      this.list.fareDetails.surgePercent = data.peakObj.percentageIncrease;
      this.list.fareDetails.surgeLabel = data.peakObj.alertLable;
    } else {
      this.list.fareDetails.surgePercent = 0;
      this.list.fareDetails.surgeLabel = "N/A";
    }
  }

  resetFare() {
    (this.list.fareDetails = {
      distance: 0,
      packageFare: 0,
      bookingFare: 0.0,

      BaseFare: 0.0,
      currency: AppSettings.defaultcur,
      tax: 0,
      taxAmount: 0,
      fareBeforeTax: 0,
      minFareAdded: 0,
      taxPercentage: 0,
      minFare: 0,
      travelRate: 0,
      DetuctedFare: 0,
      perKMRate: 0,
      KMFare: 0,
      waitingCharge: 0,
      waitingFare: 0,
      pickupCharge: 0,
      travelFare: 0,
      fareType: "N/A",
      totalFare: 0,
      inSecondaryCur: 0,
      surgePercent: 0,
      surgeLabel: "N/A",

      packageName: "N/A",
      packageDuration: 0,
      packageDistance: 0.0,
      baseFare: 0.0,
      additionalFareLabel: "N/A",
      additionalTimeLabel: "N/A",
      bkm: 0.0,
      timeFare: 0.0,
      fare: 0.0,
      noOfNights: 0,
      nightRate: 0.0,
      nightFare: 0.0,
      noOfDays: 0,
      dayFare: 0.0,
      dayRate: 0.0,
      googleRate: 0.0,
      backupFare: 0.0,
      taxTDS: 0.0,
      taxTDSPercentage: 0.0,
    }),
      (this.list.distanceDetails = {
        timeLable: "0 Mins",
      });
    this.showFareConfig = FarefieldConfig.showFareFromConfig;
    this.list.unit = this.defaultUnit;
    this.pickupChargeValues = {
      pickupCharge: 0,
    };
    this.blockPickup = false;
    delete this.fareListCopy;
    this.fareListCopy = [];
    this.fareListCopy = this.fareList;
    const arr = this.fareListCopy.map((el) =>
      el.ref === "callCenterFee" ? (el.value = "0.00") : el
    );
    const arrFare = this.fareListCopy.map((el) =>
      el.ref === "totalFare" ? (el.value = "0.00") : el
    );
    this.setPromoCodeValues("", "0.00");
    this.list.driverAssignmentType = "auto-assign";
    this.list.bookingType = "rideNow";
    this.showVehicle = false;
    this.showEstimatedFare = false;
    this.showFareDetails = false;
    this.initializeTripFunctions();
    this.list.pickupLocation = "";
    this.list.pickupLat = "";
    this.list.pickupLng = "";
    this.list.dropLocation = "";
    this.list.dropLat = "";
    this.list.dropLng = "";
    this.showJourneyCard = false;
    this.list.phcode = featuresSettings.selectedPhcode;
  }

  resetlist() {
    this.rideLaterConvertedDate = this.convertDate("today");
    /*     this.list = {
          tripType: "daily",
        };
        this.list.name = '';
        this.list.phone = '';
        this.list.unit = this.defaultUnit;
        this.list.driverAssignmentType = 'auto-assign';
        this.list.bookingType = "rideNow";
        this.list.tripTime = '';
        this.list.driverName = '';event
        this.list.driverId = ''; */
    this.showJourneyCard = false;
    this.list = {
      fareDetails: {
        packageFare: 0,
        bookingFare: 0,
        distance: 0,
        BaseFare: 0,
        currency: AppSettings.defaultcur,
        tax: 0,
        minFare: 0,
        travelRate: 0,
        DetuctedFare: 0,
        perKMRate: 0,
        KMFare: 0,
        waitingCharge: 0,
        waitingFare: 0,
        pickupCharge: 0,
        travelFare: 0,
        fareType: "N/A",
        totalFare: 0,
        inSecondaryCur: 0,
        surgePercent: 0,
        surgeLabel: "N/A",
        packageName: "N/A",
        packageDuration: 0,
        packageDistance: 0.0,
        baseFare: 0.0,
        additionalFareLabel: "N/A",
        additionalTimeLabel: "N/A",
        bkm: 0.0,
        timeFare: 0.0,
        fare: 0.0,
        noOfNights: 0,
        nightRate: 0.0,
        nightFare: 0.0,
        noOfDays: 0,
        dayFare: 0.0,
        dayRate: 0.0,
        googleRate: 0.0,
        backupFare: 0.0,
      },
      distanceDetails: {
        timeLable: "0 Mins",
      },
      unit: 0,
    };
    this.list.tripType = "daily";
    this.blockPromo = false;
    this.promoCodeValues = {};
    this.pickupChargeValues = {
      pickupCharge: 0,
    };
    this.blockPickup = false;
    this.promoCodeValues = {
      discountAmt: 0,
    };
    this.showFareConfig = FarefieldConfig.showFareFromConfig;
    this.list.unit = this.defaultUnit;
    delete this.fareListCopy;
    this.fareListCopy = [];
    this.fareListCopy = this.fareList;
    const arr = this.fareListCopy.map((el) =>
      el.ref === "callCenterFee" ? (el.value = "0.00") : el
    );
    const arrFare = this.fareListCopy.map((el) =>
      el.ref === "totalFare" ? (el.value = "0.00") : el
    );
    this.setPromoCodeValues("", "0.00");
    this.list.driverAssignmentType = "auto-assign";
    this.list.bookingType = "rideNow";
    this.showVehicle = false;
    this.showEstimatedFare = false;
    this.showFareDetails = false;
    this.initializeTripFunctions();
    this.list.phcode = featuresSettings.selectedPhcode;
  }

  BookMyTrip() {
    this.spinner.show();
    let adminId = "";
    if (!this.blockPromo) {
      this.promoCodeValues.promoCode = "";
    }
    if (localStorage.getItem("userType") === "HotelAdmin")
      adminId = localStorage.getItem("type");
    const bookTripObj = {
      userId: "",
      phcode: this.list.phcode,
      phone: this.list.phone,
      email: this.list.email !== undefined ? this.list.email : "",
      fname: this.list.name,
      newuser: this.list.isAutoRegistrationNededForThisRider,
      requestFrom: "admin",
      adminId: localStorage.getItem("userId"),
      promo: this.promoCodeValues.promoCode,
      promoAmt: "",
      tripType: this.list.tripType,
      driverAssignmentType: this.list.driverAssignmentType,
      driverName: "",
      driverId: "",
      tripTime: "",
      tripDate: "",
      manualPickupCharge: "",
      paymentMode: "Cash",
      pickupCity: "",
      bookingType: this.list.bookingType,
      serviceType: this.list.vehicletype,
      estimationId: this.list.estimationId,
      hotelId: adminId,
      packageId: "",
      vehicleTypeId: "",
      pickupLat: "",
      pickupLng: "",
      noofseats: 0,
      pickupAddress: "",
      outstationType: "",
      dropLng: "",
      dropLat: "",
      acneeded: this.list.acneeded,
      startDay: "",
      returnDay: "",
      safeRide: false,
    };
    if (this.blockPickup) {
      bookTripObj.manualPickupCharge = this.pickupChargeValues.pickupCharge;
    } else {
      delete bookTripObj.manualPickupCharge;
    }
    if (this.list.user) {
      bookTripObj.userId = this.list.user._id;
    }
    if (
      this.list.bookingType === "rideLater" &&
      this.list.tripType !== "outstation"
    ) {
      bookTripObj.tripDate = moment(
        this.rideLaterConvertedDate,
        "DD MMM YYYY"
      ).format("DD-MM-YYYY");
      bookTripObj.tripTime = moment(
        this.list.rideLaterTime,
        "YYYY-MM-DDTHH:mm:ss"
      ).format("hh:mm A");
    }
    if (this.list.driverAssignmentType === "manual-assign") {
      bookTripObj.driverName = this.list.driverName;
      bookTripObj.driverId = this.list.driverId;
    }
    if (this.list.tripType === "rental") {
      bookTripObj.packageId = this.list.rentalPackage;
      bookTripObj.vehicleTypeId = this.list.serviceTypeId;
      bookTripObj.pickupLat = this.list.pickupLat;
      bookTripObj.pickupLng = this.list.pickupLng;
      bookTripObj.noofseats = this.list.fareDetails.seat;
      bookTripObj.pickupAddress = this.list.pickupLocation;
      bookTripObj.acneeded = this.list.acneeded;
    } else if (this.list.tripType === "outstation") {
      bookTripObj.vehicleTypeId = this.list.serviceTypeId;
      bookTripObj.pickupLat = this.list.pickupLat;
      bookTripObj.pickupLng = this.list.pickupLng;
      bookTripObj.dropLat = this.list.dropLat;
      bookTripObj.dropLng = this.list.dropLng;
      bookTripObj.pickupAddress = this.list.pickupLocation;
      bookTripObj.acneeded = this.list.acneeded;
      if (this.list.journeyTrip === "oneway") {
        bookTripObj.outstationType = "oneway";
        this.convertedTripDates.startTime = moment(
          this.list.time,
          "YYYY-MM-DDTHH:mm:ss"
        ).format("hh:mm A");
        bookTripObj.startDay =
          this.convertedTripDates.startDate +
          ", " +
          this.convertedTripDates.startTime;
      } else if (this.list.journeyTrip === "roundtrip") {
        bookTripObj.outstationType = "round";
        this.convertedTripDates.startTime = moment(
          this.list.time,
          "YYYY-MM-DDTHH:mm:ss"
        ).format("hh:mm A");
        this.convertedTripDates.endTime = moment(
          this.list.returnTime,
          "YYYY-MM-DDTHH:mm:ss"
        ).format("hh:mm A");
        bookTripObj.startDay =
          this.convertedTripDates.startDate +
          ", " +
          this.convertedTripDates.startTime;
        bookTripObj.returnDay =
          this.convertedTripDates.endDate +
          ", " +
          this.convertedTripDates.endTime;
      }
    }

    bookTripObj.safeRide = this.safeRidestatus;
    console.log(bookTripObj);
    this.dataService
      .requestManualTaxiDispatch(bookTripObj)
      .then((response) => {
        this.spinner.hide();
        try {
          this.ngxToastr.success(
            "Status: " + response["message"],
            "Trip No: " + response["tripId"],
            {
              closeButton: false,
              positionClass: "toast-top-right",
              disableTimeOut: false,
              timeOut: 30000,
              extendedTimeOut: 10000,
            }
          );
          this.resetlist();
          this.emitEventToChild();
        } catch (e) {
          this.spinner.hide();
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((res) => {
        const response = res.error.message;
        this.spinner.hide();
        let errorMessage = "Something went wrong.";
        errorMessage = response !== undefined ? response : errorMessage;
        this.toastr.showtoast("error", errorMessage);
      });
  }

  /****** TRIP SETTINGS */

  initializeTripFunctions() {
    this.getDriverAssignmentModes();
    this.getTripBookingTypes();
  }

  getDriverAssignmentModes() {
    if (this.list.tripType === "daily") {
      this.driverAssignmentTypes = [
        {
          disabled: false,
          value: "auto-assign",
          label: "Auto Assign",
        },
        {
          disabled: false,
          value: "manual-assign",
          label: "Manual Assign",
        },
      ];
    } else {
      this.driverAssignmentTypes = [
        {
          disabled: false,
          value: "auto-assign",
          label: "Auto Assign",
        },
        {
          disabled: false,
          value: "manual-assign",
          label: "Manual Assign",
        },
      ];
    }
  }

  getRideLaterType() {
    this.bookingTypes = [
      {
        disabled: false,
        value: "rideNow",
        label: "Ride Now",
      },
      {
        disabled: false,
        value: "rideLater",
        label: "Ride Later (Scheduled Trip)",
      },
    ];
  }

  getTripBookingTypes() {
    if (this.list.tripType === "daily") {
      this.list.bookingType = "rideNow";
      this.bookingTypes = [
        {
          disabled: false,
          value: "rideNow",
          label: "Ride Now",
        },
        {
          disabled: true,
          value: "rideLater",
          label: "Ride Later (Scheduled Trip)",
        },
      ];
    } else if (this.list.tripType === "rental") {
      this.list.bookingType = "rideLater";
      this.bookingTypes = [
        {
          disabled: false,
          value: "rideNow",
          label: "Ride Now",
        },
        {
          disabled: false,
          value: "rideLater",
          label: "Ride Later (Scheduled Trip)",
        },
      ];
    } else {
      this.list.bookingType = "rideLater";
      this.bookingTypes = [
        {
          disabled: true,
          value: "rideNow",
          label: "Ride Now",
        },
        {
          disabled: false,
          value: "rideLater",
          label: "Ride Later (Scheduled Trip)",
        },
      ];
    }
  }

  getAllDrivers() {
    this.spinner.show();
    this.dataService
      .getAllDrivers()
      .then((response) => {
        this.spinner.hide();
        try {
          if (response["data"].length) {
            this.drivers = response["data"];
          }
        } catch (e) {
          this.spinner.hide();
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        this.spinner.hide();
        let errorMessage = "Something went wrong.";
        errorMessage =
          this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
            errorMessage,
            response
          );
        this.toastr.showtoast("error", errorMessage);
      });
  }

  selectedDriverType(options: ngSelectOptionsDataStructure) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.list.driverName = "";
    this.list.driverId = "";
    this.getAllDrivers();
    if (options.value === "manual-assign") {
      this.showNearByDriversList = false;
    }
  }

  bookType(options: ngSelectOptionsDataStructure) {
    if (
      this.list.bookingType === "rideLater" &&
      this.list.tripType !== "outstation"
    ) {
      this.list.rideLaterDate = "today";
      this.generateRideLaterTime("today");
      this.generateRideLaterDate();
    }
    if (
      this.list.bookingType === "rideLater" &&
      this.list.tripType === "daily"
    ) {
      this.list.driverAssignmentType = "auto-assign";
      this.showNearByDriversList = false;
      this.driverAssignmentTypes = [
        {
          disabled: false,
          value: "auto-assign",
          label: "Auto Assign",
        },
        {
          disabled: true,
          value: "manual-assign",
          label: "Manual Assign",
        },
      ];
    } else {
      this.getDriverAssignmentModes();
    }
    this.list.tripTime = "";
  }

  /** Ride Later */

  changeRideLaterDate(e, list) {
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.rideLaterConvertedDate = this.convertDate(selectElementText);
    if (selectElementText !== "Today") {
      this.generateRideLaterTime("someOtherDay");
    } else {
      this.generateRideLaterTime("today");
    }
  }

  changeRideLaterTime(e, list) {
    // this.list.rideLaterTime = e.value;
    this.list.rideLaterTime = e.value;
    if (this.list.tripType === "rental" && this.list.serviceTypeId !== "") {
      this.getRentalFare();
    } else if (
      this.list.tripType === "daily" &&
      this.list.serviceTypeId !== ""
    ) {
      this.getDailyFareWithTime();
    }
  }

  getRentalFare() {
    const dataTorental = {
      packageId: this.list.rentalPackage,
      tripTypeCode: "rental",
      vehicleTypeId: this.list.serviceTypeId,
      time: moment(this.list.rideLaterTime, "YYYY-MM-DDTHH:mm:ss").format(
        "hh:mm A"
      ),
      bookingType: this.list.bookingType,
    };
    this.getNearByDrivers("");
    this.dataService
      .getFareForRental(dataTorental)
      .then((res) => {
        this.showFareConfig = FarefieldConfig.showFareFromConfig;
        this.list.fareDetails = res.data;
        this.list.fareDetails.backupFare = res.data.fare;
        this.list.fareDetails.googleRate = res.data.googleCharge;
        this.setFinalFare();
        console.log(
          this.checkIfGoogleRateisZero(this.list.fareDetails.googleRate)
        );
        this.spinner.hide();
        if (
          this.list.fareDetails.currency === undefined ||
          this.list.fareDetials.currency === "undefined"
        ) {
          this.list.fareDetails.currency = AppSettings.defaultcur;
          this.list.fareDetails.fareType = "N/A";
        }
      })
      .catch((err) => {
        this.showFareDetails = false;
        this.spinner.hide();
        this.toastr.showtoast("error", err.message);
        this.showError = err.message;
      });
  }

  checkIfGoogleRateisZero(resp) {
    // tslint:disable-next-line:radix
    const num = parseInt(resp);
    return num > 0 ? true : false;
  }

  getDailyFareWithTime() {
    const getEstimated = {
      serviceType: this.list.vehicletype,
      time: "",
      tripType: this.list.tripType,
      pickupLat: this.list.pickupLat,
      pickupLng: this.list.pickupLng,
      dropLat: this.list.dropLat,
      dropLng: this.list.dropLng,
      serviceTypeId: this.list.serviceTypeId,
      pickupCity: "",
      bookingType: this.list.bookingType,
    };
    if (this.list.bookingType === "rideLater") {
      getEstimated["time"] = moment(
        this.list.rideLaterTime,
        "YYYY-MM-DDTHH:mm:ss"
      ).format("hh:mm A");
    }
    //list.fareDetails.currency
    this.showFareConfig = FarefieldConfig.showFareFromConfig;
    this.dataService
      .estimatedfare(getEstimated) // estimationFare
      .then((res) => {
        this.showFareDetails = true;
        this.list.estimationId = res.estimationId;
        this.list.vehicleDetailsAndFare = res.vehicleDetailsAndFare;
        this.list.distanceDetails = res.distanceDetails;
        this.spinner.hide();
        this.list.fareDetails = res.vehicleDetailsAndFare.fareDetails;
        this.list.fareDetails.backupFare =
          res.vehicleDetailsAndFare.fareDetails.totalFare;
        this.list.fareDetails.taxTDS =
          res.vehicleDetailsAndFare.fareDetails.taxTDS;
        this.list.fareDetails.taxTDSPercentage =
          res.vehicleDetailsAndFare.fareDetails.taxTDSPercentage;
        this.list.fareDetails.timeLable = res.distanceDetails.timeLable;
        this.checkFare(res.vehicleDetailsAndFare.fareDetails);
        this.checkSurge(res.vehicleDetailsAndFare.fareDetails);
        this.setFare(this.list.fareDetails);
      })
      .catch((err) => {
        this.showFareDetails = false;
        this.spinner.hide();
        this.toastr.showtoast("error", err.message);
        this.showError = err.message;
      });
  }

  generateRideLaterTime(day) {
    if (day === "today") {
      let timeArray = [],
        CurrentHour,
        CurrentMinutes;
      const currentDate = moment().format("DD/MM/YYYY hh:mm A");
      CurrentHour = moment().hour();
      CurrentMinutes = moment().minutes();
      const diffOfMinute = CurrentMinutes >= 30 ? 30 : 0o0;
      if (15 >= CurrentMinutes) {
        const temp2 = 15 - CurrentMinutes;
        this.rideLaterMinDate = moment()
          .add(temp2 + 15, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.rideLaterTime = moment(
          this.rideLaterMinDate,
          "MM/DD/YYYY hh:mm A"
        ).format("YYYY-MM-DDTHH:mm:ss");
      } else if (30 >= CurrentMinutes) {
        const temp = 30 - CurrentMinutes;
        this.rideLaterMinDate = moment()
          .add(temp + 15, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.rideLaterTime = moment(
          this.rideLaterMinDate,
          "MM/DD/YYYY hh:mm A"
        ).format("YYYY-MM-DDTHH:mm:ss");
      } else if (45 >= CurrentMinutes) {
        const temp = 45 - CurrentMinutes;
        this.rideLaterMinDate = moment()
          .add(temp + 15, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.rideLaterTime = moment(
          this.rideLaterMinDate,
          "MM/DD/YYYY hh:mm A"
        ).format("YYYY-MM-DDTHH:mm:ss");
      } else if (60 >= CurrentMinutes) {
        const temp = 60 - CurrentMinutes;
        this.rideLaterMinDate = moment()
          .add(temp + 15, "minute")
          .format("MM/DD/YYYY hh:mm A");
        this.list.rideLaterTime = moment(
          this.rideLaterMinDate,
          "MM/DD/YYYY hh:mm A"
        ).format("YYYY-MM-DDTHH:mm:ss");
      }
      this.rideLaterMinDate = new Date(this.rideLaterMinDate);
      this.list.rideLaterTime = moment(
        this.rideLaterMinDate,
        "MM/DD/YYYY hh:mm A"
      ).format("YYYY-MM-DDTHH:mm:ss");
    } else {
      const tomorrow = moment(new Date()).add(1, "days").startOf("day");
      const tomorrowEnd = moment(new Date()).add(1, "days").endOf("day");
      this.rideLaterMinDate = new Date(tomorrow.toString());
      this.rideLaterMaxDate = new Date(tomorrowEnd.toString());
      this.list.rideLaterTime = this.rideLaterMinDate;
    }
  }

  generateRideLaterDate() {
    const dateArray = [];
    const dayToExclude = moment().day();
    for (let d1 = 1; d1 <= 8; d1++) {
      if (d1 !== dayToExclude && d1 !== dayToExclude + 1) {
        if (d1 < dayToExclude && d1 + 8 !== dayToExclude) {
          dateArray.push({
            label: moment()
              .day(d1 + 8)
              .format("ddd, DD MMM"),
            value: d1 + 8,
          });
        } else {
          dateArray.push({
            label: moment().day(d1).format("ddd, DD MMM"),
            value: d1,
          });
        }
      }
    }
    this.rideLaterDateArray = _.sortBy(dateArray, ["value"]);
  }

  manuallySelectedDriver(e) {
    this.list.driverId = "";
    this.list.driverName = "";
    this.list.driverId = e.target.value;
    this.driverArray.forEach((el) => {
      if (el._id === e.target.value) {
        this.list.driverName = el.fname;
      }
    });
  }

  selectedDriver(options: ngSelectOptionsDataStructure) {
    this.list.driverName = options.label;
    this.list.driverId = options.value;
  }

  /** Requested Trip */

  setRiderDetails: any;
  setDriverDetails: any;
  setTripDetails: any;

  requestedTrip(e) {
    const reqTripId = e;
    this.afterBooking(reqTripId);
  }

  afterBooking(data) {
    this.resetlist();
    if (data) {
      this.spinner.show();
      this.CommonSvc.tripRequestedDrivers(data)
        .then((msg) => {
          this.setTripDetails = msg.TripDetails[0];
          this.setRiderDetails = msg.RiderDetails[0];
          this.setDriver(msg.DriverDetails);
          this.setRider(this.setRiderDetails);
          this.setTripFare(this.setTripDetails);
          this.spinner.hide();
        })
        .catch((res) => {
          this.spinner.hide();
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  setDriver(data) {
    if (data.length > 0) {
      this.getAllDrivers();
      this.list.driverAssignmentType = "manual-assign";
      this.list.driverId = data[0]._id;
      this.list.driverName = data[0].fname;
    } else {
      this.list.driverAssignmentType = "auto-assign";
    }
  }

  setRider(data) {
    if (data) {
      this.list.user = data;
      this.list.phone = data.phone;
      this.list.name = data.fname;
      this.list.email = data.email;
    }
  }

  setTripFare(data) {
    this.list.timeLable = data.estTime;
    this.list.fareDetails.timeLable = this.list.timeLable;
    this.list.tripType = data.triptype;
    this.list.pickupLocation = data.dsp.start;
    this.list.pickupLat = data.dsp.startcoords[1];
    this.list.pickupLng = data.dsp.startcoords[0];
    this.list.dropLocation = data.dsp.end;
    this.list.dropLat = data.dsp.endcoords[1];
    this.list.dropLng = data.dsp.endcoords[0];
    const getVehicles = {
      tripType: this.list.tripType,
      pickupLat: this.list.pickupLat,
      pickupLng: this.list.pickupLng,
      dropLat: this.list.dropLat,
      dropLng: this.list.dropLng,
    };
    this.showFare(data.csp, data.dsp);
    this.list.fareDetails.totalFare = data.fare;
    this.list.fareDetails.timeLable = this.list.timeLable;
    this.setFare(this.list.fareDetails);
    this.showEstimatedFare = true;
    this.showFareDetails = true;
    this.getFare(getVehicles, data.vehicle);
    this.list.serviceTypeId = data.service;
    this.list.vehicletype = data.service;
    this.list.bookingType = data.bookingType;
    this.list.tripTime = "";
    if (this.list.bookingType === "rideLater") {
      this.list.tripTime = moment(data.tripDT, "DD-MM-YYYY hh:mm A").format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    }
  }

  showFare(data, dsp) {
    this.list.fareDetails = {
      distance: dsp.distanceKM,
      BaseFare: data.base,
      currency: AppSettings.defaultcur,
      tax: data.tax,
      taxAmount: data.taxAmount,
      fareBeforeTax: data.fareBeforeTax,
      minFareAdded: data.minFareAdded,
      taxPercentage: data.taxPercentage,

      taxTDS: data.taxTDS,
      taxTDSPercentage: data.taxTDSPercentage,

      minFare: 0.0,
      travelRate: 0.0,
      DetuctedFare: 0.0,
      perKMRate: this.getPerKM(data.distfare, dsp.distanceKM),
      KMFare: data.distfare,
      waitingCharge: 0.0,
      waitingFare: 0.0,
      discountAmt: data.promoamt ? data.promoamt : 0.0,
      promoCode: data.promo ? data.promo : "",
      pickupCharge: data.conveyance,
      travelFare: 0.0,
      fareType: "KM Rate",
      inSecondaryCur: 0.0,
      surgePercent: 0.0,
      surgeLabel: "N/A",
      // taxTDS: 0.0,
      // taxTDSPercentage: 0.0,
    };
  }

  getPerKM(dist, km) {
    return (dist / km).toFixed(2);
  }

  getFare(getVehicles, vehicle) {
    this.spinner.show();
    this.vehicleArray = [];
    this.dataService
      .Getfaredetails(getVehicles)
      .then((res) => {
        this.vehicleArray = res.vehicleCategories;
        for (const item of this.vehicleArray) {
          if (item.isRideLater) {
            this.bookingTypes = [];
            this.getRideLaterType();
          }
        }
        this.showVehicle = true;
        this.list.vehicletype = vehicle;
        this.CommonSvc.doAddFormControlNgSelectClass();
        this.spinner.hide();
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.message);
        this.spinner.hide();
      });
  }

  public eventsSubject: Subject<void> = new Subject<void>();

  emitEventToChild() {
    this.eventsSubject.next();
  }
}
