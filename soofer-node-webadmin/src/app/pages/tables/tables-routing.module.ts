import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverTableComponent } from './driver-table/table.component';
import { OnlineDriverTableComponent } from './onlineDriver-table/table.component';
import { RejectedDriverTableComponent } from './rejected-drivers/table.component';
import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { VehicleTypeTableComponent } from './vehicletype-table/table.component';
import { RiderTableComponent } from './rider-table/table.component';
import { TripPackageTableComponent } from './trippackage-table/table.component';
import { PromoCodeTableComponent } from './promocode-table/table.component';
import { DriverReviewTableComponent } from './DriverReviews-table/table.component';
import { DrivertaxiTableComponent } from './drivertaxi-table/table.component';
import { RiderReviewTableComponent } from './RiderReviews-table/table.component';
import { CompanyPaymentComponent } from './payment/company/companypayment.component';
import { DriverPaymentComponent } from './payment/driver/table.component';
import { HeatMapTableComponent } from './viewheatmap/table.component';
import { OutstationTableComponent } from './outstation-table/table.component';
import { GodsViewComponent } from './godsview/godsview.component';
import { AlertSettingComponent } from './settings/alert-setting/alert-setting.component';
import { ReferalSettingsComponent } from './settings/referal-settings/referal-setting.component';
import { RideLaterComponent } from './ridelater-table/table.component';
import { ButtonViewComponent } from './ridelater-table/table.component';
import { PaymentReportComponent } from './paymentreport-table/table.component';
import { AddservicecitiesComponent } from './settings/servicecities/addservicecities/addservicecities.component';
import { NearbycitiesComponent } from './settings/nearbycities/nearbycities.component';
import { InnerComponent } from './settings/innerpolygon/inner.component';
import { OuterComponent } from './settings/outerpolygon/outer.component';
import { ViewservicecitiesComponent } from './settings/servicecities/viewservicecities/viewservicecities.component';
import { EditTemplateComponent } from './settings/emailtemplate/emailtemplate.component';
import { VehicleIconTableComponent } from './../tables/vehicleicon/table.component';
import { AddcountriesComponent } from './utility/country/addcountries/addcountries.component';
import { ViewcountriesComponent } from './utility/country/viewcountries/viewcountries.component';
import { ViewcitiesComponent } from './utility/cities/viewcities/viewcities.component';
import { AddCitiesComponent } from './utility/cities/addcities/addcities.component';
import { AddstatesComponent } from './utility/states/addstates/addstates.component';
import { UtilPagesComponent } from './utility/pages/utilpages.component';
import { ViewstatesComponent } from './utility/states/viewstates/viewstates.component';
import { EditHomePageComponent } from './utility/edithomepage/edithomepage.component';
import { OurDriverComponent } from './utility/ourdriver/ourdriver.component';
import { VehicleComponent } from './utility/vehicle/vehicle.component';
import { FaqComponent } from './utility/faq/faq.component';
import { FaqCatComponent } from './utility/catfaq/faqcat.component';
import { HelpTopicsComponent } from './utility/helptopics/helptopics.component';
import { HelpTopicsCatComponent } from './utility/topicscat/helptopicscat.component';
import { SendPushNotComponent } from './utility/sendpush/sendpushnot.component';
import { DbBackupComponent } from './utility/dbbackup/dbbackup.component';
import { CarMakeTableComponent } from './carmake/table.component';
import { ReferralComponent } from './report-table/referralreport/Referral.component';
import { UserwalletComponent } from './report-table/userwalletreport/Userwallet.component';
import { RDriverPaymentComponent } from './report-table/driverpaymentreport/DriverPayment.component';
import { DriverTravelPaymentComponent } from './payment/travel/table.component';
import { TripacceptanceComponent } from './report-table/tripacceptancereport/Tripacceptance.component';
import { TripvarianceComponent } from './report-table/tripvariance/Tripvariance.component';
import { ReportPayComponent } from './report-table/paymentreport/reportpay.component';
import { CancelledtripComponent } from './report-table/cancelledtripreport/cancelledtrip.component';
import { CompanyEarningsComponent } from './report-table/companyearningsreport/companyearnings.component';
import { DriverEarningsComponent } from './report-table/driverearningsreport/driverearnings.component';
import { DistancefareComponent } from './distancefare/distancefare.component';
import { DriverBankTranxComponent } from './bankTransaction/bankTransaction.component';
import { EmailSettingComponent } from './emailconfig/emailconfig.component';
import { TermsandconditionsComponent } from './settings/termsandconditions/termsandconditions.component';
import { RiderTermsandconditionsComponent } from './settings/driver-termsandconditions/driver-term.component';
import { AboutComponent } from './settings/about/about.component';
import { PrivacyComponent } from './settings/privacy/privacy.component';
import { RiderPrivacyComponent } from './settings/driver-privacy/driver-privacy.component';
import { DrivercreditsComponent } from './package/drivercredits/drivercredits.component';
import { DriverPackComponent } from './package/driver/driverPack.component';
import { NewPackComponent } from './package/new/newPack.component';
import { DriverhistoryComponent } from './package/driverhistory/driverhistory.component';
import { ExpOffComponent } from './offers/expiry/expiry.component';
import { AddcurrentoffersComponent } from './offers/current/addcurrentoffers/addcurrentoffers.component';
import { ViewcurrentoffersComponent } from './offers/current/viewcurrentoffers/viewcurrentoffers.component';
import { AddcarmakemodelComponent } from './utility/carmakemodel/addcarmakemodel/addcarmakemodel.component';
import { CurrencyAddComponent } from './utility/currency/currency.component';
import { CurrencyManagementComponent } from './utility/currency-management/currency-management.component';
import { ViewcarmakemodelComponent } from './utility/carmakemodel/viewcarmakemodel/viewcarmakemodel.component';
import { LanguageAddComponent } from './utility/languages/language.component';
// import { AddLanguageAvailbleComponent } from "./utility/languages/add/addlanguages.component";
// import { ViewLanguageAvailbleComponent } from "./utility/languages/view/viewlanguages.component";
import { ColorsAddComponent } from './utility/colors/colors.component';
import { YearAddComponent } from './utility/addyear/addyear.component';
import { AppConfigComponent } from './settings/app-config/app-config.component';
import { ResetPassComponent } from './settings/reset-pass/reset-pass.component';
import { ServerConfigComponent } from './settings/server-config/server-config.component';
import { DriverTrackingComponent } from './drivertracking/driver.component';
import { NotificationComponent } from './notification/notification.component';
import { SeoSettingsComponent } from './utility/seo-settings/seo-settings.component';
import { EmailChatComponent } from './email-chat/email-chat.component';
import { DriversettlementsComponent } from './settlement/driversettlements/driversettlements.component';
import { DrtransdetailsComponent } from './settlement/drtransdetails/drtransdetails.component';
import { DriverwalletdetailsComponent } from './settlement/driverwalletdetails/driverwalletdetails.component';
import { CancellationReasonsComponent } from './utility/cancellation-reasons/cancellation-reasons.component';
import { TestSettingsComponent } from './utility/test-settings/test-settings.component';
import { HailTripsComponent } from './hail-trips/hail-trips.component';
import { TripTypesComponent } from './report-table/trip-types/trip-types.component';
import { ReviewReasonsComponent } from './utility/review-reasons/review-reasons.component';
import { SettingPagesComponent } from './../tables/menu-settings/menusettings.component';
import { HoteltransdetailsComponent } from './settlement/hotelsettlements/hotransdetails.component';
import { HoteltrxdetailsComponent } from './settlement/hoteltrxdetails/hoteltrx.component';
import { HotelPaymentComponent } from './payment/hotel/table.component';
import { CompanySettlementComponent } from './payment/company-set/table.component';
import { RentalComponent } from './rental-package/rental.component';
import { TripbookedreportComponent } from './report-table/tripbookedreport/tripbookedreport.component';
import { PackagePurchaseReportComponent } from './report-table/package-purchase-report/package-purchase-report.component';
import { DriverSettlementReportComponent } from './report-table/driversettlementreport/driver-settlement-report/driver-settlement-report.component';
import { DriverWalletReportComponent } from './report-table/driversettlementreport/driver-wallet-report/driver-wallet-report.component';
import { DriverTransactionReportComponent } from './report-table/driversettlementreport/driver-transaction-report/driver-transaction-report.component';
import { InactiveDriversTableComponent } from './inactive-drivers-table/inactive-drivers-table.component';
import { DriverRatingsComponent } from './ratings/driver-ratings/driver-ratings.component';
import { RiderRatingsComponent } from './ratings/rider-ratings/rider-ratings.component';
import { CancellationSettingsComponent } from './settings/cancellation-settings/cancellation-settings.component';
import { DriverIncentivesComponent } from './settings/driver-incentives/driver-incentives.component';
import { TripstatusDailyComponent } from './daily-reports/tripstatus-daily/tripstatus-daily.component';
import { TripTypesDailyComponent } from './daily-reports/trip-types-daily/trip-types-daily.component';
import { PaymentReportDailyComponent } from './daily-reports/payment-report-daily/payment-report-daily.component';
import { TripBookedDailyComponent } from './daily-reports/trip-booked-daily/trip-booked-daily.component';
import { DeliveryReportComponent } from './report-table/delivery-report/delivery-report.component';
import { DeliveryTripsComponent } from './delivery-trips/delivery-trips.component';
import { RidersettlementsComponent } from './settlement/ridersettlements/ridersettlements.component';
import { SubscriptionComponent } from './report-table/subscriptionreport/subscription.component';
import { AddZoneComponent } from './settings/zone/add/aaddzone.component';
import { ViewZoneComponent } from './settings/zone/view/viewzone.component';
import { ViewAirportZoneComponent } from './settings/airportzone/view/viewairportzone.component';
import { AddAirportZoneComponent } from './settings/airportzone/add/airportzone.component';
import { LangMgmtComponent } from './utility/lang-mgmt/lang-mgmt.component';
import { EpickHomePageComponent } from './utility/ePickedithomepage/edithomepage.component';
import { EpickRiderComponent } from './utility/ePickriderpage/edithomepage.component';
import { EpickDriverComponent } from './utility/ePickDriverpage/edithomepage.component';
import { AddOfficeDetailsComponent } from './settings/office-details/add-office/add-office.component';
import { ViewOfficeDetailsComponent } from './settings/office-details/view-office/view-office.component';
import { DriverCreditLimitComponent } from './settings/citywise-config/add/drv-crdt-lmt.component';
import { CitywiseComponent } from './settings/citywise-config/view/citywise-config.component';
import { DriverDutyReportComponent } from './driver-duty-report/driver-duty-report.component';
import { DriverDutyComponent } from './driver-duty-report1/driver-duty-report.component';
import { DiscountPromoReportComponent } from './discount-promo-report/discount-promo-report.component';
import { LanguageComponent } from './utility/language/language.component';
import { FrontendComponent } from './utility/frontend-language/frontend-language.component';
import { AdminLanguageComponent } from './utility/admin-language/admin-language.component';
import { DriverSubscriptionComponent } from './package/driver-subscription/driver-subscription.component';
import { DriverPackagesComponent } from './package/driver-packages/driver-packages.component';
import { ActiveRenderSubComponent } from './package/active-render-sub/active-render-sub.component';
import { RentalConfigComponent } from './settings/rental-config/rental-config.component';
import { DriverLoginReportComponent } from './driver-login-report/driver-duty-report.component';
import { NoSignalDriverTableComponent } from './nosignal-drivers/table.component';
import { DriversoftdeleteComponent } from "./driverSoftDelete/driverSoftDeletecomponent";
import { SoftDriverTableComponent } from './softDrivers-table/table.component';
import { DriverDailyAttendance } from './driver-daily-attendance/table.component';
import { onlinePaymentComponent } from './report-table/onlinepaymentreport/onlinepayment.component';




