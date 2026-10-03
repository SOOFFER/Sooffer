package com.soofer.driver.Service;

import static com.soofer.driver.MainActivity.activity;

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
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationManager;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.firebase.geofire.GeoLocation;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.greenrobot.eventbus.EventBus;

import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import com.soofer.driver.Activity.WelcomeActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Stopwatch;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Geofire.GeoFire;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Presenter.FeedBackPresenter;
import com.soofer.driver.Presenter.LogoutPresenter;
import com.soofer.driver.R;
import rx.Observable;
import rx.Subscription;

@SuppressLint("ALL")
@SuppressWarnings("ALL")
public class TripRquestService extends Service implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener,
        LocationListener, Stopwatch.StopWatchListener {

    public static Context context;
    public String strDriverID = "";
    public static DatabaseReference RequestDatabase, AppAutoLoggedOut;
    public static ValueEventListener RequestValueEvent, AppAutoLoggedOutValue;
    private static final String TAG = TripRquestService.class.getSimpleName();
    public static GoogleApiClient mLocationClient;
    LocationRequest mLocationRequest = new LocationRequest();

    Location mCurrentLocation, starLocation, EndLocation;

    // FIX: Initialize updateLocation as null instead of (0.0, 0.0)
    // so we can distinguish "no location received yet" from a real zero coordinate.
    public static LatLng updateLcation = null;

    public static final String ACTION_LOCATION_BROADCAST = TripRquestService.class.getName() + "LocationBroadcast";
    public static final String EXTRA_LATITUDE = "extra_latitude";
    public static final String EXTRA_LONGITUDE = "extra_longitude";
    public static GeoFire geoFire;
    public float previousBearing = 0;
    public static Subscription subscription;

    private Boolean isNotification = true;
    NotificationManager notificationManager;

    // FIX: Track whether we have received at least one valid GPS fix
    private boolean hasValidLocation = false;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        context = getApplicationContext();
        strDriverID = SharedHelper.getKey(context, "userid");

        if (subscription == null) {
            subscription = Observable.timer(10, TimeUnit.SECONDS)
                    .repeat()
                    .subscribe(aLong -> {
                        if (!strDriverID.isEmpty()) {
                            CallApi();
                        }
                    });
        }

        mLocationClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();

        mLocationRequest.setInterval(Constants.SET_INTERVAL);
        mLocationRequest.setFastestInterval(Constants.SET_FASTESTINTERVAL);

        int priority = LocationRequest.PRIORITY_HIGH_ACCURACY;
        mLocationRequest.setPriority(priority);
        mLocationClient.connect();

        addAutoStartup();
        getCheckLogout();
        ReinitializeTimer();
    }

    private void CallApi() {
        LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;

        try {
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (!gps_enabled) {
            // GPS is OFF — remove from GeoFire and notify user
            if (SharedHelper.getKey(context, "category") != null
                    && !SharedHelper.getKey(context, "category").isEmpty()) {
                geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference()
                        .child("drivers_location")
                        .child(SharedHelper.getKey(context, "category").toLowerCase()));
                geoFire.removeLocation(strDriverID);
            }

            // FIX: Do NOT send 0.0,0.0 to the server when GPS is off.
            // Only send offline status if we have a valid location to report against.
            if (hasValidLocation && updateLcation != null) {
                upDateLocationPresnter("0", updateLcation);
            } else {
                // Just update status to offline without sending bogus coordinates
                updateOnlineStatusOnly("0");
            }

            if (notificationManager == null) {
                sendNotification("Please turn on your location");
            }

        } else {
            if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                // FIX: Only send location update if we have a valid GPS fix
                if (hasValidLocation && updateLcation != null) {
                    upDateLocationPresnter("1", updateLcation);
                } else {
                    Log.d(TAG, "CallApi: Skipping location update — waiting for first GPS fix");
                    // Still update online status even without location
                    updateOnlineStatusOnly("1");
                }

                if (!Utiles.isNetworkAvailable(context)) {
                    SharedHelper.putOnline(context, "isnetwork", true);
                } else {
                    if (SharedHelper.getOnlineStatus(context, "isnetwork")) {
                        SharedHelper.putOnline(context, "isnetwork", false);
                        DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                        ref.child("drivers_data")
                                .child(SharedHelper.getKey(context, "userid"))
                                .child("online_status")
                                .setValue("1");
                    }
                }
            } else {
                // FIX: Only send location update if we have a valid GPS fix
                if (hasValidLocation && updateLcation != null) {
                    upDateLocationPresnter("0", updateLcation);
                } else {
                    updateOnlineStatusOnly("0");
                }
            }

            if (notificationManager != null) {
                cancelNotification(context, 100);
            }
        }
    }

    /**
     * FIX: New helper — updates only the driver's online_status in Firebase
     * without sending lat/lon. Used when we don't yet have a valid GPS fix.
     */
    private void updateOnlineStatusOnly(String status) {
        try {
            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
            ref.child("drivers_data")
                    .child(SharedHelper.getKey(context, "userid"))
                    .child("online_status")
                    .setValue(status);
            Log.d(TAG, "updateOnlineStatusOnly: status=" + status + " (no valid location yet)");
        } catch (Exception e) {
            Log.e(TAG, "updateOnlineStatusOnly error: " + e.getMessage());
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        try {
            Notification notification = createForegroundNotification();
            startForeground(5, notification);
        } catch (Exception e) {
            Log.e(TAG, "onStartCommand error: " + e.getMessage());
        }

        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = getString(R.string.default_notification_channel_id);
            String channelName = "Foreground Service Channel";
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    channelName,
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Channel for foreground service notifications");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }
    }

    private Notification createForegroundNotification() {
        String channelId = getString(R.string.default_notification_channel_id);
        return new NotificationCompat.Builder(this, channelId)
                .setContentTitle(getString(R.string.driver_is_running))
                .setContentText(getString(R.string.tap_for_more_information_or_to_stop_the_app))
                .setSmallIcon(R.drawable.app_logo_notify)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.ic_applogo))
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    @Override
    public void onDestroy() {
        Constants.onResumeCalled = false;
        int flag = PendingIntent.FLAG_ONE_SHOT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;
        }
        Intent myIntent = new Intent(this, TripRquestService.class);
        PendingIntent pendingIntent = PendingIntent.getService(getApplicationContext(), 0, myIntent, flag);
        AlarmManager alarmManager1 = (AlarmManager) getSystemService(ALARM_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.add(Calendar.HOUR, 6);
        assert alarmManager1 != null;
        alarmManager1.set(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);
    }

    public void getCheckLogout() {
        if (!strDriverID.isEmpty()) {
            if (AppAutoLoggedOut != null) {
                AppAutoLoggedOut.removeEventListener(AppAutoLoggedOutValue);
            }
            AppAutoLoggedOut = FirebaseDatabase.getInstance().getReference()
                    .child("drivers_data").child(strDriverID).child("FCM_id");
            AppAutoLoggedOutValue = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.getValue() != null) {
                        if (!dataSnapshot.getValue().toString()
                                .equalsIgnoreCase(SharedHelper.getToken(context, "device_token"))) {
                            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                            ref.child("drivers_data").child(strDriverID).child("online_status").setValue("0");
                            strDriverID = "";
                            CommonData.walletBalance = "0";
                            MainActivity.RemoveListener();
                            if (MainActivity.mAuth != null) {
                                MainActivity.mAuth.signOut();
                            }
                            stopForeground(true);
                            stopSelf();
                            if (activity != null) {
                                LogoutPresenter logoutPresenter = new LogoutPresenter();
                                logoutPresenter.LogoutData(activity);
                            }
                            SharedHelper.clearSharedPreferences(context);
                            Intent intent = new Intent(context, WelcomeActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
                                    | Intent.FLAG_ACTIVITY_CLEAR_TASK
                                    | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
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

    @Override
    public void onLocationChanged(Location location) {
        if (!strDriverID.isEmpty()) {

            // FIX: Validate the location before doing anything
            if (location == null) {
                Log.d(TAG, "onLocationChanged: location is NULL, skipping");
                return;
            }

            // FIX: Reject (0.0, 0.0) coordinates — these are invalid GPS readings
            if (location.getLatitude() == 0.0 && location.getLongitude() == 0.0) {
                Log.w(TAG, "onLocationChanged: Received 0.0,0.0 — ignoring invalid GPS fix");
                return;
            }

            // FIX: Reject locations with very poor accuracy (> 500 meters is unreliable)
            if (location.hasAccuracy() && location.getAccuracy() > 500) {
                Log.w(TAG, "onLocationChanged: Accuracy too poor (" + location.getAccuracy() + "m), skipping");
                return;
            }

            Log.d(TAG, "onLocationChanged: Lat=" + location.getLatitude()
                    + " Lng=" + location.getLongitude()
                    + " Accuracy=" + location.getAccuracy());

            if (starLocation == null) {
                starLocation = location;
                EndLocation = location;
            }

            // FIX: Update the cached location with valid coordinates
            updateLcation = new LatLng(location.getLatitude(), location.getLongitude());

            // FIX: Mark that we now have at least one valid GPS fix
            hasValidLocation = true;

            if (CommonData.strDistanceBegin != null) {
                if (CommonData.strDistanceBegin.matches("distancebegin")) {
                    if (CommonData.lStart == null) {
                        CommonData.lStart = location;
                        CommonData.lEnd = location;
                    } else {
                        CommonData.lEnd = location;
                    }
                    updateUI();
                    CommonData.speed = location.getSpeed() * 18 / 5;
                }
            }

            System.out.println("enter the address online"
                    + SharedHelper.getOnlineStatus(context, "onlineStatus"));

            if (location.getBearing() != 0.0)
                previousBearing = location.getBearing();

            upladteLocation(location);

            double distanceInMiles = (starLocation).distanceTo(EndLocation) / 1609.344;
            if (distanceInMiles >= 0.124 || CommonData.isFistTime) {
                CommonData.isFistTime = false;
                EndLocation = starLocation;
                if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                    // FIX: Safe to call — we validated coordinates above
                    upDateLocationPresnter("1", updateLcation);
                }
            }
        }
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "== Error On onConnected() Permission not granted");
            return;
        }
        LocationServices.FusedLocationApi.requestLocationUpdates(mLocationClient, mLocationRequest, this);
        Log.d(TAG, "Connected to Google API");
    }

    @Override
    public void onConnectionSuspended(int i) {
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
    }

    public void upDateLocationPresnter(String status, LatLng latLng) {
        if (latLng == null) {
            Log.w(TAG, "upDateLocationPresnter: latLng is null, skipping");
            return;
        }

        // Guard 2: reject 0.0, 0.0 — this is the sentinel "no location" value
        if (latLng.latitude == 0.0 && latLng.longitude == 0.0) {
            Log.w(TAG, "upDateLocationPresnter: Blocked 0.0,0.0 coordinates from being sent to server");
            return;
        }

        // Guard 3: reject obviously invalid latitude/longitude ranges
        if (latLng.latitude < -90 || latLng.latitude > 90
                || latLng.longitude < -180 || latLng.longitude > 180) {
            Log.w(TAG, "upDateLocationPresnter: Invalid coordinate range, skipping");
            return;
        }

        HashMap<String, String> map = new HashMap<>();
        map.put("lat", String.valueOf(latLng.latitude));
        map.put("lon", String.valueOf(latLng.longitude));
        map.put("status", status);
        FeedBackPresenter feedBackPresenter = new FeedBackPresenter();
        feedBackPresenter.UpdateLocation(map, context);
    }

    public void upladteLocation(Location location) {
        if (!strDriverID.isEmpty()) {

            // FIX: Extra null/zero guard at GeoFire level too
            if (location == null) {
                Log.w(TAG, "upladteLocation: location is null, skipping GeoFire update");
                return;
            }

            if (location.getLatitude() == 0.0 && location.getLongitude() == 0.0) {
                Log.w(TAG, "upladteLocation: Blocked 0.0,0.0 from GeoFire update");
                return;
            }

            System.out.println("enter the category" + SharedHelper.getKey(context, "category"));

            if (SharedHelper.getKey(context, "category") != null
                    && !SharedHelper.getKey(context, "category").isEmpty()) {

                if (SharedHelper.getKey(context, "trip_id") == null
                        || SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("null")
                        || SharedHelper.getKey(context, "trip_id").isEmpty()) {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference()
                            .child("drivers_location")
                            .child(SharedHelper.getKey(context, "category").toLowerCase()));
                } else {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference()
                            .child("drivers_location")
                            .child("trip_location"));
                }

                if (strDriverID != null && !strDriverID.equalsIgnoreCase("null")) {
                    mCurrentLocation = location;
                    if (mCurrentLocation != null) {
                        if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                            System.out.println("location which is updated in==>"
                                    + mCurrentLocation.getLatitude()
                                    + "<====>" + mCurrentLocation.getLongitude());
                            geoFire.setLocation(strDriverID,
                                    new GeoLocation(mCurrentLocation.getLatitude(),
                                            mCurrentLocation.getLongitude()),
                                    previousBearing,
                                    (key, error) -> {
                                        if (error != null) {
                                            System.err.println("There was an error saving the location to GeoFire: "
                                                    + mCurrentLocation.getLatitude()
                                                    + mCurrentLocation.getLongitude());
                                        } else {
                                            System.out.println("OnlineOflline Location saved on server successfully!");
                                        }
                                    });
                        } else {
                            geoFire.offlineLocation(strDriverID, new GeoLocation(0.0, 0.0),
                                    new GeoFire.CompletionListener() {
                                        @Override
                                        public void onComplete(String key, DatabaseError error) {
                                            if (error != null) {
                                                System.err.println("There was an error saving the location to GeoFire: "
                                                        + mCurrentLocation.getLatitude()
                                                        + mCurrentLocation.getLongitude());
                                            } else {
                                                System.out.println("Offline Location saved on server successfully!");
                                            }
                                        }
                                    });
                        }
                    }
                }
            }
        }
    }

    private void sendNotification(String messageBody) {
        int color = getResources().getColor(R.color.white);
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);

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

        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }
        notificationBuilder.setColor(color);
        notificationManager.notify(100, notificationBuilder.build());
    }

    public void cancelNotification(Context ctx, int notifyId) {
        NotificationManager nMgr = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
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
            i.setComponent(new ComponentName("com.oppo.safe",
                    "com.oppo.safe.permission.floatwindow.FloatWindowListActivity"));
            startActivity(i);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Intent intent = new Intent("action.coloros.safecenter.FloatWindowListActivity");
                intent.setComponent(new ComponentName("com.coloros.safecenter",
                        "com.coloros.safecenter.permission.floatwindow.FloatWindowListActivity"));
                startActivity(intent);
            } catch (Exception ee) {
                ee.printStackTrace();
                try {
                    Intent i = new Intent("com.coloros.safecenter");
                    i.setComponent(new ComponentName("com.coloros.safecenter",
                            "com.coloros.safecenter.sysfloatwindow.FloatWindowListActivity"));
                    startActivity(i);
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        }
    }

    private void updateUI() {
        if (CommonData.p == 0) {
            double maxAccuracy = CommonData.speed * 2;
            double minAccuracy = 25;
            if (maxAccuracy < minAccuracy) {
                maxAccuracy = minAccuracy;
            }
            if (CommonData.lStart != null
                    && CommonData.lEnd.getAccuracy() < maxAccuracy
                    && CommonData.lEnd.getTime() > CommonData.lStart.getTime()) {
                if (CommonData.speed > 0.0) {
                    CommonData.distance = CommonData.distance
                            + (CommonData.lStart.distanceTo(CommonData.lEnd) * 1.04 / 1609.344);
                    CommonData.lStart = CommonData.lEnd;
                    if (CommonData.stopWatch.isRunning()) {
                        CommonData.stopWatch.pause();
                    }
                } else {
                    if (!CommonData.stopWatch.isRunning()) {
                        CommonData.stopWatch.resume();
                    }
                }
            }

            if (CommonData.distance > 0) {
                CommonData.strTotalDistance = new DecimalFormat("0.0##").format(CommonData.distance);
                System.out.println("TOTAL DISTANCE+++>" + CommonData.strTotalDistance);
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
            new Intent().setComponent(new ComponentName("com.meizu.safe", "com.meizu.safe.security.SHOW_APPSEC"))
                    .addCategory(Intent.CATEGORY_DEFAULT)
                    .putExtra("packageName", "com.royaleagles.app.driver")
    };
}