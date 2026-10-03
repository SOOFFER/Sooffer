package com.soofer.driver;

import static com.soofer.driver.CommonClass.CommonData.strCountryCode;
import static com.soofer.driver.CommonClass.Constants.FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS;
import static com.soofer.driver.CommonClass.Constants.REQUEST_CHECK_SETTINGS;
import static com.soofer.driver.CommonClass.Constants.UPDATE_INTERVAL_IN_MILLISECONDS;
import static com.soofer.driver.CommonClass.Constants.onResumeCalled;
import static com.soofer.driver.CommonClass.Constants.strVehicleID;
import static com.soofer.driver.CommonClass.Utiles.BitMapToString;
import static com.soofer.driver.CommonClass.Utiles.CircleImageView;
import static com.soofer.driver.CommonClass.Utiles.ClearFirebase;
import static com.soofer.driver.CommonClass.Utiles.Nullpointer;
import static com.soofer.driver.CommonClass.Utiles.displayMessage;
import static com.soofer.driver.CommonClass.Utiles.getDestination;
import static com.soofer.driver.CommonClass.Utiles.getMimeType;
import static com.soofer.driver.CommonClass.Utiles.isMyServiceRunning;
import static com.soofer.driver.Service.TripRquestService.AppAutoLoggedOut;
import static com.soofer.driver.Service.TripRquestService.AppAutoLoggedOutValue;
import static com.soofer.driver.Service.TripRquestService.RequestDatabase;
import static com.soofer.driver.Service.TripRquestService.RequestValueEvent;
import static com.soofer.driver.Service.TripRquestService.mLocationClient;
import static com.soofer.driver.Service.TripRquestService.subscription;

import android.Manifest;
import android.animation.TypeEvaluator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
import com.akexorcist.googledirection.util.DirectionConverter;
import com.firebase.geofire.GeoLocation;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolygonOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.jakewharton.rxbinding.view.RxView;
import com.soofer.driver.Activity.NotificationActivity;
import com.soofer.driver.Activity.ProfileActivity;
import com.soofer.driver.Activity.SplashActivity;
import com.soofer.driver.Activity.Texi_Hail_Activity;
import com.soofer.driver.Activity.WelcomeActivity;
import com.soofer.driver.Adapter.VehicleListAdapter;
import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FloatingView.FloatingViewManager;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.KeyHelper;
import com.soofer.driver.CommonClass.PermissionManager;
import com.soofer.driver.CommonClass.Receiver.NetworkChangeReceiver;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Stopwatch;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.CustomizeDialog.WalletAlertDialog;
import com.soofer.driver.EventBus.DestinationAddressEvent;
import com.soofer.driver.EventBus.HailRequest;
import com.soofer.driver.EventBus.ServiceWidgetEvent;
import com.soofer.driver.FCMNotification.MyFirebaseMessagingService;
import com.soofer.driver.FlowInterface.RequestInterface;
import com.soofer.driver.Fragment.AddVehicleFragment;
import com.soofer.driver.Fragment.DriverCreditFragment;
import com.soofer.driver.Fragment.DriverEarningsFragment;
import com.soofer.driver.Fragment.ManageVehicleStateFragment;
import com.soofer.driver.Fragment.ManageVehiclesFragment;
import com.soofer.driver.Fragment.RatingFragment;
import com.soofer.driver.Fragment.YourTripFragment;
import com.soofer.driver.Fragment.document.DocumentUploadListFragment;
import com.soofer.driver.Geofire.GeoFire;
import com.soofer.driver.GooglePlace.GooglePlcaeModel.AddressComponent;
import com.soofer.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.driver.Model.AttendanceModel;
import com.soofer.driver.Model.FareCaluationModel;
import com.soofer.driver.Model.ListVehicleModel;
import com.soofer.driver.Model.OnlineOflline;
import com.soofer.driver.Model.RoutesModel;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.Navigationdrawer.FragmentDrawer;
import com.soofer.driver.Presenter.CityPolygonPresenter.CityPolygonPresenter;
import com.soofer.driver.Presenter.DriverPresenter;
import com.soofer.driver.Presenter.GoogleGeocoderPresenter;
import com.soofer.driver.Presenter.GooglePolylinePresenter;
import com.soofer.driver.Presenter.LogoutPresenter;
import com.soofer.driver.Presenter.SubscriptionPresenter;
import com.soofer.driver.Service.TripRquestService;
import com.soofer.driver.TripflowFragment.BottomSheetDialogFragment.MultipleStopFragment;
import com.soofer.driver.TripflowFragment.BottomSheetDialogFragment.NotificationSoundFragment;
import com.soofer.driver.TripflowFragment.CancelFragment;
import com.soofer.driver.TripflowFragment.RequestFragement;
import com.soofer.driver.TripflowFragment.SummaryFragment;
import com.soofer.driver.TripflowFragment.TripFlowFragment;
import com.soofer.driver.View.DriverView;
import com.soofer.driver.View.GooglePolylineView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;
import java.util.UUID;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import de.hdodenhof.circleimageview.CircleImageView;
import io.github.inflationx.viewpump.ViewPumpContextWrapper;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.Observer;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;

