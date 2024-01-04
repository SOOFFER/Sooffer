
import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";
import { throwMatDuplicatedDrawerError } from "@angular/material";
@Component({
	selector: "servicecities",
	providers: [CommonService],
  templateUrl: "./servicecities.html",/* `
   <h4>NgFor (data)</h4>
   <ul *ngFor="let data of dataByCity"> 1
    <li>{{ data.city }}</li>
    <ul>
   
  <li *ngFor="let city of data.city"> 2
   
  {{ data.city }}
   
  </li>
    </ul>
   </ul>
   `*/
  })
  /*class NgForGroupedExampleComponent {
    cityByCity: any[] = [
   
      {
        "success": true,
        "data": [
          {
            "_id": "5c1b2f2797303620674eaf06",
            "nearby": [
              {
                "cityId": "3551",
                "city": "Abiramam",
                "_id": "5c25cf4e5adf8d30f426a1b7"
              },
              {
                "cityId": "3552",
                "city": "Achampudur",
                "_id": "5cc7ff75675dc81351dcb5c4"
              }
            ],
            "city": "Madurai"
          },
          {
            "_id": "5cabc4c65926c11a22c01487",
            "nearby": [],
            "city": "New York"
          },
          {
            "_id": "5cc1e1e267e33b0f1cabc24f",
            "nearby": [],
            "city": "Wilkes-Barre"
          },
          {
            "_id": "5cc7fee0675dc81351dcb5c2",
            "nearby": [],
            "city": "Rijan"
          },
          {
            "_id": "5cc85cb161d3da683365420c",
            "nearby": [],
            "city": "Johannesburg"
          },
          {
            "_id": "5ce23acfa6a94175c541ea27",
            "nearby": [],
            "city": "Ttt"
          },
          {
            "_id": "5ce23aeea6a94175c541ea29",
            "nearby": [],
            "city": "New Delhi"
          },
          {
            "_id": "5ce9cc8b35c0574de1c502b8",
            "nearby": [],
            "city": "Rusape"
          }
        ]
      }
    ];
  }*/

export class ServicecitiesComponent { 
  catary:any[]=[];
  AnsAry:any[]=[];
  title:string;
  description:string;
    constructor(private cservice: CommonService) {
        this.title= "SERVICE CITIES";
        this.cservice.getServicecityCatagory()
  .then( city =>{
      this.catary = city.data;
      console.log("city")

      console.log(city)
    }); 
  //  console.log(this.catary)
  }

  getQuestions(id){
    // console.log(id)
    this.cservice.getQuesAnswer(id)
    .then(res=>{
      this.AnsAry=res;
    })
    }

}









































/*import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
	selector: "about",
	templateUrl: "./about.html",
	providers: [CommonService]
})
export class AboutComponent {
	title: string;
	description: string;
	slider1 = [
		{ id: 1, slide: 'assets/images/header-mexico.jpg' },
		{ id: 2, slide: 'assets/images/header-mexico.jpg' },
		{ id: 3, slide: 'assets/images/header-mexico.jpg' }
	];
	slider2 = [
		{ id: 1, slide: 'assets/images/93931301.jpg' },
		{ id: 2, slide: 'assets/images/93931301.jpg' },
		{ id: 3, slide: 'assets/images/93931301.jpg' }
	];
	achive_goal = [
		{ id: 1, slide: 'assets/images/default.png' },
		{ id: 2, slide: 'assets/images/default.png' },
		{ id: 3, slide: 'assets/images/default.png' },
		{ id: 4, slide: 'assets/images/default.png' },
		{ id: 5, slide: 'assets/images/default.png' },
		{ id: 6, slide: 'assets/images/default.png' },
		{ id: 7, slide: 'assets/images/default.png' }
	];
	constructor(private cservice: CommonService) {
		this.title = "About Us";

		this.cservice.getAboutPAge('About Us')
			.then(res => {
				// console.log(res[0])
				this.title = res[0].title;
				this.description = res[0].desc;
			})
	}
}


import { Component, ViewChildren } from "@angular/core";
import { CommonService } from "../common/common.service";
import { ButtonToasterService } from "../buttontoaster/buttontoaster.service";

@Component({
  selector: "contact",
  templateUrl: "./contact.html",
  providers:[CommonService,ButtonToasterService]
})
export class ContactComponent {

  list:any={};
  constructor(private cservice:CommonService,  private tost: ButtonToasterService){
  }
  @ViewChildren('dataForm')form:any;
SendTo(inputs)
{
  if(!inputs)return;
  this.cservice.mailSend(inputs)
  .then(res=>{
    if(res.success==true){
      this.tost.showtoast('success',res.message);
      this.form.reset();
    }
    else {
      this.tost.showtoast('error',res.message);

    }
  // console.log(inputs)
});
}
}



import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "help",
  templateUrl: "./help.html",
  providers: [CommonService]
})
export class HelpComponent {
  catary: any[] = [];
  AnsAry: any[] = [];
  title: string;
  constructor(private cservice: CommonService) {
    this.title = "How It Works";
    this.cservice.gethelpCatagory()
      .then(msg => this.catary = msg);
  }

  getQuestions(id) {
    //console.log(id)
    this.cservice.getHelpQA(id)
      .then(res => {
        this.AnsAry = res;
      })
    // console.log(this.AnsAry)
  }

}

import { Component, ViewChild } from '@angular/core';
import { SigninService } from './signin.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { AppSettings } from '../../app.config';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';

@Component({
  selector: "signin",
  templateUrl: "./signin.html",
  providers: [SigninService],
})
export class SigninComponent {
  list: any = {};
  state: any = false;
  apiMessage: string;
  decoded: any = {};
  fronturl = AppSettings.FEURL;
  clearMsg(): void {
    this.apiMessage = "";
  }
  constructor(private logService: SigninService, private router: Router, private toastr: ButtonToasterService) { }
  @ViewChild('dataForm') form: any;
  login(inputs: any): void {
    if (!inputs) { return; }
    // console.log(inputs)
    this.logService.Signme(inputs)
      .then(msg => {
        if (msg.success == true) {
          // console.log(msg)
          this.state = true;
          localStorage.setItem('Tok', msg.token);
          this.decoded = jwtDecode(msg.token);
          //console.log(this.decoded);
          localStorage.setItem('Type', this.decoded.type);
          localStorage.setItem('Id', this.decoded.id);
          window.location.href = this.fronturl + "/#/profile";
          //this.router.navigate(["/profile"]);
          //this.router.navigateByUrl(this.fronturl+"/profile");
        }
        else {
          this.toastr.showtoast('error', msg.message)
        }
      }
      )
      .catch(res => {


        let err = JSON.parse(res._body);

        this.toastr.showtoast('error', err.message)

      })
  }
  ngOnInit(): void {
  }

}*/
