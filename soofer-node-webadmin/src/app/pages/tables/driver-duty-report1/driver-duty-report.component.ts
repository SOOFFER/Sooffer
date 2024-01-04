import { Component } from '@angular/core';
import { TableService } from '../table.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../common/common.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Ng2SmartTableModule , ServerDataSource } from 'ng2-smart-table';
import { AppSettings, featuresSettings } from '../../../app.config';
import { Server } from 'selenium-webdriver/safari';
import { DriverDutyReportComponent } from '../driver-duty-report/driver-duty-report.component'
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component  ({
    selector : 'driver-report-duty',
    templateUrl : './driver-duty-report.component.html'

})

export class DriverDutyComponent {

    list: any ={} ;
    event = DriverDutyReportComponent

    settings ={
      
            actions: {
                add: false,
                edit: false,
                delete : false, 
            },
            columns : {
                date : {
                    title : 'Date',
                    filter : false,
                    valuePrepareFunction: (date) =>{
                       return this.datePipe.transform(date,'dd-MM-yyyy')
                    }
                },
                // driverCode : {
                //     title :'Code',
                //     filter : false,
                // },
                // driverName : {
                //     title :'Name',
                //     filter: false,
                // },
                onlineHours : {
                    title: 'Online Hours',
                    filter: false,
                },
                offlineHours : {
                    title: 'Offline Hours',
                    filter: false
                },
                lastON : {
                    title: 'Lase On',
                    filter: false,
                    valuePrepareFunction : (lastON) =>{
                        if(lastON == null) 
                        return 'N/A'
                        else
                        {
                            // console.log(lastON.split('T'))
                      return this.datePipe.transform(
                          lastON.split('T')[0]
                      +" "+
                      (lastON.split('T')[1])
                      .split('Z')[0]
                      ,
                      'dd-MM-yyyy, h:mm a')

                        } 
                    }
                },
                lastOFF : {
                    title: 'Last Off',
                    filter: false,
                    valuePrepareFunction: (lastOFF) =>{
                        if(lastOFF == null)
                        return 'N/A'
                        else
                        {
                            // console.log(lastOFF.split('T'))
                      return this.datePipe.transform(
                        lastOFF.split('T')[0]
                      +" "+
                      (lastOFF.split('T')[1])
                      .split('Z')[0]
                      ,
                      'dd-MM-yyyy, h:mm a')

                        } 
                    }
                }

            }
        
    }

    source: ServerDataSource;
    city: any;
    showCity: boolean;
    fromDate: any;
    toDate: any;
    id: any;
    
    constructor(_http : Http, private tabelSvc : TableService ,
        private toaster : ButtonToasterService ,private router : Router,
        private http: HttpClient,private routing: ActivatedRoute, private datePipe: DatePipe,) {
            const date = new Date();
            this.list.date_gte = new Date(date.getFullYear(), date.getMonth(), 1);
            this.list.date_lte = new Date(date.getFullYear(), date.getMonth() + 1, 0); 
            this.fromDate = this.datePipe.transform(this.list.date_gte,'yyyy-MM-dd' )
            this.toDate = this.datePipe.transform(this.list.date_lte,'yyyy-MM-dd')
            this.routing.params.subscribe(params =>{
                if(params['_id']){
                    this.id=params['_id']
                    this.source = new ServerDataSource(this.http , { endPoint: AppSettings.API_ENDPOINT + 'driverOnlineStatusReport'+ '/'+ params['_id']+ '?date_gte='+ this.fromDate +'&date_lte='+ this.toDate});
                }
            }) 
         
            this.tabelSvc.getServiceCity()
            .then(res=>{
                this.city= res;
            })
            if (featuresSettings.isCityWise === true
                && featuresSettings.isServiceAvailable === true
                && localStorage.getItem('userType') === 'superadmin')
                this.showCity = true;
              else this.showCity = false;
              
              
        }

        getDriver(data) {
            console.log(data)
            this.fromDate =this.datePipe.transform(data.date_gte,'yyyy-MM-dd')
            this.toDate = this.datePipe.transform(data.date_lte,'yyyy-MM-dd')
            console.log(this.fromDate,this.toDate)     
            if(data.servicecity && data.date_gte && data.date_lte) {
                this.source = new ServerDataSource(this.http ,{ endPoint : AppSettings.API_ENDPOINT + 'driverOnlineStatusReport'+'/'+ this.id +'?date_gte=' + this.fromDate +'&date_lte=' +this.toDate + '&scity_like=' + data.servicecity  } ) 
            }
            else if(data.servicecity && data.date_gte === undefined && data.date_lte == undefined) {
                this.source = new ServerDataSource(this.http ,{ endPoint : AppSettings.API_ENDPOINT + 'driverOnlineStatusReport'+'/'+ this.id + '&scity_like=' + data.servicecity  } ) 
            }
            else if(data.servicecity === undefined && data.date_gte && data.date_lte ){
                this.source = new ServerDataSource(this.http , { endPoint : AppSettings.API_ENDPOINT + 'driverOnlineStatusReport'+'/'+ this.id +'?date_gte=' + this.fromDate +'&date_lte=' +this.toDate  } ) 
            }
        }

        goBack() {
            this.routing.params.subscribe(params =>{
              
                 if(params['_id'] && params['code']){
                    this.router.navigate(['pages/tables/driver-table'])
                 }
                 else if(params['_id']){
                    this.router.navigate(['pages/tables/driver-duty-report'])
                } 
                   
            })    
            
        }
    }
    