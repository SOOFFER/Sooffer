import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_PROVIDER: NbMenuItem[] = [
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

];
