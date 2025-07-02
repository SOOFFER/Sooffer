import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';

import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService], 
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class TripacceptanceComponent {
  title:string = "Driver Log Report"; 
 
 settings = { 

    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
    },

    columns: {
      fname: {
        title: 'Name',
      },
      email:{
        title:'Email',
      },
      last_in: {
        title: 'Online Time',
      },
      last_out:
      {
        title:'Offline Time',
      },  

      totalMin: {
        title: 'Total Minutes Login', 
        valuePrepareFunction: (totalMin) => {
          if(totalMin) return totalMin.toFixed(2)
          else 'NA'
        }  
      }, 

    },
  };
 
  source: ServerDataSource; 

  constructor(_http:HttpClient , http: Http, private service: TableService) {
    this.source = new ServerDataSource(_http, { endPoint:  AppSettings.API_ENDPOINT + 'logReport' }); 
  }

  route(event) {   
    console.log(event.data._id); 
    console.log(event.data); 
    // this.SetDocsDetails(event.data);
  }
  
  filterRes(fromDate,toDate){ 
  }   

  getDTDiff(from,to){
       var dateDiff =  (new Date()).valueOf() - (new Date("2018-06-28T12:01:04.753Z")).valueOf() ;
       return this.millisToMinutesAndSeconds (dateDiff);
  }
   
  millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ' min' ;
 } 

}
