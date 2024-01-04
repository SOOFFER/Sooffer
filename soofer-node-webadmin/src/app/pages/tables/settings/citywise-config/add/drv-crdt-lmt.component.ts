import { Component , Input } from '@angular/core';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { TableService } from '../../../table.service';
import { CommonService } from '../../../../common/common.service';
import { FeatureGroup } from 'leaflet';
import { featuresSettings,dropdown } from '../../../../../app.config';
import { Router } from '@angular/router';
// import { Input } from '@syncfusion/ej2-inputs';
 
interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component ({
    selector: 'Driver-Credit-limit',
    templateUrl: './drv-crdt-lmt.component.html',
})

export class DriverCreditLimitComponent {
  
  @Input() fields: any;

    list: any={};

    packageType : any[] = featuresSettings.payPackageTypes;
   

    cities: Array<commonDataList>;
  lengthservicecities: number;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;

    constructor ( private tableSvc : TableService ,
        private tosater: ButtonToasterService,
        private CommonSvc : CommonService,
        private router: Router ) {
          this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        //  console.log(res)
        this.cities = res;
        this.lengthservicecities = this.cities.length;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
        if(localStorage.getItem('userType') == 'citywiseadmin'){
          this.list.scIds = this.CommonSvc.dataforscids(this.cities);
        }
        // console.log(this.cities)
      });

        }

        AddData(data){
          const info={
            prepaidMinBal : data.prepaidMinBal,
            postpaidMinBal: data.postpaidMinBal,
            scIds: JSON.stringify(data.scIds),
            maxDistBtRiderAndDriver: data.maxDistBtRiderAndDriver,
            maxDistBtRiderAndDriverOutsation: data.maxDistBtRiderAndDriverOutsation,
            maxDistBtRiderAndDriverRental:data.maxDistBtRiderAndDriverRental,
            requestTime : data.requestTime,
            requestTimeOutsation: data.requestTimeOutsation,
            requestTimeRental: data.requestTimeRental,
            driversNeedToCallForATrip : data.driversNeedToCallForATrip,
            userCancelTime: data.userCancelTime
          }
          console.log(info)
          this.tableSvc.AddPackageType(info)
          .then(res=>{
            this.tosater.showtoast('success',res.message)
            this.router.navigate(['pages/tables/settings/citywise-config/view'])
          }) 
          .catch(res=>{
            this.tosater.showtoast('error',res.message)
          })
        }
}