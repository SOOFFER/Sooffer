import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class DrivertaxiTableComponent implements OnInit {

  @ViewChild('map')
  public mapElementRef: ElementRef;
  public map: google.maps.Map;
  public directionsService: google.maps.DirectionsService;
  public directionsDisplay: google.maps.DirectionsRenderer;
  list: any = {};

  ngOnInit(): void {
  }

  constructor(private renderer: Renderer2) {
    this.list = {};
    this.list.startLoc = 'Chennai, IN';
    this.list.endLoc = 'Mahabalipuram, IN';
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  initMap() {
    const latLng = new google.maps.LatLng(13.0827, 80.2707);
    this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
      zoom: 7,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.setOptions({ suppressMarkers: true });
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeColor: 'black'
      }
    });
  }

  clicked() {
    this.directionsService = new google.maps.DirectionsService;
    this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    const waypts = [];
    const checkboxArray = (this.list.wayPts) !== undefined ? this.list.wayPts : [];
    console.log(checkboxArray);
    for (let i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray[i]) {
        console.log(checkboxArray[i]);
        waypts.push({
          /*  location: checkboxArray[i].value,
           stopover: true */
          location: new google.maps.LatLng(12.9988983, 80.27185559999998),
          stopover: true
        },
          {
            location: new google.maps.LatLng(13.0381896, 80.15654610000001),
            stopover: true
          },
          {
            location: new google.maps.LatLng(12.8002323, 80.22340970000005),
            stopover: true
          },
          {
            location: new google.maps.LatLng(13.0066625, 80.22063690000004),
            stopover: true
          }
        );
        console.log(waypts);
      }
    }

    directionsService.route({
      origin: this.list.startLoc,
      destination: this.list.endLoc,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
