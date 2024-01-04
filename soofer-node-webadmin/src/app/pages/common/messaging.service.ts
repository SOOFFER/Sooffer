import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { mergeMapTo } from "rxjs/operators";
import { take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../../app.config";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { ButtonToasterService } from "../buttontoaster/buttontoaster.service";

@Injectable()
export class MessagingService {
  private apiUrl = AppSettings.API_ENDPOINT;
  currentMessage = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private toastr: ButtonToasterService,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging
  ) {
    this.angularFireMessaging.messaging.subscribe(_messaging => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
      const data = {};
      data[userId] = token;
      this.angularFireDB.object("fcmTokens/").update(data);
    });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      token => {
           console.log(token);
        const sendFCM = { fcmId: token };
        this.sendFCMToken(sendFCM);
        this.updateToken(userId, token);
      },
      err => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
	receiveMessage() {
		console.log("here")
    this.angularFireMessaging.messages.subscribe(payload => {
      console.log("new message received. ", payload);
      const body = payload["notification"];
      this.toastr.showtoast("success", body["body"]);
      this.currentMessage.next(payload);
    });
  }

  sendFCMToken(token): Promise<any> {
    return this.http
      .put(this.apiUrl + "adminPushToken", token)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
