import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_CITYWISE: NbMenuItem[] = [
    { title: 'Dashboard', icon: 'nb-home', link: '/pages/iot-dashboard' },
    { title: 'Site Statistics', icon: 'nb-bar-chart', link: '/pages/charts/echarts' },
    {
        title: 'Driver',
        icon: 'nb-snowy-circled',
        children: [
          { title: 'Add Driver', link: '/pages/driver/add' },
          { title: 'View Drivers', link: '/pages/tables/driver-table' },
          { title: 'View Online Drivers', link: '/pages/tables/onlineDriver-table' },
          { title: 'View Pending Drivers', link: '/pages/tables/rejected-drivers' },
          // { title: 'Add Driver Taxis', link: '/pages/drivertaxi/add' },
        ],
      },
      {
        title: 'Rider',
        icon: 'nb-keypad',
        children: [
          { title: 'Add  Rider', link: '/pages/rider/add' },
          { title: 'View Riders', link: '/pages/tables/rider-table' },
        ],
      },
   
      {
        title: 'Trips',
        icon: 'nb-keypad',
        permission: 'removehail',
        children: [
          { title: 'Trips', link: '/pages/tables/trips-table' },
          { title: 'OnGoing Trips', link: '/pages/tables/ongoingtrips' },
          { title: 'Upcoming Trips', link: '/pages/tables/upcomingtrips' },
          { title: 'No Response Trips', link: '/pages/tables/noresponsetrips' },
          { title: 'Past Trips', link: '/pages/tables/pasttrips' },
          { title: 'Hail Trips', permission: 'removehail', link: '/pages/tables/hail-trips' },
        ],
      },
      {
        title: 'Dispatch',
        icon: 'nb-person',
        children: [
          { title: 'Manual Taxi Dispatch', link: '/pages/taxidispatch/add' },
          { title: 'Pending Requests', link: '/pages/tables/pending-requests' },
          { title: 'Ride Later Bookings', link: '/pages/tables/ridelater-table' },
        ]
      },
      {
        title: 'Map Views',
        icon: 'nb-location',
        children: [
          { title: 'Heat Map', link: '/pages/tables/heatmap' },
          { title: "God's View", link: '/pages/tables/godsview' },
          { title: "Driver's Tracking", link: "/pages/tables/drivertracking" }
        ],
      },
      {
        title: "Driver Payment Package",
        icon: "nb-star",
        children: [
          { title: "Package List", link: "/pages/tables/package/new" },
          // { title: "Drivers Package", link: '/pages/tables/package/driver' },
          { title: "Driver Credits", link: "/pages/tables/package/drivercredits" }
        ]
      },
      {
        title: "Settlements",
        icon: "nb-plus-circled",
        children: [
          { title: "Driver Settlement", link: "/pages/tables/settlement/driversettlements" },
        ]
      },
      {
        title: 'Reviews',
        icon: 'nb-compose',
        children: [
          { title: 'Driver Reviews', link: '/pages/tables/DriverReviews-table' },
          { title: 'Rider Reviews', link: '/pages/tables/RiderReviews-table' },
        ],
      },
      {
        title: 'PromoCode',
        icon: 'nb-keypad',
        children: [
          { title: 'Add Promocode', link: '/pages/promocode/add' },
          { title: 'View Promocode', link: '/pages/tables/promocode' },
        ],
      },
      {
        title: "Offers",
        icon: "nb-partlysunny",
        children: [
          {
            title: "Current Offers",
            children: [
              { title: "Add Current Offer", link: "/pages/tables/offers/current/addcurrentoffers" },
              { title: "View Current Offers", link: "/pages/tables/offers/current/viewcurrentoffers" }
            ]
          },
          { title: "Expired Offers", link: "/pages/tables/offers/expiry" }
        ]
      },
      {
        title: 'Report',
        icon: 'nb-compose',
        permission: 'removeCompany',
        children: [
          { title: 'Trip Payments', link: '/pages/tables/paymentreport-table' },
          { title: 'Driver Payment', link: '/pages/tables/payment/driver' },
          // { title: 'Referral Report', link: '/pages/tables/report-table/referralreport' },
          { title: 'User Wallet Report', link: '/pages/tables/report-table/userwalletreport' },
          { title: 'Trip Status Report', link: '/pages/tables/report-table/driverpaymentreport' },
          { title: 'Trip Types Report', link: '/pages/tables/report-table/trip-types' }
          // { title: 'Cancelled Trip', link: '/pages/tables/report-table/cancelledtripreport' },
          // { title: 'Driver Earnings', link: '/pages/tables/report-table/driverearningsreport' },
          // { title: 'Company Earnings', permission: 'removeCompany', link: '/pages/tables/report-table/companyearningsreport' },
          // { title: 'Driver Log Report', link: '/pages/tables/report-table/tripacceptancereport' },
          // { title: 'Trip Time Variance', link: '/pages/tables/report-table/tripvariance' },
        ],
      },

];
