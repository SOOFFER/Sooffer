import { Component } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: "help",
  templateUrl: './help.html',
  providers: [CommonService]
})
export class HelpComponent {
  catary: any[] = [];
  AnsAry: any[] = [];
  title: string;
  constructor(private cservice: CommonService) {
    this.title = 'How It Works';
    this.cservice.gethelpCatagory()
      .then(msg => {
        this.catary = msg;
        this.getQuestions(this.catary[0]._id);
      });
  }

  getQuestions(id) {
    // console.log(id)
    this.cservice.getHelpQA(id)
      .then(res => {
        this.AnsAry = res;
      });
    // console.log(this.AnsAry)
  }

}