@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class MainActivity extends BaseActivity implements FragmentDrawer.FragmentDrawerListener, OnMapReadyCallback, GoogleApiClient.ConnectionCallbacks, LocationSource,
        GoogleApiClient.OnConnectionFailedListener, LocationListener, GooglePolylineView, RequestInterface, DriverView,
        VehicleListAdapter.UpdateVehicleInterface, Stopwatch.StopWatchListener, GoogleGeocoderPresenter.GoogleGeoCoderView,
        CityPolygonPresenter.PolyGonView {
    @SuppressLint("StaticFieldLeak")
    public static DrawerLayout mDrawerLayout;
    FragmentDrawer drawerFragment;
    ImageView userProfileImage;
    RelativeLayout logout_layout;
    TextView txtUserName;
    LocationManager locationManager;
    Fragment fragment = null;
    AlertDialog VehicleDialog;
    Fragment FlowFragment = null;
    static GeoFire geoFire;
    public static Context context;
    public static Activity activity;
    BitmapDescriptor mapCarIcon;
    GoogleApiClient mGoogleApiClient;
    RecyclerView vehicle_list;
    public static String random;
    private KeyHelper keyHelpers;
    public static String Sha1;

    public static FirebaseAuth mAuth;

    GooglePolylinePresenter googlePolylinePresenter;
    VehicleListAdapter vehicleListAdapter;
    List<ListVehicleModel> vehicleModels = new ArrayList<>();
    public static GoogleMap mMap;
    View mapView;
    Bitmap mapBitmap;
    File uriprofile = null;
    Marker currentLocMarker, pickUPrDropMarker;
    static DatabaseReference ProofstatusReference, RequestDatabaseReference, TripFlowReference, acceptedTripDatabase, CategoryDatabase;
    static ValueEventListener ProofstatusValue, RequestValueListener, TripFlowValue, acceptedTripValue, CategoryValueEvent;
    DriverPresenter driverPresenter;
    float previousBearing = 0;
    AlertDialog alert11;
    int mapPosition = 0;
    static String driverId = "", strPreviousClassName = "";
    public static Location mCurrentLocation, starLocation, EndLocation;
    final Handler handler = new Handler();
    @BindView(R.id.proostatus)
    TextView proostatus;
    @BindView(R.id.menu_imgbtn)
    ImageButton menuImgbtn;
    @BindView(R.id.daily_earnings_txt)
    ImageView dailyEarningsTxt;
    @BindView(R.id.earning_lyt)
    RelativeLayout earningLyt;
    @BindView(R.id.notification_imgbtn)
    ImageButton notificationImgbtn;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.stops_imgbtn)
    ImageButton stopsImgbtn;
    @BindView(R.id.support_imgbtn)
    ImageButton supportImgbtn;
    @BindView(R.id.currentlocation_imgbtn)
    ImageButton currentlocationImgbtn;
    @BindView(R.id.profile_img)
    CircleImageView profileImg;
    @BindView(R.id.plate_txt)
    TextView plateTxt;
    @BindView(R.id.category_model_txt)
    TextView categoryModelTxt;
    @BindView(R.id.serviceTypeTxt)
    TextView serviceTypeTxt;
    @BindView(R.id.change_txt)
    TextView changeTxt;
    @BindView(R.id.online_offline_text)
    TextView onlineOfflineText;
    @BindView(R.id.online_offline_switch)
    Switch onlineOfflineSwitch;
    @BindView(R.id.online_offline_layout)
    LinearLayout onlineOfflineLayout;
    @BindView(R.id.driver_online_layout)
    RelativeLayout driverOnlineLayout;
    @BindView(R.id.Driver_details)
    RelativeLayout DriverDetails;
    @BindView(R.id.containterss)
    FrameLayout containterss;
    @BindView(R.id.container)
    FrameLayout container;
    @BindView(R.id.img_textHail)
    ImageView imgTextHail;
    @BindView(R.id.back)
    ImageView back;
    @BindView(R.id.header_lyt)
    RelativeLayout headerLyt;
    @BindView(R.id.txt_Date)
    TextView txtDate;
    @BindView(R.id.walletCredits)
    TextView walletCredits;
    @BindView(R.id.txt_ride_fare)
    TextView txtRideFare;
    @BindView(R.id.txt_tips)
    TextView txtTripsReceived;

    @BindView(R.id.txt_gateway_charge)
    TextView txtGatewayCharge;
    @BindView(R.id.txt_income)
    TextView txtIncome;
    @BindView(R.id.tvKm)
    TextView tvKm;
    @BindView(R.id.tvRides)
    TextView tvRides;
    @BindView(R.id.daily_earning_lyt)
    LinearLayout dailyEarningLyt;
    @BindView(R.id.walletBalanceTxt)
    TextView walletBalanceTxt;
    @BindView(R.id.map_lyt)
    RelativeLayout mapLyt;
    private Runnable runnable;

    Boolean isPermissionGivenAlready = false;
    private boolean isAttendanceCompleted = false;

    LatLng prevLatLng = new LatLng(0, 0);
    ArrayList<String> arrayCategory = new ArrayList<>();
    private OnLocationChangedListener mMapLocationListener = null;
    public CityPolygonPresenter cityPolygonPresenter;
    private static final int MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;
    protected LocationRequest mLocationRequest;
    TextView change_txt;
    static String strMake, strModel, strPlateNum, Tripstatus = "";
    PermissionManager permissionManager;

    public static LatLng destLocation, waypoints_one, waypoints_two;
    public static FragmentManager FragmentManage;
    //proof and online status
    private static Boolean proofstatus = false;
    private static Boolean onlinestatus = false;
    private static Boolean isSubcriptionActive = false;

    private Polyline routePolyline;
    public FusedLocationProviderClient mFusedLocationClient;
    File photoFile;
    public String path;
    Uri uri = null;
    FragmentManager fragmentManager;
    GoogleGeocoderPresenter googleGeocoderPresenter;

    private CompositeDisposable disposable;
    private String strCityName = "";
    List<LatLng> PolyGonData;
    private static final int CUSTOM_OVERLAY_PERMISSION_REQUEST_CODE = 10001;
    private SubscriptionPresenter subscriptionPresenter;
    private NetworkChangeReceiver networkChangeReceiver;

    private final List<LatLng> multiLocations = new ArrayList<>();

    private Response<TripFlowModel> response = null;
    private BottomSheetDialogFragment bottomSheetDialogFragment;
    private LocationCallback mLocationCallback;
    private SettingsClient mSettingsClient;
    private LocationSettingsRequest mLocationSettingsRequest;
    boolean safeRide = false;
    boolean isDocumentType = false;
    Dialog dialog = null;
    LottieAnimationView animationView;

    public static Window windows;

    private static final int BATTERY_OPTIMIZATION_REQUEST_CODE = 1021;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        windows = getWindow();
        windows.addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        windows.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            windows.addFlags(
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }
        context = this;
        activity = this;
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        findviewById();

        mAuth = FirebaseAuth.getInstance();
        random = UUID.randomUUID().toString();
        keyHelpers = new KeyHelper();
        new Thread(() -> {
            keyHelpers.get(context, "SHA1");
            runOnUiThread(() -> {
                if (SharedHelper.getKey(context, "SHA1Key") != null) {
                    Sha1 = SharedHelper.getKey(context, "SHA1Key").toUpperCase().replace(":", "");
                }
            });
        }).start();

        googlePolylinePresenter = new GooglePolylinePresenter(this);

        getDateFormate();
        permissionManager = new PermissionManager();
        Constants.RquestScreen = false;
        onResumeCalled = true;
        FragmentManage = getSupportFragmentManager();
        strMake = SharedHelper.getKey(context, "vmake");
        strModel = SharedHelper.getKey(context, "vmodel");
        strPlateNum = SharedHelper.getKey(context, "numplate");

        if (strMake != null && !strMake.isEmpty()) {
            categoryModelTxt.setText(Nullpointer(strMake) + " " + Nullpointer(strModel));
            serviceTypeTxt.setText(SharedHelper.getKey(context, "vehicle_type"));
        }
        driverPresenter = new DriverPresenter(this);
        fragmentManager = getSupportFragmentManager();
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);


        disposable = new CompositeDisposable();
        googleGeocoderPresenter = new GoogleGeocoderPresenter(this, disposable);
        cityPolygonPresenter = new CityPolygonPresenter(activity, new CompositeDisposable(), this);
        PolyGonData = new ArrayList<>();
        if (SharedHelper.getKey(context, "vehicleId") != null && !SharedHelper.getKey(context, "vehicleId").isEmpty()) {
            getVehicleCategory(SharedHelper.getKey(context, "vehicleId"));
        }

        networkChangeReceiver = new NetworkChangeReceiver();
        if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
            onlineOfflineText.setText(R.string.available);
        } else {
            onlineOfflineText.setText(R.string.unavailable);
        }
        onlineOfflineSwitch.setChecked(SharedHelper.getOnlineStatus(context, "onlineStatus"));
        setLocale(SharedHelper.getToken(activity, "lang"));
        startService();
        DriverProofstatus();
        CommonFirebaseListoner.Previous = "0";
        new Handler(Looper.getMainLooper()).post(() -> {
            CommonFirebaseListoner.FirebaseTripFlow();
            CommonFirebaseListoner.setActivity(activity);
        });
        registerReceiver(gpsReceiver, new IntentFilter("android.location.PROVIDERS_CHANGED"));
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, null);
        earningLyt.setOnClickListener(v -> {
            dailyEarningLyt.setVisibility(View.VISIBLE);
            earningdata();
        });
        back.setOnClickListener(v -> dailyEarningLyt.setVisibility(View.GONE));

    }

    private void requestBatteryOptimizationExemption() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            String packageName = getPackageName();

            if (pm != null && !pm.isIgnoringBatteryOptimizations(packageName)) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + packageName));
                startActivityForResult(intent, BATTERY_OPTIMIZATION_REQUEST_CODE);
            }
        }
    }


    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent); // update the activity's intent to the new one

        if (intent != null && intent.getBooleanExtra(
                MyFirebaseMessagingService.ACTION_TRIP_REQUEST, false)) {
            Log.d("MainActivity", "onNewIntent: Woken by FCM trip request");
            String tripId = SharedHelper.getKey(context, "trip_id");
            if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                CommonData.RequestBoolean = false;
                CommonData.requestionInprogress = false;
                if (SharedHelper.getOnlineStatus(activity, "onlineStatus").equals(true)) {
                    getRequestStatus();
                }
            }
        }
    }


    private void driverAttendanceRegistration() {
        goToImageIntent(isDocumentType);
    }

    public void goToImageIntent(boolean isDocumentType) {
        isPermissionGivenAlready = true;
        ChooseUserProfile(isDocumentType);
    }

    public void ChooseUserProfile(boolean title) {
        dialog = new Dialog(this);
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
        dialog.setContentView(R.layout.cameraorgalary);
        dialog.setCancelable(false);
        dialog.setCanceledOnTouchOutside(false);
        final View decorView = dialog.getWindow().getDecorView();
        Utiles.StartAnimation(decorView);
        Button camera_btn = dialog.findViewById(R.id.camera_btn);
        TextView title_txt = dialog.findViewById(R.id.title_txt);
        Button gallary_btn = dialog.findViewById(R.id.gallary_btn);
        title_txt.setText(title ? "Please Choose Your Proof Picture" : "Please Verify that is you");
        View.OnClickListener clickListener = view -> {
            switch (view.getId()) {
                case R.id.camera_btn:
                    takePhotoFromCamera();
                    break;
            }
        };
        camera_btn.setOnClickListener(clickListener);
        gallary_btn.setOnClickListener(clickListener);
        if (!isDestroyed() && !isFinishing()) {
            dialog.show();
        }
    }

    private void takePhotoFromCamera() {
        if (permissionManager.userHasPermission(activity)) {
            takePicture();
        } else {
            permissionManager.requestPermission(activity);
        }
    }

    private void takePicture() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        try {
            photoFile = Utiles.createImageFileWith(activity);
            path = photoFile.getAbsolutePath();

            Uri photoURI = FileProvider.getUriForFile(
                    activity,
                    getString(R.string.file_provider_authority),
                    photoFile
            );

            Log.e("responseeeee", "" + path + "////" + photoURI);
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivityForResult(takePictureIntent, 1003);
        } catch (ActivityNotFoundException e) {
            // ✅ Handles devices with no camera app
            Log.e("TakePicture", "No camera app found: " + e.getMessage());
        } catch (IOException ex) {
            Log.e("TakePicture", "File creation failed: " + ex.getMessage());
        }
    }


    private void earningdata() {

        Float rideFare = Float.parseFloat(SharedHelper.getKey(context, "driver_ridefare"));
        txtRideFare.setText(String.format("$ " + rideFare, "%.2f"));

        Float rideTips = Float.parseFloat(SharedHelper.getKey(context, "driver_tips"));
        txtTripsReceived.setText(String.format("$ " + rideTips, "%.2f"));

        Float driverGateway = Float.parseFloat(SharedHelper.getKey(context, "GatewayCharge"));
        txtGatewayCharge.setText(String.format("$ -" + driverGateway, "%.2f"));

        Float driverEarned = Float.parseFloat(SharedHelper.getKey(context, "driver_earned"));
        txtIncome.setText(String.format("$ " + driverEarned, "%.2f"));

        walletBalanceTxt.setText(String.format("$ " + CommonData.walletBalance, "%.2f"));

        Float walletCredition = Float.parseFloat(SharedHelper.getKey(context, "wallet_credition"));
        walletCredits.setText(String.format("$ " + walletCredition, "%.2f"));

        SimpleDateFormat sdf = new SimpleDateFormat("EEEE / dd-MM", Locale.getDefault());
        String todayDate = sdf.format(new Date());
        txtDate.setText(todayDate);

        tvKm.setText(SharedHelper.getKey(context, "perdaykm") + " Miles");
        tvRides.setText(SharedHelper.getKey(context, "perdayrides") + " Rides");
    }

    private void chekNotificationPermission() {
        try {
            NotificationManager notificationManager =
                    (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
            assert notificationManager != null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Objects.requireNonNull(notificationManager).isNotificationPolicyAccessGranted()) {
                if (bottomSheetDialogFragment != null) {
                    bottomSheetDialogFragment.dismiss();
                }
                bottomSheetDialogFragment = new NotificationSoundFragment();
                bottomSheetDialogFragment.show(getSupportFragmentManager(), "show_notification_permission");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("SetTextI18n")
    public void findviewById() {

        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawerFragment = (FragmentDrawer)
                getSupportFragmentManager().findFragmentById(R.id.fragment_navigation_drawer);
        assert drawerFragment != null;
        drawerFragment.setUp(R.id.fragment_navigation_drawer, mDrawerLayout, null);
        drawerFragment.setDrawerListener(this);
        userProfileImage = (ImageView) mDrawerLayout.findViewById(R.id.rider_profile_image);
        txtUserName = (TextView) mDrawerLayout.findViewById(R.id.userName);
        logout_layout = (RelativeLayout) mDrawerLayout.findViewById(R.id.logout_layout);
        txtUserName.setOnClickListener(v -> {
            mDrawerLayout.closeDrawer(GravityCompat.START);
            startActivity(new Intent(context, ProfileActivity.class));
        });
        logout_layout.setOnClickListener(view -> Alertdialog());

        driverId = SharedHelper.getKey(context, "userid");
        System.out.println("enter the driver id" + driverId);
        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        assert mapFragment != null;
        mapView = mapFragment.getView();
        mapFragment.getMapAsync(this);

        CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, activity);
        CircleImageView(SharedHelper.getKey(context, "profile"), profileImg, activity);
        if (SharedHelper.getKey(context, "fname") != null) {
            txtUserName.setText(SharedHelper.getKey(context, "fname") + SharedHelper.getKey(context, "lname"));
        }
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();


        LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;

        try {
            assert lm != null;
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (!gps_enabled) {
            init();
            GPSTurnOnAlert();
        }
        mGoogleApiClient.connect();
    }

    @OnClick({R.id.menu_imgbtn})
    public void onViewClicked() {
        mDrawerLayout.openDrawer(GravityCompat.START);

    }

    private void init() {
        mSettingsClient = LocationServices.getSettingsClient(activity);
        LocationRequest mLocationRequest = new LocationRequest();
        mLocationRequest.setInterval(UPDATE_INTERVAL_IN_MILLISECONDS);
        mLocationRequest.setFastestInterval(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS);
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        builder.addLocationRequest(mLocationRequest);
        mLocationSettingsRequest = builder.build();
        startLocationUpdatess();
    }

    private void startLocationUpdatess() {
        mSettingsClient.checkLocationSettings(mLocationSettingsRequest)
                .addOnSuccessListener(activity, locationSettingsResponse -> {
                    currentLocation();
                    startService();
                })
                .addOnFailureListener(activity, e -> {
                    int statusCode = ((ApiException) e).getStatusCode();
                    switch (statusCode) {
                        case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                            try {
                                ResolvableApiException rae = (ResolvableApiException) e;
                                rae.startResolutionForResult(activity, REQUEST_CHECK_SETTINGS);
                            } catch (IntentSender.SendIntentException sie) {
                            }
                            break;
                        case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                            String errorMessage = "Location settings are inadequate, and cannot be " +
                                    "fixed here. Fix in Settings.";
                    }

                });
    }

    public void getRequestStatus() {
        if (RequestDatabaseReference != null && RequestValueListener != null) {
            RequestDatabaseReference.removeEventListener(RequestValueListener);
            RequestValueListener = null;
        }
        RequestDatabaseReference = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_data").child(driverId + "/request")).getDatabaseReference();
        RequestDatabaseReference.keepSynced(true);
        RequestValueListener = RequestDatabaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    System.out.println("DRIVERS DATA REQUEST::::" + dataSnapshot.child("status").getValue());
                    System.out.println("DRIVERS DATA REQUEST:::: REVIEW:::" + dataSnapshot.child("review").getValue());
                    String tripId = SharedHelper.getKey(context, "trip_id");
                    if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                        if (dataSnapshot.child("status").getValue().equals("1")) {
                            if (!dataSnapshot.child("datetime").getValue().toString().equalsIgnoreCase("0")) {
                                if (imgTextHail.getVisibility() == View.VISIBLE) {
                                    imgTextHail.setVisibility(View.GONE);
                                }
                                earningLyt.setVisibility(View.GONE);
                                supportImgbtn.setVisibility(View.GONE);
                                currentlocationImgbtn.setVisibility(View.GONE);
                                /*if (dataSnapshot.child("review").getValue().toString().equalsIgnoreCase("Accepted")) {
                                    removeAllFragments(FragmentManage);
                                    CLoseDrawer();
                                    wakeupScreen(true);
                                    asynApiCall(Objects.requireNonNull(dataSnapshot.child("request_id").getValue()).toString());
                                } else {*/
                                if (!CommonData.RequestBoolean) {
                                    removeAllFragments(FragmentManage);
                                    CLoseDrawer();
                                    Constants.RequestStart = false;
                                    CommonData.RequestBoolean = true;
                                    FlowFragment = new RequestFragement(dataSnapshot);
                                    SummaryFragment(FlowFragment);
                                    CommonData.requestionInprogress = true;
                                    wakeupScreen(false);
                                    asynApiCall(Objects.requireNonNull(dataSnapshot.child("request_id").getValue()).toString());
                                }
                            }
                        } else if (dataSnapshot.child("status").getValue().equals("2")) {
                            if (imgTextHail.getVisibility() == View.VISIBLE) {
                                imgTextHail.setVisibility(View.GONE);
                            }
                            if (!CommonData.RequestBoolean) {
                                CommonData.RequestBoolean = true;
                                acceptedTripListener();
                            }
                        } else {
                            if (dataSnapshot.child("status").getValue().equals("0")) {
                                if (imgTextHail.getVisibility() == View.GONE) {
                                    imgTextHail.setVisibility(View.GONE);
                                }
                                earningLyt.setVisibility(View.VISIBLE);
                                supportImgbtn.setVisibility(View.VISIBLE);
                                currentlocationImgbtn.setVisibility(View.VISIBLE);
                                onlineOfflineSwitch.setChecked(true);
                                onlineOfflineText.setText(R.string.available);
                                RemoveFragment(FlowFragment);
                                CommonData.RequestBoolean = false;
                                CommonData.isRequestFrom = true;
                                Constants.RequestStart = true;
                                CommonData.requestionInprogress = false;
                                menuImgbtn.setVisibility(View.VISIBLE);
                                SharedHelper.putKey(activity, "trip_id", "null");
                                DriverDetails.setVisibility(View.VISIBLE);
                                CommonData.strDistanceBegin = "totaldistancend";
                                SharedHelper.putKey(context, "strDistanceBegin", "totaldistancend");
                                CommonData.distance = 0;
                                RequestFragement.stopMusicAlert();
                            }
                        }

                    }
                }


            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                new Handler().postDelayed(() -> {
                    Log.d("getRequestStatus", "Retrying getRequestStatus after cancellation...");
                    getRequestStatus();
                }, 3000);
            }
        });
    }

    public void checkPermission() {
        if (Build.VERSION.SDK_INT >= 30) {
            if (ContextCompat.checkSelfPermission(MainActivity.this,
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {

                ActivityCompat.requestPermissions(MainActivity.this,
                        new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION},
                        MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);
            }

        }
    }

    public void startService() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (!Settings.canDrawOverlays(context)) {
                final Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + context.getPackageName()));
                startActivityForResult(intent, CUSTOM_OVERLAY_PERMISSION_REQUEST_CODE);
                return;
            }
        }
        if (!isMyServiceRunning(activity, TripRquestService.class)) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                Intent serviceIntent = new Intent(context, TripRquestService.class);
                serviceIntent.putExtra("already", "first");
                startService(serviceIntent);
            } else {
                Intent serviceIntent = new Intent(context, TripRquestService.class);
                serviceIntent.putExtra("already", "first");
                context.startForegroundService(serviceIntent);
            }
        } else {
            EventBus.getDefault().postSticky(new ServiceWidgetEvent(FloatingViewManager.findCutoutSafeArea(activity)));
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission was granted, yay! Do the task you need to do.
                    startLocationUpdates();
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                        startService(new Intent(context, TripRquestService.class));
                    } else {
                        Intent serviceIntent = new Intent(context, TripRquestService.class);
                        context.startForegroundService(serviceIntent);
                    }

                } else {
                    // permission denied, boo! Disable the functionality that depends on this permission.
                }
            }
            case 100:
                for (int grantResult : grantResults) {
                    if (grantResult == PackageManager.PERMISSION_GRANTED) {
                        if (!isPermissionGivenAlready) {
                            goToImageIntent(isDocumentType);
                        }
                    }
                }
        }
    }

    public void GPSTurnOnAlert() {

        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(Constants.SET_INTERVAL); //5 seconds
        locationRequest.setFastestInterval(Constants.SET_FASTESTINTERVAL); //3 seconds
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);
        builder.setAlwaysShow(true); //this is the key ingredient

        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient, builder.build());
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(@NonNull LocationSettingsResult result) {
                final Status status = result.getStatus();
                final LocationSettingsStates state = result.getLocationSettingsStates();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        currentLocation();
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                            startService(new Intent(context, TripRquestService.class));
                        } else {
                            Intent serviceIntent = new Intent(context, TripRquestService.class);
                            context.startForegroundService(serviceIntent);
                        }
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        // Location settings are not satisfied. But could be fixed by showing the user
                        // a dialog.
                        try {
                            // Show the dialog by calling startResolutionForResult(),
                            // and check the result in onActivityResult().
                            status.startResolutionForResult(MainActivity.this, REQUEST_CHECK_SETTINGS);

                        } catch (IntentSender.SendIntentException e) {
                            // Ignore the error.
                        }
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        // Location settings are not satisfied. However, we have no way to fix the
                        // settings so we won't show the dialog.

                        break;
                }
            }
        });
    }

    protected void startLocationUpdates() {
        checkPermission();
        mGoogleApiClient.connect();
        //LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, this, Looper.getMainLooper());
    }

    @Override
    public void onDrawerItemSelected(View view, int position) {
        switch (position) {
            case 0:
                RemoveRequestListioner();
                Log.e("profilepage", "Profile page");
                startActivity(new Intent(context, ProfileActivity.class));
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 1:
                fragment = new DriverCreditFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);

                break;
            case 2:
                CommonData.Earningdate = "";
                fragment = new YourTripFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);

                break;
            case 3:
                fragment = new RatingFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;

            case 4:
                fragment = new ManageVehiclesFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 5:
                fragment = new ManageVehicleStateFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;

            case 6:
                fragment = new DocumentUploadListFragment("drivers", false);
                strVehicleID = "";
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;

            case 7:
                fragment = new DriverEarningsFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);

                break;
           /* case 7:
                fragment = new ManageVehicleStateFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);

                break;*/
            case 8:
                startActivity(new Intent(context, NotificationActivity.class));
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
//            case 9:
//                fragment = new SubscriptionFragment();
//                moveToFragment(fragment);
//                mDrawerLayout.closeDrawer(GravityCompat.START);
//                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
//
//                break;
           /* case 10:
                fragment = new PaymentTypeFragment();
                moveToFragment(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;*/
        }
    }

    @SuppressLint("GestureBackNavigation")
    @Override
    public void onBackPressed() {
        if (FlowFragment == null) {
            super.onBackPressed();
            CLoseDrawer();
            mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
        }

    }

    private void moveToFragment(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    FragmentManage.beginTransaction().setCustomAnimations(R.anim.slide_in_left, R.anim.slide_out_right)
                            .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

                });

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void FlowFragment(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> FragmentManage.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                        .replace(R.id.containterss, fragment, fragment.getClass().getSimpleName()).commitNowAllowingStateLoss());

            } else {
                callMethodWithDelay(fragment);
            }
        } catch (Exception e) {
            e.printStackTrace();
            callMethodWithDelay(fragment);
        }

    }

    int count = 0;

    public void callMethodWithDelay(Fragment fragment) {
        if (count == 2) {
            count = 0;
        } else {
            count++;
            new Handler().postDelayed(() -> FlowFragment(fragment), 3000);
        }


    }


    private void SummaryFragment(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> FragmentManage.beginTransaction()
                        .replace(R.id.container, fragment, fragment.getClass()
                                .getSimpleName())
                        .addToBackStack(null)
                        .commitAllowingStateLoss());

            } else {

                if (CommonData.RequestBoolean) {
                    fragment.setUserVisibleHint(false);
                }
                CommonData.RequestBoolean = false;
            }
        } catch (Exception e) {
            Toast.makeText(activity, "text", Toast.LENGTH_LONG).show();
            if (CommonData.RequestBoolean) {
                fragment.setUserVisibleHint(false);
            }
            CommonData.RequestBoolean = false;
            e.printStackTrace();
        }
    }

    public void RemoveFragment(Fragment fragment) {
        try {
            Reintialize();
            runOnUiThread(() -> {
                if (fragment != null) {
                    runOnUiThread(() -> FragmentManage.beginTransaction().remove(fragment).commitAllowingStateLoss());

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @OnClick({R.id.driver_online_layout, R.id.change_txt, R.id.stops_imgbtn, R.id.img_textHail, R.id.notification_imgbtn, R.id.currentlocation_imgbtn, R.id.support_imgbtn})
    public void onViewClick(View view) {
        switch (view.getId()) {
            case R.id.driver_online_layout:

                break;
            case R.id.change_txt:
                driverPresenter.getVehcleList(SharedHelper.getKey(context, "userid"), activity);
                break;
            case R.id.stops_imgbtn:
                if (response != null) {
                    if (bottomSheetDialogFragment != null) {
                        bottomSheetDialogFragment.dismiss();
                    }
                    bottomSheetDialogFragment = new MultipleStopFragment(response);
                    bottomSheetDialogFragment.show(getSupportFragmentManager(), "mutliple_Stop");
                }
                break;
            case R.id.img_textHail:
                startActivity(new Intent(activity, Texi_Hail_Activity.class));
                break;
            case R.id.notification_imgbtn:
                startActivity(new Intent(context, NotificationActivity.class));
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case R.id.currentlocation_imgbtn:
                mCurrentLocation = getFusedLocation();
                if (mCurrentLocation != null) {
                    LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(latLng)                              // Sets the center of the map to current location
                            .zoom(Constants.MAP_ZOOM_SIZE)
                            .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                            .build();

                    mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                }
                break;
            case R.id.support_imgbtn:
                if (SharedHelper.getKey(activity, "support_num") != null && !SharedHelper.getKey(activity, "support_num").isEmpty()) {
                    Intent intent1 = new Intent(Intent.ACTION_DIAL);
                    intent1.setData(Uri.parse("tel:" + SharedHelper.getKey(activity, "support_num")));
                    if (intent1.resolveActivity(activity.getPackageManager()) != null) {
                        activity.startActivity(intent1);
                    }
                } else {
                    Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
                }
                break;
        }

    }

    private void dismissDialog() {
        try {
            if (bottomSheetDialogFragment != null && bottomSheetDialogFragment.isAdded()) {
                bottomSheetDialogFragment.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        LatLng curPos;
        float curPosBearing;
        if (mCurrentLocation == null && location != null) {
            getAddress(new LatLng(location.getLatitude(), location.getLongitude()));
        }
        CommonData.CurrentLocation = location;

        mCurrentLocation = location;
        if (mMapLocationListener != null) {
            mMapLocationListener.onLocationChanged(location);
        }


        if (mCurrentLocation != null) {
            curPos = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
            curPosBearing = mCurrentLocation.getBearing();
        } else {
            curPos = new LatLng(location.getLatitude(), location.getLongitude());
            curPosBearing = location.getBearing();
        }
        mCurrentLocation = location;
        updateLocationToFirebase(mCurrentLocation);


        if (mMap != null) {
            try {
                zoomCameraToPosition(curPos);
                if (currentLocMarker == null) {
                    currentLocMarker = mMap.addMarker(new MarkerOptions()
                            .icon(mapCarIcon)
                            .position(curPos)
                            .flat(true));
                    currentLocMarker.setAnchor(0.5f, 0.5f);
                    currentLocMarker.setRotation(curPosBearing);
                } else {
                    if (mCurrentLocation.getBearing() != 0.0)
                        previousBearing = mCurrentLocation.getBearing();
                    if (prevLatLng != new LatLng(0, 0)) {
                        if (!(curPos.equals(prevLatLng))) {
                            double[] startValues = new double[]{prevLatLng.latitude, prevLatLng.longitude};
                            double[] endValues = new double[]{curPos.latitude, curPos.longitude};
                            animateMarkerTo(currentLocMarker, startValues, endValues, mCurrentLocation.getBearing());
                        } else {
                            if (mCurrentLocation.getBearing() == 0.0)
                                currentLocMarker.setRotation(previousBearing);
                            else
                                currentLocMarker.setRotation(mCurrentLocation.getBearing());
                        }
                    } else {
                        currentLocMarker.setPosition(curPos);
                        currentLocMarker.setRotation(mCurrentLocation.getBearing());
                    }

                    prevLatLng = new LatLng(curPos.latitude, curPos.longitude);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }

    @SuppressLint("RestrictedApi")
    @Override
    public void onConnected(@Nullable Bundle bundle) {


    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    @Override
    public void activate(OnLocationChangedListener onLocationChangedListener) {
        mMapLocationListener = onLocationChangedListener;
    }

    @Override
    public void deactivate() {
        mMapLocationListener = null;
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        mMap = googleMap;
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        Bitmap originalBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic_mini_1);
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(
                originalBitmap,
                40,
                70,
                false
        );
        mapCarIcon = BitmapDescriptorFactory.fromBitmap(resizedBitmap);

        mMap.getMinZoomLevel();
        if (mapView != null &&
                mapView.findViewById(Integer.parseInt("1")) != null) {
            View locationButton = ((View) mapView.findViewById(Integer.parseInt("1")).getParent()).findViewById(Integer.parseInt("2"));
            RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams)
                    locationButton.getLayoutParams();
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
            layoutParams.setMargins(30, 180, 0, 0);
        }
        checkPermission();
        mGoogleApiClient.connect();
        currentLocation();
    }

    private void getMapImage() {
        try {
            mMap.setOnMapLoadedCallback(() -> {
                // Make a snapshot when map's done loading
                mMap.snapshot(bitmap -> {
                    mapBitmap = bitmap;
                    if (mapBitmap != null) {
                        SharedHelper.putKey(context, "mapImage", BitMapToString(mapBitmap));
                    }
                });
            });
        } catch (Exception e) {
            System.out.println("Exception" + e);
        }
    }

    public void googleIcon() {
        //  RelativeLayout.LayoutParams lp = (RelativeLayout.LayoutParams) DriverDetails.getLayoutParams();

        View googleLogo = mapView.findViewWithTag("GoogleWatermark");
        RelativeLayout.LayoutParams glLayoutParams = (RelativeLayout.LayoutParams) googleLogo.getLayoutParams();
        // glLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, 0);
        //    glLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, 0);
        // glLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_START, 0);
        //  glLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        //glLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
        glLayoutParams.addRule(RelativeLayout.ABOVE, R.id.Driver_details);
        googleLogo.setLayoutParams(glLayoutParams);

    }

    public void currentLocation() {
        mCurrentLocation = getFusedLocation();
        if (mCurrentLocation != null) {
            RemovePolyline();
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
            getAddress(latLng);
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE_ONTRIP)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();
            if (mMap != null) {
                mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                if (currentLocMarker == null) {
                    currentLocMarker = mMap.addMarker(new MarkerOptions()
                            .icon(mapCarIcon)
                            .position(latLng)
                            .flat(true)
                            .anchor(0.5f, 0.5f)
                            .rotation(mCurrentLocation.getBearing()));
                } else {
                    currentLocMarker.setPosition(latLng);
                }
            }
            getMapImage();
        }
    }

    @Override
    public void googlePolylineSuccess(Response<RoutesModel> resultsResponse) {
        if (resultsResponse == null || resultsResponse.body() == null) return;
        RoutesModel model = resultsResponse.body();
        System.out.println("DIRECTION STATUS:::" + model.getStatus());
        if (!"OK".equalsIgnoreCase(model.getStatus())) {
            return;
        }
        if (mCurrentLocation != null && destLocation != null) {
            ArrayList<LatLng> directionPositionList = new ArrayList<>();
            RoutesModel.Route route = model.getRoutes().get(0);
            List<RoutesModel.Route.Leg> legList = route.getLegs();
            for (RoutesModel.Route.Leg leg : legList) {
                for (RoutesModel.Route.Leg.Step step : leg.getSteps()) {
                    String polyline = step.getPolyline().getPoints();
                    directionPositionList.addAll(decodePolyline(polyline));
                }
            }
            onDirectionSuccessMarkerPlacing(directionPositionList, legList);
        }
    }

    public List<LatLng> decodePolyline(String encoded) {
        List<LatLng> poly = new ArrayList<>();
        int index = 0, len = encoded.length();
        int lat = 0, lng = 0;
        while (index < len) {
            int b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlat = ((result & 1) != 0) ? ~(result >> 1) : (result >> 1);
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlng = ((result & 1) != 0) ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            LatLng p = new LatLng(((double) lat / 1E5), ((double) lng / 1E5));
            poly.add(p);
        }

        return poly;
    }


    @Override
    public void googlePolylineFailure(Response<RoutesModel> response) {

    }


    public void onDirectionSuccessMarkerPlacing(ArrayList<LatLng> directionPositionList, List<RoutesModel.Route.Leg> legList) {
        LatLng curPos = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());

        Bitmap originalBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_stop);
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(
                originalBitmap,
                90,
                90,
                false
        );
        for (int i = 0; i < legList.size(); i++) {
            RoutesModel.Route.Leg leg = legList.get(i);
            if (i != 0) {
                RoutesModel.Route.Leg.StartLocation startLoc = leg.getStartLocation();
                mMap.addMarker(new MarkerOptions()
                        .position(new LatLng(startLoc.getLat(), startLoc.getLng()))
                        .icon(BitmapDescriptorFactory.fromBitmap(resizedBitmap)));
            }
        }

        if (curPos.latitude != 0 && curPos.longitude != 0) {
            zoomCameraToPosition(curPos);
        }
        if (routePolyline != null) {
            routePolyline.setPoints(directionPositionList);
        } else {
            routePolyline = mMap.addPolyline(DirectionConverter.createPolyline(this, directionPositionList, 5, Color.BLUE));
            routePolyline.setVisible(true);
        }
        if (currentLocMarker != null && currentLocMarker.getPosition() != null) {
            if (currentLocMarker.getPosition().latitude != 0 && currentLocMarker.getPosition().longitude != 0) {
                if (mCurrentLocation.getBearing() != 0.0) {
                    final CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(currentLocMarker.getPosition())
                            .bearing(mCurrentLocation.getBearing())
                            .tilt(0)
                            .build();
                    mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                    CameraUpdate center = CameraUpdateFactory.newLatLng(curPos);
                    mMap.animateCamera(center, 400, null);
                } else {
                    final CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(currentLocMarker.getPosition())
                            .bearing(previousBearing)
                            .tilt(0)
                            .build();
                    mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                    CameraUpdate center = CameraUpdateFactory.newLatLng(curPos);
                    mMap.animateCamera(center, 400, null);
                }
            }
        }

        try {
            if (Constants.Previousstatus.matches("3")) {
                if (pickUPrDropMarker != null)
                    pickUPrDropMarker.remove();
                // before loop:
                System.out.println("destLocation location ===>" + destLocation);
                pickUPrDropMarker = mMap.addMarker(new MarkerOptions().position(destLocation).icon(BitmapDescriptorFactory.fromResource(R.mipmap.ub__ic_pin_dropoff)));
                pickUPrDropMarker.setVisible(true);

            } else {
                if (pickUPrDropMarker != null)
                    pickUPrDropMarker.remove();
                System.out.println("destLocation location ===>" + destLocation);
                pickUPrDropMarker = mMap.addMarker(new MarkerOptions().position(destLocation).icon(BitmapDescriptorFactory.fromResource(R.mipmap.ub__ic_pin_pickup)));
                pickUPrDropMarker.setVisible(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    @SuppressLint({"NewApi", "WakelockTimeout"})
    private void wakeupScreen(Boolean isSafeRide) {
        if (windows != null) {
            windows.addFlags(
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
            );
        }

        PowerManager powerManager = (PowerManager) getSystemService(Service.POWER_SERVICE);
        if (powerManager != null) {
            PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                    PowerManager.FULL_WAKE_LOCK |
                            PowerManager.ACQUIRE_CAUSES_WAKEUP |
                            PowerManager.ON_AFTER_RELEASE,
                    "MyApp:WakeLock");
            wakeLock.acquire(10 * 1000L);
            new Handler().postDelayed(() -> {
                if (wakeLock.isHeld()) wakeLock.release();
            }, 10 * 1000L);
        }
        if (!isSafeRide) {
            RequestFragement.startMusicAlert();
        }
        if (onResumeCalled) {
            // App is already in foreground — RequestFragment is being shown
            return;
        } else if (!isDestroyed() && !isFinishing() && !onResumeCalled) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            startActivity(intent);
        } else {
            // App is fully destroyed — rebuild from SplashActivity
            Intent intent = new Intent(context, SplashActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP |
                    Intent.FLAG_ACTIVITY_CLEAR_TASK |
                    Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }
    }


    public void CLoseDrawer() {
        if (mDrawerLayout.isDrawerOpen(GravityCompat.START)) {
            mDrawerLayout.closeDrawer(GravityCompat.START);
        }
    }

    public void acceptedTripListener() {
        if (acceptedTripDatabase != null) {
            acceptedTripDatabase = null;
        }
        acceptedTripDatabase = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("accept").child("trip_id");
        acceptedTripDatabase.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    if (dataSnapshot.getValue().toString().isEmpty() || dataSnapshot.getValue().toString().equalsIgnoreCase("0")) {
                        return;
                    } else {
                        RequestFragement.stopMusicAlert();
                        SharedHelper.putKey(context, "trip_id", dataSnapshot.getValue().toString());
                        FirebaseTripFlow();
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("tage", "error respone" + databaseError.getMessage());
            }
        });
    }

    public Location getFusedLocation() {

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return null;
        }

        mCurrentLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
        if (mCurrentLocation == null) {
            locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
            if (locationManager != null) {
                try {
                    locationManager.removeUpdates(this);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER,
                        Constants.MIN_TIME_BW_UPDATES,
                        Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                }
                if (mCurrentLocation == null) {
                    locationManager.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            Constants.MIN_TIME_BW_UPDATES,
                            Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                    if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                        mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    }

                }
            }
        }

        return mCurrentLocation;
    }

    public void zoomCameraToPosition(LatLng curPos) {
        boolean contains = mMap.getProjection().getVisibleRegion().latLngBounds.contains(curPos);
        if (!contains) {
            float zoomPosition;
            String tripId = SharedHelper.getKey(context, "trip_id");
            if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                zoomPosition = Constants.MAP_ZOOM_SIZE;
            } else {
                zoomPosition = Constants.MAP_ZOOM_SIZE_ONTRIP;
            }


            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(curPos)                              // Sets the center of the map to current location
                    .zoom(zoomPosition)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();
            mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        for (Fragment fragment : fragmentManager.getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
        switch (requestCode) {
            case REQUEST_CHECK_SETTINGS:
                switch (resultCode) {
                    case Activity.RESULT_OK:
                        // All required changes were successfully made

                        new Handler().postDelayed(new Runnable() {

                            /*
                             * Showing splash screen with a timer. This will be useful when you
                             * want to show case your app logo / company
                             */

                            @Override
                            public void run() {
                                // This method will be executed once the timer is over
                                mCurrentLocation = getFusedLocation();

                                if (mCurrentLocation != null) {
                                    zoomCameraToPosition(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
                                }

                            }
                        }, Constants.GET_ZOOM_TIME);

                        break;

                    case Activity.RESULT_CANCELED:

                        // The user was asked to change settings, but chose not to
                        Toast.makeText(this, "Location not enabled, user cancelled.", Toast.LENGTH_SHORT).show();
                        finish();
                        break;

                    default:
                        break;
                }
                break;
            case CUSTOM_OVERLAY_PERMISSION_REQUEST_CODE:
                startService();
                break;
            case 1001:
                if (resultCode == Activity.RESULT_CANCELED) {
                }
                break;
            case 1003:
                if (resultCode == Activity.RESULT_OK) {
                    if (path != null) {
                        uriprofile = new File(path);
                        callAttendance(uriprofile);
                        Log.e("responseddddd", "" + path);
                    } else {
                        System.out.println("FAILED IMAGE:::" + resultCode);
                    }
                }
                break;
            case BATTERY_OPTIMIZATION_REQUEST_CODE:
                PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
                if (pm != null && pm.isIgnoringBatteryOptimizations(getPackageName())) {
                    // User granted — battery optimization is now disabled for your app
                } else {
                    requestBatteryOptimizationExemption();
                }

        }
    }

    private void callAttendance(File uriprofile) {
        MultipartBody.Part filePart = null;
        if (uriprofile != null) {
            filePart = MultipartBody.Part.createFormData("identityImg", uriprofile.getName(), RequestBody.create(MediaType.parse(getMimeType(uriprofile.toString())), uriprofile));
            Utiles.ShownewLoader(activity);
            driverPresenter.callAttendance(filePart, activity);

        }

    }

    // Animation handler for old APIs without animation support
    private void animateMarkerTo(final Marker marker, double[] startValues, double[] endValues, final float bearing) {


        ValueAnimator latLngAnimator = ValueAnimator.ofObject(new DoubleArrayEvaluator(), startValues, endValues);
        latLngAnimator.setDuration(1300);
        latLngAnimator.setInterpolator(new DecelerateInterpolator());
        latLngAnimator.addUpdateListener(animation -> {
            double[] animatedValue = (double[]) animation.getAnimatedValue();
            marker.setPosition(new LatLng(animatedValue[0], animatedValue[1]));
        });
        latLngAnimator.start();
        float rotate = getRotate(new LatLng(startValues[0], startValues[1]), new LatLng(endValues[0], endValues[1]));
        if (mCurrentLocation.getBearing() == 0.0)
            marker.setRotation(previousBearing);
        else
            marker.setRotation(mCurrentLocation.getBearing());
    }

    private static float getRotate(LatLng curPos, LatLng nextPos) {
        double x1 = curPos.latitude;
        double x2 = nextPos.latitude;
        double y1 = curPos.longitude;
        double y2 = nextPos.longitude;

        return (float) (Math.atan2(y2 - y1, x2 - x1) / Math.PI * 180);
    }

    @Override
    public void TripFragment() {
        runOnUiThread(() -> {
            driverOnlineLayout.setVisibility(View.GONE);
            RemoveFragment(FlowFragment);
            FlowFragment = new TripFlowFragment("empty", mCurrentLocation, safeRide);
            FlowFragment(FlowFragment);
            RequestFragement.stopMusicAlert();
            FirebaseTripFlow();
            remogeoFire();
        });

    }

    @Override
    public void summaryFragment() {
        CommonData.strDistanceBegin = "totaldistancend";

        CommonData.p = 1;
        CommonData.lStart = null;
        CommonData.lEnd = null;
        String starttime = SharedHelper.getKey(context, "starttime");
        String endtime = getCurrentTime();
        Integer duration = 0;
        @SuppressLint("SimpleDateFormat") DateFormat format = new SimpleDateFormat("HH:mm");//24 Hour Format

        Date d1;
        Date d2;
        try {
            d1 = format.parse(starttime);
            d2 = format.parse(endtime);

            long diff = d2.getTime() - d1.getTime();
            long diffMinutes = diff / (60 * 1000);
            duration = (int) (long) diffMinutes;
        } catch (Exception e) {
            e.printStackTrace();
        }
        mCurrentLocation = getFusedLocation();
        FareCaluationModel fareCaluationModel = new FareCaluationModel();
        fareCaluationModel.setDistance(CommonData.strTotalDistance);
        fareCaluationModel.setWaitingTime(String.valueOf(CommonData.stopWatch.getElapsedTimeSecs() + 60 * CommonData.stopWatch.getElapsedTimeMin() + 60 * 60 * CommonData.stopWatch.getElapsedTimeHour()));
        fareCaluationModel.setDuration(String.valueOf(CommonData.stopWatch.getElapsedTimeMin() + 60 * CommonData.stopWatch.getElapsedTimeHour()));
        fareCaluationModel.setmCurrentLocation(mCurrentLocation);

        RemoveFragment(FlowFragment);
        RemovePolyline();
        FlowFragment = new SummaryFragment(fareCaluationModel, "Api");
        moveToFragment(FlowFragment);
        CommonData.distance = 0;

    }

    @Override
    public void ClearFragment() {
        Notrip();
        mMap.clear();
        currentLocMarker = null;
        currentLocation();
        RemovePolyline();


    }

    @Override
    public void CallCancelFragment() {
        SummaryFragment(new CancelFragment());
    }

    @Override
    public void ClearAllFragment() {
        removeAllFragments(FragmentManage);
        Notrip();
        mMap.clear();
        currentLocMarker = null;
        currentLocation();
        RemovePolyline();
    }

    public void Notrip() {
        runOnUiThread(() -> {
            driverOnlineLayout.setVisibility(View.VISIBLE);
            earningLyt.setVisibility(View.VISIBLE);
            supportImgbtn.setVisibility(View.VISIBLE);
            currentlocationImgbtn.setVisibility(View.VISIBLE);
            menuImgbtn.setVisibility(View.VISIBLE);
            RemoveFragment(FlowFragment);
            FlowFragment = null;
            destLocation = null;
        });

        //currentLocation();

    }

    public void RemovePolyline() {
        destLocation = null;
        runOnUiThread(() -> {
            try {
                if (routePolyline != null) {
                    routePolyline.setVisible(false);
                    routePolyline.remove();
                    routePolyline = null;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            try {
                if (pickUPrDropMarker != null) {
                    pickUPrDropMarker.setVisible(false);
                    pickUPrDropMarker.remove();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });


    }

    @Override
    public void FlowDetails(Response<TripFlowModel> Response) {

        this.response = Response;
        if (!multiLocations.isEmpty()) {
            multiLocations.clear();
        }

        if (!Constants.Previousstatus.equalsIgnoreCase("4") && !Constants.Previousstatus.equalsIgnoreCase("5")) {
            assert Response.body() != null;
            if (Response.body().getStatus().equalsIgnoreCase("Start Trip")) {
                if (SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("daily") || SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("outstation") || SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("hail")) {
                    destLocation = new LatLng(Double.parseDouble(Response.body().getPickupdetails().getEndcoords().get(1)), Double.parseDouble(Response.body().getPickupdetails().getEndcoords().get(0)));
                    final int[] i = {0};
                    assert Response.body() != null;
                    if (Response.body().getMultiLocation().isEmpty()) {
                        DrawablePolyline();
                    } else {
                        if (stopsImgbtn.getVisibility() == View.GONE) {
                            stopsImgbtn.setVisibility(View.VISIBLE);
                        }
                    }
                    Observable.fromIterable(Response.body().getMultiLocation())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribeOn(Schedulers.io())
                            .subscribe(new Observer<TripFlowModel.MultiLocation>() {
                                @Override
                                public void onSubscribe(Disposable d) {
                                    disposable.add(d);
                                }

                                @Override
                                public void onNext(TripFlowModel.MultiLocation multipleAddressModel) {
                                    if (i[0] != 0 && i[0] != Response.body().getMultiLocation().size() - 1) {
                                        if (!multipleAddressModel.getStrAddress().isEmpty()) {
                                            multiLocations.add(new LatLng(Double.parseDouble(multipleAddressModel.getDoubleLat()), Double.parseDouble(multipleAddressModel.getDoubleLng())));
                                        }
                                    }
                                    i[0]++;
                                }

                                @Override
                                public void onError(Throwable e) {

                                }

                                @Override
                                public void onComplete() {
                                    if (!multiLocations.isEmpty()) {
                                        if (Constants.Previousstatus.equalsIgnoreCase("3") && stopsImgbtn.getVisibility() == View.GONE) {
                                            stopsImgbtn.setVisibility(View.VISIBLE);
                                        }
                                        DrawablePolyline();
                                    }

                                }
                            });

                } else {
                    try {
                        if (routePolyline != null) {
                            routePolyline.setVisible(false);
                            routePolyline.remove();
                            routePolyline = null;
                        }
                        if (pickUPrDropMarker != null) {
                            pickUPrDropMarker.remove();
                            pickUPrDropMarker = null;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }

            } else {
                destLocation = new LatLng(Double.parseDouble(Response.body().getPickupdetails().getStartcoords().get(1)), Double.parseDouble(Response.body().getPickupdetails().getStartcoords().get(0)));
                DrawablePolyline();
            }
        }

    }

    public void DrawablePolyline() {
        if (mCurrentLocation != null) {
            if (Constants.Previousstatus.equalsIgnoreCase("3")) {
                if (multiLocations.isEmpty()) {
                    googlePolylinePresenter.getDrawPolyline(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), destLocation, null);
                } else {
                    googlePolylinePresenter.getDrawPolyline(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), destLocation, multiLocations);
                }
            } else {
                googlePolylinePresenter.getDrawPolyline(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), destLocation, null);
            }
        }
    }

    @Override
    public void OnlineSuccess(Response<OnlineOflline> response, String status) {
        assert response.body() != null;
        if (response.body().getSuccess()) {
            if (Objects.equals(status, "1")) {
                onlineOfflineText.setText(R.string.available);
                onlineOfflineSwitch.setChecked(true);
            } else {
                onlineOfflineText.setText(R.string.unavailable);
                onlineOfflineSwitch.setChecked(false);
            }
            FirebaseDatabase.getInstance().getReference().child("drivers_data").child(driverId).child("online_status").setValue(status);
        } else {
            Utiles.CommonToast(activity, response.body().getMessage());
            if (Objects.equals(status, "0")) {
                onlineOfflineText.setText(R.string.available);
                onlineOfflineSwitch.setChecked(true);
            } else {
                onlineOfflineText.setText(R.string.unavailable);
                onlineOfflineSwitch.setChecked(false);
            }
        }
    }


    @Override
    public void OnlineFailed(Response<OnlineOflline> response, String status) {

        try {
            String Message = response.errorBody().string();
            Utiles.ShowError(Message, context, onlineOfflineSwitch);
        } catch (IOException e) {
            Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
        }
        if (Objects.equals(status, "0")) {
            onlineOfflineText.setText(R.string.available);
            onlineOfflineSwitch.setChecked(true);
        } else {
            onlineOfflineText.setText(R.string.unavailable);
            onlineOfflineSwitch.setChecked(false);
        }
    }

    @Override
    public void VehicleListsuccessFully(Response<List<ListVehicleModel>> response) {
        vehicleModels.clear();
        assert response.body() != null;
        vehicleModels.addAll(response.body());
        alertChange();
    }

    @Override
    public void VehicleListFailure(Response<List<ListVehicleModel>> response) {
        displayMessage(getCurrentFocus(), context, activity.getResources().getString(R.string.something_went_wrong));
    }

    @Override
    public void AttendanceSuccess(Response<AttendanceModel> response) {
        try {
            if (response.body().getSuccess()) {
                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                    Toast.makeText(context, "Attendance Success", Toast.LENGTH_SHORT).show();
                    OnlineOfflinePresenterCall("1");
                }
            } else {
                Toast.makeText(context, response.body().getMessage(), Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
            }
        }
    }

    @Override
    public void AttendanceFailed(Response<AttendanceModel> response) {

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void UpdateVehicle(ListVehicleModel listVehicleModel) {
        UpdateVehicledIFirebase(listVehicleModel.getId());
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (VehicleDialog != null) {
                    try {
                        VehicleDialog.dismiss();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        SharedHelper.putKey(context, "vehicleId", listVehicleModel.getId());
        SharedHelper.putKey(context, "vmake", listVehicleModel.getMakename());
        SharedHelper.putKey(context, "vmodel", listVehicleModel.getModel());
        SharedHelper.putKey(context, "numplate", listVehicleModel.getLicence());
        SharedHelper.putKey(context, "vehicle_type", listVehicleModel.getVehicletype());
        HashMap<String, String> map = new HashMap<>();
        map.put("makeid", listVehicleModel.getId());
        map.put("service", "");
        driverPresenter.UpdateVicle(map, activity);
        categoryModelTxt.setText(Nullpointer(listVehicleModel.getMakename()) + " " + Nullpointer(listVehicleModel.getModel()));
        serviceTypeTxt.setText(SharedHelper.getKey(context, "vehicle_type"));
    }

    public void UpdateVehicledIFirebase(String vehicleID) {
        DatabaseReference Driverdata = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("vehicle_id", vehicleID);
        Driverdata.updateChildren(map);
        getVehicleCategory(vehicleID);
    }

    public void getVehicleCategory(final String VehicleID) {
        if (driverId != null) {
            if (CategoryDatabase != null && CategoryValueEvent != null) {
                CategoryDatabase.removeEventListener(CategoryValueEvent);
                CategoryValueEvent = null;
            }
            CategoryDatabase = FirebaseDatabase.getInstance().getReference().child("vehicle_list").child(driverId).child(VehicleID);
            CategoryValueEvent = CategoryDatabase.addValueEventListener(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {

                    if (dataSnapshot.getValue() != null && !CommonData.requestionInprogress) {
                        DataSnapshot objects = dataSnapshot.child("category");
                        Object status = dataSnapshot.child("status").getValue();

                        if (status.toString().equals("1")) {
                            mGoogleApiClient.connect();
                            remogeoFire();
                            arrayCategory.clear();
                            for (DataSnapshot dataSnapshot1 : objects.getChildren()) {
                                if (!arrayCategory.contains(objects.getKey())) {
                                    arrayCategory.add(dataSnapshot1.getKey());
                                }
                            }
                        } else {
                            remogeoFire();
                            arrayCategory.clear();
                            if (status.toString().equals("0")) {
                                showdialog("Your vehicle Proof status Pending");
                                proostatus.setVisibility(View.VISIBLE);
                                SharedHelper.putOnline(activity, "onlineStatus", onlinestatus);
                                proofstatus = false;
                                onlineOfflineSwitch.setEnabled(false);
                                onlineOfflineSwitch.setChecked(false);
                            }
                        }
                        SharedHelper.setCategory(activity, "categorylist", arrayCategory);
                        updateLocationToFirebase(mCurrentLocation);
                    }

                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {
                    new Handler().postDelayed(() -> {
                        Log.d("getVehicleCategory", "Retrying getVehicleCategory after cancellation...");
                        getVehicleCategory(SharedHelper.getKey(context, "vehicleId"));
                    }, 3000);
                }
            });
        }

    }

    @Override
    public void onTick(String time) {

    }

    @Override
    public void geocoderOnSucessful(GeocoderModel geocoderModel) {
        try {
            if (geocoderModel.getResults() != null && !geocoderModel.getResults().isEmpty()) {
                for (AddressComponent addressComponent : geocoderModel.getResults().get(0).getAddressComponents()) {
                    if (addressComponent.getTypes().get(0).equalsIgnoreCase("administrative_area_level_2")) {
                        callPolygon(addressComponent.getShortName());
                    }

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void geocoderOnFailure(Throwable throwable) {

    }

    @Override
    public void SuccessPolygon(List<LatLng> latLngs) {
        PolyGonData.addAll(latLngs);
        setPolygon(latLngs);
    }


    private class DoubleArrayEvaluator implements TypeEvaluator<double[]> {

        private double[] mArray;

        /**
         * Create a DoubleArrayEvaluator that does not reuse the animated value. Care must be taken
         * when using this option because on every evaluation a new <code>double[]</code> will be
         * allocated.
         *
         * @see #DoubleArrayEvaluator(double[])
         */
        DoubleArrayEvaluator() {
        }

        /**
         * Create a DoubleArrayEvaluator that reuses <code>reuseArray</code> for every evaluate() call.
         * Caution must be taken to ensure that the value returned from
         * {@link ValueAnimator#getAnimatedValue()} is not cached, modified, or
         * used across threads. The value will be modified on each <code>evaluate()</code> call.
         *
         * @param reuseArray The array to modify and return from <code>evaluate</code>.
         */
        DoubleArrayEvaluator(double[] reuseArray) {
            mArray = reuseArray;
        }

        /**
         * Interpolates the value at each index by the fraction. If
         * {@link #DoubleArrayEvaluator(double[])} was used to construct this object,
         * <code>reuseArray</code> will be returned, otherwise a new <code>double[]</code>
         * will be returned.
         *
         * @param fraction   The fraction from the starting to the ending values
         * @param startValue The start value.
         * @param endValue   The end value.
         * @return A <code>double[]</code> where each element is an interpolation between
         * the same index in startValue and endValue.
         */
        @Override
        public double[] evaluate(float fraction, double[] startValue, double[] endValue) {
            double[] array = mArray;
            if (array == null) {
                array = new double[startValue.length];
            }

            for (int i = 0; i < array.length; i++) {
                double start = startValue[i];
                double end = endValue[i];
                array[i] = start + (fraction * (end - start));
            }
            return array;
        }
    }

    public void updateLocationToFirebase(Location location) {
        try {
            for (String category : arrayCategory) {
                SharedHelper.putKey(context, "category", category);
                String tripId = SharedHelper.getKey(context, "trip_id");
                if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child(category.toLowerCase()));
                } else {
                    geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child("trip_location"));
                }

                geofire(location, geoFire);
            }
            if (mCurrentLocation != null) {
                if (starLocation == null) {
                    starLocation = mCurrentLocation;
                    EndLocation = mCurrentLocation;

                } else {
                    starLocation = mCurrentLocation;
                }
                double distanceInKiloMeters = (starLocation).distanceTo(EndLocation) / 1000; // as distance is in meter
                if (distanceInKiloMeters >= 0.2 | CommonData.isFistTime) {
                    CommonData.isFistTime = false;
                    EndLocation = starLocation;
                    if (onlinestatus) {
                        upDateLocationPresnter("1", new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));

                    } else {
                        upDateLocationPresnter("0", new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));

                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void remogeoFire() {
        try {
            if (!CommonData.RequestBoolean) {
                if (mGoogleApiClient.isConnected()) {
                    mGoogleApiClient.disconnect();
                }
                if (arrayCategory != null && !arrayCategory.isEmpty()) {
                    for (String category : arrayCategory) {
                        geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child(category.toLowerCase()));
                        geoFire.removeLocation(driverId);

                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    public Location LatLngToLocation(String locatin, Double lat, Double lng) {
        final Location location = new Location(locatin);
        location.setLatitude(lat);
        location.setLongitude(lng);
        return location;
    }

    public void geofire(Location location, GeoFire geoFire) {
        if (driverId != null && !driverId.equalsIgnoreCase("null")) {
            mCurrentLocation = location;
            if (mCurrentLocation != null) {
                if (proofstatus && onlinestatus) {
                    geoFire.setLocation(driverId, new GeoLocation(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), previousBearing, (key, error) -> {
                    });
                } else {

                    geoFire.offlineLocation(driverId, new GeoLocation(0.0, 0.0), new GeoFire.CompletionListener() {
                        @Override
                        public void onComplete(String key, DatabaseError error) {
                        }
                    });
                }


            }
        }

    }

    @Override
    protected void onStart() {
        super.onStart();
        Constants.RquestScreen = false;
        onResumeCalled = true;
        if (!mGoogleApiClient.isConnected()) {
            mGoogleApiClient.connect();
        }
        String tripId = SharedHelper.getKey(context, "trip_id");
        if (tripId != null && !tripId.equalsIgnoreCase("null") && !tripId.isEmpty()) {
            FirebaseTripFlow();
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onResume() {
        super.onResume();
        Constants.RquestScreen = false;
        onResumeCalled = true;
        requestBatteryOptimizationExemption();
        DriverProofstatus();
        String tripId = SharedHelper.getKey(context, "trip_id");
        if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
            if (!CommonData.requestionInprogress) {
                CommonData.RequestBoolean = false;
            }
            if (SharedHelper.getOnlineStatus(activity, "onlineStatus").equals(true)) {
                getRequestStatus();
            }
        }
        if (!mGoogleApiClient.isConnected()) {
            mGoogleApiClient.connect();
        }
        logout_layout.setEnabled(true);
        logout_layout.setClickable(true);
        CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, activity);
        CircleImageView(SharedHelper.getKey(context, "profile"), profileImg, activity);
        if (SharedHelper.getKey(context, "fname") != null) {
            txtUserName.setText(SharedHelper.getKey(context, "fname") + " " + SharedHelper.getKey(context, "lname"));
            plateTxt.setText(SharedHelper.getKey(context, "fname") + " " + SharedHelper.getKey(context, "lname") + " (" + SharedHelper.getKey(context, "drivercode") + ")");
        }
        if (SharedHelper.getKey(context, "driver_earned") != null) {
            String s = SharedHelper.getKey(context, "driver_earned");
            Float f = Float.parseFloat(s);
            tvKm.setText(SharedHelper.getKey(context, "perdaykm") + " mile");
            tvRides.setText(SharedHelper.getKey(context, "perdayrides") + " Rides");
        }

        try {
            registerReceiver(networkChangeReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        Constants.RquestScreen = true;
        try {
            unregisterReceiver(networkChangeReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        Constants.RquestScreen = true;
        onResumeCalled = false;
    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onRestart() {
        super.onRestart();
        onResumeCalled = true;
        DriverProofstatus();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Constants.RquestScreen = true;
        onResumeCalled = false;
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
        if (mGoogleApiClient.isConnected()) {
            mGoogleApiClient.disconnect();
        }
        try {
            if (alert11 != null && alert11.isShowing()) {
                alert11.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Constants.Previousstatus = "0";
        dismissDialog();
    }

    public static void RemoveRequestListioner() {
        if (RequestValueListener != null) {
            RequestDatabaseReference.removeEventListener(RequestValueListener);
        }
    }

    public void alertChange() {
        final LayoutInflater inflater = (LayoutInflater) this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        assert inflater != null;
        View layout = inflater.inflate(R.layout.alert_change, null);

        TextView manage_txt = (TextView) layout.findViewById(R.id.manage_txt);
        TextView txt_add_new = (TextView) layout.findViewById(R.id.txt_add_new);
        vehicle_list = layout.findViewById(R.id.vehicle_list);

        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));

        final AlertDialog.Builder alert = new AlertDialog.Builder(this);
        alert.setView(layout);

        VehicleDialog = alert.create();
        VehicleDialog.setCancelable(true);
        VehicleDialog.show();


        manage_txt.setOnClickListener(v -> {
            VehicleDialog.dismiss();
            fragment = new ManageVehiclesFragment();
            moveToFragment(fragment);
        });

        txt_add_new.setOnClickListener(v -> {
            VehicleDialog.dismiss();
            fragment = new AddVehicleFragment();
            moveToFragment(fragment);
        });

        setAdapter();
    }

    public void setAdapter() {
        if (vehicleModels != null && !vehicleModels.isEmpty()) {
            vehicle_list.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
            vehicle_list.setItemAnimator(new DefaultItemAnimator());
            vehicle_list.setHasFixedSize(true);
            vehicleListAdapter = new VehicleListAdapter(activity, vehicleModels, this);
            vehicle_list.setAdapter(vehicleListAdapter);
        }
    }

    // foramte getfrom firebase
    private Object cancelExceeds;
    private Object lastCanceledDate;
    private Object creditBalance;

    public void DriverProofstatus() {
        if (ProofstatusReference != null) {
            ProofstatusReference.removeEventListener(ProofstatusValue);
        }
        if (SharedHelper.getKey(context, "userid").isEmpty()) {
            finish();
        }
        ProofstatusReference = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid"));
        ProofstatusReference.keepSynced(true);
        ProofstatusValue = ProofstatusReference.addValueEventListener(new ValueEventListener() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    Object Proofstatus = dataSnapshot.child("proof_status").getValue();
                    Object Onlinestatus = dataSnapshot.child("online_status").getValue();
                    Object subcriptionEndDate = dataSnapshot.child("subcriptionEndDate").getValue();
                    Object vehicleID = dataSnapshot.child("vehicle_id").getValue();
                    if (subcriptionEndDate != null) {
                        SharedHelper.putKey(context, "subscriptionDate", subcriptionEndDate.toString());
                    }
                    creditBalance = dataSnapshot.child("credits").getValue();
                    cancelExceeds = dataSnapshot.child("cancelExceeds").getValue();
                    if (dataSnapshot.child("isSubcriptionActive").getValue() != null) {
                        isSubcriptionActive = (Boolean) dataSnapshot.child("isSubcriptionActive").getValue();
                    }
                    lastCanceledDate = dataSnapshot.child("lastCanceledDate").getValue();
                    System.out.println("Enter the Proofstatus" + Proofstatus.toString() +"      "+SharedHelper.getKey(context, "userid"));
                    if (Proofstatus != null && Proofstatus.toString().equalsIgnoreCase("Accepted")) {
                        if (creditBalance != null) {
                            CommonData.walletBalance = creditBalance.toString();
                            SharedHelper.putOnline(activity, "proof", true);
                            proostatus.setVisibility(View.GONE);
                            proofstatus = true;
                            onlineOfflineSwitch.setEnabled(true);
                            assert Onlinestatus != null;
                            if (Onlinestatus.toString().equalsIgnoreCase("1")) {
                                onlinestatus = true;
                                SharedHelper.putOnline(activity, "onlineStatus", onlinestatus);
                                if (!onlineOfflineSwitch.isChecked()) {
                                    onlineOfflineSwitch.setChecked(true);
                                }
                                onlineOfflineText.setText(R.string.available);
                                getRequestStatus();
                                CommonData.isFistTime = true;
                                String tripId = SharedHelper.getKey(context, "trip_id");
                                if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                                    if (imgTextHail.getVisibility() == View.GONE) {
                                        imgTextHail.setVisibility(View.GONE);
                                    }
                                }
                            } else {
                                onlinestatus = false;
                                if (onlineOfflineSwitch.isChecked()) {
                                    onlineOfflineSwitch.setChecked(false);
                                }
                                if (imgTextHail.getVisibility() == View.VISIBLE) {
                                    imgTextHail.setVisibility(View.GONE);
                                }
                                SharedHelper.putOnline(activity, "onlineStatus", onlinestatus);
                                onlineOfflineText.setText(R.string.unavailable);
                                RemoveRequestListioner();
                                CommonData.isFistTime = false;
                            }

                            String tripId = SharedHelper.getKey(context, "trip_id");
                            if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
                                if (dataSnapshot.child("accept").child("trip_id").getValue() != null) {
                                    String acceptTripId = dataSnapshot.child("accept").child("trip_id").getValue().toString();
                                    if (acceptTripId.isEmpty() || acceptTripId.equalsIgnoreCase("0")) {
                                        return;
                                    } else {
                                        SharedHelper.putKey(context, "trip_id", acceptTripId);
                                        FirebaseTripFlow();
                                        SharedHelper.putKey(context, "starttime", getCurrentTime());
                                    }
                                }
                            }
                        } else {
                            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                            ref.child("drivers_data").child(driverId).child("credits").setValue("0");
                        }
                    } else {
                        SharedHelper.putOnline(activity, "onlineStatus", onlinestatus);
                        proofstatus = false;
                        onlineOfflineSwitch.setEnabled(false);
                        onlineOfflineSwitch.setChecked(false);
                        proostatus.setVisibility(View.VISIBLE);
                        SharedHelper.putOnline(activity, "proof", false);
                        try {
                            if (Proofstatus == null) {
                                DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                                ref.child("drivers_data").child(driverId).child("proof_status").setValue("Accepted");
                            }
                            if (Proofstatus != null && Proofstatus.toString().matches("Rejected")) {
                                showdialog((getResources().getString(R.string.proof_rejected)));
                            } else {
                                showdialog(getResources().getString(R.string.proof_not_accept));
                            }
                        } catch (Resources.NotFoundException e) {
                            e.printStackTrace();
                        }

                    }

                    if (vehicleID != null && !vehicleID.equals("0")) {
                        getVehicleCategory(vehicleID.toString());
                    }

                } else {
                    // setDriversData(context);
                }

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("FirebaseProof", "DriverProofstatus listener cancelled: "
                        + databaseError.getMessage()
                        + " | Code: " + databaseError.getCode());
                new Handler().postDelayed(() -> {
                    Log.d("FirebaseProof", "Retrying DriverProofstatus after cancellation...");
                    DriverProofstatus();
                }, 3000);
            }
        });
        onlineOfflineSwitch.setOnClickListener(v -> {
            if(proofstatus == true) {
                if (Constants.RequestStart) {
                    if (onlineOfflineSwitch.isChecked()) {
                        onlineOfflineSwitch.setChecked(false);
                        driverAttendanceRegistration();
                    } else {
                        OnlineOfflinePresenterCall("0");
                    }
                } else {
                    onlineOfflineSwitch.setChecked(false);
                }
            }
        });

    }

    public Double MakeDouble(String value) {
        double floats;
        try {
            floats = Double.parseDouble(value);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            floats = 0.0;
        }

        return floats;
    }

    public void LimitAlert() {
        if (CommonFirebaseListoner.isWallet && !isSubcriptionActive) {
            if (MakeDouble(CommonFirebaseListoner.minimumBalances) > Double.parseDouble(creditBalance.toString()) && Constants.WalletAlertEnable) {
                WalletBalance(CommonFirebaseListoner.exceededminimumBalanceDriver, false);
            }
        }

    }

    public void updateLimitdate() {
        DatabaseReference Driverdata = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("cancelExceeds", "0");
        map.put("lastCanceledDate", "0");
        Driverdata.updateChildren(map);
    }

    public void WalletBalance(String amount, Boolean from) {
        WalletAlertDialog dialogClass = new WalletAlertDialog(activity, amount, from);
        dialogClass.setCancelable(false);
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
        try {
            runOnUiThread(dialogClass::show);
        } catch (Exception e) {
            e.printStackTrace();
        }
        onlinestatus = false;
        if (onlineOfflineSwitch.isChecked()) {
            onlineOfflineSwitch.setChecked(false);
        }
        onlineOfflineText.setText(R.string.unavailable);
        if (imgTextHail.getVisibility() == View.VISIBLE) {
            imgTextHail.setVisibility(View.GONE);
        }
        OnlineOfflinePresenterCall("0");
        RemoveRequestListioner();
    }

    public void OnlineOfflinePresenterCall(String status) {
        driverPresenter.getOnlineOffline(status, activity, context, true);
    }

    public void Alertdialog() {
        String tripId = SharedHelper.getKey(context, "trip_id");
        if (tripId == null || tripId.equalsIgnoreCase("null") || tripId.isEmpty() || tripId.equalsIgnoreCase("0")) {
            AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
            builder1.setTitle(R.string.logout);
            builder1.setMessage(R.string.are_your);
            builder1.setCancelable(false);
            builder1.setPositiveButton(
                    activity.getResources().getString(R.string.yes),
                    (dialog, id) -> {
                        dialog.dismiss();
                        if (mGoogleApiClient.isConnected()) {
                            mGoogleApiClient.disconnect();
                        }
                        try {
                            remogeoFire();
                            driverPresenter.getOnlineOffline("0", activity, context, false);
                            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                            ref.child("drivers_data").child(driverId).child("online_status").setValue("0");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        CommonData.walletBalance = "0";
                        RemoveListener();
                        StopService();
                        if (mAuth != null) {
                            mAuth.signOut();
                        }
                        LogoutPresenter logoutPresenter = new LogoutPresenter();
                        logoutPresenter.LogoutData(activity);
                        SharedHelper.clearSharedPreferences(context);
                        Intent intent = new Intent(context, WelcomeActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                        ActivityCompat.finishAffinity(MainActivity.this);
                    });
            builder1.setNegativeButton(activity.getResources().getString(R.string.no), (dialog, which) -> dialog.dismiss());

            alert11 = builder1.create();
            alert11.show();
        } else {
            Utiles.CommonToast(activity, activity.getResources().getString(R.string.you_cant_logout_the_app));
        }
    }

    public static void RemoveListener() {
        try {
            Utiles.RemoveRefenceListioner(TripFlowReference, TripFlowValue);
            Utiles.RemoveRefenceListioner(ProofstatusReference, ProofstatusValue);
            Utiles.RemoveRefenceListioner(RequestDatabase, RequestValueEvent);
            Utiles.RemoveRefenceListioner(AppAutoLoggedOut, AppAutoLoggedOutValue);
            Utiles.RemoveRefenceListioner(CategoryDatabase, CategoryValueEvent);
            Utiles.RemoveRefenceListioner(RequestDatabaseReference, RequestValueListener);
            Utiles.RemoveRefenceListioner(TripFlowReference, TripFlowValue);
            Utiles.RemoveRefenceListioner(acceptedTripDatabase, acceptedTripValue);
            if (mLocationClient != null && mLocationClient.isConnected()) {
                mLocationClient.disconnect();
            }
            if (subscription != null) {
                subscription.unsubscribe();
                subscription = null;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void StopService() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            stopService(new Intent(context, TripRquestService.class));
        } else {
            stopService(new Intent(context, TripRquestService.class));
        }

    }

    public void upDateLocationPresnter(String status, LatLng latLng) {
        HashMap<String, String> map = new HashMap<>();
        map.put("lat", String.valueOf(latLng.latitude));
        map.put("lon", String.valueOf(latLng.longitude));
        map.put("status", status);
        driverPresenter.UpdateLocation(map, activity);
    }

    public void showdialog(String message) {
        final Snackbar snackbar = Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG);
        snackbar.setActionTextColor(Color.RED);
        View snackbarView = snackbar.getView();
        snackbarView.setBackgroundColor(Color.RED);
        TextView textView = (TextView) snackbarView.findViewById(R.id.snackbar_text);
        textView.setTextColor(Color.WHITE);
        textView.setTypeface(null, Typeface.BOLD);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
        params.setMargins(0, 30, 0, 0);
        textView.setLayoutParams(params);
        snackbar.show();
    }

    private String previousdest = "";
    private String previousaddess = "";

    public void FirebaseTripFlow() {
        if (TripFlowReference != null && TripFlowValue != null) {
            TripFlowReference.removeEventListener(TripFlowValue);
        }
        TripFlowReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        TripFlowReference.keepSynced(true);
        TripFlowValue = TripFlowReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NotNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    Object status = dataSnapshot.child("status").getValue();
                    Object driver_alavance_dis = dataSnapshot.child("driver_alavance_dis").getValue();
                    Object destinationlat = dataSnapshot.child("Drop_latlng").getValue();
                    Object destinationaddress = dataSnapshot.child("Drop_address").getValue();
                    Object rider_token = dataSnapshot.child("rider_token").getValue();
                    Object safeRideData = dataSnapshot.child("safeRideData").child("safeRidestatus").getValue();
                    Object safeRidestatus = dataSnapshot.child("safeRideData").child("safeRidetripStatus").getValue();
                    Object safeRideVehicle = dataSnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue();
                    Object safeRideVehiclemodel = dataSnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue();
                    Object safeRideVehiclemake = dataSnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue();
                    Object firstDriver = dataSnapshot.child("driver_id").getValue();

                    if (driver_alavance_dis != null && driver_alavance_dis.toString().equalsIgnoreCase("0")) {
                        CommonData.driveAllovanceDis = driver_alavance_dis.toString();
                    }
                    if (destinationlat != null && !destinationlat.toString().equalsIgnoreCase("0") && !previousdest.equalsIgnoreCase(destinationlat.toString())) {
                        previousdest = destinationlat.toString();
                        if (Constants.Previousstatus.equalsIgnoreCase("3")) {
                            destLocation = getDestination(destinationlat.toString());
                            DrawablePolyline();
                        }
                    }
                    if (destinationaddress != null && !destinationaddress.toString().equalsIgnoreCase("0") && !previousaddess.equalsIgnoreCase(destinationaddress.toString())) {
                        previousaddess = destinationaddress.toString();
                        EventBus.getDefault().postSticky(new DestinationAddressEvent(destinationaddress.toString()));
                    }
                    if (status != null) {
                        String statusdata = "-1";
                        if (firstDriver != null)
                            if (!firstDriver.equals(SharedHelper.getKey(context, "userid"))) {
                                if (safeRidestatus != null) {
                                    statusdata = safeRidestatus.toString();
                                }
                                if (statusdata.equalsIgnoreCase("6")) {
                                    Constants.Previousstatus = status.toString();
                                    safeRide = Objects.requireNonNull(safeRideData).toString().equals("true");
                                    RequestFragement.stopMusicAlert();
                                    TripFlowSwitch(status.toString(), safeRide, statusdata, firstDriver.toString());
                                }
                                if (!status.equals("1") && !status.equals("2")) {
                                    RequestFragement.stopMusicAlert();
                                    TripFlowSwitch(status.toString(), safeRide, statusdata, firstDriver.toString());
                                }
                            } else {
                                if (!Constants.Previousstatus.equalsIgnoreCase(status.toString())) {
                                    Constants.Previousstatus = status.toString();
                                    safeRide = Objects.requireNonNull(safeRideData).toString().equals("true");
                                    RequestFragement.stopMusicAlert();
                                    TripFlowSwitch(status.toString(), safeRide, statusdata, firstDriver.toString());
                                }
                            }
                    }

                    if (rider_token != null && !rider_token.equals("0")) {
                        Constants.strRideToken = rider_token.toString();
                    }
                }


            }

            @Override
            public void onCancelled(@NotNull DatabaseError databaseError) {
                Log.e("FirebaseTripFlow", "TripFlow listener cancelled: "
                        + databaseError.getMessage()
                        + " | Code: " + databaseError.getCode());
                String tripId = SharedHelper.getKey(context, "trip_id");
                if (tripId != null && !tripId.equalsIgnoreCase("null") && !tripId.isEmpty()) {
                    new Handler().postDelayed(() -> {
                        Log.d("FirebaseTripFlow", "Retrying FirebaseTripFlow after cancellation...");
                        FirebaseTripFlow();
                    }, 3000);
                }
            }
        });
    }

    public void TripFlowSwitch(String status, boolean safeRide, String safeRidestatus, String firstDriver) {
        earningLyt.setVisibility(View.VISIBLE);
        supportImgbtn.setVisibility(View.VISIBLE);
        currentlocationImgbtn.setVisibility(View.VISIBLE);
        RequestFragement.stopMusicAlert();
        if (!firstDriver.equals(SharedHelper.getKey(context, "userid"))) {
            System.out.println(" Second driver Status -->> " + safeRidestatus);
            switch (safeRidestatus) {
                case "6":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    driverOnlineLayout.setVisibility(View.GONE);
                    FlowFragment = new TripFlowFragment("6", mCurrentLocation, safeRide);
                    FlowFragment(FlowFragment);
                    break;
                case "7":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    driverOnlineLayout.setVisibility(View.GONE);
                    FlowFragment = new TripFlowFragment("7", mCurrentLocation, safeRide);
                    FlowFragment(FlowFragment);
                    break;
                case "8":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    if (stopsImgbtn.getVisibility() == View.VISIBLE) {
                        stopsImgbtn.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    earningLyt.setVisibility(View.GONE);
                    supportImgbtn.setVisibility(View.GONE);
                    currentlocationImgbtn.setVisibility(View.GONE);
                    menuImgbtn.setVisibility(View.GONE);
                    FlowFragment = new SummaryFragment(null, "Farebase");
                    SummaryFragment(FlowFragment);
                    mMap.clear();
                    currentLocMarker = null;
                    driverOnlineLayout.setVisibility(View.GONE);
                    RemovePolyline();
                    dismissDialog();
                    break;
                case "9": // Two Driver Cancelled Trip
                    if (imgTextHail.getVisibility() == View.GONE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    mMap.clear();
                    currentLocMarker = null;
                    Notrip();
                    RemoveFragment(FlowFragment);
                    currentLocation();
                    removeAllFragments(fragmentManager);
                    System.out.println("COMING HERE 9 STATUS::::");
                    ClearFirebase(context);
                    RemovePolyline();
                    SharedHelper.putKey(activity, "trip_id", "null");
                    break;
            }
        } else {
            switch (status) {
                case "1":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    FlowFragment = new TripFlowFragment("1", mCurrentLocation, safeRide);
                    driverOnlineLayout.setVisibility(View.GONE);
                    FlowFragment(FlowFragment);
                    break;
                case "2":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    driverOnlineLayout.setVisibility(View.GONE);
                    FlowFragment = new TripFlowFragment("2", mCurrentLocation, safeRide);
                    FlowFragment(FlowFragment);
                    break;
                case "3":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    driverOnlineLayout.setVisibility(View.GONE);
                    FlowFragment = new TripFlowFragment("3", mCurrentLocation, safeRide);
                    FlowFragment(FlowFragment);
                    break;
                case "4":
                    if (imgTextHail.getVisibility() == View.VISIBLE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    if (stopsImgbtn.getVisibility() == View.VISIBLE) {
                        stopsImgbtn.setVisibility(View.GONE);
                    }
                    RemoveFragment(FlowFragment);
                    earningLyt.setVisibility(View.GONE);
                    supportImgbtn.setVisibility(View.GONE);
                    currentlocationImgbtn.setVisibility(View.GONE);
                    menuImgbtn.setVisibility(View.GONE);
                    FlowFragment = new SummaryFragment(null, "Farebase");
                    SummaryFragment(FlowFragment);
                    mMap.clear();
                    currentLocMarker = null;
                    driverOnlineLayout.setVisibility(View.GONE);
                    RemovePolyline();
                    dismissDialog();
                    break;
                case "5":
                    if (imgTextHail.getVisibility() == View.GONE) {
                        imgTextHail.setVisibility(View.GONE);
                    }
                    mMap.clear();
                    currentLocMarker = null;
                    Notrip();
                    RemoveFragment(FlowFragment);
                    currentLocation();
                    removeAllFragments(fragmentManager);
                    System.out.println("COMING HERE 5 STATUS::::");
                    ClearFirebase(context);
                    RemovePolyline();
                    SharedHelper.putKey(activity, "trip_id", "null");
                    break;
            }
        }

    }

    public void updateView(View view, boolean ischeck) {
        RxView.layoutChangeEvents(view)
                .subscribe(ignore -> {
                    if (ischeck) {
                        if (view.getVisibility() == View.GONE) {
                            view.setVisibility(View.VISIBLE);
                        }
                    } else {
                        if (view.getVisibility() == View.VISIBLE) {
                            view.setVisibility(View.GONE);
                        }
                    }

                }, Exception::new);

    }


    public static String getCurrentTime() {

        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        Date currentLocalTime = cal.getTime();
        DateFormat date = new SimpleDateFormat("HH:mm");//24 Hour Format
        date.setTimeZone(TimeZone.getDefault());
        String localTime = date.format(currentLocalTime);
        return localTime.replaceAll(" ", "%20");

    }

    private void removeAllFragments(FragmentManager fragmentManager) {
        Reintialize();
        runOnUiThread(() -> {
            if (fragmentManager != null) {
                try {
                    while (fragmentManager.getBackStackEntryCount() > 0) {
                        fragmentManager.popBackStackImmediate();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void Reintialize() {
        FragmentManage = getSupportFragmentManager();
    }

    public void getDateFormate() {
        Date c = Calendar.getInstance().getTime();
        @SuppressLint("SimpleDateFormat") SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        String formattedDate = df.format(c);
        formattedDate.replaceAll(" ", "");
    }

    public void getAddress(final LatLng LatLng) {
        try {
            CommonData.Pickuplat = LatLng.latitude;
            CommonData.Pickuplng = LatLng.longitude;
            Geocoder geocoder;
            List<Address> addresses;
            geocoder = new Geocoder(this, Locale.getDefault());
            addresses = geocoder.getFromLocation(LatLng.latitude, LatLng.longitude, 1); // Here 1 represent max location result to returned, by documents it recommended 1 to 5
            if (addresses != null && !addresses.isEmpty()) {

                String address = addresses.get(0).getAddressLine(0); // If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()
                CommonData.strPickupAddress = address;// If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()

                if (addresses.get(0).getLocality() != null && !addresses.get(0).getLocality().isEmpty()) {
                    callPolygon(addresses.get(0).getLocality());
                } else {
                    googleGeocoderPresenter.getAddressFromLocation(LatLng, context);
                }
                for (Address addresss : addresses) {
                    strCountryCode = addresss.getCountryCode();
                    CommonData.strpickCity = addresss.getSubLocality();
                    if (strCountryCode != null && !strCountryCode.isEmpty()) {
                        break;
                    }
                }
            } else {
                googleGeocoderPresenter.getAddressFromLocation(LatLng, context);
            }

        } catch (Exception e) {
            e.printStackTrace();
            googleGeocoderPresenter.getAddressFromLocation(LatLng, context);

        }
    }

    public void callPolygon(String cityname) {
        try {
            if (!cityname.equalsIgnoreCase(strCityName)) {
                strCityName = cityname;
                cityPolygonPresenter.getAddressFromLocation(cityname);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setPolygon(List<LatLng> data) {
        if (mMap != null) {
            mMap.addPolygon(new PolygonOptions().addAll(data).fillColor(activity.getResources().getColor(R.color.light_blue)));
        }
    }


    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(ViewPumpContextWrapper.wrap(newBase));
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED)
    public void Onmesssage(HailRequest event) {
        runOnUiThread(() -> {
            driverOnlineLayout.setVisibility(View.GONE);
            imgTextHail.setVisibility(View.GONE);
            RemoveFragment(FlowFragment);
            FlowFragment = new TripFlowFragment("3", mCurrentLocation, safeRide);
            FlowFragment(FlowFragment);
            FirebaseTripFlow();
        });
    }

    public void setLocale(String lang) {

        Locale myLocale = new Locale(lang);
        Resources res = getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        onConfigurationChanged(conf);

    }

    private final BroadcastReceiver gpsReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().matches("android.location.PROVIDERS_CHANGED")) {
                LocationManager manager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
                boolean isGpsEnabled = manager.isProviderEnabled(LocationManager.GPS_PROVIDER);
                if (intent.getAction().matches("android.location.PROVIDERS_CHANGED")) {

                    if (!isGpsEnabled) {
                        //Here code when gps is enabled
                        init();
                    }
                }
            }
        }
    };


    private void asynApiCall(String id) {
        AsyncTask.execute(() -> {
            HashMap<String, String> map = new HashMap<>();
            map.put("tripId", id);
            subscriptionPresenter.tripisReceivedApi(map);
        });
    }
}

