import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../utility.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Router } from "@angular/router";

@Component({
  selector: 'addcountries',
  templateUrl: './addcountries.component.html',
  styles: [`
  .example-form {
    min-width: 150px;
    max-width: 500px;
    width: 100%;
  }

  .example-full-width {
    width: 100%;
  }

  `]
})

export class AddcountriesComponent {
  spinner: boolean = true;
  userId: Number;
  name: any = {};
  sortname: any;
  phoneCode: any;
  currencyName: any;
  currencyCode: any;
  constructor(private router: Router, private service: UtilityService, private toastr: ButtonToasterService) {
    this.userId = parseInt(localStorage.getItem('userId'));
  }

  list: any = {}

  AddNewDoc(inputs) {
    inputs.userId = this.userId;
    //console.log(inputs)
    this.service.Addcountries(inputs)
      .then(res => {
        //console.log(res)
        this.toastr.showtoast("success", res.message);
        this.spinner = true;
        this.router.navigate(['/pages/tables/utility/country/viewcountries']);
      }).catch(err => {
        let error = JSON.parse(err._body)
        this.toastr.showtoast("error", error.message);
        this.spinner = true;
      })

  }
}

// export interface User {
//   name: string;
// }
