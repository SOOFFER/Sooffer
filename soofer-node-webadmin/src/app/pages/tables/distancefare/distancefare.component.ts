import { Component, OnInit } from '@angular/core';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { Service } from '../../vehicletype/vehicletype.service';
import { featuresSettings } from '../../../app.config';

@Component({
  selector: 'distancefare',
  providers: [Service],
  templateUrl: './distancefare.component.html'
})
export class DistancefareComponent implements OnInit {
  list: any = {};

  updateList: any = {};
  offerUpdateList: any = {};
  defaultUnit = featuresSettings.distanceUnit;
  vehicleId: any;
  noFilterThreshold = 3;
  fareTypeDropDown: boolean = false;
  Faretype = [
    {
      value: 'flatrate',
      label: 'Flat Rate'
    },
    {
      value: 'kmrate',
      label: 'Mile Rate'
    },
  ];

  yesOrNo = [
    {
      value: 'true',
      label: 'Yes'
    },
    {
      value: 'false',
      label: 'No'
    },
  ];

  arrData: any = [];
  arrList: any = [];
  showAdd: boolean = false;
  editList: boolean = false;


  constructor(private dataService: Service,
    private CommonSvc: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ButtonToasterService) {
    this.route.params.subscribe(params => {
      if (params['vehicletypeid']) {
        this.vehicleId = params['vehicletypeid'];
        this.list.vehicleId = this.vehicleId;

      }
    });
    this.ListDetails();
    // this.list = {};
    // this.list.applyTax = false;
    // this.list.applyWaitingTime = false;
    // this.list.applyNightCharge = false;
    // this.list.applyPeakCharge = false;
    // this.list.applyCommission = false;
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  ngOnInit() {
  }

  ListDetails() {
    this.dataService.getVehicleData()
      .then(res => {
        this.arrData = res;
        this.arrData.forEach(el => {
          if (el._id === this.vehicleId) {
            this.arrList = el.distance;
          }
        });
      });
  }

  show() {
    this.showAdd = true;
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.list = {};
    this.list.applyTax = false;
    this.list.applyWaitingTime = false;
    this.list.applyNightCharge = false;
    this.list.applyPeakCharge = false;
    this.list.applyCommission = false;
    this.list.applyPickupCharge = false;
  }

  mainPage() {
    this.router.navigate(['/pages/tables/vehicletype-table']);
  }

  goBack() {
    //this.router.navigate(['/pages/tables/vehicletype-table']);
    this.showAdd = false;
    this.editList = false;
    this.ListDetails();
  }

  selectedDistance(event) {
    if (event.value === 'kmrate' || event.value === 'flatrate') {
      this.list.distanceFarePerKM = '';
      this.list.distanceFarePerFlatRate = '';
    }
  }

  selectedDistanceFare(event) {
    if (event.value === 'kmrate' || event.value === 'flatrate') {
      this.updateList.distanceFarePerKM = '';
      this.updateList.distanceFarePerFlatRate = '';
    }
  }

  addDistance(inputs: any): void {
    this.dataService.addDistanceFare(this.vehicleId, inputs)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }


  makeDetails(taxi, index): any {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.editList = true;
    this.updateList = taxi;
    this.offerUpdateList.discount = taxi.discount;
    this.offerUpdateList.offerPerDay = taxi.offerPerDay;
    this.offerUpdateList.offerPerUser = taxi.offerPerUser;
    this.offerUpdateList.cmpyAllowance = this.cmpyAllowanceconvention(taxi.cmpyAllowance);
    this.offerUpdateList._id = taxi._id;
  }
  cmpyAllowanceconvention(cmpyAllowance) {
    if (cmpyAllowance === true) {
      return 'true';
    }
    else {
      return 'false';
    }
  }
  updateDistance(id: any, inputs: any): void {
    const updateObj = {
      distanceFarePerKMnac: inputs.distanceFarePerKMnac,
      distanceFrom: inputs.distanceFrom,
      distanceTo: inputs.distanceTo,
      applyCommission: inputs.applyCommission,
      applyPeakCharge: inputs.applyPeakCharge,
      applyNightCharge: inputs.applyNightCharge,
      applyWaitingTime: inputs.applyWaitingTime,
      applyTax: inputs.applyTax,
      distanceFarePerFlatRate: inputs.distanceFarePerFlatRate,
      distanceFarePerKM: inputs.distanceFarePerKM,
      distanceFareType: inputs.distanceFareType,
      distanceFarePerFlatRatenac: inputs.distanceFarePerFlatRatenac,
      additionalFarePerHrs: inputs.additionalFarePerHrs,
      applyPickupCharge: inputs.applyPickupCharge
      // cmpyAllowance: inputs.cmpyAllowance,
      // discount: inputs.discount,
      // offerPerUser: inputs.offerPerUser,
      // offerPerDay: inputs.offerPerDay
    };
    this.dataService.updateDistanceFare(this.vehicleId, id, updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  offerUpdate(id: any, inputs: any): void {
    const updateObj = {
      cmpyAllowance: inputs.cmpyAllowance,
      discount: inputs.discount,
      offerPerUser: inputs.offerPerUser,
      offerPerDay: inputs.offerPerDay
    };
    this.dataService.offerUpdateDistanceFare(this.vehicleId, id, updateObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }
  deleteDistance(inputs: any): void {
    this.dataService.deleteDistanceFare(this.vehicleId, inputs)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  minmaxlist(e) {
    // console.log(e)
    let value = e.target.value;
    if (value >= 100) {
      value = 100;
    }
    if (value <= 0) {
      value = 0;
    }

    const ObjectName = e.target.name;
    this.list[ObjectName] = value;

  }
  minmaxOffer(e) {
    // console.log(e)
    let value = e.target.value;
    if (value >= 100) {
      value = 100;
    }
    if (value <= 0) {
      value = 0;
    }

    const ObjectName = e.target.name;
    this.offerUpdateList[ObjectName] = value;

  }

}
