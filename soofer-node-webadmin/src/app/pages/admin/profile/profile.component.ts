import { Component } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { NbToastrService } from '@nebular/theme';
import { AppSettings, inputValidation } from '../../../app.config';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-smart-table',
  providers: [AdminService],
  templateUrl: './profile.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class ProfileComponent {
  initial:string = "list";
  selectedid:string;
  selectedDocs:any={};
  selectedUser:any;
  list: any = {};
  validation = inputValidation;
  data: any;

  constructor(
    private toastr: ButtonToasterService,
    private router: Router,
    private adminservice: AdminService) {
    this.adminservice.getMyProfile()
      .then(res => {
        this.SetDocsDetails(res.data);
      })
  }
  SetDocsDetails(data:any):void{
    if(!data){ return; }
    this.selectedid =  data._id;
    this.selectedDocs =  data;
    this.selectedUser =  data.fname;
    var ele='';
    data.scIds.forEach(element => {
      if(ele=='') ele=element.name;
      else
      ele=ele+","+element.name;
    });
    this.selectedDocs.scId=ele;
  }

  EditAdmin(inputs: any) {
    let updateAdmin = {
      email: inputs.email,
      fname: inputs.fname,
      lname: inputs.lname,
      phone: inputs.phone,
    }
    this.adminservice.EditMyProfile(updateAdmin)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        // this.router.navigate(['/pages/dashboard']);
      })
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      })
  }
}
