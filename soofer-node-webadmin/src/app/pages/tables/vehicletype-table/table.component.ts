import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { Http } from '@angular/http';
import { AppSettings, dropdown, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Service } from '../../vehicletype/vehicletype.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import * as moment from 'moment';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';

interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

interface triptypeData {
  value: string;
  label: string;
}

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, Service, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }

      .example-chip-list {
        width: 100%;
      }
      .required::after {
        content: " *";
        color: red;
      }
    `,
  ],
})
export class VehicleTypeTableComponent implements OnInit {
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};
  title: String = 'View Vehicle Type Details';
  initial: string = 'list';
  selectedid: string;
  selectedDocs: any;
  cityary: any;
  selectedImage: any;
  baseurl: string = AppSettings.BASEURL;
  cities: Array<commonDataList>;
  TripType: Array<triptypeData>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  features = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  matdata: any = [];
  defaultUnit = featuresSettings.distanceUnit;
  showShareTaxi = featuresSettings.shareTaxi;
  /*** Driver Conveyance (Pickup Charge) Details */

  noFilterThreshold: number = 3;
  navigationSubscription: any;

  Faretype = [
    {
      value: 'flatrate',
      label: 'Flat Rate',
    },
    {
      value: 'kmrate',
      label: 'Mile Rate',
    },
  ];

  yesOrNo = [
    {
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    },
  ];

  gender = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];

  FaretypeOrPercentage = [
    {
      value: 'flatrate',
      label: 'Flat Rate',
    },
    {
      value: 'percentage',
      label: 'Percentage',
    },
  ];

  peakHours: any = [];
  nightHours: any = [];
  peakHourId: any = [];
  selectedScID: any;
  peakHour1: any = {};
  peakHour2: any = {};
  currentIndex: any = 0;

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }],
      history: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }],
    },

    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      //or something
      child: {
        title: 'Add Distance Fare',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="Add Distance Fare"  href="#/pages/tables/distancefare;vehicletypeid=${row._id}" >
                  <i class="ion-plus-round"></i></a>`;
        },
      },
      displayorder: {
        title: 'Display Order',
      },
      type: {
        title: 'Type',
      },
      tripTypeCode: {
        title: 'Trip Type',
      },
      bkm: {
        title: 'Per Mile Rate',
      },
      mfare: {
        title: 'Minimum Fare',
      },
      comison: {
        title: 'Commission (%)',
      },
      asppc: {
        title: 'Available Seats',
      },
      cancelationFeesDriver: {
        title: 'Cancellation Charge for Driver',
      },
      cancelationFeesRider: {
        title: 'Cancellation Charge for Rider',
      },
      file: {
        title: 'Icon',
        filter: false,
        type: 'html',
        valuePrepareFunction: (file: string) =>
          `<img width="50px" src="${this.baseurl + file}" alt='icon' />`,
      },
    },
  };
  deldocs = [];
  itemdata = [];
  source: ServerDataSource;
  dropdownList = [];
  lengthservicecities: number;
  dropdownSettings = dropdown.dropdownSettings;
  vehicleDropdown = {
    singleSelection: false,
    idField: 'type',
    textField: 'type',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };
  servicecity = featuresSettings.isServiceAvailable;
  availableTrips = featuresSettings.tripsAvailable;
  selectedimage: any;


  constructor(
    private http: HttpClient,
    private service: TableService,
    private dataService: Service,
    private router: Router,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService
  ) {
    dataService;
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + 'vehicletype',
    });
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem('userType') === 'superadmin'
    )
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity().then(res => {
      this.serviceCityArray = res;
    });

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });
  }

  SerachForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === 'undefined' || data.servicecity === 'all')
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + 'vehicletype',
      });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          'vehicletype?scIds.name_like=' +
          data.servicecity,
      });
  }

  lesserThanZero(e) {

  }


  ngOnInit(): void {
    this.CommonSvc.getServiceAvailableCity().then(res => {
      this.cities = res;
      this.lengthservicecities = this.cities.length;
      this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
      this.cities = this.CommonSvc.dataforscids(this.cities);
      //console.log(this.cities)
    });
    // this.setHours();
  }

  // setHours() {
  //   this.startEndTime = moment('06:00:00', 'HH:mm:ss').subtract(1, 'hours').format('HH:mm:ss')
  //   this.endStartTime = moment('22:00:00', 'HH:mm:ss').add(1, 'hours').format('HH:mm:ss')
  //   this.defaultLimitArr = [{
  //     fromLimit: '22:00:00',
  //     toLimit: '06:00:00'
  //   }]
  // }

  convertTripType(data) {
    const typeArr = [];
    data.forEach(el => {
      typeArr.push({
        label: el,
        value: el.toLowerCase(),
      });
    });
    this.TripType = typeArr;
  }

  getVehiclesByTypeList = [];

  getVehiclesFortypefromROute(type, scity = undefined) {
    this.dataService
      .getVehicleByType(type, scity)
      .then(async res => {
        this.getVehiclesByTypeList = await res['datas'];
        // this.selectedDocs.lowCategoryOptions = "";
      })
      .catch(res => {
        this.selectedDocs.lowCategoryOptions = '';

        this.toastr.showtoast('error', res.message);
      });
  }
  getVehiclesFortype(type, scity = undefined) {
    this.dataService
      .getVehicleByType(type, scity)
      .then(async res => {
        this.getVehiclesByTypeList = await res['datas'];
        this.selectedDocs.lowCategoryOptions = '';
      })
      .catch(res => {
        this.selectedDocs.lowCategoryOptions = '';

        this.toastr.showtoast('error', res.message);
      });
  }

  async route(event) {
    console.log(" console.log", this.source.getPaging().perPage)
    const temp = document.querySelector('li.active');
    console.log(temp)
    if (temp) {
      const child = temp.children
      if (child[0] && child[0].childNodes[0] && child[0].childNodes[0].nodeValue) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    await this.convertTripType(this.availableTrips);
    this.initial = '';
    await this.getVehiclesFortypefromROute(
      event.data.tripTypeCode,
      event.data.scIds.length != 0 ? event.data.scIds[0].name : undefined
    );
    await this.SetDocsDetails(event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  SetDocsDetails(data: any): void {
    if (!data) {
      return;
    }
    this.selectedScID = data.scIds;
    this.filedata = '';
    this.selectedid = data._id;
    this.selectedDocs = data;
    console.log(this.selectedDocs.lowCategoryOptions)
    this.selectedDocs.lowCategoryOptions = data.lowCategoryOptions.filter(item => item !== "[object Object]");
    this.selectedImage = data.file;
    this.selectedDocs.base = data.baseFare;
    this.features = data.features;
    this.matchip(this.features);
    this.selectedDocs.isWaitingTimeExceddedChargesApplicable = this.convertToString(
      data.isWaitingTimeExceddedChargesApplicable
    );
    this.selectedDocs.isWaitingTimeBeforeTripStartExceddedChargesApplicable = this.convertToString(
      data.isWaitingTimeBeforeTripStartExceddedChargesApplicable
    );

    this.selectedDocs.conveyanceAvailable = this.convertToString(
      data.conveyanceAvailable
    );
    this.selectedDocs.isTax = this.convertToString(data.isTax);
    this.selectedDocs.available = this.convertToString(data.available);
    this.selectedDocs.isRideLater = this.convertToString(data.isRideLater);
    this.selectedDocs.isShareAvailable = this.convertToString(
      data.isShareAvailable
    );
    this.convertPeakHours(data.peakHours);
    this.convertnightHours(data.nightHours);
    this.selectedDocs.loc = data.scIds;
    this.selectedimage = data.file;
    if (localStorage.getItem('userType') === 'citywiseadmin') {
      this.selectedDocs.scIds = this.CommonSvc.dataforscids(this.cities);
    }
  }

  convertPeakHours(data) {
    data.forEach((el, index) => {
      if (index === 0) {
        this.selectedDocs.peakHourOneStartTime = moment(
          el.from,
          'HH:mm:ss'
        ).format('YYYY-MM-DDTHH:mm:ss');
        this.selectedDocs.peakHourOneEndTime = moment(el.to, 'HH:mm:ss').format(
          'YYYY-MM-DDTHH:mm:ss'
        );
        this.selectedDocs.percentPeakHourOne = el.percentPeakFare;
        this.selectedDocs.peakHourOneId = el._id;
      } else if (index === 1) {
        this.selectedDocs.peakHourTwoStartTime = moment(
          el.from,
          'HH:mm:ss'
        ).format('YYYY-MM-DDTHH:mm:ss');
        this.selectedDocs.peakHourTwoEndTime = moment(el.to, 'HH:mm:ss').format(
          'YYYY-MM-DDTHH:mm:ss'
        );
        this.selectedDocs.percentPeakHourTwo = el.percentPeakFare;
        this.selectedDocs.peakHourTwoId = el._id;
      }
    });
  }

  convertnightHours(data) {
    data.forEach(el => {
      this.selectedDocs.nightHourOneStartTime = moment(
        el.from,
        'HH:mm:ss'
      ).format('YYYY-MM-DDTHH:mm:ss');
      this.selectedDocs.nightHourOneEndTime = moment(el.to, 'HH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss'
      );
      this.selectedDocs.percentNightFare = el.percentNightFare;
      this.selectedDocs.nightHourOneId = el._id;
    });
  }

  convertToString(data) {
    if (data === true) {
      return 'true';
    } else return 'false';
  }

  matchip(data) {
    this.features = [];
    if (data[0] === '') {
      this.features = [];
    } else if (data.length === 0) {
      this.features = [];
    } else {
      const val = data.toString();
      const matdata = val.split(',');
      matdata.forEach(el => {
        const mat = {
          name: el,
        };
        this.features.push(mat);
      });
    }
  }

  selectedCity(option: commonDataList) {
    this.selectedDocs.serviceAvailableCityId = option.label;
  }

  deSelectedCity(option: commonDataList) {
    this.selectedDocs.serviceAvailableCityId = '';
  }

  tripTypeDoAssignSelected(option: triptypeData) {
    // this.getVehiclesFortype(option.value);
    this.getVehiclesFortype(
      option.value,
      this.selectedDocs.scIds ? this.selectedDocs.scIds[0].name : undefined
    );
    this.selectedDocs.lowCategoryOptions = '';
  }

  tripTypeDoUnassignDeselected(option: triptypeData) { }

  // MAT CHIP

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our feature
    if ((value || '').trim()) {
      this.features.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(feature): void {
    const index = this.features.indexOf(feature);
    if (index >= 0) {
      this.features.splice(index, 1);
    }
  }

  featureconvertion() {
    this.matdata = [];
    this.features.forEach(ele => {
      this.matdata.push(ele.name);
    });
  }

  peakandnightHours() {
    this.peakHours = [];
    this.nightHours = [];
    this.selectedDocs.peakHourOneStartTime = moment(
      this.selectedDocs.peakHourOneStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.selectedDocs.peakHourOneEndTime = moment(
      this.selectedDocs.peakHourOneEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.selectedDocs.peakHourTwoStartTime = moment(
      this.selectedDocs.peakHourTwoStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.selectedDocs.peakHourTwoEndTime = moment(
      this.selectedDocs.peakHourTwoEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.selectedDocs.nightHourOneStartTime = moment(
      this.selectedDocs.nightHourOneStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.selectedDocs.nightHourOneEndTime = moment(
      this.selectedDocs.nightHourOneEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.peakHour1 = {
      from: moment(this.selectedDocs.peakHourOneStartTime, 'HH:mm').format(
        'HH:mm:ss'
      ),
      to: moment(this.selectedDocs.peakHourOneEndTime, 'HH:mm').format(
        'HH:mm:ss'
      ),
      percentPeakFare: this.selectedDocs.percentPeakHourOne,
      oldId: this.selectedDocs.peakHourOneId,
    };
    this.peakHour2 = {
      from: moment(this.selectedDocs.peakHourTwoStartTime, 'HH:mm').format(
        'HH:mm:ss'
      ),
      to: moment(this.selectedDocs.peakHourTwoEndTime, 'HH:mm').format(
        'HH:mm:ss'
      ),
      percentPeakFare: this.selectedDocs.percentPeakHourTwo,
      oldId: this.selectedDocs.peakHourTwoId,
    };
    this.peakHours.push(this.peakHour1);
    this.peakHours.push(this.peakHour2);
    this.peakHourId.push(
      this.selectedDocs.peakHourOneId,
      this.selectedDocs.peakHourTwoId
    );
    this.nightHours = [
      {
        from: moment(this.selectedDocs.nightHourOneStartTime, 'HH:mm').format(
          'HH:mm:ss'
        ),
        to: moment(this.selectedDocs.nightHourOneEndTime, 'HH:mm').format(
          'HH:mm:ss'
        ),
        percentNightFare: this.selectedDocs.percentNightFare,
      },
    ];
  }

  /*** Driver Conveyance (Pickup Charge) Details */

  conveyance(event) {
    if (event.value === 'true') {
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.selectedDocs.conveyancePerKm = 0;
      this.selectedDocs.conveyanceType = 'flatrate';
    } else {
      this.selectedDocs.conveyancePerKm = 0;
      this.selectedDocs.conveyanceType = 'flatrate';
    }
  }

  /*** Tax Details */

  TaxAction(event) {
    if (event.value === 'true') {
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.selectedDocs.taxPercentage = 0;
    } else {
      this.selectedDocs.taxPercentage = 0;
    }
  }

  /*** Waiting Time Details */

  WaitingTimeExceddedCharges(event) {
    if (event.value === 'true') {
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.selectedDocs.allowMinimumWaitingTimeInMinutes = 0;
      this.selectedDocs.chargeRatePerMinuteForExceededMinimumWaitingTime = 0;
    } else {
      this.selectedDocs.allowMinimumWaitingTimeInMinutes = 0;
      this.selectedDocs.chargeRatePerMinuteForExceededMinimumWaitingTime = 0;
    }
  }

  WaitingTimeExceddedChargesApplicable(event) {
    if (event.value === 'true') {
      // this.WaitingTimeBefore = true;
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.selectedDocs.allowMiniWaitingTimeBeforeTripStartInMin = 0;
      this.selectedDocs.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart = 0;
    } else {
      // this.WaitingTimeBefore = false;
      this.selectedDocs.allowMiniWaitingTimeBeforeTripStartInMin = 0;
      this.selectedDocs.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart = 0;
    }
  }
  goBack(): void {
    this.initial = 'list';
    setTimeout(() => this.source.setPaging(this.currentIndex, 10), 0);
  }

  filedata: any;
  filedata2: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }
  fileEvent2(e) {
    this.filedata2 = e.target.files[0];
  }

  updateVehicleType(inputs: any): void {
    console.log(typeof this.selectedDocs.lowCategoryOptions);
    const newCate = [];
    if (this.selectedDocs.lowCategoryOptions.length != 0) {
      this.selectedDocs.lowCategoryOptions.forEach((item) => {
        if (item.type) {
          newCate.push(item.type);
          console.log(item.type, 'type');
        }
        else {
          newCate.push(item);
          console.log(item, 'not type');
        }
      });
    }

    inputs.lowCategoryOptions = newCate;
    console.log(newCate);
    this.featureconvertion();
    if (!inputs) {
      return;
    }
    if (this.filedata === typeof 'undefined') {
      this.filedata = this.selectedImage;
    }
    if (inputs.scIds.length <= 0 && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      }
      inputs.oldScIds = this.selectedScID;
      const formdata = new FormData();
      formdata.append('lowCategoryOptions', inputs.lowCategoryOptions);
      formdata.append('image', this.selectedimage);
      formdata.append('file', this.filedata);
      formdata.append('type', inputs.type);
      formdata.append('tripTypeCode', inputs.tripTypeCode);
      formdata.append('displayorder', inputs.displayorder);
      formdata.append('scIds', JSON.stringify(inputs.scIds));
      formdata.append('oldScIds', JSON.stringify(inputs.oldScIds));
      formdata.append('mfare', inputs.mfare);
      formdata.append('bkm', inputs.bkm);
      formdata.append('bkmnac', inputs.bkmnac);
      formdata.append('comison', inputs.comison);
      formdata.append('isShareAvailable', inputs.isShareAvailable || false);
      formdata.append('asppc', inputs.asppc);
      formdata.append('description', inputs.description);
      formdata.append('features', this.matdata);
      formdata.append('available', inputs.available);
      formdata.append('gender', inputs.gender);
      formdata.append('isRideLater', inputs.isRideLater);
      formdata.append('base', inputs.baseFare);
      formdata.append('timeFare', inputs.timeFare);
      formdata.append('bookingFare', inputs.bookingFare);

      if (inputs.tripTypeCode === 'outstation') {
        formdata.append('dayRate', inputs.dayRate);
        formdata.append('kmReducedPerExtraHr', inputs.kmReducedPerExtraHr);
        formdata.append('timeFareForIdel', inputs.timeFareForIdel);
        formdata.append('baseFareForRoundTrip', inputs.baseFareForRoundTrip);
        formdata.append('bkmForRoundTrip', inputs.bkmForRoundTrip);
        formdata.append('timeFareForIdelOneway', inputs.timeFareForIdelOneway);
        formdata.append('timeFareOneway', inputs.timeFareOneway);
      }
      console.log(inputs);
      formdata.append('baseKMBefore', inputs.baseKMBefore);
      formdata.append('baseFare', inputs.baseFare);
      formdata.append('baseKMAfter', inputs.baseKMAfter);
      formdata.append('baseFareAfter', inputs.baseFareAfter);
      this.dataService
        .updateVehicle(this.selectedid, formdata)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.SetDocsDetails(msg.op);
        })
        .catch(msg => {
          this.toastr.showtoast('error', msg.message);
        });
    }
  }

  //checking whether it was ther or not in Scids

  updateVehicleCharges(inputs, inputFor) {
    if (inputFor === 'conveyance') {
      const patchData = {
        conveyanceAvailable: inputs.conveyanceAvailable,
        conveyanceType: inputs.conveyanceType,
        conveyancePerKm: inputs.conveyancePerKm,
      };
      this.updateRecord(inputFor, patchData);
    } else if (inputFor === 'tax') {
      const patchData = {
        isTax: inputs.isTax,
        taxPercentage: inputs.taxPercentage,
      };
      this.updateRecord(inputFor, patchData);
    } else if (inputFor === 'cancelation') {
      const patchData = {
        cancelationFeesDriver: inputs.cancelationFeesDriver,
        cancelationFeesRider: inputs.cancelationFeesRider,
      };
      this.updateRecord(inputFor, patchData);
    } else if (inputFor === 'waitingtime') {
      const patchData = {
        isWaitingTimeExceddedChargesApplicable:
          inputs.isWaitingTimeExceddedChargesApplicable,
        allowMinimumWaitingTimeInMinutes:
          inputs.allowMinimumWaitingTimeInMinutes,
        chargeRatePerMinuteForExceededMinimumWaitingTime:
          inputs.chargeRatePerMinuteForExceededMinimumWaitingTime,
        isWaitingTimeBeforeTripStartExceddedChargesApplicable:
          inputs.isWaitingTimeBeforeTripStartExceddedChargesApplicable,
        allowMiniWaitingTimeBeforeTripStartInMin:
          inputs.allowMiniWaitingTimeBeforeTripStartInMin,
        chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart:
          inputs.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart,
      };
      this.updateRecord(inputFor, patchData);
    }
    // else if (inputFor === "waitingtimebeforestart") {
    //   const patchData = {
    //     isWaitingTimeBeforeTripStartExceddedChargesApplicable:
    //       inputs.isWaitingTimeBeforeTripStartExceddedChargesApplicable,
    //     allowMiniWaitingTimeBeforeTripStartInMin:
    //       inputs.allowMiniWaitingTimeBeforeTripStartInMin,
    //     chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart:
    //       inputs.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart,
    //   };
    //   this.updateRecord(inputFor, patchData);
    // }
  }

  updateRecord(inputFor: any, data: any): void {
    this.dataService
      .updateVehicleDetails(this.selectedid, inputFor, data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.SetDocsDetails(res.op);
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  updateFileRecords(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (this.filedata === typeof 'undefined') {
      this.filedata = this.selectedImage;
    }
    const formdata = new FormData();
    // formdata.append("image", this.selectedimage)
    formdata.append('file', this.filedata);
    formdata.append('description', inputs.description);

    this.dataService
      .updateSelectedFiles(this.selectedid, formdata)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.SetDocsDetails(res.op);
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  updateVehicleHour(inputs, inputFor) {
    this.peakandnightHours();
    if (inputFor === 'peakfare') {
      const updateHour = {
        peakHours: JSON.stringify(this.peakHours),
      };
      this.updateHours(inputFor, updateHour);
    } else if (inputFor === 'nightfare') {
      const updateHour = {
        oldId: this.selectedDocs.nightHourOneId,
        nightHours: JSON.stringify(this.nightHours),
      };
      if (inputs.tripTypeCode === 'outstation') {
        updateHour['nightRate'] = inputs.nightRate;
      }
      this.updateHours(inputFor, updateHour);
    }
  }

  updateHours(inputFor: any, data: any): void {
    this.dataService
      .updateVehicleHourDetails(this.selectedid, inputFor, data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.SetDocsDetails(res.op);
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  deleteRecord(data: any): void {
    if (window.confirm("Are you sure you want to Delete?")) {
      this.dataService
        .deleteTaxiData(data)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.goBack();
        })
        .catch(msg => {
          this.toastr.showtoast('error', msg.message);
        });
    }
  }



  minmax(e) {
    // console.log(e)
    const value = e.target.value;
    // if (value >= 100) {
    //   value = 100
    // }
    // if (value <= 0) {
    //   value = 0
    // }

    const ObjectName = e.target.name;
    this.selectedDocs[ObjectName] = value;
  }
  featureOnItemSelect(data) {
    console.log(data.name);
    this.getVehiclesFortype(this.selectedDocs.tripTypeCode, data.name);
  }
  onItemDeSelect(data) {
    console.log(data, 'data');
    this.getVehiclesByTypeList = [];
    this.selectedDocs.lowCategoryOptions = '';
  }
}
