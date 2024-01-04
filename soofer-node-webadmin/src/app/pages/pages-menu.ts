import { NbMenuItem } from '@nebular/theme';
import { featuresSettings } from '../app.config';
const userType = localStorage.getItem('userType');
export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'nb-e-commerce',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  { title: "Dashboard", icon: "nb-home", link: "/pages/iot-dashboard" },
  {
    title: "Site Statistics",
    icon: "nb-bar-chart",
    link: "/pages/charts/echarts",
  },
  // { title: 'Profile', icon: 'nb-home', link: '/pages/hotel/hotelprofile' },

  {
    title: "Admin",
    icon: "nb-person",
    permission: "superadmin",
    children: [
      { title: "Add Admin", link: "/pages/admin/add" },
      { title: "View Admin", link: "/pages/admin/view" },
    ],
  },
  {
    title: "Vehicle Type",
    icon: "nb-grid-a-outline",
    children: [
      { title: "Add Vehicle Type", link: "/pages/vehicletype/add" },
      { title: "View Vehicles", link: "/pages/tables/vehicletype-table" },
    ],
  },
  // {
  //   title: 'Company',
  //   icon: 'nb-person',
  //   permission: 'checked',
  //   children: [
  //     { title: 'Add Company', link: '/pages/company/company-add' },
  //     { title: 'View Company', link: '/pages/company/company-view' },
  //     // { title: 'Company Payment', link: '/pages/tables/payment/company' },
  //   ]
  // },
  {
    title: "Driver",
    icon: "nb-snowy-circled",
    children: [
      { title: "Add Driver", link: "/pages/driver/add" },
      { title: "View Drivers", link: "/pages/tables/driver-table" },
      { title: "Daily Attendance", link: "/pages/tables/driver-daily-attendance"},
      { title: "View Online Drivers", link: "/pages/tables/onlineDriver-table" },
      { title: "View Pending Drivers", link: "/pages/tables/rejected-drivers" },
      {
        title: "View Inactive Drivers",
        link: "/pages/tables/inactive-drivers-table",
      },
      // { title: "View Softdelete Drivers", link: "/pages/tables/driver-softDelete" },
      { title: "View Softdelete Drivers", link: "/pages/tables/softDrivers-table" },

      // { title: 'Add Driver Taxis', link: '/pages/drivertaxi/add' },
    ],
  },
  {
    title: "Rider",
    icon: "nb-keypad",
    children: [
      { title: "Add  Rider", link: "/pages/rider/add" },
      { title: "View Riders", link: "/pages/tables/rider-table" },
    ],
  },
  {
    title: "Trip Packages",
    icon: "nb-compose",
    children: [
      { title: "Add Rental Packages", link: "/pages/trippackage/add" },
      { title: "View Rental Packages", link: "/pages/tables/trippackage-table" },
      { title: "Add OutStation Packages", link: "/pages/trippackage/outstation" },
      {
        title: "View OutStation Packages",
        link: "/pages/tables/outstation-table",
      },
    ],
  },
  // {
  //   title: 'Rental Package',
  //   icon: 'nb-grid-a',
  //   link: '/pages/tables/rental'
  // },
  // {
  //   title: 'Hotel',
  //   icon: 'nb-compose',
  //   hidden: findRole((userType)),
  //   children: [
  //     {
  //       title: 'Add Hotel',
  //       link: '/pages/hotel/add'
  //     },
  //     {
  //       title: 'View Hotel',
  //       link: '/pages/hotel/view'
  //     },
  //   ],
  // },
  {
    title: "Trips",
    icon: "nb-keypad",
    permission: "removehail",
    children: [
      { title: "Trips", link: "/pages/tripdetails/all-trips" },
      { title: "Ongoing Trips", link: "/pages/tripdetails/ongoing-trips" },
      { title: "Upcoming Trips", link: "/pages/tripdetails/upcoming-trips" },
      { title: "No Response Trips", link: "/pages/tripdetails/noresponse-trips" },
      { title: "Past Trips", link: "/pages/tripdetails/past-trips" },
      // { title: "Card Payment Failed Trips", link: "/pages/tripdetails/payment-failed-trips" },
      {
        title: "Hail Trips",
        permission: "removehail",
        link: "/pages/tables/hail-trips",
      },
      {
        title: "Delivery Trips",
        permission: "removeDelivery",
        link: "/pages/tables/delivery-trips",
      },
    ],
  },
  {
    title: "Dispatch",
    icon: "nb-person",
    children: [
      { title: "Manual Taxi Dispatch", link: "/pages/taxidispatch/add" },
      { title: "Pending Requests", link: "/pages/tripdetails/pending-req-trips" },
      {
        title: "Ride Later Bookings",
        link: "/pages/tripdetails/ride-later-trips",
      },
    ],
  },
  {
    title: "Map Views",
    icon: "nb-location",
    children: [
      { title: "Heat Map", link: "/pages/tables/heatmap" },
      { title: "God's View", link: "/pages/tables/godsview" },
      { title: "Driver's Tracking", link: "/pages/tables/drivertracking" },
      // { title: 'Way Points', link: '/pages/tables/drivertaxi-table' }
    ],
  },
  {
    title: "Driver Payment Package",
    icon: "nb-star",
    children: [
      { title: "Package List", link: "/pages/tables/package/new" },
      // { title: "Drivers Package", link: '/pages/tables/package/driver' },
      { title: "Driver Credits", link: "/pages/tables/package/drivercredits" },
      {
        title: "Driver Subscription",
        link: "/pages/tables/package/driver-subscription",
      },
    ],
  },
  // {
  //   title: 'Payment',
  //   icon: 'nb-compose',
  //   children: [
  //     { title: 'Driver Bank Transaction', link: '/pages/tables/bankTransaction',},
  //   ]
  // },
  {
    title: "Settlements",
    icon: "nb-plus-circled",
    children: [
      {
        title: "Driver Settlement",
        link: "/pages/tables/settlement/driversettlements",
      },
      {
        title: "Rider Settlement",
        link: "/pages/tables/settlement/ridersettlements",
      },
      {
        title: "Hotel Settlement",
        link: "/pages/tables/settlement/hotransdetails",
        hidden: findRole(userType),
      },
      { title: "Driver Bank Transaction", link: "/pages/tables/bankTransaction" },
    ],
  },
  {
    title: "Reviews",
    icon: "nb-compose",
    children: [
      { title: "Rider Reviews", link: "/pages/tables/DriverReviews-table" },
      { title: "Driver Reviews", link: "/pages/tables/RiderReviews-table" },
      { title: "Driver Ratings", link: "/pages/tables/ratings/driver-ratings" },
      { title: "Rider Ratings", link: "/pages/tables/ratings/rider-ratings" },
    ],
  },
  {
    title: "PromoCode",
    icon: "nb-keypad",
    children: [
      { title: "Add Promocode", link: "/pages/promocode/add" },
      { title: "View Promocode", link: "/pages/tables/promocode" },
      { title: "Send Notification", link: "/pages/tables/utility/sendpush" },
    ],
  },
  {
    title: "Offers",
    icon: "nb-partlysunny",
    children: [
      {
        title: "Current Offers",
        children: [
          {
            title: "Add Current Offer",
            link: "/pages/tables/offers/current/addcurrentoffers",
          },
          {
            title: "View Current Offers",
            link: "/pages/tables/offers/current/viewcurrentoffers",
          },
        ],
      },
      { title: "Expired Offers", link: "/pages/tables/offers/expiry" },
    ],
  },
  {
    title: "Report",
    icon: "nb-compose",
    permission: "removeDelivery",
    children: [
      { title: "Trip Payments", link: "/pages/tables/paymentreport-table" },
      {
        title: "Delivery Report",
        permission: "removeDelivery",
        link: "/pages/tables/report-table/delivery-report",
      },
      { title: "Driver Duty Report", link: "/pages/tables/driver-duty-report" },
      {
        title: "Trip Promo Discounts",
        link: "/pages/tables/discount-promo-report",
      },
      { title: "Driver Payment", link: "/pages/tables/payment/driver" },
      { title: "Travel Payment", link: "/pages/tables/payment/travel" },
      { title: "Online Payment", link: "/pages/tables/report-table/onlinepaymentreport"},
      {
        title: "Hotel Payment",
        link: "/pages/tables/payment/hotel",
        hidden: findRole(userType),
      },
      {
        title: "Company Settlements",
        link: "/pages/tables/payment/company-set",
        hidden: findRole(userType),
      },
      {
        title: "User Wallet",
        link: "/pages/tables/report-table/userwalletreport",
      },
      {
        title: "Trip Status",
        link: "/pages/tables/report-table/driverpaymentreport",
      },
      {
        title: "Subscription Report",
        link: "/pages/tables/report-table/subscriptionreport",
      },
      { title: "Trip Types", link: "/pages/tables/report-table/trip-types" },
      {
        title: "Trip Booked",
        link: "/pages/tables/report-table/tripbookedreport",
      },
      {
        title: "Package Purchase History",
        link: "/pages/tables/report-table/package-purchase-report",
      },
      {
        title: "Driver Wallet",
        link:
          "/pages/tables/report-table/driversettlementreport/driver-settlement-report",
      },
      // {title: "Driver Online", link: "/pages/tables/driver-online-report"},

      {
        title: "Daily Reports",
        children: [
          {
            title: "Payment Report",
            link: "/pages/tables/daily-reports/payment-report-daily",
          },
          {
            title: "Trip Status",
            link: "/pages/tables/daily-reports/tripstatus-daily",
          },
          {
            title: "Trip Types",
            link: "/pages/tables/daily-reports/trip-types-daily",
          },
          {
            title: "Trip Booked",
            link: "/pages/tables/daily-reports/trip-booked-daily",
          },
        ],
      },
      // { title: 'Cancelled Trip', link: '/pages/tables/report-table/cancelledtripreport' },
      // { title: 'Driver Earnings', link: '/pages/tables/report-table/driverearningsreport' },
      // { title: 'Company Earnings', permission: 'removeCompany', link: '/pages/tables/report-table/companyearningsreport' },
      // { title: 'Driver Log Report', link: '/pages/tables/report-table/tripacceptancereport' },
      // { title: 'Trip Time Variance', link: '/pages/tables/report-table/tripvariance' },
    ],
  },
  {
    title: "Utility",
    icon: "nb-compose",
    children: [
      // { title: 'Language Management', link: '/pages/tables/utility/lang-mgmt' },
      {
        title: "Countries",
        children: [
          {
            title: "Add a Country",
            link: "/pages/tables/utility/country/addcountries",
          },
          {
            title: "View All Countries",
            link: "/pages/tables/utility/country/viewcountries",
          },
        ],
      },
      {
        title: "States",
        children: [
          {
            title: "Add a State",
            link: "/pages/tables/utility/states/addstates",
          },
          {
            title: "View All States",
            link: "/pages/tables/utility/states/viewstates",
          },
        ],
      },
      {
        title: "Cities",
        children: [
          { title: "Add a City", link: "/pages/tables/utility/cities/addcities" },
          {
            title: "View All Cities",
            link: "/pages/tables/utility/cities/viewcities",
          },
        ],
      },
      {
        title: "App Response Language Update",
        link: "/pages/tables/utility/language",
      },
      {
        title: "Frontend Language Update",
        link: "/pages/tables/utility/frontend-language",
      },
      {
        title: "Admin Language Update",
        link: "/pages/tables/utility/admin-language",
      },
      {
        title: "Cancellation Reasons",
        link: "/pages/tables/utility/cancellation-reasons",
      },
      { title: "Feedback Reasons", link: "/pages/tables/utility/review-reasons" },
      { title: "Car Make and Model", link: "/pages/tables/carmake" },
      {
        title: "Currency Management",
        link: "/pages/tables/utility/currency-management",
      },
      // {
      //   title: 'App Data',
      //   children: [
      //     // { title: 'Languages', link: '/pages/tables/utility/languages' },
      //     // { title: 'Currency', link: '/pages/tables/utility/currency' },
      //     { title: 'Colors', link: '/pages/tables/utility/colors' },
      //     { title: 'Years', link: '/pages/tables/utility/addyear' },
      //   ]
      // },
      {
        title: "App CMS",
        children: [
          { title: "Colors", link: "/pages/tables/utility/colors" },
          { title: "Years", link: "/pages/tables/utility/addyear" },
          { title: "About Us", link: "/pages/tables/settings/about" },
          { title: "Rider Privacy", link: "/pages/tables/settings/privacy" },
          {
            title: "Rider Terms And Conditions",
            link: "/pages/tables/settings/termsandconditions",
          },
          // { title: 'Driver Privacy', link: './tables/settings/driver-privacy' },
          {
            title: "Driver Terms and Conditions",
            link: "/pages/tables/settings/driver-termsandconditions",
          },
        ],
      },
      {
        title: "FrontEnd CMS",
        children: [
          { title: "Pages", link: "/pages/tables/utility/pages" },
          { title: "Edit Home Page", link: "/pages/tables/utility/edithomepage" },
          //{ title: 'Edit Home Page', link: '/pages/tables/utility/epickhomepage' },
          //{ title: 'Edit  Rider Page', link: '/pages/tables/utility/epickriderpage' },
          //{ title: 'Eid Driver Page', link: '/pages/tables/utility/epickDriverpage' },
          { title: "Our Driver", link: "/pages/tables/utility/ourdriver" },
          { title: "Faq", link: "/pages/tables/utility/faq" },
          { title: "Faq Catagories", link: "/pages/tables/utility/catfaq" },
          { title: "Help Topics", link: "/pages/tables/utility/helptopics" },
          {
            title: "Help Topics Catagories",
            link: "/pages/tables/utility/topicscat",
          },
          { title: "Slider Section", link: "/pages/tables/utility/vehicle" },
          { title: "Seo Settings", link: "/pages/tables/utility/seo-settings" },
        ],
      },
      { title: "Send Notification", link: "/pages/tables/utility/sendpush" },
      { title: "Testing", link: "/pages/tables/utility/test-settings" },
      { title: "DB Backup", link: "/pages/tables/utility/dbbackup" },
    ],
  },
  {
    title: "Settings",
    icon: "nb-gear",
    permission: "removeServiceCity",
    children: [
      {
        title: "Service Available Cities",
        permission: "removeServiceCity",
        children: [
          {
            title: "Add a Service Available City",
            link: "/pages/tables/settings/servicecities/addservicecities",
          },
          {
            title: "View Service Available Cities",
            link: "/pages/tables/settings/servicecities/viewservicecities",
          },
        ],
      },
      {
        title: "Office Details",
        hidden: featuresSettings.isCityWise === false,
        children: [
          {
            title: "Add Office Details",
            link: "/pages/tables/settings/office-details/add-office",
          },
          {
            title: "View Office Details",
            link: "/pages/tables/settings/office-details/view-office",
          },
        ],
      },
      {
        title: "Citywise Config",
        children: [
          {
            title: "Add Citywise Config",
            link: "/pages/tables/settings/citywise-config/add",
          },
          {
            title: "View Citywise Config",
            link: "/pages/tables/settings/citywise-config/view",
          },
        ],
      },
      {
        title: "Zone Settings",
        permission: "removeServiceCity",
        children: [
          { title: "Add a Zone", link: "/pages/tables/settings/add-zone" },
          { title: "View Zone", link: "/pages/tables/settings/view-zone" },
        ],
      },
      {
        title: "Dev Tools",
        children: [
          // { title: 'App Config', link: '/pages/tables/settings/app-config' },
          {
            title: "Server Config",
            link: "/pages/tables/settings/server-config",
          },
        ],
      },
      {
        title: "Rental and Outstation Description",
        link: "/pages/tables/settings/rental-config",
      },
      { title: "Email Templates", link: "/pages/tables/settings/emailtemplate" },
      // { title: 'Email Configuration', link: '/pages/tables/settings/emailconfig' },
      { title: "Reset Password", link: "/pages/tables/settings/reset-pass" },
      // {
      //   title: 'Vehicle Icons',
      //   link: '/pages/tables/vehicleicon',
      // },
      { title: "Admin Menus Permissions", link: "/pages/tables/page-settings" },
      { title: "Alert Setting", link: "/pages/tables/settings/alert-setting" },
      // { title: 'Driver Incentives', link: '/pages/tables/settings/driver-incentives' },
      {
        title: "Referral Settings",
        link: "/pages/tables/settings/referal-settings",
      },
      {
        title: "Cancellation Settings",
        link: "/pages/tables/settings/cancellation-settings",
      },
    ],
  },
  // {
  //   title: 'Auth',
  //   icon: 'nb-locked',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
function findRole(userRole) {
  // console.log(userRole);
  if (featuresSettings.isHotel === true && userRole === 'superadmin')
    return false;
  else return true;
}
