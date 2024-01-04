import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_BILLING: NbMenuItem[] = [

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
