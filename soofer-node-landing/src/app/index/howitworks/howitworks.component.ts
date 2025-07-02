import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "howitworks",
  templateUrl: "./howitworks.html",
  providers: [CommonService]
})
export class HowitworksComponent {
  title: string;
  description: string;
  constructor(private cservice: CommonService) {
    this.title = "How It Works";

    this.cservice.getAboutPAge(this.title)
      .then(res => {
        this.title = res[0].title;
        this.description = res[0].desc;
        // console.log(this.description);
      })
  }
}