const routes: Routes = [
  {
    path: "",
    component: TablesComponent,
    children: [
      {
        path: "no-signal",
        component: NoSignalDriverTableComponent,
      },
      {
        path: "payment/travel",
        component: DriverTravelPaymentComponent,
      },

      {
        path: "settings/air-add",
        component: AddAirportZoneComponent,
      },
      {
        path: "settings/air-view",
        component: ViewAirportZoneComponent,
      },
      {
        path: "settings/add-zone",
        component: AddZoneComponent,
      },
      {
        path: "settings/view-zone",
        component: ViewZoneComponent,
      },

      {
        path: "page-settings",
        component: SettingPagesComponent,
      },
      {
        path: "smart-table",
        component: SmartTableComponent,
      },
      {
        path: "driver-table",
        component: DriverTableComponent,
      },
      {
        path: "softDrivers-table",
        component: SoftDriverTableComponent,
      },
      {
        path: "rental",
        component: RentalComponent,
      },
      {
        path: "report-table/delivery-report",
        component: DeliveryReportComponent,
      },
      {
        path: "report-table/driverpaymentreport",
        component: RDriverPaymentComponent,
      },
      {
        path: "report-table/driversettlementreport/driver-settlement-report",
        component: DriverSettlementReportComponent,
      },
      {
        path: "report-table/driversettlementreport/driver-wallet-report",
        component: DriverWalletReportComponent,
      },
      {
        path: "report-table/driversettlementreport/driver-transaction-report",
        component: DriverTransactionReportComponent,
      },
      {
        path: "report-table/onlinepaymentreport",
        component: onlinePaymentComponent,
      },
      {
        path: "bankTransaction",
        component: DriverBankTranxComponent,
      },
      {
        path: "utility/faq",
        component: FaqComponent,
      },
      {
        path: "utility/currency-management",
        component: CurrencyManagementComponent,
      },
      {
        path: "distancefare",
        component: DistancefareComponent,
      },
      {
        path: "hail-trips",
        component: HailTripsComponent,
      },
      {
        path: "delivery-trips",
        component: DeliveryTripsComponent,
      },
      {
        path: "report-table/companyearningsreport",
        component: CompanyEarningsComponent,
      },
      {
        path: "report-table/driverearningsreport",
        component: DriverEarningsComponent,
      },
      {
        path: "report-table/cancelledtripreport",
        component: CancelledtripComponent,
      },
      {
        path: "report-table/trip-types",
        component: TripTypesComponent,
      },
      {
        path: "report-table/tripbookedreport",
        component: TripbookedreportComponent,
      },
      {
        path: "report-table/package-purchase-report",
        component: PackagePurchaseReportComponent,
      },
      {
        path: "daily-reports/tripstatus-daily",
        component: TripstatusDailyComponent,
      },
      {
        path: "daily-reports/payment-report-daily",
        component: PaymentReportDailyComponent,
      },
      {
        path: "daily-reports/trip-booked-daily",
        component: TripBookedDailyComponent,
      },
      {
        path: "daily-reports/trip-types-daily",
        component: TripTypesDailyComponent,
      },
      {
        path: "utility/sendpush",
        component: SendPushNotComponent,
      },
      {
        path: "utility/catfaq",
        component: FaqCatComponent,
      },
      {
        path: "utility/edithomepage",
        component: EditHomePageComponent,
      },
      {
        path: "utility/epickhomepage",
        component: EpickHomePageComponent,
      },
      {
        path: "utility/epickriderpage",
        component: EpickRiderComponent,
      },
      {
        path: "utility/epickDriverpage",
        component: EpickDriverComponent,
      },
      {
        path: "onlineDriver-table",
        component: OnlineDriverTableComponent,
      },
      {
        path: "utility/pages",
        component: UtilPagesComponent,
      },
      {
        path: "rejected-drivers",
        component: RejectedDriverTableComponent,
      },
      {
        path: "settings/emailtemplate",
        component: EditTemplateComponent,
      },
      {
        path: "utility/helptopics",
        component: HelpTopicsComponent,
      },
      {
        path: "utility/topicscat",
        component: HelpTopicsCatComponent,
      },
      {
        path: "report-table/tripacceptancereport",
        component: TripacceptanceComponent,
      },
      {
        path: "vehicletype-table",
        component: VehicleTypeTableComponent,
      },
      {
        path: "ridelater-table",
        component: RideLaterComponent,
      },
      {
        path: "settings/alert-setting",
        component: AlertSettingComponent,
      },
      {
        path: "settings/referal-settings",
        component: ReferalSettingsComponent,
      },
      {
        path: "rider-table",
        component: RiderTableComponent,
      },
      {
        path: "trippackage-table",
        component: TripPackageTableComponent,
      },
      {
        path: "carmake",
        component: CarMakeTableComponent,
      },
      {
        path: "report-table/referralreport",
        component: ReferralComponent,
      },
      {
        path: "report-table/tripvariance",
        component: TripvarianceComponent,
      },
      {
        path: "promocode",
        component: PromoCodeTableComponent,
      },
      {
        path: "report-table/userwalletreport",
        component: UserwalletComponent,
      },
      {
        path: "vehicleicon",
        component: VehicleIconTableComponent,
      },
      {
        path: "report-table/paymentreport",
        component: ReportPayComponent,
      },
      {
        path: "DriverReviews-table",
        component: DriverReviewTableComponent,
      },
      {
        path: "utility/test-settings",
        component: TestSettingsComponent,
      },
      {
        path: "utility/dbbackup",
        component: DbBackupComponent,
      },
      {
        path: "settings/reset-pass",
        component: ResetPassComponent,
      },
      {
        path: "settings/emailconfig",
        component: EmailSettingComponent,
      },
      {
        path: "settings/servicecities/addservicecities",
        component: AddservicecitiesComponent,
      },
      {
        path: "settings/nearbycities",
        component: NearbycitiesComponent,
      },
      {
        path: "settings/innerpolygon",
        component: InnerComponent,
      },
      {
        path: "settings/outerpolygon",
        component: OuterComponent,
      },
      {
        path: "settings/servicecities/viewservicecities",
        component: ViewservicecitiesComponent,
      },
      {
        path: "settings/app-config",
        component: AppConfigComponent,
      },
      {
        path: "settings/server-config",
        component: ServerConfigComponent,
      },
      {
        path: "settings/driver-incentives",
        component: DriverIncentivesComponent,
      },
      {
        path: "utility/ourdriver",
        component: OurDriverComponent,
      },
      {
        path: "utility/vehicle",
        component: VehicleComponent,
      },
      {
        path: "paymentreport-table",
        component: PaymentReportComponent,
      },
      {
        path: "RiderReviews-table",
        component: RiderReviewTableComponent,
      },

      {
        path: "payment/company",
        component: CompanyPaymentComponent,
      },
      {
        path: "payment/driver",
        component: DriverPaymentComponent,
      },
      {
        path: "payment/hotel",
        component: HotelPaymentComponent,
      },
      {
        path: "payment/company-set",
        component: CompanySettlementComponent,
      },
      {
        path: "heatmap",
        component: HeatMapTableComponent,
      },
      {
        path: "drivertracking",
        component: DriverTrackingComponent,
      },
      {
        path: "utility/country/addcountries",
        component: AddcountriesComponent,
      },
      {
        path: "utility/country/viewcountries",
        component: ViewcountriesComponent,
      },
      {
        path: "utility/cities/addcities",
        component: AddCitiesComponent,
      },
      {
        path: "utility/cities/viewcities",
        component: ViewcitiesComponent,
      },
      {
        path: "utility/states/addstates",
        component: AddstatesComponent,
      },
      {
        path: "utility/states/viewstates",
        component: ViewstatesComponent,
      },

      {
        path: "godsview",
        component: GodsViewComponent,
      },
      {
        path: "settings/termsandconditions",
        component: TermsandconditionsComponent,
      },
      {
        path: "settings/driver-termsandconditions",
        component: RiderTermsandconditionsComponent,
      },
      {
        path: "settings/about",
        component: AboutComponent,
      },
      {
        path: "settings/privacy",
        component: PrivacyComponent,
      },
      {
        path: "settings/driver-privacy",
        component: RiderPrivacyComponent,
      },
      {
        path: "settings/cancellation-settings",
        component: CancellationSettingsComponent,
      },
      {
        path: "outstation-table",
        component: OutstationTableComponent,
      },
      {
        path: "package/driver-subscription",
        component: DriverSubscriptionComponent,
      },
      {
        path: "package/driver-packages",
        component: DriverPackagesComponent,
      },
      {
        path: "package/drivercredits",
        component: DrivercreditsComponent,
      },
      {
        path: "package/driver",
        component: DriverPackComponent,
      },
      {
        path: "package/new",
        component: NewPackComponent,
      },
      {
        path: "driverhistory",
        component: DriverhistoryComponent,
      },
      {
        path: "offers/current/addcurrentoffers",
        component: AddcurrentoffersComponent,
      },
      {
        path: "offers/current/viewcurrentoffers",
        component: ViewcurrentoffersComponent,
      },
      {
        path: "offers/expiry",
        component: ExpOffComponent,
      },
      {
        path: "utility/carmakemodel/addcarmakemodel",
        component: AddcarmakemodelComponent,
      },
      {
        path: "utility/languages",
        component: LanguageAddComponent,
      },
      {
        path: "utility/colors",
        component: ColorsAddComponent,
      },
      {
        path: "utility/addyear",
        component: YearAddComponent,
      },
      {
        path: "report-table/subscriptionreport",
        component: SubscriptionComponent,
      },
      {
        path: "utility/currency",
        component: CurrencyAddComponent,
      },
      {
        path: "utility/carmakemodel/viewcarmakemodel",
        component: ViewcarmakemodelComponent,
      },
      // {
      //   path: "utility/languages/add",
      //   component: AddLanguageAvailbleComponent
      // },
      // {
      //   path: "utility/languages/view",
      //   component: ViewLanguageAvailbleComponent
      // },
      {
        path: "notification",
        component: NotificationComponent,
      },
      {
        path: "email-chat",
        component: EmailChatComponent,
      },
      {
        path: "utility/seo-settings",
        component: SeoSettingsComponent,
      },
      {
        path: "settlement/driversettlements",
        component: DriversettlementsComponent,
      },
      {
        path: "settlement/ridersettlements",
        component: RidersettlementsComponent,
      },
      {
        path: "settlement/drtransdetails",
        component: DrtransdetailsComponent,
      },
      {
        path: "settlement/driverwalletdetails",
        component: DriverwalletdetailsComponent,
      },
      {
        path: "settlement/driverwalletdetails",
        component: DriverwalletdetailsComponent,
      },
      {
        path: "settlement/hotransdetails",
        component: HoteltransdetailsComponent,
      },
      {
        path: "settlement/hottrxdetails",
        component: HoteltrxdetailsComponent,
      },
      {
        path: "utility/cancellation-reasons",
        component: CancellationReasonsComponent,
      },
      {
        path: "utility/review-reasons",
        component: ReviewReasonsComponent,
      },
      {
        path: "inactive-drivers-table",
        component: InactiveDriversTableComponent,
      },
      {
        path: "ratings/driver-ratings",
        component: DriverRatingsComponent,
      },
      {
        path: "ratings/rider-ratings",
        component: RiderRatingsComponent,
      },
      {
        path: "drivertaxi-table",
        component: DrivertaxiTableComponent,
      },
      {
        path: "settings/rental-config",
        component: RentalConfigComponent,
      },
      {
        path: "settings/office-details/add-office",
        component: AddOfficeDetailsComponent,
      },
      {
        path: "settings/office-details/view-office",
        component: ViewOfficeDetailsComponent,
      },
      {
        path: "settings/citywise-config/add",
        component: DriverCreditLimitComponent,
      },
      {
        path: "settings/citywise-config/view",
        component: CitywiseComponent,
      },
      {
        path: "driver-duty-report",
        component: DriverDutyReportComponent,
      },
      {
        path: "driver-online-report",
        component: DriverLoginReportComponent,
      },

      {
        path: "driver-duty-report1",
        component: DriverDutyComponent,
      },
      {
        path: "discount-promo-report",
        component: DiscountPromoReportComponent,
      },
      {
        path: "utility/language",
        component: LanguageComponent,
      },
      {
        path: "utility/frontend-language",
        component: FrontendComponent,
      },
      {
        path: "utility/admin-language",
        component: AdminLanguageComponent,
      },
      {
        path: "driver-softDelete",
        component: DriversoftdeleteComponent,
      },
      {
        path: "driver-daily-attendance",
        component: DriverDailyAttendance,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  entryComponents: [ActiveRenderSubComponent]
})
export class TablesRoutingModule { }

export const routedComponents = [
  NoSignalDriverTableComponent,
  DriverLoginReportComponent,
  EpickDriverComponent,
  ViewZoneComponent,
  TablesComponent,
  SmartTableComponent,
  RiderTableComponent,
  TripPackageTableComponent,
  DriverTableComponent,
  DrivertaxiTableComponent,
  RideLaterComponent,
  ButtonViewComponent,
  PaymentReportComponent,
  CompanyEarningsComponent,
  OnlineDriverTableComponent,
  EmailSettingComponent,
  PromoCodeTableComponent,
  RejectedDriverTableComponent,
  VehicleTypeTableComponent,
  NearbycitiesComponent,
  FaqComponent,
  FaqCatComponent,
  DriverReviewTableComponent,
  DistancefareComponent,
  AlertSettingComponent,
  DbBackupComponent,
  RiderReviewTableComponent,
  CompanyPaymentComponent,
  DriverPaymentComponent,
  TripvarianceComponent,
  ReferralComponent,
  DriverEarningsComponent,
  OurDriverComponent,
  VehicleComponent,
  TripacceptanceComponent,
  SendPushNotComponent,
  ReferalSettingsComponent,
  AddservicecitiesComponent,
  ViewservicecitiesComponent,
  VehicleIconTableComponent,
  RiderTermsandconditionsComponent,
  HeatMapTableComponent,
  EditHomePageComponent,
  ReportPayComponent,
  GodsViewComponent,
  CarMakeTableComponent,
  CurrencyManagementComponent,
  RDriverPaymentComponent,
  UserwalletComponent,
  UtilPagesComponent,
  EditTemplateComponent,
  DriverBankTranxComponent,
  AddstatesComponent,
  ViewstatesComponent,
  AddcountriesComponent,
  ViewcountriesComponent,
  ViewcitiesComponent,
  CancelledtripComponent,
  AddCitiesComponent,
  OutstationTableComponent,
  HelpTopicsComponent,
  HelpTopicsCatComponent,
  TermsandconditionsComponent,
  AboutComponent,
  PrivacyComponent,
  RiderPrivacyComponent,
  DrivercreditsComponent,
  DriverPackComponent,
  NewPackComponent,
  DriverhistoryComponent,
  ViewcurrentoffersComponent,
  AddcurrentoffersComponent,
  ExpOffComponent,
  // AddLanguageAvailbleComponent,
  // ViewLanguageAvailbleComponent,
  onlinePaymentComponent,
  LanguageAddComponent,
  AddcarmakemodelComponent,
  ViewcarmakemodelComponent,
  AppConfigComponent,
  ResetPassComponent,
  ServerConfigComponent,
  DriverTrackingComponent,
  SeoSettingsComponent,
  InnerComponent,
  OuterComponent,
  CurrencyAddComponent,
  ColorsAddComponent,
  YearAddComponent,
  NotificationComponent,
  EmailChatComponent,
  DriversettlementsComponent,
  DrtransdetailsComponent,
  DriverwalletdetailsComponent,
  CancellationReasonsComponent,
  TestSettingsComponent,
  HailTripsComponent,
  SoftDriverTableComponent,
  TripTypesComponent,
  ReviewReasonsComponent,
  SettingPagesComponent,
  HoteltransdetailsComponent,
  HoteltrxdetailsComponent,
  HotelPaymentComponent,
  CompanySettlementComponent,
  RentalComponent,
  TripbookedreportComponent,
  PackagePurchaseReportComponent,
  DriverSettlementReportComponent,
  DriverWalletReportComponent,
  DriverTransactionReportComponent,
  InactiveDriversTableComponent,
  DriverRatingsComponent,
  RiderRatingsComponent,
  CancellationSettingsComponent,
  DriverIncentivesComponent,
  TripstatusDailyComponent,
  TripTypesDailyComponent,
  PaymentReportDailyComponent,
  TripBookedDailyComponent,
  DeliveryReportComponent,
  DeliveryTripsComponent,
  RidersettlementsComponent,
  SubscriptionComponent,
  AddZoneComponent,
  ViewAirportZoneComponent,
  AddAirportZoneComponent,
  LangMgmtComponent,
  EpickHomePageComponent,
  EpickRiderComponent,
  AddOfficeDetailsComponent,
  ViewOfficeDetailsComponent,
  DriverCreditLimitComponent,
  CitywiseComponent,
  DriverDutyReportComponent,
  DriverDutyComponent,
  DiscountPromoReportComponent,
  LanguageComponent,
  FrontendComponent,
  AdminLanguageComponent,
  DriverSubscriptionComponent,
  DriverPackagesComponent,
  ActiveRenderSubComponent,
  RentalConfigComponent,
  DriverTravelPaymentComponent,
  DriversoftdeleteComponent,
  DriverDailyAttendance,

];
