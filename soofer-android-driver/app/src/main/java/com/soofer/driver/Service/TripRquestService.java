package com.soofer.driver.Service;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.location.Location;
import android.location.LocationManager;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.RemoteViews;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.firebase.geofire.GeoLocation;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.maps.model.LatLng;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.soofer.driver.Activity.WelcomeActivity;
import com.soofer.driver.Apllicationcontroller.Appcontroller;
import com.soofer.driver.BuildConfig;
import com.soofer.driver.CommonClass.CheckApp.ForegroundCheckTask;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CommonClass.Constants;


import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Stopwatch;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.ServiceWidgetEvent;
import com.soofer.driver.Geofire.GeoFire;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Presenter.FeedBackPresenter;
import com.soofer.driver.R;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import rx.Observable;
import rx.Subscription;

import static com.soofer.driver.CommonClass.Constants.FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS;
import static com.soofer.driver.CommonClass.Constants.UPDATE_INTERVAL_IN_MILLISECONDS;


/**
 * Created by com on 08-Jun-18.
 */

public class TripRquestService extends Service implements Stopwatch.StopWatchListener {
    public static Context context;
    public String strDriverID = "";
    static DatabaseReference RequestDatabase, AppAutoLoggedOut;
    static ValueEventListener RequestValueEvent, AppAutoLoggedOutValue;
    private static final String TAG = TripRquestService.class.getSimpleName();


    @SuppressLint("StaticFieldLeak")
    public static FusedLocationProviderClient mFusedLocationClient;

    /**
     * Callback for changes in location.
     */
    private LocationCallback mLocationCallback;

    private LocationRequest mLocationRequest;


    Location mCurrentLocation, starLocation, EndLocation;
    LatLng updateLcation = new LatLng(0.0, 0.0);

    public static final String ACTION_LOCATION_BROADCAST = TripRquestService.class.getName() + "LocationBroadcast";
    public static final String EXTRA_LATITUDE = "extra_latitude";
    public static final String EXTRA_LONGITUDE = "extra_longitude";
    public static GeoFire geoFire;
    public float previousBearing = 0;
    public static Subscription subscription;

    private Boolean isNotification = true;
    NotificationManager notificationManager;
    public static final String EXTRA_CUTOUT_SAFE_AREA = "cutout_safe_area";
    /**
     * FloatingViewManager
     */

    private WindowManager mWindowManager;

    private View mOverlayView;
    int mWidth;
    private RelativeLayout layout_track;
    private ImageView logo_img;
    private TextView seedo_meter_txt;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private static int CLICK_THRESHOLD = 150;

