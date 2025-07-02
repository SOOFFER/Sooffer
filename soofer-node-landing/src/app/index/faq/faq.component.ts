import { Component } from '@angular/core';
import { CommonService } from '../common/common.service';

@Component({
  selector: "faq",
  templateUrl: './faq.html',
  providers: [CommonService]
})
export class FaqComponent {
  catary: any[] = [];
  AnsAry: any[] = [];
  title: string;


  constructor(private cservice: CommonService) {
    this.title = 'FAQ';
    this.cservice.getfaqCatagory()
      .then(msg => {
        console.log('msg : ', msg);

        this.catary = msg;
        this.getQuestions(this.catary[0]._id,);
      });
  }

  getQuestions(id,) {


    this.cservice.getQuesAnswer(id)
      .then(res => {
        console.log('Answer Array : ', res);

        this.AnsAry = res;
      });
  }


}
