import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";
import { AppSettings } from "../../../../app.config";
import { MatTooltip } from "@angular/material";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableService } from "../../table.service";
import { ButtonToasterService } from "../../../buttontoaster/buttontoaster.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";


@Component({
    templateUrl:'./onlinepayment.component.html',
})
export class onlinePaymentComponent {
    @ViewChild('tp') _matTooltip: MatTooltip;
        initial: string = "list";
        source: ServerDataSource;
        defaultCur = AppSettings.defaultcur;
        Doc: any={};
        currentIndex: any = 0;
        userType = [
            {
                label: 'Driver',
                value: 'driver'
            },
            {
                label: 'Rider',
                value: 'rider'
            }
        ]
        settings = {
        actions:{
            edit: false,
            delete: false,
            add: false,
            custom: [{ name:"routeToPage", title: `<i class="nb-edit"></i>`}] 
        },
        pager:{
            display: true,
            perPage: 10,
            page: this.currentIndex,
        },
        columns: {
          // 'userDoc.name': {
          //       title: "Name",
          //       valuePrepareFunction: (cell, row, _id)=>{
          //         let tempAr: any = {}
          //         tempAr = row.userDoc.name
          //         return tempAr
          //       },
          //     },
              transactionId: {
                title: "Transaction Id",
            },
            status:{
                title: "Status",
                filter: {
                type: "list",
                config: {
                  selectText: "All",
                  list: [
                    { value: "initiated", title: "Initiated" },
                    { value: "reversed", title: "Reversed" },
                    { value: "completed", title: "Completed" },
                  ],
                },
              }
            },
            description:{
                title: "Description",
            },
            paymentType:{
                title: "Payment Type",
                valuePrepareFunction: (cell, row, _id)=>{
                  if(row.paymentType == "trip"){
                    return "Trip Payment"
                  }else{
                    return row.paymentType
                  }
                },
            },
            amount:{
                title: "Amount",
                valuePrepareFunction: (cell, row, _id)=>{
                  return row.amount/100
                },
            }
        }
    }
  paymentDetails: any;
  showpaymentDetails:any;
  selectedReferId: any;
  convertAmt: number;
  value: number = 0;
  table: any;
  selecteduserId: any;
  navigationSubscription: any;
  userInfo: any;
    constructor(
        private http : HttpClient,
        private modalService: NgbModal,
        private activatedRoute:ActivatedRoute,
        private toastr: ButtonToasterService,
        private router: Router,
        private service: TableService
        ){
        this.Doc.usertype = "rider"
        this.source = new ServerDataSource(http, {
            // endPoint: AppSettings.API_ENDPOINT + "holdAmtTransaction"
            endPoint: AppSettings.API_ENDPOINT + "holdAmtTransaction?userType_like="+this.Doc.usertype
          });

          this.activatedRoute.params.subscribe(params => {
            if(params['table']){
              this.table =  params['table']
              this.selecteduserId = params['userId']
              if(this.table == 'rider-table'){
                this.Doc.usertype = 'rider'
                this.source = new ServerDataSource(http, {
                  endPoint: AppSettings.API_ENDPOINT + "holdAmtTransaction?userType_like=rider&userId_like="+ params['userId'] 
                });
              //  this.source.setFilter([{ field: "userId", search:  params['userId'] }]);  
              }else{
                this.Doc.usertype = 'driver'
                this.source = new ServerDataSource(http, {
                  endPoint: AppSettings.API_ENDPOINT + "holdAmtTransaction?userType_like=driver&userId_like="+ params['userId'] 
                });
              }
            }
          })

          this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
            if(history.state.code) {
            let code = history.state.code
            this.http.get(AppSettings.API_ENDPOINT + "holdAmtTransaction?userType_like=driver&userId_like=" +code)
            this.initial = 'list'
          } else {
            this.initial = 'list'
          }
        }
        });
    }
    route(event){
      console.log(event,"------>")
        this.initial = ""
        this.paymentDetails = event.data
        this.paymentDetails.amount = event.data.amount/100
        this.getRefundDetails(event.data)
        this.selectedReferId = event.data.referenceId
        this.userInfo = event.data.riderDetails[0]
        this.convertAmt = this.paymentDetails.amount
    }
    goback(): void {
        this.initial = "list";
        // setTimeout(() => this.source.setPage(this.currentIndex), 0);
      }
      copyText() {
        setTimeout(() => {
          this._matTooltip.show();
          this._matTooltip.message = "Copied!";
          });
        setTimeout(() => {
          this._matTooltip.message = "Copy to clipboard";
          this._matTooltip.hide();
        }, 1000);
      }
      openRefund(refund){
        const modalRef = this.modalService.open(refund);
      }
      onInputChange(value: number) {
        this.value = value;
      }
      submitted(d) {
        d('Cross click');
      }
      closed(d) {
        d("Cross click");
      }
      paymentrefund(inputs){
        console.log(inputs)
        
        let info
        info = {
          tripId: this.selectedReferId,
          refundAmount:inputs.fare,
          desc:inputs.paymentdesc
        };
        this.service.refund(info).then((msg)=>{
          this.toastr.showtoast("success", msg.message);
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
      }
      getRefundDetails(data){
        this.showpaymentDetails = {
          paymentdesc : data.description,
          fare : data.amount,
        }
      }
      selectuserType(event){
        this.Doc.usertype = event
        this.source = new ServerDataSource(this.http,{endPoint: AppSettings.API_ENDPOINT+"holdAmtTransaction?userType_like="+ event})
              this.Doc.usertype = event
      }
      gobacktouser(){
        this.activatedRoute.params.subscribe(params => {
            if(params['table'] == "rider-table"){
                this.router.navigate(
                  ["pages/tables/rider-table"],{state: {data: 'redirect',code:params['code']}} 
                );
              }
            else if (params['table'] == "driver-table" ) {
                this.router.navigate(['pages/tables/driver-table'],{state: {data: 'redirect',code:params['code']}})
            }
        })
      }
      redirectToTrips(){
        this.routeToTrips();
      }
      routeToTrips(){
         this.router.navigate(["pages/tripdetails/all-trips",
         {table: "online-payment",code:this.paymentDetails.referenceId}])
      } 
}