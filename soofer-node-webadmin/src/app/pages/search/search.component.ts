import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../app.config';
import { NbSearchService } from '@nebular/theme';

@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
})

export class SearchComponent implements OnInit {

  drivers = []
  trips = []
  riders = []
  setCollected: any;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private search: NbSearchService) {
    this.search.onSearchSubmit()
      .subscribe((data: any) => {
        let val = data.term
        this.searchProcess(val)
      })
    let val = this.route.snapshot.paramMap.get('value')
    this.searchProcess(val)
  }

  ngOnInit() {
    this.setCollected = {
      trip: null,
      rider: null,
      driver: null
    }
  }

  searchData(data) {
    let a = this.searchProcess(data.term)
  }

  searchProcess(data) {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'search?search=' + data)
      .toPromise()
      .then(msg => {
        this.ProcessData(msg)
      })
      .catch(err => {
        this.errProcessData(err)
      })
  }

  ProcessData(data) {
    this.drivers = []
    this.trips = []
    this.riders = []
    let content = data
    this.setCollected = content
    if (content.status === true) {
      if (content.driver != null) {
        this.drivers.push(content.driver)
        if (content.trip != null) {
          this.trips.push(content.trip)
        }
        if (content.rider != null) {
          this.riders.push(content.rider)
        }
      }
      else if (content.trip != null) {
        this.trips.push(content.trip)
        if (content.rider != null) {
          this.riders.push(content.rider)
        }
      }
      else if (content.rider != null) {
        this.riders.push(content.rider)
      }
    }
  }

  errProcessData(data) {
    this.drivers = []
    this.trips = []
    this.riders = []
    let content = data
    this.setCollected = content
    if (content.status === false) {
      this.setCollected = {
        trip: null,
        rider: null,
        driver: null
      }
    }
  }

}
