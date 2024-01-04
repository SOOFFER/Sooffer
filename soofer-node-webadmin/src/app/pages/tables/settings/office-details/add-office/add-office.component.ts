import { Component , ViewChild } from '@angular/core';
import { TableService } from '../../../table.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Http } from '@angular/http'; 
import { inputValidation, featuresSettings, dropdown } from '../../../../../app.config'
import { CommonService } from '../../../../common/common.service';
import { Router } from '@angular/router';

interface commonDataList {
    value: string;
    label: string;
    id: string;
    name: string;
  }
@Component ({
    selector: 'office-details',
    templateUrl : 'add-office.component.html',
    providers :[ TableService, ButtonToasterService]
})

export class AddOfficeDetailsComponent {
    list: any={};
    valid=inputValidation.emailValid;
    servicecity = featuresSettings.isServiceAvailable;
    dropdownSettings = dropdown.dropdownSettings;
    cities: Array<commonDataList>;
    lengthservicecities: number;

    constructor( private tableSvc: TableService ,
        private CommonSvc: CommonService,
        private router: Router,
        private toaster: ButtonToasterService) {
            this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        //  console.log(res)
        this.cities = res;
        this.lengthservicecities = this.cities.length;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
        this.list.isSupportNoEnable = true;
        if(localStorage.getItem('userType') == 'citywiseadmin'){
          this.list.scIds = this.CommonSvc.dataforscids(this.cities);
        }
        // console.log(this.cities)
      });
        }
 
        AddData(data){
          const info={
            address:data.address,
            mail:data.mail,
            phone: data.phone,
            scIds: JSON.stringify(data.scIds),
            isSupportNoEnable : data.isSupportNoEnable
          }
        //  const formdata = new FormData();
        //       formdata.append("address",data.address);
        //       formdata.append('mail',data.mail);
        //       formdata.append('phone',data.phone);
        //       formdata.append('scIds',JSON.stringify(data.scIds));
            this.tableSvc.AddOfficeDetails(info) 
            .then(res=>{
                this.toaster.showtoast('success',res.message)
                this.router.navigate(['pages/tables/settings/office-details/view-office'])
            })
            .catch(res=>{
                this.toaster.showtoast('error',res.message)
            })
        }

}