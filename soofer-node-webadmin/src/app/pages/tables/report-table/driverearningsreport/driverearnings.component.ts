import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { Location } from '@angular/common'; 
import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';  

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService,CommonService], 
  templateUrl: './driverearnings.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  },
  .invoice{
    padding-top: 45px !important;
  }
  `],
})

export class DriverEarningsComponent{ 
  title:string = "Driver Earnings";   
  trip:string = "triplist";
  settings = {

  // actions: false,
  actions: {
  edit: false, //as an example
  delete: false, //as an example
  add: false, //as an example
  custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }  ] 
},

pager : {
  display : true,  
  perPage:10, 
},

columns: {

  dvrfname: {
    title: 'Driver Name',
  },

   code: {
        title: 'Driver Code',
        valuePrepareFunction: (cell, row) => { return row.code[0] }
      }, 
 
  totalearnings:
  {
    title:'Total Earnings',
    valuePrepareFunction: (cell, row)=>  row.inhand + row.digital
  }, 
  commision: {
    title: 'Commision' 
  },
 
  }, 


};

source: ServerDataSource;  

constructor(_http:HttpClient , http: Http, private service: TableService,  private location:Location, private CommonSvc: CommonService  ) {
  this.source = new ServerDataSource(_http, { endPoint:  AppSettings.API_ENDPOINT + 'driverEarnings' });  
}

tripdetailsId:string;

route(event) { 
     

  }

  ngOnInit(): void {  }

   filterRes(fromDate,toDate){ 
  }
   
  
}//Export