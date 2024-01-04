import { Component } from '@angular/core';
import { CommonService } from '../common/common.service'

@Component ({
    selector : 'city-address',
    templateUrl : './city-address.html',
    providers: [CommonService]
})

export class CityAddressComponent {
    City: any=[]; 
    Address: any=[];
    data: any=[];
    symbol = "#collapse";
    symbol1="collapse";
    constructor(private service : CommonService) {
     this.service.GetCityAddress()
     .then(res=>{
         this.data = res
         for(let i=0;i<res.length;i++) {
            this.data[i].num = i+1
            this.data[i].name = res[i].scIds[0].name;
            this.data[i].Address = res[i].address  
         }

        //  this.data = res
        //  this.data[0].num=1;
        //  this.data[1].num=2;
        //  for(let i=0;i<res.length;i++){
        //     this.City.push(res[i].scIds[0]) 
        //     // this.Address.push(res[i].address)
        //  }
       console.log(this.data)
     })
    }

}