    @Override
    public void onCreate() {

        context = getApplicationContext();
        strDriverID = SharedHelper.getKey(context, "userid");
        if (!EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().register(this);
        if (subscription == null) {
            subscription = Observable.timer(10, TimeUnit.SECONDS)
                    .repeat()
                    .subscribe(aLong -> {
                        CallApi();
                        System.out.println("enter the no request" + strDriverID);
                    });

        }
        //
        //   addAutoStartup();
        getRequest();
        getCheckLogout();
        ReinitializeTimer();
        overLayWidget();
    }


    private void CallApi() {
        LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;

        try {
            assert lm != null;
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (!gps_enabled) {
            SharedHelper.getCategoryList(context, "categorylist");
            if (!SharedHelper.getCategoryList(context, "categorylist").isEmpty()) {
                for (String s : SharedHelper.getCategoryList(context, "categorylist")) {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child(s.toLowerCase()));
                    geoFire.removeLocation(strDriverID);
                }

            }
            upDateLocationPresnter("0", updateLcation);
            if (notificationManager == null) {
                sendNotification("Please turn on your location");
            }

        } else {
            if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                upDateLocationPresnter("1", updateLcation);
                if (!Utiles.isNetworkAvailable(context)) {
                    SharedHelper.putOnline(context, "isnetwork", true);
                } else {
                    if (SharedHelper.getOnlineStatus(context, "isnetwork")) {
                        SharedHelper.putOnline(context, "isnetwork", false);
                        DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                        ref.child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("online_status").setValue("1");
                    }
                }
            } else {
                upDateLocationPresnter("0", updateLcation);
            }
            if (notificationManager != null) {
                cancelNotification(context, 100);
            }

        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {


        try {
            RemoteViews remoteViews = new RemoteViews(getPackageName(),
                    R.layout.customize_notification);
            Intent notificationIntent = new Intent(this, MainActivity.class);
            notificationIntent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            int flag = PendingIntent.FLAG_ONE_SHOT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pendingNotificationIntent = PendingIntent.getActivity(this, 0,
                    notificationIntent, flag);
            Notification.Builder mBuilder = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                mBuilder = new Notification.Builder(this, Appcontroller.CHANNEL_ID).setSmallIcon(R.drawable.ic_applogo).setContent(remoteViews);
            } else {
                mBuilder = new Notification.Builder(this).setSmallIcon(R.drawable.ic_applogo).setContent(remoteViews);

            }
            mBuilder.setContentIntent(pendingNotificationIntent);
            startForeground(1, mBuilder.build());
            connectionFuseClient();
            init();
            //   FloatingIcon(intent.getParcelableExtra(EXTRA_CUTOUT_SAFE_AREA));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String login_status = SharedHelper.getKey(getApplicationContext(), "login_status");
        if (login_status.isEmpty()) {
            stopSelf();
        }
        return START_STICKY;
    }

    private void connectionFuseClient() {
        if (mFusedLocationClient == null)
            mFusedLocationClient = LocationServices.getFusedLocationProviderClient(TripRquestService.this);
    }

    @Override
    public void onDestroy() {

        RemoveListener();
        if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
            Intent myIntent = new Intent(this, TripRquestService.class);
            int flag = PendingIntent.FLAG_ONE_SHOT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pendingIntent = PendingIntent.getService(getApplicationContext(), 0, myIntent, flag);
            AlarmManager alarmManager1 = (AlarmManager) getSystemService(ALARM_SERVICE);
            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(System.currentTimeMillis());
            calendar.add(Calendar.MINUTE, 5);
            alarmManager1.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        }
        if (mOverlayView != null) {
            mWindowManager.removeView(mOverlayView);
            mOverlayView = null;
        }
        if (RequestDatabase != null) {
            RequestDatabase.removeEventListener(RequestValueEvent);
        }
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);


    }

