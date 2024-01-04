import { Component, ViewChildren } from '@angular/core';
import { CommonService } from '../common/common.service';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';

@Component({
  selector: "contact",
  templateUrl: './contact.html',
  providers: [CommonService, ButtonToasterService]
})
export class ContactComponent {

  list: any = {};
  City: any =[]; 
  Data: any;

  constructor(private cservice: CommonService,
    private router: Router,
    private tost: ButtonToasterService) {
    this.list = {};
    this.cservice.GetCityAddress()
    .then(res=>{
       for(const data of res) {
         data.name = data.scIds[0].name
         data.cityId =data.scIds[0].scId
       }
       console.log(res)
       this.Data = res
    })
   
  }

  @ViewChildren('dataForm') form: any;

  SendTo(inputs) {
    console.log(inputs)
    if (!inputs) { return; }
    this.cservice.mailSend(inputs)
      .then(res => {
        this.tost.showtoast('success', res.message);
        this.list = {};
        this.router.navigate(['/']);
      })
      .catch(res => {
        this.tost.showtoast('error', res.message);
      })
  }
}
