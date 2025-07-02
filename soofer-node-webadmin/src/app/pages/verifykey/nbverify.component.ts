import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VerifyService } from './verify.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme/components/toastr/toastr.service';

@Component({
  selector: 'ng-verify',
  styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
  providers: [VerifyService]
})

export class NbVerifyComponent {
  list: any = {};
  apiMessage: string;

  constructor(private dataService: VerifyService, private tService: NbToastrService,
    private router: Router) {}
  clearMsg(): void {
    this.apiMessage = "";
  }

  @ViewChild('dataForm') form: any;
  verifyMe(inputs: any): void {
    if (!inputs) { return; }
    this.dataService.verifyDoc(inputs)
      .then(msg => {
   
        if (msg.success == true) {
          var dyUrl=this.dataService.genreateDynamicUrl();
          console.log("dyUrl",dyUrl)
          this.tService.success(msg.message);
          // this.router.navigate(['auth/l]);

          this.router.navigate(['auth/login2'] ,{ skipLocationChange: true });
          this.form.reset();
        }
        else {
          this.tService.danger(msg.message);
     
        }

      }
      )
      .catch(err => {
        let Erro = JSON.parse(err._body);
        this.tService.danger(Erro.message);
        this.list = inputs;
      }
      )
  }
  ngOnInit(): void {
  }

}

