import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { PendingRequestsService } from './request.list.service';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { Observable, Subject } from 'rxjs/Rx';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
 import { AppSettings } from '../../../app.config';
@Component({
  selector: "ngx-request-pending",
  templateUrl: "./request-list.component.html",
  styles: [],
  providers: [PendingRequestsService],
})
export class AutoRefreshComponent implements OnInit, OnDestroy {
  @Output() reqTrip = new EventEmitter();

  responseDat: any = {};
  PendingRequest: any[] = [];
  loading = true;
  p = 0;
  canToast = AppSettings.canToast;

  private timerSubscription: AnonymousSubscription;
  private postsSubscription: AnonymousSubscription;

  private eventsSubscription: AnonymousSubscription;
  @Input() events: Observable<void>;
  have_to_check: boolean = true;
  constructor(
    private _requesteService: PendingRequestsService,
    private toastr: ToastrService,
    private db: AngularFireDatabase
  ) {
    // this.refreshData();
    //  console.log("On ngssssOnInit");
    //  this.processData();
    //  this.eventsSubscription = this.events.subscribe(() => {
    //    console.log("Proc");
    //    this.processData();
    //  });
    // this.readItems();
  }

  processingTrips$: any = [];

  processData() {
    this.loading = true;
    this._requesteService.list().subscribe((requests) => {
      this.processingTrips$ = [];
      this.loading = false;
      this.responseDat = requests;
      this.PendingRequest = this.responseDat.data;
      const checkReq = this.responseDat.data.filter(
        (word) => word.status === "processing"
      );
      this.processingTrips$ = this.check(checkReq);
      console.log(this.have_to_check);
      if (this.have_to_check) {
        console.log("called");
        this.checkProcessTrips(this.processingTrips$);
      }
    });
  }

  ngOnInit() {
    console.log("On ngOnInit");

    this.processData();
    this.eventsSubscription = this.events.subscribe(() => {
      console.log("Proc");
      this.processData();
    });
  }

  checkProcessTrips(trips) {
    this.readItems();
  }

  public ngOnDestroy(): void {
    console.log("On destroy");
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.valueChanged$.next();
    this.valueChanged$.complete();
    this.eventsSubscription.unsubscribe();
    this.have_to_check = false;
  }

  private refreshData(): void {
    this.postsSubscription = this._requesteService.list().subscribe(
      (data: any) => {
        this.PendingRequest = data.data;
        // this.subscribeToData();
      },
      function (error) {
        // console.log(error);
      },
      function () {
        // console.log('complete');
      }
    );
  }

  comparer(otherArray) {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other._id === current._id;
        }).length === 0
      );
    };
  }

  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(10000).subscribe(() =>
      this.refreshData()
    );
  }

  clickReq(e) {
    const tripId = e._id;
    this.reqTrip.emit(tripId);
  }

  check(data) {
    let trips: any = [];
    if (data.length > 0) {
      data.forEach((element) => {
        trips.push({
          tripNo: element.tripno,
          riderId: element.ridid,
          tripStatus: element.status,
        });
      });
    } else trips = [];
    return trips;
  }

  /** */
  valueChanged$ = new Subject();
  listenDB: any = [];
  tp: any = [];

  readItems() {
    this.tp = [];
    this.tp = this.processingTrips$;
    // console.log('trips array - ', this.tp);
    for (let i = 0; i < this.tp.length; i++) {
      this.listenDB[i] = this.db.database
        .ref("riders_data/" + this.tp[i].riderId)
        .child("tripstatus")
        .on("value", (snap) => this.callback(snap.val(), i));
    }
  }

  callback(val, index) {
    // console.log('Firebase : ', '- val -' + val, '- index - ' + index);
    const check = this.processingTrips$[index]["currentTripStatus"];
    // console.log('first check - ', check);
    this.processingTrips$[index]["currentTripStatus"] = val;
    if (check !== undefined) {
      if (this.canToast)
        this.toastr.info(
          "Status: " + this.processingTrips$[index].currentTripStatus,
          "Trip No: " + this.processingTrips$[index].tripNo,
          {
            closeButton: false,
            positionClass: "toast-top-right",
            disableTimeOut: false,
            timeOut: 30000,
            extendedTimeOut: 10000,
          }
        );
      this.processData();
      this.valueChanged$.next(val);
      this.valueChanged$.subscribe((el) => console.log(el));
      this.db.database
        .ref("riders_data/" + this.tp[index].riderId)
        .child("tripstatus")
        .off("value", this.listenDB[index]);
      this.processingTrips$.splice(index, 1);
    }
  }
}
