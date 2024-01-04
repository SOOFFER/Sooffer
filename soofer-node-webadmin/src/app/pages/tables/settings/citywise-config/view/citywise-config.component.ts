import { Component } from '@angular/core';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { TableService } from '../../../table.service'
import { CommonService } from '../../../../common/common.service';
import { Ng2SmartTableModule, LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http'
import { HttpClient } from '@angular/common/http'
import { AppSettings ,featuresSettings,dropdown} from '../../../../../app.config';

interface commonDataList {
    value: string;
    label: string;
    id: string;
    name: string;
  }

@Component ({
    selector : 'city-wise-config',
    templateUrl : './citywise-config.component.html'
})

export class CitywiseComponent {

 source : ServerDataSource;
 cities: Array<commonDataList>;
 dropdownSettings = dropdown.dropdownSettings;
 servicecity = featuresSettings.isServiceAvailable;
 initial : string ="table"
 list: any ={};
 
 settings ={
     actions :{
        add: false,
        edit:false,
        delete: false,
        custom : [{ name : 'routeToPage' , title :` <i class="nb-edit"></i>` }],
     },
    

     columns : {
        prepaidMinBal : {
            title : 'Pre Paid '
        },
        postpaidMinBal:{
            title: 'Post Paid'
        }
     }
 }
    GetData: any;
    lengthservicecities: number;
    oldScIds: any;
    selId: any;

constructor(private toaster : ButtonToasterService ,
    private tableSvc : TableService ,
    private CommonSvc : CommonService,
    private http : Http,
    private _http : HttpClient ) {
        this.source = new ServerDataSource (_http ,{ endPoint : AppSettings.API_ENDPOINT + 'citywiseconfig'})
        this.CommonSvc.getServiceAvailableCity()
        .then(res => {
          //  console.log(res)
          this.cities = res;
          this.lengthservicecities = this.cities.length;
          this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
          this.cities = this.CommonSvc.dataforscids(this.cities);
    })
}

    route(event) {
        this.initial = ""
        console.log(event.data)
        this.selId = event.data._id;
        this.list = event.data;
        this.oldScIds = event.data.scIds 
        if(localStorage.getItem('userType') == 'citywiseadmin'){
            this.list.scIds = this.CommonSvc.dataforscids(this.cities);
          }
    }

    goBack() {
        this.initial="table"
    }
    
    UpdateData(list) {
       const info = {
        oldScIds : JSON.stringify(this.oldScIds),
        scIds : JSON.stringify(list.scIds),
        prepaidMinBal : list.prepaidMinBal,
        postpaidMinBal : list.postpaidMinBal,
        maxDistBtRiderAndDriver : list.maxDistBtRiderAndDriver,
        maxDistBtRiderAndDriverOutsation: list.maxDistBtRiderAndDriverOutsation,
        maxDistBtRiderAndDriverRental : list.maxDistBtRiderAndDriverRental,
        requestTime :list.requestTime,
        requestTimeOutsation : list.requestTimeOutsation,
        requestTimeRental : list.requestTimeRental,
        driversNeedToCallForATrip : list.driversNeedToCallForATrip,
        userCancelTime : list.userCancelTime
       }
   
        this.tableSvc.UpdateCitywiseConfig(info , this.selId)
        .then(res=>{
            this.toaster.showtoast('success',res.message)
            this.initial ="table"
        })
        .catch(res=>{
            this.toaster.showtoast('error',res.message)
        })
    }
    DeleteData() {
        this.tableSvc.DeleteCitywiseConfig(this.selId)
        .then(res=>{
            this.toaster.showtoast('success',res.message)
            this.initial ="table"
        })
        .catch(res=>{
            this.toaster.showtoast('error',res.message)
        })
    }
}