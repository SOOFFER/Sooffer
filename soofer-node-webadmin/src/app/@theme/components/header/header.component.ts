import { Component, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NbMenuService, NbSidebarService, NbSearchService } from "@nebular/theme";
import { UserService } from "../../../@core/data/users.service";
import { AnalyticsService } from "../../../@core/utils/analytics.service";
import { LayoutService } from "../../../@core/data/layout.service";
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";
import { Router, RouterEvent, NavigationStart } from "@angular/router";
import { ISubscription } from "rxjs/Subscription";
import { AppSettings, LanguageSettings } from "../../../app.config";
import { TableService } from "../../../pages/tables/table.service";
import { MessagingService } from "../../../pages/common/messaging.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ngx-header",
  providers: [TableService, MessagingService],
  // providers: [MessagingService],
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  @Input() position = "normal";

  user: any;
  title = AppSettings.APPNAME;
  showTitle = AppSettings.showTitle;
  showLogo = AppSettings.showLogo;
  logoUrl = AppSettings.logo_URL;
  logoWidth = AppSettings.logo_width;
  logoHeight = AppSettings.logo_height;
  mailNumber: number = 0;
  userMenu = [{ title: "Profile" }, { title: "Log out", link: "/auth/logout" }];
  lang;
  showTransOption = LanguageSettings.showTranslateOption;
  setInt: any;
  private subscription: ISubscription;
  message;

  constructor(
    private sidebarService: NbSidebarService,
    private translate: TranslateService,
    private menuService: NbMenuService,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private authService: NbAuthService,
    private router: Router,
    private search: NbSearchService,
    private http: HttpClient,
    private tbservice: TableService,
    private messagingService: MessagingService
  ) {

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang);

    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload();
        console.log('header ==>',this.user); // here we receive a payload from the token and assigne it to our `user` variable
        //localStorage.setItem('auth_app_token', token.getValue());
        localStorage.setItem("userId", this.user.id);
        localStorage.setItem("userEmail", this.user.email);
        localStorage.setItem("userType", this.user.type);
        localStorage.setItem("cityType", this.user.city);
        this.messagingService.requestPermission(this.user.id);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
      }
    });

    this.setInt = setInterval(() => {
      console.log("this.user"); // here we receive a payload from the token and assigne it to our `user` variable

      this.countNotification();
    }, 3.6e+6);

    this.search.onSearchSubmit().subscribe((data: any) => {
      //console.log(data.term)
      const Content = data.term;
      this.router.navigate(["../../pages", "search", { value: Content }]);
    });
  }
  countNotification() {
    this.tbservice
      .getNotifications()
      .then((res) => {
        if (!res.success) {
          localStorage.clear();
          this.setInt = {};
          this.router.navigate(["auth/login"]);
        }
        // localStorage.clear();
        // this.router.navigate(["auth/logout"]);
      })
      .catch((err) => {
        localStorage.clear();
        this.setInt = {};
        this.router.navigate(["auth/login"]);
      });
  }

  ngOnInit() {
    const user = {
      name: this.user.name,
    };
    this.user = user;
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
    this.subscription = this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    });
  }

  onItemSelection(title) {
    if (title === "Log out") {
      localStorage.clear();
      this.router.navigate(["auth/logout"]);
    } else if (title === "Profile") {
      // Do something on Profile
      this.router.navigate(["/pages/admin/profile"]);
      //console.log('Profile Clicked helo')
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, "settings-sidebar");
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent("startSearch");
  }
  /*
    navIndicator(event): void {
      if (event instanceof NavigationStart) {
        this.emailCountCal()
        //console.log(this.mailNumber)
      }
    }

    emailCountCal() {
      this.http.get(AppSettings.API_ENDPOINT + 'contactUs')
        .toPromise()
        .then(val => {
          this.mailBody(val)
        })
    }

    mailBody(data) {
      let mail = data
      //console.log(mail.length)
      this.mailNumber = mail.length;
    } */

  routeToEmail() {
    this.router.navigate(["../../pages", "tables", "email-chat"]);
  }

  routeToNotification() {
    this.router.navigate(["../../pages", "tables", "notification"]);
  }
}