    private void init() {

        mLocationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                super.onLocationResult(locationResult);
                // location is received
                if (starLocation == null) {
                    starLocation = locationResult.getLastLocation();
                    EndLocation = locationResult.getLastLocation();
                    ;
                }
                if (CommonData.strDistanceBegin != null) {

                    if (CommonData.strDistanceBegin.matches("distancebegin")) {
                        if (CommonData.lStart == null) {
                            CommonData.lStart = locationResult.getLastLocation();
                            ;
                            CommonData.lEnd = locationResult.getLastLocation();
                        } else
                            CommonData.lEnd = locationResult.getLastLocation();

                        //Calling the method below updates the  live values of distance and speed to the TextViews.

                        //calculating the speed with getSpeed method it returns speed in m/s so we are converting it into kmph
                        CommonData.speed = locationResult.getLastLocation().getSpeed() * 18 / 5;
                        updateUI();

                    }
                }
                updateLcation = new LatLng(locationResult.getLastLocation().getLatitude(), locationResult.getLastLocation().getLongitude());
                System.out.println("enter the address online" + SharedHelper.getOnlineStatus(context, "onlineStatus"));
                if (locationResult.getLastLocation().getBearing() != 0.0)
                    previousBearing = locationResult.getLastLocation().getBearing();

                if (SharedHelper.getKey(context, "trip_id") == null || SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("null") || SharedHelper.getKey(context, "trip_id").isEmpty()) {
                    if (SharedHelper.getCategoryList(context, "categorylist") != null && !SharedHelper.getCategoryList(context, "categorylist").isEmpty()) {
                        for (String s : SharedHelper.getCategoryList(context, "categorylist")) {
                            geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child(s.toLowerCase()));
                            upladteLocation(locationResult.getLastLocation(), geoFire);
                        }
                    }

                } else {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child("trip_location"));
                    upladteLocation(locationResult.getLastLocation(), geoFire);
                }

                double distanceInKiloMeters = (starLocation).distanceTo(EndLocation) / 1000; // as distance is in meter
                if (distanceInKiloMeters >= 0.2 || CommonData.isFistTime) {
                    CommonData.isFistTime = false;
                    EndLocation = starLocation;
                    if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                        upDateLocationPresnter("1", new LatLng(locationResult.getLastLocation().getLatitude(), locationResult.getLastLocation().getLongitude()));

                    }
                }


            }
        };
        mLocationRequest = new LocationRequest();
        mLocationRequest.setInterval(UPDATE_INTERVAL_IN_MILLISECONDS);
        mLocationRequest.setFastestInterval(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS);
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        builder.addLocationRequest(mLocationRequest);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mFusedLocationClient.requestLocationUpdates(mLocationRequest,
                mLocationCallback, Looper.myLooper());
    }

    public void getRequest() {
        if(RequestDatabase!=null){
            RequestDatabase.removeEventListener(RequestValueEvent);
            RequestValueEvent =null;
            RequestDatabase =null;
        }

        if (!strDriverID.isEmpty()) {
            RequestDatabase = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(strDriverID).child("request").child("status");
            RequestValueEvent = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.getValue() != null) {
                        if (dataSnapshot.getValue().toString().equalsIgnoreCase("1") && Constants.RquestScreen) {
                            CommonData.RequestBoolean = false;
                            CommonData.isRequestFrom = false;
                            Constants.RequestStart = false;
                            System.out.println("enter the request");
                            Intent intent = new Intent(context, MainActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP |Intent.FLAG_ACTIVITY_SINGLE_TOP  | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);


                        } else {
                            System.out.println("enter the no request");
                        }

                        if (dataSnapshot.getValue().toString().equalsIgnoreCase("0")) {
                            CommonData.RequestBoolean = false;
                            CommonData.isRequestFrom = true;
                            Constants.RequestStart = true;
                            CommonData.requestionInprogress = false;
                        }
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {

                }
            };
            RequestDatabase.addValueEventListener(RequestValueEvent);

        }

    }

    public void getCheckLogout() {
        if(AppAutoLoggedOut!=null){
            AppAutoLoggedOut.removeEventListener(AppAutoLoggedOutValue);
            AppAutoLoggedOutValue =null;
            AppAutoLoggedOut =null;
        }

        if (!strDriverID.isEmpty()) {
            AppAutoLoggedOut = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(strDriverID).child("FCM_id");
            AppAutoLoggedOutValue = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.getValue() != null) {
                        if (!dataSnapshot.getValue().toString().equalsIgnoreCase(SharedHelper.getToken(context, "device_token"))) {
                            /* if(!Constants.RquestScreen){*/
                            Intent intent = new Intent(context, WelcomeActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                            SharedHelper.clearSharedPreferences(context);
                            /*}else {
                                SharedHelper.clearSharedPreferences(context);
                            }*/
                            strDriverID = "";
                            RemoveListener();
                            stopForeground(true);
                            stopSelf();
                        } else {
                            System.out.println("enter same fcm id");
                        }
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {

                }
            };
            AppAutoLoggedOut.addValueEventListener(AppAutoLoggedOutValue);

        }

    }

    public static void RemoveListener() {
        try {
            if (RequestDatabase != null) {
                RequestDatabase.removeEventListener(RequestValueEvent);
            }
            if (AppAutoLoggedOut != null) {
                AppAutoLoggedOut.removeEventListener(AppAutoLoggedOutValue);
            }

            if (subscription != null) {
                subscription.unsubscribe();
                subscription = null;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void upDateLocationPresnter(String status, LatLng latLng) {
        HashMap<String, String> map = new HashMap<>();
        map.put("lat", String.valueOf(latLng.latitude));
        map.put("lon", String.valueOf(latLng.longitude));
        map.put("status", status);
        FeedBackPresenter feedBackPresenter = new FeedBackPresenter();
        feedBackPresenter.UpdateLocation(map, context);
    }

    public void upladteLocation(Location location, GeoFire geoFire) {
        System.out.println("enter the category" + SharedHelper.getKey(context, "category"));
        if (strDriverID != null && !strDriverID.equalsIgnoreCase("null")) {
            mCurrentLocation = location;
            if (mCurrentLocation != null) {
                if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                    System.out.println("location which is updated in==>" + mCurrentLocation.getLatitude() + "<====>" + mCurrentLocation.getLongitude());
                    geoFire.setLocation(strDriverID, new GeoLocation(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), previousBearing, (key, error) -> {
                        if (error != null) {
                            System.err.println("There was an error saving the location to GeoFire: " + mCurrentLocation.getLatitude() + mCurrentLocation.getLongitude());
                        } else {
                            System.out.println("OnlineOflline Location saved on server successfully!");
                        }
                    });
                } else {

                    geoFire.offlineLocation(strDriverID, new GeoLocation(0.0, 0.0), (key, error) -> {
                        if (error != null) {
                            System.err.println("There was an error saving the location to GeoFire: " + mCurrentLocation.getLatitude() + mCurrentLocation.getLongitude());
                        } else {
                            System.out.println("Offline Location saved on server successfully!");
                        }
                    });
                }
            }
        }

    }

    private void sendNotification(String messageBody) {
        int color = getResources().getColor(R.color.white);
        ;
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flag = PendingIntent.FLAG_ONE_SHOT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                flag);

        String channelId = getString(R.string.default_notification_channel_id);
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher_round)
                        .setContentTitle(getString(R.string.app_name))
                        .setContentText(messageBody)
                        .setAutoCancel(false)
                        .setOngoing(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);
        notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }
        notificationBuilder.setColor(color);
        notificationManager.notify(100 /* ID of notification */, notificationBuilder.build());
    }

    public void cancelNotification(Context ctx, int notifyId) {
        NotificationManager nMgr = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        assert nMgr != null;
        nMgr.cancel(notifyId);
        notificationManager = null;
    }

    private void addAutoStartup() {
        try {

            String manufacturer = android.os.Build.MANUFACTURER;
            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
            ref.child("brand").child(manufacturer).setValue("0");

            if ("oppo".equalsIgnoreCase(manufacturer)) {
                initOPPO();
            } else {
                for (Intent intents : POWERMANAGER_INTENTS)
                    if (getPackageManager().resolveActivity(intents, PackageManager.MATCH_DEFAULT_ONLY) != null) {
                        // show dialog to ask user action
                        startActivity(intents);
                        break;
                    }
            }
        } catch (Exception e) {
            Log.e("exc", String.valueOf(e));
        }
    }

    private void initOPPO() {
        try {

            Intent i = new Intent(Intent.ACTION_MAIN);
            i.setComponent(new ComponentName("com.oppo.safe", "com.oppo.safe.permission.floatwindow.FloatWindowListActivity"));
            startActivity(i);
        } catch (Exception e) {
            e.printStackTrace();
            try {

                Intent intent = new Intent("action.coloros.safecenter.FloatWindowListActivity");
                intent.setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.permission.floatwindow.FloatWindowListActivity"));
                startActivity(intent);
            } catch (Exception ee) {

                ee.printStackTrace();
                try {

                    Intent i = new Intent("com.coloros.safecenter");
                    i.setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.sysfloatwindow.FloatWindowListActivity"));
                    startActivity(i);
                } catch (Exception e1) {

                    e1.printStackTrace();
                }
            }

        }
    }

    private void updateUI() {
        if (CommonData.p == 0) {
            System.out.println("enter the speed in java"+ Math.round(CommonData.speed ));
            double maxAccuracy = CommonData.speed * 2;
            double minAccuracy = 25;
            if (maxAccuracy < minAccuracy) {
                maxAccuracy = minAccuracy;
            }
            if (CommonData.lStart != null && CommonData.lEnd.getAccuracy() < maxAccuracy
                    && CommonData.lEnd.getTime() > CommonData.lStart.getTime()) {
                if (Math.round(CommonData.speed ) > 0) {

                   /* if(PolyUtil.containsLocation (new LatLng (lEnd.getLatitude(), lEnd.getLongitude()), PolyGonData, true)){
                        distance = distance + (lStart.distanceTo(lEnd) * 1.04 / 1000.00);
                    }else {
                        outsitedistance = outsitedistance + (lStart.distanceTo(lEnd) * 1.04 / 1000.00);
                    }
*/
                    CommonData.distance = CommonData.distance + (CommonData.lStart.distanceTo(CommonData.lEnd) * 1.04 / 1000.00);
                    CommonData.lStart = CommonData.lEnd;
                    if (CommonData.stopWatch.isRunning()) {
                        CommonData.stopWatch.pause();
                    }

                    System.out.println("Speedd===>" + new DecimalFormat("0.00").format(CommonData.speed) + "km/hr");
                } else {
                    if (!CommonData.stopWatch.isRunning()) {
                        CommonData.stopWatch.resume();
                    }


                }
            }

            if (CommonData.distance > 0) {
                CommonData.strTotalDistance = new DecimalFormat("0.0##").format(CommonData.distance);
                System.out.println("TOTAL DISTANCE+++>" + CommonData.strTotalDistance);
                //SavePref.saveInt(context,"TotalDistance", strDistance);
                System.out.println("Distance in shared preference==>in mappppp" + CommonData.strTotalDistance);
            } else {
                CommonData.strTotalDistance = String.valueOf(CommonData.distance);
            }
        }
    }

    public void ReinitializeTimer() {
        if (CommonData.stopWatch == null) {
            CommonData.stopWatch = new Stopwatch();
            CommonData.stopWatch.setListener(this);
        }
    }

    @Override
    public void onTick(String time) {

    }

    private static final Intent[] POWERMANAGER_INTENTS = {
            new Intent().setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity")),
            new Intent().setComponent(new ComponentName("com.letv.android.letvsafe", "com.letv.android.letvsafe.AutobootManageActivity")),
            new Intent().setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.systemmanager.optimize.process.ProtectActivity")),
            new Intent().setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.systemmanager.appcontrol.activity.StartupAppControlActivity")),
            new Intent().setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity")),
            new Intent().setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.permission.startup.StartupAppListActivity")),
            new Intent().setComponent(new ComponentName("com.coloros.oppoguardelf", "com.coloros.powermanager.fuelgaue.PowerUsageModelActivity")),
            new Intent().setComponent(new ComponentName("com.coloros.oppoguardelf", "com.coloros.powermanager.fuelgaue.PowerSaverModeActivity")),
            new Intent().setComponent(new ComponentName("com.coloros.oppoguardelf", "com.coloros.powermanager.fuelgaue.PowerConsumptionActivity")),
            new Intent().setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.startupapp.StartupAppListActivity")),
            new Intent().setComponent(new ComponentName("com.oppo.safe", "com.oppo.safe.permission.startup.StartupAppListActivity")),
            new Intent().setComponent(new ComponentName("com.iqoo.secure", "com.iqoo.secure.ui.phoneoptimize.AddWhiteListActivity")),
            new Intent().setComponent(new ComponentName("com.iqoo.secure", "com.iqoo.secure.ui.phoneoptimize.BgStartUpManager")),
            new Intent().setComponent(new ComponentName("com.vivo.permissionmanager", "com.vivo.permissionmanager.activity.BgStartUpManagerActivity")),
            new Intent().setComponent(new ComponentName("com.samsung.android.lool", "com.samsung.android.sm.ui.battery.BatteryActivity")),
            new Intent().setComponent(new ComponentName("com.htc.pitroad", "com.htc.pitroad.landingpage.activity.LandingPageActivity")),
            new Intent().setComponent(new ComponentName("com.asus.mobilemanager", "com.asus.mobilemanager.entry.FunctionActivity")),
            new Intent().setComponent(new ComponentName("com.asus.mobilemanager", "com.asus.mobilemanager.autostart.AutoStartActivity")),
            new Intent().setComponent(new ComponentName("com.asus.mobilemanager", "com.asus.mobilemanager.MainActivity")),
            new Intent().setComponent(new ComponentName("com.letv.android.letvsafe", "com.letv.android.letvsafe.AutobootManageActivity"))
                    .setData(android.net.Uri.parse("mobilemanager://function/entry/AutoStart")),
            new Intent().setComponent(new ComponentName("com.meizu.safe", "com.meizu.safe.security.SHOW_APPSEC")).addCategory(Intent.CATEGORY_DEFAULT).putExtra("packageName", BuildConfig.APPLICATION_ID)

    };

    @Subscribe(threadMode = ThreadMode.BACKGROUND, sticky = true)
    public void onMessage(ServiceWidgetEvent event) {
        new Handler(Looper.getMainLooper()).post(() -> {
            // this will run in the main thread
            try {
                getRequest();
                getCheckLogout();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }
    @SuppressLint("ClickableViewAccessibility")
    private void overLayWidget() {
        if (mOverlayView == null) {
            mOverlayView = LayoutInflater.from(this).inflate(R.layout.overlay_layout, null);
            final WindowManager.LayoutParams params;
            //Add the view to the window.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                params = new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.WRAP_CONTENT,
                        WindowManager.LayoutParams.WRAP_CONTENT,
                        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                        PixelFormat.TRANSLUCENT);
                params.gravity = Gravity.TOP | Gravity.START;        //Initially view will be added to top-left corner
                params.x = 0;
                params.y = 100;

                mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
                mWindowManager.addView(mOverlayView, params);
            } else {
                params = new WindowManager.LayoutParams(
                        WindowManager.LayoutParams.WRAP_CONTENT,
                        WindowManager.LayoutParams.WRAP_CONTENT,
                        WindowManager.LayoutParams.TYPE_PHONE,
                        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                        PixelFormat.TRANSLUCENT);

                params.gravity = Gravity.TOP | Gravity.START;        //Initially view will be added to top-left corner
                params.x = 0;
                params.y = 100;

                mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
                mWindowManager.addView(mOverlayView, params);
            }
            layout_track = mOverlayView.findViewById(R.id.layout_track);
            logo_img = mOverlayView.findViewById(R.id.logo_img);
            seedo_meter_txt = mOverlayView.findViewById(R.id.seedo_meter_txt);
            Display display = mWindowManager.getDefaultDisplay();
            final Point size = new Point();
            display.getSize(size);
            final FrameLayout layout = (FrameLayout) mOverlayView.findViewById(R.id.layout);
            ViewTreeObserver vto = layout.getViewTreeObserver();
            vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                    layout.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                    int width = layout.getMeasuredWidth();

                    //To get the accurate middle of the screen we subtract the width of the floating widget.
                    mWidth = size.x - width;

                }
            });

            layout_track.setOnTouchListener(new View.OnTouchListener() {
                                                private int initialX;
                                                private int initialY;
                                                private float initialTouchX;
                                                private float initialTouchY;


                                                @Override
                                                public boolean onTouch(View v, MotionEvent event) {
                                                    switch (event.getAction()) {
                                                        case MotionEvent.ACTION_DOWN:

                                                            //remember the initial position.
                                                            initialX = params.x;
                                                            initialY = params.y;
                                                            //get the touch location
                                                            initialTouchX = event.getRawX();
                                                            initialTouchY = event.getRawY();


                                                            return true;
                                                        case MotionEvent.ACTION_UP:

                                                            long duration = event.getEventTime() - event.getDownTime();
                                                            System.out.println("Enter the click listioner"+duration);
                                                            //Logic to auto-position the widget based on where it is positioned currently w.r.t middle of the screen.
                                                            int middle = mWidth / 2;
                                                            float nearestXWall = params.x >= middle ? mWidth : 0;
                                                            params.x = (int) nearestXWall;
                                                            mWindowManager.updateViewLayout(mOverlayView, params);

                                                            if (duration < CLICK_THRESHOLD) {
                                                                try {
                                                                    boolean foregroud = new ForegroundCheckTask().execute(context).get();
                                                                    if (!foregroud) {
                                                                        Constants.Previousstatus = "0";
                                                                        CommonFirebaseListoner.Previous = "0";
                                                                        CommonData.RequestBoolean = false;
                                                                        CommonData.isFistTime = true;
                                                                        Intent intent1 = new Intent(context, MainActivity.class);
                                                                        intent1.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                                                                        intent1.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                                                        startActivity(intent1);
                                                                    }

                                                                } catch (Exception e) {
                                                                    e.printStackTrace();
                                                                }
                                                            }


                                                            return true;
                                                        case MotionEvent.ACTION_MOVE:


                                                            int xDiff = Math.round(event.getRawX() - initialTouchX);
                                                            int yDiff = Math.round(event.getRawY() - initialTouchY);


                                                            //Calculate the X and Y coordinates of the view.
                                                            params.x = initialX + xDiff;
                                                            params.y = initialY + yDiff;

                                                            //Update the layout with new X & Y coordinates
                                                            mWindowManager.updateViewLayout(mOverlayView, params);


                                                            return true;
                                                    }
                                                    return false;
                                                }

                                            }
            );
        }
    }


}
