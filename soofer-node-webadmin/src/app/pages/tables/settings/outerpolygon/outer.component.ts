import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { DrawingManager } from '@ngui/map';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../app.config';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'outerpolygon',
  templateUrl: './outer.component.html',
})

export class OuterComponent implements OnInit {

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  positions;
  paths = [];
  as: any = [];
  pathss;
  stateName;
  toshow: boolean = true;

  zoom = AppSettings.MAP_ZOOM;
  location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;

  constructor(private router: Router,
    private toast: ButtonToasterService,
    private route: ActivatedRoute,
    private commonservice: CommonService) {
    // commonservice.bSubject.subscribe(value => {
    //   AppSettings.GOOGLE_MAP_DEFAULT_LOCATION = value;
    //   this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
    //   this.reloadPage();
    // });
    this.reloadPage();
  }

  reloadPage() {
    this.route.params.subscribe(params => {
      if (params['cityname']) {
        this.stateName = params['cityname'];
      }
    });
    this.getbounval(this.stateName);
    this.location = this.stateName;
  }

  setPoints(event) {
    this.as = [];
    let t: any = {};
    t = event.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);
    }
  }

  goback() {
    this.router.navigate(['pages/tables/settings/servicecities/viewservicecities']);
  }

  ngOnInit() { }

  getPoints(event) {
    this.as = [];
    let t: any = {};
    // console.log(event)
    t = event.target.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);
      // this.as.push(ty.lat().toString() + ' ' + ty.lng().toString())
    }
  }

  getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }

  updateLoc() {
    const datas = { outerPolygon: this.as };
    const city = this.stateName;
    // console.log('updateLoc', datas);
    this.commonservice.upadteOuterBoundry(datas, city).then((res) => {
      // console.log(res);
      if (res.success === true) {
        this.as = [];
        this.toast.showtoast('success', res.message);
      }
    }).catch(err => {
      this.toast.showtoast('error', err.message);
    });
  }


  getbounval(val) {
    this.paths = [];
    this.commonservice.getOuterPolygon(val)
      .then(response => {
        if (response.data[0].outerPolygon.length > 0) {
          response.data[0].outerPolygon.forEach((element, index) => {
            const latlng = { lat: element[1], lng: element[0] };
            this.paths.push(latlng);
          });
          this.toshow = true;
        } else {
          this.paths = [];
          this.toshow = false;
        }
      });
  }
}



