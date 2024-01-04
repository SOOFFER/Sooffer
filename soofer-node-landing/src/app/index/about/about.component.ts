import { Component } from "@angular/core";
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
