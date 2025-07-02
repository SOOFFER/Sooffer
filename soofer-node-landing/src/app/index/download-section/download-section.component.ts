import { Component, OnInit } from '@angular/core';
import { SectionService } from '../section/section.service';

@Component({
  selector: 'app-download-section',
  templateUrl: './download-section.component.html',
  styleUrls: ['./download-section.component.css']
})
export class DownloadSectionComponent implements OnInit {
  list: any;

  constructor(private sectionService: SectionService) { 
    this.sectionService.gethomecontent().then(res => {
      if (res.length)  this.list = res[0];
    });
  }


  ngOnInit() {
  }

}
