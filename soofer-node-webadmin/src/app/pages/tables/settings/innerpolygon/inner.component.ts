import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { DrawingManager } from '@ngui/map';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../app.config';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'innerpolygon',
  templateUrl: './inner.component.html',
  providers: [ButtonToasterService]
})
export class InnerComponent implements OnInit {

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  as: any = [];
  positions;
  paths = [];
  pathss;
  toshow: boolean = true;
  stateName;
  place = {
    display: true,
    lat: null,
    lng: null,
  };

  zoom = AppSettings.MAP_ZOOM;
  location: any = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
  bounds = new google.maps.LatLngBounds();
  polygonCoords = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toast: ButtonToasterService,
    private commonservice: CommonService) {
    this.bounds = new google.maps.LatLngBounds();
    this.polygonCoords = [];
  }

  reloadPage() {
    this.route.params.subscribe(params => {
      if (params['cityname']) {
        this.stateName = params['cityname'];
        this.getbounval(this.stateName);
        // if (params['lat'] && params['lng']) {
        //   this.location = [params['lat'], params['lng']].toString();
        // } else {
        //   this.location = this.stateName;
        // }
      }
    });
  }

  ngOnInit() {
    this.reloadPage();
    this.paths = [];
  }

  setPoints(event) {
    this.as = [];
    for (let i = 0; i < event.getPath().getLength(); i++) {
      let tr = [];
      tr = [parseFloat(event.getPath().getAt(i).lng().toString()), parseFloat(event.getPath().getAt(i).lat().toString())];
      this.as.push(tr);
    }
    // console.log(this.as, ' this.as');
  }

  getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }

  getPoints(event) {
    this.as = [];
    for (let i = 0; i < event.target.getPath().getLength(); i++) {
      let tr = [];
      tr = [parseFloat(event.target.getPath().getAt(i).lng().toString()), parseFloat(event.target.getPath().getAt(i).lat().toString())];
      this.as.push(tr);
    }
    // console.log(this.as, ' this.as');
  }

  updateLoc() {
    const datas = { cityBoundaryPolygon: this.as };
    const city = this.stateName;
    // console.log(datas, 'updateLoc');
    this.commonservice.upadteCityBoundry(datas, city)
      .then((res) => {
        if (res.success === true) {
          this.as = [];
          this.toast.showtoast('success', res.message);
          this.goback();
        }
      }).catch(err => {
        this.toast.showtoast('error', err.message);
      });
  }

  goback() {
    this.router.navigate(['pages/tables/settings/servicecities/viewservicecities']);
  }

  getbounval(val) {
    this.spinner.show();
    this.paths = [];
    this.polygonCoords = [];
    this.commonservice.getBoundryPolygon(val)
      .then(response => {
        if (response.data[0].cityBoundaryPolygon != null) {
          if (response.data[0].cityBoundaryPolygon.length > 0) {
            response.data[0].cityBoundaryPolygon.forEach((element, index) => {
              this.polygonCoords.push(new google.maps.LatLng(element[1], element[0]));
              const latlng = { lat: element[1], lng: element[0] };
              this.paths.push(latlng);
            });
            for (let i = 0; i < this.polygonCoords.length; i++) {
              this.bounds.extend(this.polygonCoords[i]);
            }
            this.location = [this.bounds.getCenter().lat(), this.bounds.getCenter().lng()].toString();
            this.toshow = true;

            const timeout = setTimeout(() => {
              this.spinner.hide();
              clearTimeout(timeout);
            }, 2000);

          } else {
            // console.log(response.data[0].cityBoundaryPolygon, 'false1');
            this.toshow = false;
            this.paths = [];
            this.spinner.hide();
          }
        } else {
          // console.log(response.data[0].cityBoundaryPolygon, 'false2');
          this.toshow = false;
          this.paths = [];
          this.spinner.hide();
        }
      });
  }
}

