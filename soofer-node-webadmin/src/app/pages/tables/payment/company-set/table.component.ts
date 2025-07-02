import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { ReportService } from '../../../common/report.service';
import { AppSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';
import { Angular2Csv } from 'angular2-csv';
import * as moment from 'moment';
import { template } from '@angular/core/src/render3';
 
@Component({
    selector:'ngx-smart-table',
    providers:[TableService,ReportService,DatePipe],
    templateUrl:'./smart-table.component.html',
    styles:[`
    nb-card{
        transform: translate3d(0,0,0,);
    }
    `],
})

export class CompanySettlementComponent {

    title:string='Company Settlements';
    dateObj:any;
    list:any;
    initial:string = 'showList';
    settings={
        actions:{
            edit:false,
            delete:false,
            add:false,
            columnTitle:'View Payment Details',
            class:'action-column',
            custom:[{ name:'routeToPage',title:`<i class="nb-edit"></i>`}]
        },
       columns:{
           hotelname:{
               title:'Company',
           },
           count:{
               title:'Total No of Trips',
           },
           commision:{
               title:'Commision',
               filter:false,
           },
           amttohotel:{
               title:'Company Commision',
               filter:false
           },
           amttopay:{
               title:'Total Trip Amount',
               filter:false
           },
       },
    };

    reportname="Company Settlement";
    options={
        fieldSeparator:',',
        quoteStrings:'"',
        decimalseperator:'.',
        headers:['Driver','code','Total Trip Amount','Total No of Trips'],
        showTitle:true,
        title:'Driver Payments',
        useBom:true,
        removeNewLines:false,
        keys:['dvrfname','code','amttodriver','count'],

    };
    source:ServerDataSource;
    trxSource:ServerDataSource;

    constructor(private _http:HttpClient,
        private service:TableService,
        private dataPipe:DatePipe,
        private toastr:ButtonToasterService,
        private RepSvc:ReportService){
            this.dateObj = {};
            this.list = {};
            const fromDate = new Date(Date.now());
            let month =fromDate.getMonth(),
              year = fromDate.getFullYear();
            let FirstDay = new Date(year,month,1);
            let LastDay = new Date(year,month+1,0);
            this.list.fromDate=FirstDay;
            this.list.toDate=LastDay;
            console.log(this.list.toDate);
            this.loadTable(); 
        }
        loadTable(){
            this.source = new ServerDataSource(this._http, { endPoint:AppSettings.API_ENDPOINT + 'hotelPayReport?createdAt_gte=' + this.list.fromDate + '&createdAt_lte=' + this.list.toDate }); 
        }
        filteRes(){
            if(this.dateObj['fromDate']!=undefined || this.dateObj['toDate']==undefined){
                this.toastr.showtoast('warn','Select Both Form Date and To Date');
            }
            else{
                const fromDate = this.dateObj['fromDate'];
                const toDate='';
                this.source= new ServerDataSource(this._http,{ endPoint:AppSettings.API_ENDPOINT + 'hotelPayReport?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate });
            }
        }

        export(){
            let fromDate='';
            let toDate='';
            if(this.dateObj['fromDate']!=undefined
            && this.dateObj['fromDate'] != ''){
                fromDate = this.dateObj['fromDate'];
            }
            if (this.dateObj['toDate']!=undefined
            && this.dateObj['toDate'] != ''){
                toDate= this.dateObj['toDate'];
            }
            this._http.get(AppSettings.API_ENDPOINT
                +'hotelPayReport?createAt_gte='
                +fromDate
                +'&createdAt_lte='
                +toDate
                +'&requestFrom'
                +'without_limit')
                .toPromise()
                .then(res=>{
                    const data= res;
                    this.exporttoCSV(data,fromDate,toDate);
                })
                .catch(res=>{
                    this.toastr.showtoast('error',res.message)
                });
        }

        exporttoCSV(data,from,to){
            if(from !=='' && to !== ''){
                this.options.title =`Driver Payments Form ${from} to ${to}`;
            } else if (from !== '' && to ==''){
                this.options.title=`Driver Payments Form ${from}`;
            } else if (from == '' && to !==''){
                this.options.title=`Driver Payments Upto ${to}`;
            }
            new Angular2Csv(data,this.reportname,this.options);
        }
        logDate(msg){
            this.dateObj[msg.input.name] = this.dataPipe.transform(msg.input.value,'yyyy-MM-dd');
        }
        trxSettings={
            actions:false,
            columns:{
                triptype:{
                    title:'Trip Type',
                },
                tripno:{
                    title:'Trip No',
                },
                date:{
                    title:'Date',
                },
                dvr:{
                    title:'Driver',
                },
                rid:{
                    title:'Rider',
                },
                fare:{
                    title:'Fare',
                },
                vehicle:{
                    title:'Vehicle Type',
                },
                status:{
                    title:'Status',
                },
                csp:{
                    title:'Via',
                    valuePrepareFunction :(csp)=>{
                        return csp['via'];
                    }
                },
            },
        };
        route(event){
            this.initial='';
            this.SetDocsDetails(event.data);
        }
        SetDocsDetails(data){
            console.log(data.trx);
            this.trxSource =data.trx;
        }
}
