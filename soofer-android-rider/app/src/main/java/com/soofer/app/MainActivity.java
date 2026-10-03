package com.soofer.app;

/**
 * powered by Abservetech.
 */

import android.Manifest;
import android.animation.TypeEvaluator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Space;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.akexorcist.googledirection.util.DirectionConverter;
import com.google.firebase.auth.FirebaseAuth;
import com.soofer.app.Activity.HomeActivity;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.KeyHelper;
import com.soofer.app.EventBus.CategoryPassing;
import com.soofer.app.EventBus.FemaleDriverFlow;
import com.soofer.app.EventBus.FlowBottomSheet;
import com.soofer.app.Fragment.PaymentFragmentNew;
import com.soofer.app.Model.RoutesModel;
import com.soofer.app.Presenter.GooglePolylinePresenter;
import com.soofer.app.TripFlowScreen.CarDropFragment;
import com.soofer.app.TripFlowScreen.bottomSheetDialogFragment.CategoryBottom;
import com.firebase.geofire.GeoFire;
import com.firebase.geofire.GeoLocation;
import com.firebase.geofire.GeoQuery;
import com.firebase.geofire.GeoQueryEventListener;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.libraries.places.api.Places;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.google.maps.android.SphericalUtil;
import com.razorpay.PaymentResultListener;
import com.soofer.app.Activity.GooglePlaceSearch;
import com.soofer.app.Activity.ProfileActivity;
import com.soofer.app.Activity.SetPinLocationActivity;
import com.soofer.app.Activity.WelcomeActivity;
import com.soofer.app.Adapter.NearServiceAdapter;
import com.soofer.app.Adapter.ServiceAdapter;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.CommonFirebaseListoner;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.MapAnimator;
import com.soofer.app.CommonClass.Mapcustomize.MultiTouchMapFragment;
import com.soofer.app.CommonClass.MyAddress;
import com.soofer.app.CommonClass.PolyUtils;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CommonClass.paymentModule.RazorPayPaymentModule;
import com.soofer.app.EventBus.EstimationChanges;
import com.soofer.app.EventBus.MakePaymentEvent;
import com.soofer.app.EventBus.MutlipleDestination;
import com.soofer.app.EventBus.RequestStatus;
import com.soofer.app.EventBus.TripStatus;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Fragment.ContactFragment;
import com.soofer.app.Fragment.FavoriteLocationFragment;
import com.soofer.app.Fragment.InviteFriends;
import com.soofer.app.Fragment.NotificationFragment;
import com.soofer.app.Fragment.OffersFragment;
import com.soofer.app.Fragment.StopLocationFragment;
import com.soofer.app.Fragment.SupportFragment;
import com.soofer.app.Fragment.WalletFragment;
import com.soofer.app.Fragment.YourTripFragment;
import com.soofer.app.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.app.Model.AddWalletModel;
import com.soofer.app.Model.ErrorModel;
import com.soofer.app.Model.LocalModel.MultipleAddressModel;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.Model.WalletBalanceModel;
import com.soofer.app.Navigationdrawer.FragmentDrawer;
import com.soofer.app.Presenter.GoogleGeocoderPresenter;
import com.soofer.app.Presenter.LogoutPresenter;
import com.soofer.app.Presenter.SentEmegencyPresenter;
import com.soofer.app.Presenter.ServicePresenter;
import com.soofer.app.Presenter.WalletBalancePresenter;
import com.soofer.app.Presenter.updateLocationPresenter;
import com.soofer.app.TripFlowScreen.EstimationFareFragment;
import com.soofer.app.TripFlowScreen.FareDetailsFragment;
import com.soofer.app.TripFlowScreen.OutStation.OutStationFragment;
import com.soofer.app.TripFlowScreen.RedEstimateFragment;
import com.soofer.app.TripFlowScreen.Rental.RentalFragment;
import com.soofer.app.TripFlowScreen.RequestFragment;
import com.soofer.app.TripFlowScreen.RiderLaterFragment;
import com.soofer.app.TripFlowScreen.SummaryFragment;
import com.soofer.app.TripFlowScreen.TripFlowFragment;
import com.soofer.app.TripFlowScreen.bottomSheetDialogFragment.MultipleStopFragment;
import com.soofer.app.View.GoogleGeoCoderView;
import com.soofer.app.View.GooglePolylineView;
import com.soofer.app.View.ServiceView;
import com.soofer.app.View.WalletView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.reactivestreams.Subscription;

import java.io.IOException;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.github.inflationx.viewpump.ViewPumpContextWrapper;
import io.reactivex.Observable;
import io.reactivex.Observer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strPickupCity;
import static com.soofer.app.CommonClass.Constants.isMultipleStop;
import static com.soofer.app.CommonClass.Constants.multipleAddressModels;
import static com.soofer.app.CommonClass.Utiles.AddToken;
import static com.soofer.app.CommonClass.Utiles.RemoveRefenceListioner;
import static com.soofer.app.CommonClass.Utiles.changeVisiblity;

@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class MainActivity extends BaseActivity implements FragmentDrawer.FragmentDrawerListener, CallRequest,
        OnMapReadyCallback, LocationSource, LocationListener, GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener,
        GooglePolylineView, GeoQueryEventListener, WalletView, GoogleGeoCoderView, View.OnLongClickListener,
        GoogleMap.OnCameraIdleListener, ServiceView, PaymentResultListener {
    DrawerLayout mDrawerLayout;
    FragmentDrawer drawerFragment;
    ImageView userProfileImage;
    RelativeLayout logout_layout;
    public static String random;
    private KeyHelper keyHelper;
    public static String Sha1;
    CompositeDisposable compositeDisposable = new CompositeDisposable();

    TextView txtUserName;
    @BindView(R.id.menu_img)
    ImageButton menuImg;
    boolean Tripstartstatus = true;
    Context context = MainActivity.this;
    Activity activity = MainActivity.this;
    AlertDialog logoutAler = null;
    String Tag = "mapactivity";
    protected static Fragment fragment, ServiceFagment;
    private final int GOOGLESEARCHCODE = 0;
    protected static boolean tripStatus = false;
    @BindView(R.id.pickup_address_txt)
    TextView pickupAddressTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.trip_status)
    TextView TripTitle;
    @BindView(R.id.flow_layout)
    RelativeLayout flowLayout;
    @BindView(R.id.work_imgbtn)
    ImageButton workImgbtn;
    @BindView(R.id.home_imgbtn)
    ImageButton homeImgbtn;
    @BindView(R.id.emegency_imgbtn)
    ImageButton emegencyImgbtn;

    @BindView(R.id.no_service_linearlayout)
    LinearLayout noServiceLinearlayout;
    @BindView(R.id.recyler_cartype)
    RecyclerView recylerCartype;
    @BindView(R.id.center_spacing)
    Space centerSpacing;
    @BindView(R.id.stops_imgbtn)
    ImageButton stopsImgbtn;
    @BindView(R.id.drop_txt)
    TextView dropTxt;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.ic_call_imgbtn)
    ImageButton icCallImgbtn;
    @BindView(R.id.pbHeaderProgress)
    ProgressBar pbHeaderProgress;
    private ServiceAdapter serviceAdapter;
    GooglePolylinePresenter googlePolylinePresenter;

    @BindView(R.id.rider_later_btn)
    Button riderLaterBtn;
    @BindView(R.id.request_btn)
    Button requestBtn;
    @BindView(R.id.nearby_layout)
    RelativeLayout nearbyLayout;
    @BindView(R.id.Servicecontainter)
    FrameLayout Servicecontainter;
    @BindView(R.id.container)
    FrameLayout container;
    @BindView(R.id.drawer_layout)
    DrawerLayout drawerLayout;
    @BindView(R.id.picku_drag_marker)
    ImageView pickuDragMarker;
    @BindView(R.id.loader_view)
    RelativeLayout loaderView;
    @BindView(R.id.ride_layout)
    LinearLayout rideLayout;
    private OnLocationChangedListener mMapLocationListener = null;
    LocationManager locationManager;
    GoogleMap mMap;
    GoogleApiClient mGoogleApiClient;
    Marker pickupmarker, dropmarker;
    Location mCurrentLocation;
    @BindView(R.id.where_to_txt)
    TextView whereToTxt;
    @BindView(R.id.pickup_drop_layout)
    LinearLayout pickupDropLayout;
    @BindView(R.id.currentlocation_imgbtn)
    ImageButton currentlocationImgbtn;
    @BindView(R.id.support_imgbtn)
    ImageButton support_imgbtn;
    @BindView(R.id.navigation_imgbtn)
    ImageButton navigation_imgbtn;
    public static ArrayList<Fragment> fragmentslist = new ArrayList<>();

    private ArrayList<LatLng> listLatLng = new ArrayList<>();

    public static DatabaseReference LastTripDatabase, TripFlowReference, TripFlowCarDataBase, AppAutoLoggedOut;
    public static ValueEventListener LastTripValueEvent, TripFlowValue, TripFlowCarValue, AppAutoLoggedOutValue;

    //Firebase
    private GeoQuery geoQuery;
    private GeoFire geoFire;
    String carcategory = "auto";

    private List<ServiceModel.VehicleCategory> servieModel;
    BitmapDescriptor bitmapDescriptor;
    public Map<String, Marker> markers;

    private float driverBearing = 0.0f, getBearing = 0.0f;


    int count = 0;
    Location filterLocation;
    public static LatLng startLatLng, destLatLng, destinationLatLng, pickupLatLng;
    Polyline mPolyline;
    Marker pickUPrDropMarker, myMarker;
    public static Boolean isFirstTime = true;
    public static FirebaseAuth mAuth;
    LatLng prevLatLng = new LatLng(0, 0);
    static int flowstatus = 0;
    public TextView wallet_balance_txt;
    public static GoogleGeocoderPresenter googleGeocoderPresenter;
    public static FragmentManager FragmentManage;
    AlertDialog logoutAlert;
    PolyUtils polyUtils;
    private Subscription sendStateSubscription;
    private ServicePresenter servicePresenter;
    private List<LatLng> multiLocations = new ArrayList<>();
    private Response<TripFlowModel> multipleStopDetails;
    private BottomSheetDialogFragment bottomSheetDialogFragment;
    private BottomSheetDialogFragment bottomSheetcategory;
    private BottomSheetDialogFragment bottomSheetCarDropFragment;
    private Fragment flowFragment;
    public RazorPayPaymentModule razorpaymodule;
    private Double routeLat, routeLng;
    String strVehicleCode;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;

    private TripFlowFragment tripFlowFragmant;

    private static final String[] REQUIRED_PERMISSIONS = {
            Manifest.permission.CAMERA,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    public class PhoneStateBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction() != null && intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                if (flowFragment != null && flowFragment.isAdded() && !Constants.CheckRiderStatus.equalsIgnoreCase("Processing")) {
                    RemoveFragment(flowFragment);
                }

            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        System.out.println("1a" + isFinishing());
        System.out.println("1aonCreate");

        mAuth = FirebaseAuth.getInstance();
        random = UUID.randomUUID().toString();
        keyHelper = new KeyHelper();
        keyHelper.get(context, "SHA1");
        ;
        if (SharedHelper.getKey(context, "SHA1Key") != null) {
            Sha1 = SharedHelper.getKey(context, "SHA1Key").toUpperCase().replace(":", "");
        }
        googlePolylinePresenter = new GooglePolylinePresenter(this);

        servieModel = new ArrayList<>();
        findviewById();
        Intent intent = getIntent();
        strVehicleCode = intent.getStringExtra("strVehicleCode");
        razorpaymodule = new RazorPayPaymentModule(activity);
        FragmentManage = getSupportFragmentManager();
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        pickupAddressTxt.setSelected(true);
        dropAddressTxt.setSelected(true);
        if (!Places.isInitialized())
            Places.initialize(this, Constants.GoogleDirectionkey);
        LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;
        googleGeocoderPresenter = new GoogleGeocoderPresenter(this, compositeDisposable);
        this.markers = new HashMap<>();
        try {
            assert lm != null;
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (!gps_enabled) {
            GPSTurnOnAlert();
        }
        pickupAddressTxt.setOnLongClickListener(this);
        dropAddressTxt.setOnLongClickListener(this);
        servicePresenter = new ServicePresenter(this);

        if (SharedHelper.getKey(context, "trip_id") != null && !SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("null") && !SharedHelper.getKey(context, "trip_id").isEmpty() && !SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("0")) {
            tripStatus = true;
            FlowMode(true);
            Constants.FlowStatus = "0";
            FirebaseTripFlow();
        } else {
            LastTripStatusCheck();
        }
        Constants.CheckRiderStatus = "";
        recylerCartype.setAdapter(new NearServiceAdapter(activity, null));
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
        PhoneStateBroadcastReceiver pSReciever = new PhoneStateBroadcastReceiver();
        registerReceiver(pSReciever, filter);

        getCheckLogout();
        walletPResenter();

    }

    public void getCheckLogout() {
        if (!SharedHelper.getKey(context, "userid").isEmpty()) {
            RemoveRefenceListioner(AppAutoLoggedOut, AppAutoLoggedOutValue);
            AppAutoLoggedOut = FirebaseDatabase.getInstance().getReference().child("riders_data").child(SharedHelper.getKey(context, "userid")).child("FCM_id");
            AppAutoLoggedOut.keepSynced(true);
            AppAutoLoggedOutValue = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.getValue() != null) {
                        if (!dataSnapshot.getValue().toString().equalsIgnoreCase(SharedHelper.getToken(context, "device_token"))) {
                            try {
                                CommonData.addressList.clear();
                                fragmentslist.clear();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            SharedHelper.clearSharedPreferences(context);
                            mAuth.signOut();
                            Utiles.clearCache(activity);
                            RemoveListener();
                            LogoutPresenter logoutPresenter = new LogoutPresenter();
                            logoutPresenter.LogoutData(activity);
                            SharedHelper.clearSharedPreferences(context);
                            Intent intent = new Intent(context, WelcomeActivity.class);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                            ActivityCompat.finishAffinity(MainActivity.this);
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

    public void RemoveListener() {
        RemoveRefenceListioner(LastTripDatabase, LastTripValueEvent);
        RemoveRefenceListioner(TripFlowReference, TripFlowValue);
        RemoveRefenceListioner(TripFlowCarDataBase, TripFlowCarValue);
        RemoveRefenceListioner(AppAutoLoggedOut, AppAutoLoggedOutValue);
    }


    private boolean arePermissionsGranted() {
        for (String permission : REQUIRED_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission)
                    != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    private void requestCameraPermission() {
        ActivityCompat.requestPermissions(
                this,
                new String[]{Manifest.permission.CAMERA},
                CAMERA_PERMISSION_REQUEST_CODE
        );
    }

    public void walletPResenter() {
        WalletBalancePresenter walletBalancePresenter = new WalletBalancePresenter(activity, this);
        walletBalancePresenter.getWalletBalance(false);
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
        result.setResultCallback(result1 -> {
            final Status status = result1.getStatus();
            final LocationSettingsStates state = result1.getLocationSettingsStates();
            switch (status.getStatusCode()) {
                case LocationSettingsStatusCodes.SUCCESS:
                    // All location settings are satisfied. The client can initialize location
                    // requests here.
                    setCurrentlocation();
                    break;
                case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                    // Location settings are not satisfied. But could be fixed by showing the user
                    // a dialog.
                    try {
                        // Show the dialog by calling startResolutionForResult(),
                        status.startResolutionForResult(activity, Constants.REQUEST_CHECK_SETTINGS);

                    } catch (IntentSender.SendIntentException e) {
                        // Ignore the error.
                    }
                    break;
                case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                    // Location settings are not satisfied. However, we have no way to fix the
                    // settings so we won't show the dialog.

                    break;
            }
        });
    }

    MultiTouchMapFragment mapFragment;

    @SuppressLint("SetTextI18n")
    public void findviewById() {

        //map
        mapFragment = (MultiTouchMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        /*Navigation Drawer Layout*/
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawerFragment = (FragmentDrawer)
                getSupportFragmentManager().findFragmentById(R.id.fragment_navigation_drawer);
        drawerFragment.setUp(R.id.fragment_navigation_drawer, mDrawerLayout, null);
        drawerFragment.setDrawerListener(this);
        TripTitle.setSelected(true);
        userProfileImage = (ImageView) mDrawerLayout.findViewById(R.id.rider_profile_image);
        txtUserName = (TextView) mDrawerLayout.findViewById(R.id.userName);
        txtUserName.setOnClickListener(v -> startActivity(new Intent(context, ProfileActivity.class)));
        wallet_balance_txt = (TextView) mDrawerLayout.findViewById(R.id.wallet_balance_txt);
        logout_layout = (RelativeLayout) mDrawerLayout.findViewById(R.id.logout_layout);
        logout_layout.setOnClickListener(v -> Alertdialog(getString(R.string.are_you_sure_you_want_to_logout)));

        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, context);
        txtUserName.setText(Utiles.NullPointer(SharedHelper.getKey(context, "fname")) + Utiles.NullPointer(SharedHelper.getKey(context, "lname")));
    }

    @Override
    public void onDrawerItemSelected(View view, int position) {
        switch (position) {
            case 0:
                startActivity(new Intent(context, ProfileActivity.class));
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 1:
                fragment = new WalletFragment();
                moveToFragment(fragment);
                break;
            case 2:
                fragment = new PaymentFragmentNew();
                moveToFragment(fragment);
                break;
            case 3:
                fragment = new YourTripFragment();
                moveToFragment(fragment);

                break;
            case 4:
                fragment = new InviteFriends();
                moveToFragment(fragment);
                break;
            case 5:
                fragment = new ContactFragment();
                moveToFragment(fragment);

                break;
            case 6:
                fragment = new SupportFragment();
                moveToFragment(fragment);

                break;
            case 7:
                fragment = new OffersFragment();
                moveToFragment(fragment);
                break;
            case 8:
                fragment = new FavoriteLocationFragment();
                moveToFragment(fragment);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 9:
                fragment = new NotificationFragment();
                moveToFragment(fragment);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            default:
                break;

        }

    }

    private void moveToFragment(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    FragmentManage.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                            .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void FLowoverlay(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {

                runOnUiThread(() -> {
                    FragmentManage.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                            .replace(R.id.container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                });

            } else {
                if (countfragment == 3) {
                    return;
                }
                countfragment++;
                fragmenAddissue(fragment);
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (countfragment == 3) {
                return;
            }
            countfragment++;
            fragmenAddissue(fragment);
        }


    }

    public void fragmenAddissue(Fragment fragment) {
        if (fragment instanceof RequestFragment) {
            FLowoverlay(fragment);
        }
    }


    int countfragment = 0;

    private void ServiceFow(Fragment fragment) {
        Reintialize();
        try {
            System.out.println("tripp " + this.isFinishing());
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    FragmentManage.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                            .replace(R.id.Servicecontainter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

                });
                countfragment = 0;
            } else {
                if (countfragment < 6) {
                    countfragment++;
                    ServiceFow(fragment);
                } else {
                    Constants.TripFlowFragmant = null;
                }

            }
        } catch (Exception e) {
            if (countfragment < 6) {
                countfragment++;
                ServiceFow(fragment);
            } else {
                Constants.TripFlowFragmant = null;
            }
            e.printStackTrace();
        }

    }

    @SuppressLint("UseCompatLoadingForDrawables")
    @OnClick(R.id.menu_img)
    public void onViewClicked() {


        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));

            if (fragmentslist.size() == 0) {
                flowstatus = 0;
                stopAnim();
                menuImg.setImageResource(R.drawable.ic_menu_layer);
                NormalMode();
                setCurrentlocation();
                if (mCurrentLocation != null) {
                    Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
                }
                CheckFavoriteLocation();
            }
        } else {
            mDrawerLayout.openDrawer(GravityCompat.START);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(FlowBottomSheet event) {
        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        if (fragmentslist.size() == 0 && !tripStatus) {
            flowstatus = 0;
            RemovePolyline();
            NormalMode();
            stopAnim();
            setCurrentlocation();
            if (mCurrentLocation != null) {
                Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
            }
            CheckFavoriteLocation();
        }
        getFragmentManager().popBackStackImmediate();
        mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

    @Override
    public void onBackPressed() {
        if (Constants.TripFlowFragmant == null) {
            super.onBackPressed();
        }
        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        if (fragmentslist.size() == 0 && !tripStatus) {
            flowstatus = 0;
            RemovePolyline();
            NormalMode();
            stopAnim();
            setCurrentlocation();
            menuImg.setImageResource(R.drawable.ic_menu_layer);
            if (mCurrentLocation != null) {
                Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
            }
            CheckFavoriteLocation();
        }
        getFragmentManager().popBackStackImmediate();
        mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
    }

    public void RemovePolyline() {
        // stopAnim();
   /*     if (pickupmarker != null) {
            pickupmarker.remove();
        }
        if (dropmarker != null) {
            dropmarker.remove();
        }*/

    }

    public void RemoveflowPolyline() {
        if (mPolyline != null) {
            mPolyline.remove();
            mPolyline = null;
        }
        if (myMarker != null) {
            myMarker.remove();
            myMarker = null;
        }
    }

    @Override
    public void callReuest() {
        removeAllFragments(FragmentManage);
        currentlocationImgbtn.setVisibility(View.GONE);
        support_imgbtn.setVisibility(View.GONE);
        menuImg.setVisibility(View.GONE);
        flowFragment = new RequestFragment();
        FLowoverlay(flowFragment);
        Constants.CheckRiderStatus = "Processing";
        LastTripStatusCheck();
    }

    @Override
    public void ClearServiceFragment() {
        if (flowLayout.getVisibility() == View.VISIBLE) {
            flowLayout.setVisibility(View.GONE);
        }
        flowstatus = 0;
        stopAnim();
        menuImg.setImageResource(R.drawable.ic_menu_layer);
        if (polyUtils != null) {
            polyUtils.clrearAll();
        }
        NormalMode();
        CheckFavoriteLocation();
        removeAllFragments(FragmentManage);
        setCurrentlocation();
        RemoveFragment(Constants.TripFlowFragmant);
        fragmentslist.clear();
        Utiles.ClearFirebase(SharedHelper.getKey(context, "userid"));
        Intent i = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(i);
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
        finish();
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


    @Override
    public void CallsummaryFragment() {
        if (CommonData.strVehicleCode.equalsIgnoreCase("Rental")) {
            moveToFragment(new RentalFragment());
        } else if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
            moveToFragment(new OutStationFragment());
        } else {
            if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                CommonData.Pickuplat = getFusedLocation().getLatitude();
                CommonData.Pickuplng = getFusedLocation().getLongitude();
            }
            Intent intent = new Intent(context, GooglePlaceSearch.class);
            startActivityForResult(intent, GOOGLESEARCHCODE);
        }
    }

    @Override
    public void CallEstimationfare() {
        // RemoveFragment(ServiceFagment);
        ServiceFagment = new EstimationFareFragment();
        fragmentslist.add(ServiceFagment);
        FLowoverlay(ServiceFagment);
    }

    public void CheckFavoriteLocation() {
        if (flowstatus == 0) {
            if (Utiles.isNull(SharedHelper.getKey(context, "homeaddress"))) {
                homeImgbtn.setVisibility(View.VISIBLE);
            } else {
                homeImgbtn.setVisibility(View.GONE);

            }
            if (Utiles.isNull(SharedHelper.getKey(context, "workaddress"))) {
                workImgbtn.setVisibility(View.VISIBLE);
            } else {
                workImgbtn.setVisibility(View.GONE);

            }

        } else {
            homeImgbtn.setVisibility(View.GONE);
            workImgbtn.setVisibility(View.GONE);
        }


    }



    @Override
    public void FareDetailFragment(List<ServiceModel> serviceModels) {
        ServiceFagment = new FareDetailsFragment();
        fragmentslist.add(ServiceFagment);
        Bundle bundle = new Bundle();
        bundle.putSerializable("serviceModel", (Serializable) serviceModels);
        ServiceFagment.setArguments(bundle);
        FLowoverlay(ServiceFagment);
    }

    @Override
    public void FlowDetails(Response<TripFlowModel> Response) {
        multipleStopDetails = Response;
        System.out.println("multipleStopDetails:::::" + multipleStopDetails);
        if (multiLocations != null && !multiLocations.isEmpty()) {
            multiLocations.clear();
        }
        assert Response.body() != null;
        try {
            pickupLatLng = new LatLng(Double.parseDouble(Response.body().getPickupdetails().getStartcoords().get(1)), Double.parseDouble(Response.body().getPickupdetails().getStartcoords().get(0)));
            destinationLatLng = new LatLng(Double.parseDouble(Response.body().getPickupdetails().getEndcoords().get(1)), Double.parseDouble(Response.body().getPickupdetails().getEndcoords().get(0)));
            destLatLng = destinationLatLng;

            CommonData.Pickuplat = pickupLatLng.latitude;
            CommonData.Pickuplng = pickupLatLng.longitude;

            CommonData.Droplat = destinationLatLng.latitude;
            CommonData.Droplng = destinationLatLng.longitude;
            CommonData.strPickupAddress = Response.body().getPickupdetails().getStart();
            CommonData.strDropAddresss = Response.body().getPickupdetails().getEnd();

            pickupAddressTxt.setText(Response.body().getPickupdetails().getStart());
            dropAddressTxt.setText(Response.body().getPickupdetails().getEnd());
        } catch (Exception e) {
            e.printStackTrace();
        }
        updateMarker(Response.body().getServiceType().toLowerCase());

        final int[] i = {0};
        Observable.fromIterable(Response.body().getMultiLocation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribeOn(Schedulers.io())
                .subscribe(new Observer<TripFlowModel.MultiLocation>() {
                    @Override
                    public void onSubscribe(Disposable d) {
                        compositeDisposable.add(d);
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
                            if (Constants.FlowStatus.equalsIgnoreCase("3") && stopsImgbtn.getVisibility() == View.GONE) {
                                stopsImgbtn.setVisibility(View.VISIBLE);
                            }
                            DrawPolyline();
                        }

                    }
                });

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void SelectedCategory(ServiceModel.VehicleCategory ServiceType) {
        RemoveCarMarker();
        if (mCurrentLocation != null) {
            Geofire(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng), ServiceType.getType().toLowerCase());
        }
        requestBtn.setText(R.string.request_now);
        if (ServiceType.getIsRideLater()) {
            if (ServiceType.getType().equalsIgnoreCase("Rental")) {
                requestBtn.setVisibility(View.GONE);
                riderLaterBtn.setVisibility(View.VISIBLE);
            } else {
                changeVisiblity(riderLaterBtn, true);
            }

        } else {
            requestBtn.setVisibility(View.GONE);
            changeVisiblity(riderLaterBtn, false);
        }
        if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
            requestBtn.setVisibility(View.GONE);
            changeVisiblity(riderLaterBtn, false);
            requestBtn.setText(R.string.continues);
        }
        carcategory = ServiceType.getType().toLowerCase();
        if (mCurrentLocation != null) {
            Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
        }

    }

    @Override
    public void availablestatus(String availablestatus) {

    }


    private void updateMarker(String category) {
        if (SharedHelper.getKey(context, "driver_id") != null) {
            RemoveRefenceListioner(TripFlowCarDataBase, TripFlowCarValue);
            TripFlowCarDataBase = FirebaseDatabase.getInstance().getReference().child("drivers_location").child("trip_location").child(SharedHelper.getKey(context, "driver_id"));
            TripFlowCarDataBase.keepSynced(true);
            TripFlowCarValue = TripFlowCarDataBase.addValueEventListener(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.getValue() != null) {
                        try {
                            String drivBearing;
                            if (dataSnapshot.child("bearing").getValue() != null)
                                drivBearing = Objects.requireNonNull(dataSnapshot.child("bearing").getValue()).toString();
                            else {
                                drivBearing = "0";
                            }
                            String status = Objects.requireNonNull(dataSnapshot.child("l").getValue()).toString();
                            if (drivBearing != null) {
                                if (isFloat(drivBearing)) {
                                    getBearing = Float.parseFloat(drivBearing);
                                } else {
                                    getBearing = (float) Integer.parseInt(drivBearing);
                                }
                            }
                            String[] lat1ong = status.split(",");

                            String latitude = lat1ong[0];
                            String longitude = lat1ong[1];

                            String latreplace = latitude.replaceAll("\\[", "");
                            String longreplace = longitude.replaceAll("\\]", "");
                            Double laat = Double.parseDouble(latreplace);
                            Double lngg = Double.parseDouble(longreplace);
                            routeLat = laat;
                            routeLng = lngg;

                            LatLng driverLocation = new LatLng(laat, lngg);
                            if (isFirstTime) {
                                startLatLng = driverLocation;
                                DrawPolyline();

                            }
                            if (startLatLng != null && mMap != null) {
                                startLatLng = driverLocation;
                                onDirectionSuccessPlaceMarker();
                            }
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {

                }
            });
        }
    }

    public void DrawPolyline() {
        if (Constants.FlowStatus.equals("1") || Constants.FlowStatus.equals("2")) {
            if (startLatLng != null && pickupLatLng != null) {
                isFirstTime = false;
                try {
                    googlePolylinePresenter.getDrawPolyline(startLatLng, pickupLatLng, null);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }

        } else {
            if (startLatLng != null && destinationLatLng != null) {
                isFirstTime = false;
                try {
                    if (multiLocations.isEmpty()) {
                        googlePolylinePresenter.getDrawPolyline(startLatLng, destinationLatLng, null);
                    } else {
                        googlePolylinePresenter.getDrawPolyline(startLatLng, destinationLatLng, multiLocations);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private boolean ispickup = true;

    @OnClick({R.id.where_to_txt, R.id.pickup_address_txt, R.id.drop_address_txt, R.id.emegency_imgbtn, R.id.rider_later_btn,
            R.id.request_btn, R.id.ic_call_imgbtn, R.id.stops_imgbtn, R.id.drop_txt, R.id.support_imgbtn, R.id.notification_img
            , R.id.navigation_imgbtn, R.id.tvSearchDestination})
    public void onViewClick(View view) {
        Intent intent = null;
        switch (view.getId()) {
            case R.id.where_to_txt:
                intent = new Intent(this, GooglePlaceSearch.class);
                intent.putExtra("setpin", "setpin");
                startActivityForResult(intent, 400);
               /* whereToTxt.bringToFront();
                dropTxt.setAlpha(0.8f);
                whereToTxt.setAlpha(1f);*/
                break;
            case R.id.drop_txt:
                intent = new Intent(this, GooglePlaceSearch.class);
                intent.putExtra("setpin", "setpin");
                startActivityForResult(intent, 400);
                dropTxt.bringToFront();
                whereToTxt.setAlpha(0.8f);
                dropTxt.setAlpha(1f);

                break;
            case R.id.pickup_address_txt:
             /*   GOtoFavoriteLocation();
                isPickup = true;*/
                break;
            case R.id.drop_address_txt:
                intent = new Intent(this, GooglePlaceSearch.class);
                intent.putExtra("setpin", "setpin");
                startActivityForResult(intent, 500);
                break;
            case R.id.emegency_imgbtn:
                SosAlertdialog();
                break;

            case R.id.rider_later_btn:
                new RiderLaterFragment().show(getSupportFragmentManager(), "riderlater");
                isClear();
                break;
            case R.id.request_btn:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";

                isClear();
                if (CommonData.strVehicleCode.equalsIgnoreCase("Rental")) {
                    moveToFragment(new RentalFragment());
                } else if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
                    if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                        CommonData.Pickuplat = getFusedLocation().getLatitude();
                        CommonData.Pickuplng = getFusedLocation().getLongitude();
                    }
                    intent = new Intent(context, GooglePlaceSearch.class);
                    startActivityForResult(intent, GOOGLESEARCHCODE);
                } else {
                    if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                        CommonData.Pickuplat = getFusedLocation().getLatitude();
                        CommonData.Pickuplng = getFusedLocation().getLongitude();
                    }
                    intent = new Intent(context, GooglePlaceSearch.class);
                    startActivityForResult(intent, GOOGLESEARCHCODE);
                }

                break;
            case R.id.ic_call_imgbtn:
                Calltosupport();
                break;
            case R.id.tvSearchDestination:
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                intent = new Intent(context, GooglePlaceSearch.class);
                startActivityForResult(intent, GOOGLESEARCHCODE);
                break;
            case R.id.stops_imgbtn:
                if (multipleStopDetails != null) {
                    if (bottomSheetDialogFragment != null) {
                        bottomSheetDialogFragment.dismiss();
                    }
                    bottomSheetDialogFragment = new MultipleStopFragment(multipleStopDetails);
                    bottomSheetDialogFragment.show(getSupportFragmentManager(), "mutliple_Stop");
                }
                break;
            case R.id.support_imgbtn:
                if (SharedHelper.getKey(activity, "support_num") != null && !SharedHelper.getKey(activity, "support_num").isEmpty()) {
                    Intent intent1 = new Intent(Intent.ACTION_DIAL);
                    intent1.setData(Uri.parse("tel:" + SharedHelper.getKey(activity, "support_num")));
                    activity.startActivity(intent1);

                } else {
                    Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
                }
                break;
            case R.id.notification_img:
                fragment = new NotificationFragment();
                moveToFragment(fragment);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case R.id.navigation_imgbtn:
                try {
                    if (!routeLat.isNaN() && !routeLng.isNaN()) {
                        String strwayPint = "https://www.google.com/maps/dir/?api=1&origin=" + pickupLatLng.latitude + "," + pickupLatLng.longitude + "&destination=" + routeLat + "," + routeLng;
                        Uri gmmIntentUri = Uri.parse(strwayPint + "&travelmode=driving");
                        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
                        mapIntent.setPackage("com.google.android.apps.maps");
                        activity.startActivity(mapIntent);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }


    }

    public void SosAlertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setMessage("Do you want to send the message");
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    SentEmegencyPresenter emegencyPresenter = new SentEmegencyPresenter();
                    emegencyPresenter.getsentEmercency(activity, SharedHelper.getKey(context, "trip_id"));
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no),
                (dialog, which) ->
                        dialog.dismiss());
        logoutAlert = builder1.create();
        logoutAlert.show();
    }

    private void isClear() {
        if (multipleAddressModels != null && !multipleAddressModels.isEmpty()) {
            multipleAddressModels.clear();
        }
    }

    public void GOtoFavoriteLocation() {
        CommonData.HeaderTitle = "favorite";
        Intent intents = new Intent(context, SetPinLocationActivity.class);
        startActivityForResult(intents, GOOGLESEARCHCODE);
    }

    public void RemoveFragment(Fragment fragment) {
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    if (fragment != null) {
                        FragmentManage.beginTransaction()
                                .remove(fragment)
                                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_CLOSE)
                                .commitAllowingStateLoss();
                    }
                });

            }
        } catch (Exception e) {
            Log.i("tag", e.getMessage());

        }

    }

    @Override
    public void onLocationChanged(Location location) {

        if (mCurrentLocation == null && location != null) {
            mCurrentLocation = location;
            CommonData.CurrentLocation = location;
            if (mCurrentLocation != null) {
                Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
            }
            getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());


            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();

            mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }
        if (mMapLocationListener != null) {
            mMapLocationListener.onLocationChanged(location);
        }
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
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
        final Location mLastLocation = LocationServices.FusedLocationApi.getLastLocation(
                mGoogleApiClient);
        if (mLastLocation != null && count == 0) {
            System.out.println("The Last Known Location " + mLastLocation);
            filterLocation = mLastLocation;
            count = count + 1;
            float zoomPosition = Constants.MAP_ZOOM_SIZE_ONTRIP;
            if (mMap != null) {
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(
                        new LatLng(mLastLocation.getLatitude(),
                                mLastLocation.getLongitude()),
                        zoomPosition));
            }

        }
        getFusedLocation();
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

    private float currentZoom = -1;
    private boolean ischeck = false;

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setOnCameraIdleListener(this);
        mapFragment.mTouchView.setGoogleMap(mMap);

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
        mMap.setMyLocationEnabled(true);
        mMap.getUiSettings().setMyLocationButtonEnabled(false);
        mMap.getUiSettings().setCompassEnabled(false);
        mMap.getUiSettings().setRotateGesturesEnabled(false);
        mMap.getUiSettings().setZoomGesturesEnabled(false);
        mMap.getUiSettings().setMapToolbarEnabled(false);

        setCurrentlocation();
        mMap.setOnCameraMoveStartedListener(reason -> {
            if (reason == GoogleMap.OnCameraMoveStartedListener.REASON_GESTURE) {
                if (pickuDragMarker.getVisibility() == View.VISIBLE) {
                    if (nearbyLayout.getVisibility() == View.VISIBLE) {
                        Utiles.hideLayout(nearbyLayout, context);
                        currentlocationImgbtn.setVisibility(View.GONE);
                        support_imgbtn.setVisibility(View.GONE);
                        mMap.setOnCameraIdleListener(this);

                    }
                }
            } else if (reason == GoogleMap.OnCameraMoveStartedListener
                    .REASON_DEVELOPER_ANIMATION) {
                if (pickuDragMarker.getVisibility() == View.VISIBLE) {
                    ischeck = true;
                }

            }
        });
        nearbyLayout.getViewTreeObserver().addOnGlobalLayoutListener(() -> {
            int height = nearbyLayout.getHeight(); //height is ready
            if (nearbyLayout.getVisibility() == View.VISIBLE) {
                mMap.setPadding(0, height, 0, height);
            }
        });

        mMap.setOnMarkerClickListener(marker -> {
            if (marker.getTag() != null) {
                switch (marker.getTag().toString()) {
                    case "pickup":
                        CommonData.HeaderTitle = "pickup";
                        if (!isMultipleStop) {
                            startActivityForResult(new Intent(getApplicationContext(), SetPinLocationActivity.class), 101);
                        } else {
                            moveToFragment(new StopLocationFragment(false));
                        }
                        break;
                    case "drop":
                        CommonData.HeaderTitle = "drop";
                        if (!isMultipleStop) {
                            startActivityForResult(new Intent(getApplicationContext(), SetPinLocationActivity.class), 102);
                        } else {
                            moveToFragment(new StopLocationFragment(false));
                        }


                        break;
                }
            }
            return true;
        });

        Bitmap originalBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic_mini_1);
        Bitmap resizedBitmap = Bitmap.createScaledBitmap(
                originalBitmap,
                40,
                70,
                false
        );
        bitmapDescriptor = BitmapDescriptorFactory.fromBitmap(resizedBitmap);

    }

    public void setCurrentlocation() {
        mCurrentLocation = getFusedLocation();
        if (mCurrentLocation != null) {
            Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
            getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());


            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE_ONTRIP)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();

            mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

        }
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
        System.out.println("Location Provoider:" + " Fused Location");

        if (mCurrentLocation == null) {

            locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
            System.out.println("Location Provoider:" + " Fused Location Fail: GPS Location");

            if (locationManager != null) {

                //To avoid duplicate listener
                try {
                    locationManager.removeUpdates(this);
                    System.out.print("remove location listener success");
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.print("remove location listener failed");
                }

                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER,
                        Constants.MIN_TIME_BW_UPDATES,
                        Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);

                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                }

                if (mCurrentLocation == null) {

                    System.out.println("Location Provoider:" + " GPS Location Fail: Network Location");

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
        CommonData.CurrentLocation = mCurrentLocation;
        return mCurrentLocation;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonDestroy");
        if (mGoogleApiClient.isConnected()) {
            mGoogleApiClient.disconnect();
        }
        if (compositeDisposable != null) {
            compositeDisposable.clear();
        }
        dismissDialog();
        try {
            Utiles.compositeClreate(compositeDisposable);
            Utiles.clearInstance();
            if (logoutAlert != null && logoutAlert.isShowing()) {
                logoutAlert.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @OnClick(R.id.currentlocation_imgbtn)
    public void onViewClicklocation() {
        mCurrentLocation = getFusedLocation();
        if (mCurrentLocation != null) {

            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE_ONTRIP)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();

            mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }
    }

    public void getAddress(final LatLng LatLng) {
        try {
            CommonData.Pickuplat = LatLng.latitude;
            CommonData.Pickuplng = LatLng.longitude;
            Geocoder geocoder;
            List<Address> addresses;
            geocoder = new Geocoder(this, Locale.getDefault());
            addresses = geocoder.getFromLocation(LatLng.latitude, LatLng.longitude, 1); // Here 1 represent max location result to returned, by documents it recommended 1 to 5
            String address = addresses.get(0).getAddressLine(0); // If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()
            CommonData.strPickupAddress = address;
            whereToTxt.setText(address);
            for (Address addresss : addresses) {
                CommonData.strCountryCode = addresss.getCountryCode();
                if (CommonData.strCountryCode != null && !CommonData.strCountryCode.isEmpty()) {
                    break;
                }
            }
            setCallNearbyService();
        } catch (Exception e) {
            e.printStackTrace();
            googleGeocoderPresenter.getAddressFromLocation(LatLng, context);

        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 0:
                if (resultCode == Activity.RESULT_OK) {
                    if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
                        moveToFragment(new OutStationFragment());
                    } else {
                        StartRequestFlow(true);
                    }
                } else {
                    stopAnim();
                }
                break;
            case 101:
                if (resultCode == Activity.RESULT_OK) {
                    StartRequestFlow(false);
                    EventBus.getDefault().postSticky(new EstimationChanges("estimation"));
                }

                break;
            case 102:
                if (resultCode == Activity.RESULT_OK) {
                    StartRequestFlow(false);
                    EventBus.getDefault().postSticky(new EstimationChanges("estimation"));
                }
                break;
            case 400:
                if (resultCode == Activity.RESULT_OK) {
                    Bundle b = data.getExtras();
                    LatLng latLng = new LatLng(b.getDouble("droplat"), b.getDouble("droplng"));
                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(latLng)                              // Sets the center of the map to current location
                            .zoom(Constants.MAP_ZOOM_SIZE_ONTRIP)
                            .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                            .build();
                    CommonData.Pickuplat = b.getDouble("droplat");
                    CommonData.Pickuplng = b.getDouble("droplng");
                    CommonData.strPickupAddress = CommonData.strSetpinAddress;
                    mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                    whereToTxt.setText(CommonData.strSetpinAddress);
                }

                break;
            case 500:
                if (resultCode == Activity.RESULT_OK) {
                    Bundle b = data.getExtras();
                    assert b != null;
                    LatLng latLng = new LatLng(b.getDouble("droplat"), b.getDouble("droplng"));
                    CommonData.Droplat = latLng.latitude;
                    CommonData.Droplng = latLng.longitude;
                    dropAddressTxt.setText(CommonData.strSetpinAddress);
                    destinationLatLng = latLng;
                    String droplatlng = String.valueOf(CommonData.Droplat) + "," + String.valueOf(CommonData.Droplng);
                    DatabaseReference trips_data = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
                    HashMap<String, Object> createTrip = new HashMap<>();
                    createTrip.put("Drop_address", CommonData.strSetpinAddress);
                    createTrip.put("Drop_latlng", droplatlng);
                    trips_data.updateChildren(createTrip);
                    DrawPolyline();
                    AsyncTask.execute(() -> {
                        updateLocationPresenter updateLocation = new updateLocationPresenter();
                        HashMap<String, String> map = new HashMap<>();
                        map.put("trip_id", SharedHelper.getKey(context, "trip_id"));
                        map.put("dropLat", String.valueOf(CommonData.Droplat));
                        map.put("dropLng", String.valueOf(CommonData.Droplng));
                        updateLocation.getUpdateDestinationLocation(activity, map);
                    });
                }

                break;
            case 1001:
                if (resultCode == Activity.RESULT_CANCELED) {

                }
                break;
        }

    }


    public void StartRequestFlow(Boolean isFirstTime) {
        if (isFirstTime) {
            if (fragmentslist != null && !fragmentslist.isEmpty()) {
                fragmentslist.clear();
            }
        }
        flowstatus = 1;
        if (isFirstTime) {
            bottomSheetcategory = new CategoryBottom(servieModel, getSupportFragmentManager());
            bottomSheetcategory.show(getSupportFragmentManager(), bottomSheetcategory.getTag());
        }
        CheckTheRadius(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng), new LatLng(CommonData.Droplat, CommonData.Droplng));
        FlowMode(false);
        RemoveCarMarker();


        if (isMultipleStop) {
            multiStopSegments();
        } else {
            setGoogleDirection(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng), new LatLng(CommonData.Droplat, CommonData.Droplng), null);
        }

        pickupAddressTxt.setText(CommonData.strPickupAddress);
        dropAddressTxt.setText(CommonData.strDropAddresss);
        menuImg.setImageResource(R.drawable.ic_arrow_back);
        menuImg.setVisibility(View.VISIBLE);
        CheckFavoriteLocation();
    }

    private void multiStopSegments() {
        CommonData.strDropAddresss = multipleAddressModels.get(multipleAddressModels.size() - 1).getStrAddress();
        final int[] i = {0};
        List<LatLng> latLngs = new ArrayList<>();
        CommonData.Pickuplat = multipleAddressModels.get(0).getDoubleLat();
        CommonData.Pickuplng = multipleAddressModels.get(0).getDoubleLng();
        CommonData.Droplat = multipleAddressModels.get(multipleAddressModels.size() - 1).getDoubleLat();
        CommonData.Droplng = multipleAddressModels.get(multipleAddressModels.size() - 1).getDoubleLng();
        Observable.fromIterable(multipleAddressModels)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribeOn(Schedulers.io())
                .subscribe(new Observer<MultipleAddressModel>() {
                    @Override
                    public void onSubscribe(Disposable d) {
                        compositeDisposable.add(d);
                    }

                    @Override
                    public void onNext(MultipleAddressModel multipleAddressModel) {
                        if (i[0] != 0 && i[0] != multipleAddressModels.size() - 1) {
                            if (!multipleAddressModel.getStrAddress().isEmpty()) {
                                latLngs.add(new LatLng(multipleAddressModel.getDoubleLat(), multipleAddressModel.getDoubleLng()));
                            }
                        }
                        i[0]++;
                    }

                    @Override
                    public void onError(Throwable e) {

                    }

                    @Override
                    public void onComplete() {
                        setGoogleDirection(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng), new LatLng(CommonData.Droplat, CommonData.Droplng), latLngs);
                    }
                });

    }

    public Location LatLngToLocation(String locatin, Double lat, Double lng) {
        final Location location = new Location(locatin);
        location.setLatitude(lat);
        location.setLongitude(lng);
        return location;
    }


    public void CheckTheRadius(LatLng pickupLatLng, LatLng destinationLatLng) {
        SphericalUtil.computeDistanceBetween(pickupLatLng, destinationLatLng);
        System.out.println("enter the radius" + SphericalUtil.computeDistanceBetween(pickupLatLng, destinationLatLng));
    }

    public void RemoveCarMarker() {
        for (Marker marker : markers.values()) {
            marker.remove();
        }
        markers.clear();
    }

    public void FlowMode(boolean starttrip) {
        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) currentlocationImgbtn.getLayoutParams();
        params.addRule(RelativeLayout.ABOVE, R.id.Servicecontainter);
        whereToTxt.setVisibility(View.GONE);
        if (mMap != null) {
            mMap.setPadding(0, 0, 0, 0);
        }
        if (pickuDragMarker.getVisibility() == View.VISIBLE) {
            pickuDragMarker.setVisibility(View.GONE);
        }
        if (nearbyLayout.getVisibility() == View.VISIBLE) {
            Utiles.hideLayout(nearbyLayout, context);
        }
        System.out.println("kkk " + SharedHelper.getKey(context, "ride_type"));
        if (starttrip) {
            if (!SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("rental")) {
                pickupDropLayout.setVisibility(View.VISIBLE);
            } else {
                pickupDropLayout.setVisibility(View.GONE);
            }
        } else {
            pickupDropLayout.setVisibility(View.GONE);
        }
    }


    @Override
    public void googlePolylineSuccess(Response<RoutesModel> resultsResponse) {
        if (resultsResponse == null || resultsResponse.body() == null) return;
        RoutesModel model = resultsResponse.body();
        System.out.println("DIRECTION STATUS:::" + model.getStatus());
        if (!"OK".equalsIgnoreCase(model.getStatus())) {
            stopAnim();
            return;
        }

        ArrayList<LatLng> directionPositionList = new ArrayList<>();
        RoutesModel.Route route = model.getRoutes().get(0);
        List<RoutesModel.Route.Leg> legList = route.getLegs();

        if (flowstatus != 0 || !"0".equals(Constants.FlowStatus)) {
            if (!tripStatus) {
                if (listLatLng != null) {
                    listLatLng.clear();
                }
                if (polyUtils != null) {
                    polyUtils.clrearAll();
                }
                try {
                    CommonData.strEncodePolyline = route.getOverviewPolyline().getPoints();
                    assert listLatLng != null;

                    for (int i = 0; i < legList.size(); i++) {
                        RoutesModel.Route.Leg leg = legList.get(i);
                        if (isMultipleStop && i != 0) {
                            RoutesModel.Route.Leg.StartLocation startLoc = leg.getStartLocation();
                            mMap.addMarker(new MarkerOptions()
                                    .position(new LatLng(startLoc.getLat(), startLoc.getLng()))
                                    .icon(BitmapDescriptorFactory.fromResource(R.mipmap.ic_stop)));
                        }
                        for (RoutesModel.Route.Leg.Step step : leg.getSteps()) {
                            String polyline = step.getPolyline().getPoints();
                            listLatLng.addAll(decodePolyline(polyline));
                        }
                    }
                    polyUtils = new PolyUtils(this, mMap, listLatLng);
                    polyUtils.setSourceAddress(new MyAddress(CommonData.strPickupAddress, null));
                    polyUtils.setDestinationAddress(new MyAddress(
                            CommonData.strDropAddresss,
                            legList.get(0).getDuration().getText()));
                    polyUtils.start();
                    Geofire(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng), carcategory);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("ON DIRECTION COMING 3");
                if (destLatLng == null && filterLocation != null) {
                    destLatLng = new LatLng(filterLocation.getLatitude(), filterLocation.getLongitude());
                }
                for (int i = 0; i < legList.size(); i++) {
                    RoutesModel.Route.Leg leg = legList.get(i);
                    if (i != 0) {
                        RoutesModel.Route.Leg.StartLocation startLoc = leg.getStartLocation();
                        mMap.addMarker(new MarkerOptions()
                                .position(new LatLng(startLoc.getLat(), startLoc.getLng()))
                                .icon(BitmapDescriptorFactory.fromResource(R.mipmap.ic_stop)));
                    }
                    for (RoutesModel.Route.Leg.Step step : leg.getSteps()) {
                        String polyline = step.getPolyline().getPoints();
                        directionPositionList.addAll(decodePolyline(polyline));
                    }
                }
                if (mPolyline == null) {
                    mPolyline = mMap.addPolyline(DirectionConverter.createPolyline(this, directionPositionList, 5, Color.BLUE));
                } else {
                    mPolyline.setPoints(directionPositionList);
                }
            }
        } else {
            stopAnim();
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

    public void onDirectionSuccessPlaceMarker() {
        LatLng curPos = new LatLng(startLatLng.latitude, startLatLng.longitude);
        if (curPos.latitude != 0 && curPos.longitude != 0) {
            zoomCameraToPosition(curPos);
        }
        if (myMarker == null) {
            myMarker = mMap.addMarker(new MarkerOptions().position(startLatLng).icon(bitmapDescriptor).flat(true));
            myMarker.setAnchor(0.5f, 0.5f);
            myMarker.setRotation(getBearing);

        } else {
            if (prevLatLng != new LatLng(0, 0)) {
                if (!(prevLatLng.equals(startLatLng))) {
                    double[] startValues = new double[]{prevLatLng.latitude, prevLatLng.longitude};
                    double[] endValues = new double[]{curPos.latitude, curPos.longitude};
                    animateMarkerTo(myMarker, startValues, endValues, getBearing);
                } else {
                    myMarker.setRotation(getBearing);
                }
            } else {
                myMarker.setPosition(curPos);
                myMarker.setRotation(getBearing);
            }

            prevLatLng = new LatLng(startLatLng.latitude, startLatLng.longitude);
        }
        if (Constants.FlowStatus.equals("1") || Constants.FlowStatus.equals("2")) {
            if (pickUPrDropMarker != null)
                pickUPrDropMarker.remove();
            System.out.println("pick location ===>" + pickupLatLng);
            if (pickupLatLng != null) {
                pickUPrDropMarker = mMap.addMarker(new MarkerOptions().position(pickupLatLng).icon(BitmapDescriptorFactory.fromResource(R.mipmap.ub__ic_pin_pickup)));

            }
        } else {
            if (pickUPrDropMarker != null)
                pickUPrDropMarker.remove();
            if (destinationLatLng != null) {
                pickUPrDropMarker = mMap.addMarker(new MarkerOptions().position(destinationLatLng).icon(BitmapDescriptorFactory.fromResource(R.mipmap.ub__ic_pin_dropoff)));
            }
        }

    }

    public void zoomCameraToPosition(LatLng curPos) {
        boolean contains = mMap.getProjection().getVisibleRegion().latLngBounds.contains(curPos);
        if (!contains) {
            float zoomPosition;
            zoomPosition = Constants.MAP_ZOOM_SIZE_ONTRIP;
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(curPos)                              // Sets the center of the map to current location
                    .zoom(zoomPosition)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();
            mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }


    }


    private void stopAnim() {
        if (mMap != null) {
            MapAnimator.getInstance().stopAnim();
            if (polyUtils != null) {
                polyUtils.clrearAll();
            }
            if (myMarker != null) {
                myMarker.remove();
                myMarker = null;
            }
        }
    }


    public void setGoogleDirection(LatLng startLatLng, LatLng destionation, List<LatLng> latLngs) {
        Log.e("pickup", "pickup location" + startLatLng);
        Log.e("drop", "drop location" + destionation);
        if (isMultipleStop && !latLngs.isEmpty()) {
            googlePolylinePresenter.getDrawPolyline(startLatLng, destionation, latLngs);
        } else {
            isMultipleStop = false;
            googlePolylinePresenter.getDrawPolyline(startLatLng, destionation, null);
        }
    }

    @Override
    public void onKeyEntered(String key, GeoLocation location) {
        Log.e(Tag, "enter the location" + location);
        System.out.println("Driver ID call listion key enter===>" + key);
        if (location != null && !tripStatus) {
            EventBus.getDefault().postSticky(new RequestStatus("Request Now"));
            if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
                requestBtn.setText(R.string.continues);
            } else {
                requestBtn.setText(R.string.request_now);
            }
            /*if (!requestBtn.isEnabled()) {
                requestBtn.setEnabled(true);
                requestBtn.setAlpha(1.0f);
            }*/
          /*  if(markers.isEmpty()){
                setCallNearbyService();
            }*/
            if (!markers.containsKey(key)) {

                Marker marker = mMap.addMarker(new MarkerOptions().position(new LatLng(location.latitude, location.longitude))
                        .icon(bitmapDescriptor).flat(true));
                marker.setFlat(true);
                marker.setVisible(true);
                marker.setAnchor(0.5f, 0.5f);
                this.markers.put(key, marker);
            }


        }

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onKeyExited(String key) {
        Marker marker = this.markers.get(key);
        if (marker != null) {
            this.markers.remove(key);
            if (markers.size() == 0) {
                setCallNearbyService();
                //  requestBtn.setText(R.string.no_vehicle);
                /*if (requestBtn.isEnabled()) {
                    requestBtn.setEnabled(false);
                    requestBtn.setAlpha(0.5f);
                }*/
            }
            marker.remove();
        }
    }

    @Override
    public void onKeyMoved(String key, GeoLocation location) {
        System.out.println("Driver ID call listion key call check===>" + key);
        // Move the marker
        Marker marker = this.markers.get(key);

        if (marker != null) {

            //new moveKeyAsync(marker, location.latitude, location.longitude,keyMovedBear).execute();


            LatLng curPos, prevPos;

            prevPos = new LatLng(marker.getPosition().latitude, marker.getPosition().latitude);
            curPos = new LatLng(location.latitude, location.latitude);


            if (!prevPos.equals(curPos)) {

                double[] startValues = new double[]{marker.getPosition().latitude, marker.getPosition().longitude};
                double[] endValues = new double[]{location.latitude, location.longitude};
                System.out.println("Driver ID call listion key moved===>" + key);
                this.animateMarkerTo(marker, startValues, endValues, getDriverBearing(key));

            }

        }
    }

    @Override
    public void onGeoQueryReady() {
        Log.e(Tag, "geofire start");
    }

    @Override
    public void onGeoQueryError(DatabaseError error) {
        Log.e(Tag, "geofire error" + error.getMessage());
    }

    private void animateMarkerTo(final Marker marker, double[] startValues, double[] endValues, float rotate) {

        ValueAnimator latLngAnimator = ValueAnimator.ofObject(new DoubleArrayEvaluator(), startValues, endValues);
        latLngAnimator.setDuration(3000);
        latLngAnimator.setInterpolator(new DecelerateInterpolator());
        latLngAnimator.addUpdateListener(animation -> {
            double[] animatedValue = (double[]) animation.getAnimatedValue();
            marker.setPosition(new LatLng(animatedValue[0], animatedValue[1]));
        });
        latLngAnimator.start();
        marker.setRotation(rotate);
    }

    @OnClick(R.id.work_imgbtn)
    public void onWorkImgbtnClicked() {
        CommonData.Droplat = Double.parseDouble(SharedHelper.getKey(context, "worklat"));
        CommonData.Droplng = Double.parseDouble(SharedHelper.getKey(context, "worklng"));
        CommonData.strDropAddresss = SharedHelper.getKey(context, "workaddress");
        StartRequestFlow(true);
    }

    @OnClick(R.id.home_imgbtn)
    public void onHomeImgbtnClicked() {
        CommonData.Droplat = Double.parseDouble(SharedHelper.getKey(context, "homelat"));
        CommonData.Droplng = Double.parseDouble(SharedHelper.getKey(context, "homelng"));
        CommonData.strDropAddresss = SharedHelper.getKey(context, "homeaddress");
        StartRequestFlow(true);
    }

    @Override
    public void onwalletSuccessfully(Response<WalletBalanceModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            SharedHelper.putKey(context, "wallet_amout", Response.body().getBalance());
            setTextWalletBalance();
        }

    }

    @Override
    public void onwalletFailure(Response<WalletBalanceModel> Response) {

    }

    @Override
    public void onaddwalletSuccessfully(Response<AddWalletModel> Response) {

    }

    @Override
    public void onaddwalletFailure(Response<AddWalletModel> Response) {

    }

    @Override
    public void geocoderOnSucessful(GeocoderModel geocoderModel) {
        if (geocoderModel.getStatus().equalsIgnoreCase("OK")) {
            CommonData.strPickupAddress = geocoderModel.getResults().get(0).getFormattedAddress();

        } else {
            googleGeocoderPresenter.getAddressFromLocation(new LatLng(CommonData.CurrentLocation.getLatitude(), CommonData.CurrentLocation.getLongitude()), context);
        }

    }

    @Override
    public void geocoderOnFailure(Throwable throwable) {

    }

    @Override
    public boolean onLongClick(View v) {
        switch (v.getId()) {
            case R.id.pickup_address_txt:
                GOtoFavoriteLocation();
                CommonData.isPickup = true;
                break;
            case R.id.drop_address_txt:
                GOtoFavoriteLocation();
                CommonData.isPickup = false;
                break;

        }
        return false;
    }

    private LatLng Centerlatlng;

    @Override
    public void onCameraIdle() {
        System.out.println("enter the cameraidle lisioner" + SharedHelper.getKey(context, "trip_id"));
        Centerlatlng = mMap.getCameraPosition().target;
        if (SharedHelper.getKey(context, "trip_id").isEmpty() || SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("null") || SharedHelper.getKey(context, "trip_id").equalsIgnoreCase("0")) {
            if (pickuDragMarker.getVisibility() == View.VISIBLE) {
                if (Centerlatlng != null) {
                    if (nearbyLayout.getVisibility() == View.GONE) {
                        Utiles.showLayout(nearbyLayout, context);
                        currentlocationImgbtn.setVisibility(View.VISIBLE);
                        support_imgbtn.setVisibility(View.VISIBLE);
                    }
                    CommonData.Pickuplat = Centerlatlng.latitude;
                    CommonData.Pickuplng = Centerlatlng.longitude;
                    setCallNearbyService();
                    try {
                        new GetLocationAsync(Centerlatlng.latitude, Centerlatlng.longitude).execute();
                        Geofire(new LatLng(Centerlatlng.latitude, Centerlatlng.longitude), carcategory);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } else if (ischeck) {
                ischeck = false;
                CommonData.Pickuplat = Centerlatlng.latitude;
                CommonData.Pickuplng = Centerlatlng.longitude;
                setCallNearbyService();
                try {
                    new GetLocationAsync(Centerlatlng.latitude, Centerlatlng.longitude).execute();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

    @Override
    public void OnSuccess(Response<ServiceModel> response) {
        assert response.body() != null;
        servieModel.clear();
        if (response.body().getVehicleCategories() != null && !response.body().getVehicleCategories().isEmpty()) {
            if (response.body().getVehicleCategories().isEmpty()) {
                return;
            }
            if (servieModel != null && !servieModel.isEmpty()) {
                servieModel.clear();
            }
            assert servieModel != null;
            servieModel.addAll(response.body().getVehicleCategories());
            noServiceLinearlayout.setVisibility(View.GONE);
            recylerCartype.setVisibility(View.VISIBLE);
            if (servieModel != null && !servieModel.isEmpty()) {
                if (serviceAdapter == null) {
                    if (strVehicleCode.equalsIgnoreCase("HomeIntent")) {
                        if (CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
                            moveToFragment(new OutStationFragment());
                        } else {
                            StartRequestFlow(true);
                        }
                    } else if (strVehicleCode.equalsIgnoreCase("Outstation")) {
                        moveToFragment(new OutStationFragment());
                    } else if (strVehicleCode.equalsIgnoreCase("Riderlater")) {
                        new RiderLaterFragment().show(getSupportFragmentManager(), "riderlater");
                        isClear();
                    } else if (strVehicleCode.equalsIgnoreCase("Rental")) {
                        moveToFragment(new RentalFragment());
                    } else if (strVehicleCode.equalsIgnoreCase("TwoDriver")) {
                        bottomSheetCarDropFragment = new CarDropFragment();
                        bottomSheetCarDropFragment.show(getSupportFragmentManager(), bottomSheetCarDropFragment.getTag());
                        getSupportFragmentManager().executePendingTransactions();
                        bottomSheetCarDropFragment.getDialog().setOnDismissListener(dialog -> {
                            finish();
                        });
                        isClear();
                    }
                    serviceAdapter = new ServiceAdapter(activity, servieModel, this);
                    recylerCartype.setAdapter(serviceAdapter);
                } else {
                    serviceAdapter.notifyDataSetChanged();
                }
            }
            rideLayout.setVisibility(View.GONE);
        } else {
            noServiceLinearlayout.setVisibility(View.VISIBLE);
            recylerCartype.setVisibility(View.GONE);
            rideLayout.setVisibility(View.GONE);
            if (response.body().getPhone() != null) {
                icCallImgbtn.setVisibility(View.VISIBLE);
                supportNumber = response.body().getPhone();
            }
        }
        strPickupCity = response.body().getPickupCity();
    }

    private String supportNumber = "";

    @Override
    public void OnFailure(Response<ServiceModel> response) {
        noServiceLinearlayout.setVisibility(View.VISIBLE);
        rideLayout.setVisibility(View.GONE);
        recylerCartype.setVisibility(View.GONE);
        try {
            assert response.errorBody() != null;
            String message = response.errorBody().string();
            ErrorModel errorModel = new Gson().fromJson(message, ErrorModel.class);
            if (errorModel.getPhone() != null) {
                icCallImgbtn.setVisibility(View.VISIBLE);
                supportNumber = errorModel.getPhone();
                System.out.println("enter the service number" + supportNumber);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void show() {
        if (serviceAdapter == null) {
            loaderView.setVisibility(View.VISIBLE);
        }

    }

    @Override
    public void hide() {
        if (loaderView.getVisibility() == View.VISIBLE) {
            loaderView.setVisibility(View.GONE);
        }
    }

    @Override
    public void onPaymentSuccess(String s) {
        EventBus.getDefault().postSticky(new MakePaymentEvent(s));
    }

    @Override
    public void onPaymentError(int i, String s) {
        Utiles.CommonToast(activity, s);

    }

    public class DoubleArrayEvaluator implements TypeEvaluator<double[]> {

        private double[] mArray;

        /**
         * Create a DoubleArrayEvaluator that does not reuse the animated value. Care must be taken
         * when using this option because on every evaluation a new <code>double[]</code> will be
         * allocated.
         *
         * @see #DoubleArrayEvaluator(double[])
         */
        public DoubleArrayEvaluator() {
        }

        /**
         * Create a DoubleArrayEvaluator that reuses <code>reuseArray</code> for every evaluate() call.
         * Caution must be taken to ensure that the value returned from
         * {@link ValueAnimator#getAnimatedValue()} is not cached, modified, or
         * used across threads. The value will be modified on each <code>evaluate()</code> call.
         *
         * @param reuseArray The array to modify and return from <code>evaluate</code>.
         */
        public DoubleArrayEvaluator(double[] reuseArray) {
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

    public synchronized float getDriverBearing(String key) {
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("drivers_location").child(carcategory).child(key).child("bearing");
        databaseReference.keepSynced(true);
        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    String status = dataSnapshot.getValue().toString();
                    if (isFloat(status)) {
                        driverBearing = Float.parseFloat(status);
                    } else {
                        driverBearing = (float) Integer.parseInt(status);
                    }

                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
        return driverBearing;
        //return 0;
    }

    boolean isFloat(String str) {
        try {

            Float.parseFloat(str);

            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public void setGeofire(GeoFire geofire) {
        this.geoFire = geofire;
    }


    public GeoFire getGeofire() {
        return geoFire;
    }

    public void Geofire(LatLng latLng, String ServiceType) {
        if (!CommonData.strVehicleCode.equalsIgnoreCase("Outstation")) {
            //requestBtn.setText(R.string.no_vehicle);
            /*if (requestBtn.isEnabled()) {
                requestBtn.setEnabled(false);
                requestBtn.setAlpha(0.5f);
            }*/
        } else {
            /*if (!requestBtn.isEnabled()) {
                requestBtn.setEnabled(true);
                requestBtn.setAlpha(1.0f);
            }*/
        }
        removeGeofire();
        geoFire = new GeoFire(FirebaseDatabase.getInstance().getReference().child("drivers_location").child(ServiceType.trim()));
        setGeofire(geoFire);
        try {
            if (markers != null && !markers.isEmpty()) {
                for (Marker marker : this.markers.values()) {
                    marker.setVisible(false);
                    marker.remove();
                }
                markers.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        geoQuery = getGeofire().queryAtLocation(new GeoLocation(latLng.latitude, latLng.longitude), 4);
        if (this.geoQuery != null) {
            this.geoQuery.setCenter(new GeoLocation(latLng.latitude, latLng.longitude));
            // radius in km Dynamic_Radious
            this.geoQuery.setRadius(4);
            this.geoQuery.addGeoQueryEventListener(this);
            System.out.println("geo status: geo queery started in on connected");
        } else {
            Toast.makeText(this, "Geoquery Null", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonStart");
        mGoogleApiClient.connect();
        if (!EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().register(this);
        // add an event listener to start updating locations again
        if (!tripStatus) {
            if (geoQuery != null) {
                try {
                    this.geoQuery.addGeoQueryEventListener(this);
                    System.out.println("geo status: geo queery started in on start");
                } catch (NullPointerException e) {
                    System.out.print("Geo query event listener Null Point exception" + e);
                } catch (IllegalArgumentException e) {
                    System.out.print("Geo query event listener Illegal Argument exception" + e);
                }
            }
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonStop");
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);
        // remove all event listeners to stop updating in the background
        removeGeofire();
    }

    private void removeGeofire() {
        if (geoQuery != null) {
            this.geoQuery.removeAllListeners();
            if (markers != null) {
                for (Marker marker : this.markers.values()) {
                    marker.setVisible(false);
                    marker.remove();

                }
                this.markers.clear();
            }

        }
    }


    public void Alertdialog(String Message) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(activity.getResources().getString(R.string.logout));
        builder1.setMessage(Message);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    dialog.dismiss();
                    try {
                        CommonData.addressList.clear();
                        fragmentslist.clear();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    SharedHelper.clearSharedPreferences(context);
                    mAuth.signOut();
                    Utiles.clearCache(activity);
                    RemoveListener();
                    LogoutPresenter logoutPresenter = new LogoutPresenter();
                    logoutPresenter.LogoutData(activity);
                    SharedHelper.clearSharedPreferences(context);
                    Intent intent = new Intent(context, WelcomeActivity.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    ActivityCompat.finishAffinity(MainActivity.this);
                });
        builder1.setNegativeButton(R.string.no, (dialog, which) -> dialog.dismiss());
        logoutAlert = builder1.create();
        logoutAlert.show();


    }

    public void driverNotAvailableDialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(R.string.choose_driver_type);
        builder1.setMessage(R.string.driver_not_available);
        builder1.setCancelable(true);
        logoutAlert = builder1.create();
        logoutAlert.show();
    }


    public void LastTripStatusCheck() {
        if (LastTripDatabase != null) {
            LastTripDatabase.removeEventListener(LastTripValueEvent);
        }
        LastTripDatabase = FirebaseDatabase.getInstance().getReference().child("riders_data").child(SharedHelper.getKey(context, "userid"));
        LastTripDatabase.keepSynced(true);
        LastTripValueEvent = LastTripDatabase.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    if (dataSnapshot.child("tripstatus").getValue() == null) {
                        return;
                    }
                    String currentStatus = dataSnapshot.child("tripstatus").getValue().toString();
                    RemoveView(currentStatus);
                    Object cancelExceeds = dataSnapshot.child("cancelExceeds").getValue();
                    Object oldBalances = dataSnapshot.child("oldBalance").getValue();
                    Object lastCanceledDate = dataSnapshot.child("lastCanceledDate").getValue();
                    String currentdate = getDateFormate();
                    if (cancelExceeds != null && cancelExceeds.toString().equals("1")
                            && lastCanceledDate != null
                            && lastCanceledDate.toString().equalsIgnoreCase(currentdate)) {
                        CommonFirebaseListoner.cancelExceedss = cancelExceeds.toString();
                        CommonFirebaseListoner.riderAlert(activity, CommonFirebaseListoner.riderCancelLimiitExceeds);
                    } else {
                        CommonFirebaseListoner.cancelExceedss = "0";
                        if (cancelExceeds == null) {
                            Utiles.ClearFirabae(SharedHelper.getKey(context, "userid"));
                        } else if (!cancelExceeds.equals("0") && lastCanceledDate != null && !lastCanceledDate.equals("0")) {
                            Utiles.ClearFirabae(SharedHelper.getKey(context, "userid"));
                        }
                    }
                    if (oldBalances != null && !oldBalances.toString().isEmpty()) {
                        CommonFirebaseListoner.oldBalance = oldBalances.toString();
                    } else {
                        CommonFirebaseListoner.oldBalance = "0";
                    }
                    new Handler().postDelayed(() -> {
                        if (!currentStatus.equalsIgnoreCase("0") && !Constants.CheckRiderStatus.equalsIgnoreCase(currentStatus)) {
                            Constants.CheckRiderStatus = currentStatus;
                            Checkstatus(currentStatus, dataSnapshot);
                        }
                    }, 1000);

                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("tag", databaseError.getMessage());
            }
        });
    }


    public String getDateFormate() {
        Date c = Calendar.getInstance().getTime();
        System.out.println("Current time => " + c);
        SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        String formattedDate = df.format(c);
        System.out.println("Current date formate => " + formattedDate);
        return formattedDate.replaceAll(" ", "");
    }

    public void RemoveView(String status) {
        if (status != null && status.equalsIgnoreCase("No Driver Found") | status.equalsIgnoreCase("Accepted")) {
            compositeDisposable.add(Observable.timer(1, TimeUnit.SECONDS, AndroidSchedulers.mainThread())
                    .subscribe(aLong -> {
                        if (status.equalsIgnoreCase("No Driver Found")) {
                            NormalMode();
                            menuImg.setImageResource(R.drawable.ic_menu_layer);
                            tripStatus = false;
                            Constants.TripFlowFragmant = null;
                            Utiles.ClearFirebase(SharedHelper.getKey(context, "userid"));
                            Intent intent = new Intent(this, HomeActivity.class);
                            startActivity(intent);
                            finish();
                        } else {
                            tripStatus = true;
                        }
                        stopAnim();
                        flowstatus = 0;
                        CheckFavoriteLocation();
                        RemoveFragment(flowFragment);
                    }));
        }
    }

    @SuppressLint("SetTextI18n")
    public void Checkstatus(String status, DataSnapshot dataSnapshot) {
        System.out.println("STATUS DRIVER :::" + status);
        switch (status) {
            case "Processing":
                isFirstTime = true;
                flowstatus = 1;
                flowFragment = new RequestFragment();
                FLowoverlay(flowFragment);
                CommonData.strRequestId = dataSnapshot.child("requestId").getValue().toString();
                CheckFavoriteLocation();
                break;
            case "No Driver Found":
                noDriverFoundUI();
                break;
            case "Accepted":
                System.out.println("CURRENT TRIP ID::::" + Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString());
                if (!Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString().equalsIgnoreCase("0") || !Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString().equalsIgnoreCase("")) {
                    tripStatus = true;
                    isFirstTime = true;
                    SharedHelper.putKey(context, "trip_id", Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString());
                    SharedHelper.putKey(context, "driver_id", Objects.requireNonNull(dataSnapshot.child("tripdriver").getValue()).toString());
                    if (mMap != null) {
                        mMap.clear();
                    }
                    RemoveGoeFire();
                    resetMarker();
                    compositeDisposable.add(Observable.timer(1, TimeUnit.SECONDS, AndroidSchedulers.mainThread())
                            .subscribe(aLong -> {
                                if (Constants.TripFlowFragmant instanceof RequestFragment) {
                                    RemoveFragment(Constants.TripFlowFragmant);
                                }
                                removeAllFragments(FragmentManage);
                                AddToken(Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString(), context);
                            }, Throwable::printStackTrace));
                    compositeDisposable.add(Observable.timer(1, TimeUnit.SECONDS, AndroidSchedulers.mainThread())
                            .subscribe(aLong -> {
                                if (SharedHelper.getKey(this, "trip_id") != null && !SharedHelper.getKey(this, "trip_id").equalsIgnoreCase("null") && !SharedHelper.getKey(this, "trip_id").isEmpty() && !SharedHelper.getKey(this, "trip_id").equalsIgnoreCase("0")) {
                                    FirebaseTripFlow();
                                }
                            }, Throwable::printStackTrace));
                }
                break;
            case "No Female Driver Found So Please You Can Try Male Driver":
                noDriverFoundUI();
                break;
            case "canceled":
                flowstatus = 0;
                CommonData.Droplng = 0.0;
                CommonData.Droplat = 0.0;
                menuImg.setImageResource(R.drawable.ic_menu_layer);
                RemoveFragment(Constants.TripFlowFragmant);
                tripStatus = false;
                RemoveflowPolyline();
                if (flowLayout.getVisibility() == View.VISIBLE) {
                    flowLayout.setVisibility(View.GONE);
                }

                stopAnim();
                if (mCurrentLocation != null) {
                    Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);

                }
                stopAnim();
                setCurrentlocation();
                CheckFavoriteLocation();

                break;

        }

    }

    private void noDriverFoundUI() {
        try {
            CommonData.gender = "";
            Utiles.CommonToast(activity, activity.getResources().getString(R.string.sorry_no_cabs_are_available));
            tripStatus = false;
            setCurrentlocation();
            NormalMode();
            menuImg.setImageResource(R.drawable.ic_menu_layer);
            stopAnim();
            flowstatus = 0;
            compositeDisposable.add(Observable.timer(1, TimeUnit.SECONDS, AndroidSchedulers.mainThread())
                    .subscribe(aLong -> {
                        removeAllFragments(FragmentManage);
                        RemoveFragment(Constants.TripFlowFragmant);
                    }, Throwable::printStackTrace));
            if (!fragmentslist.isEmpty()) {
                fragmentslist.clear();
            }
            Constants.TripFlowFragmant = null;
            Utiles.ClearFirebase(SharedHelper.getKey(context, "userid"));
            CheckFavoriteLocation();
            finish();
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }
    }

    private void searchMaleDrivers() {
        Utiles.ClearFirebase(SharedHelper.getKey(context, "userid"));
        CommonData.gender = "female";
        EventBus.getDefault().postSticky(new FemaleDriverFlow("female"));
        if (bottomSheetcategory != null) {
            bottomSheetcategory.dismiss();
        }
        ServiceFagment = new RedEstimateFragment();
        fragmentslist.add(ServiceFagment);
        ServiceFow(ServiceFagment);
    }


    public void NormalMode() {
        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) currentlocationImgbtn.getLayoutParams();
        params.addRule(RelativeLayout.ABOVE, R.id.nearby_layout);

        whereToTxt.setVisibility(View.VISIBLE);
        menuImg.setVisibility(View.VISIBLE);
        pickupDropLayout.setVisibility(View.GONE);
        if (pickuDragMarker.getVisibility() == View.GONE) {
            pickuDragMarker.setVisibility(View.VISIBLE);
        }
        menuImg.setImageResource(R.drawable.ic_menu_layer);
        if (nearbyLayout.getVisibility() == View.GONE) {
            Utiles.showLayout(nearbyLayout, context);
        }
    }

    public void RemoveFragment() {

        try {
            if (FragmentManage != null) {
                if (FragmentManage.getBackStackEntryCount() > 0) {
                    FragmentManage.popBackStackImmediate();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void Reintialize() {
        FragmentManage = getSupportFragmentManager();
    }

    public void FirebaseTripFlow() {
        RemoveRefenceListioner(TripFlowReference, TripFlowValue);
        TripFlowReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        TripFlowReference.keepSynced(true);
        TripFlowValue = TripFlowReference.addValueEventListener(new ValueEventListener() {
                                                                    @Override
                                                                    public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                                                                        if (dataSnapshot.getValue() != null) {
                                                                            Object status = dataSnapshot.child("status").getValue();
                                                                            Object driver_token = dataSnapshot.child("driver_token").getValue();
                                                                            if (status != null) {
                                                                                if (!Constants.FlowStatus.equalsIgnoreCase(status.toString())) {
                                                                                    Constants.FlowStatus = status.toString();
                                                                                    menuImg.setVisibility(View.GONE);
                                                                                    TripFlowSwitch(status.toString());
                                                                                }
                                                                                if (driver_token != null && !driver_token.equals("0")) {
                                                                                    Constants.strDriver = driver_token.toString();
                                                                                }
                                                                            }
                                                                        }
                                                                    }

                                                                    @Override
                                                                    public void onCancelled(@NonNull DatabaseError databaseError) {
                                                                        new Handler().postDelayed(() -> {
                                                                            Log.d("FirebaseTripFlow", "Retrying FirebaseTripFlow after cancellation...");
                                                                            FirebaseTripFlow();
                                                                        }, 3000);
                                                                    }
                                                                }
        );
    }

    @SuppressLint("SetTextI18n")
    public void TripFlowSwitch(final String status) {
        currentlocationImgbtn.setVisibility(View.VISIBLE);
        support_imgbtn.setVisibility(View.VISIBLE);
        emegencyImgbtn.setVisibility(View.VISIBLE);
        switch (status) {
            case "1":
                flowstatus = 1;
                tripStatus = true;
                TripTitle.setText(R.string.your_driver_is_on_the_way);
                menuImg.setVisibility(View.GONE);
                flowLayout.setVisibility(View.GONE);
                Constants.TripFlowFragmant = null;
                DrawPolyline();
                FlowMode(true);
                removeGeofire();
                CheckFavoriteLocation();
                CallFlowFragment();
                EventBus.getDefault().postSticky(new TripStatus(status));
                menuImg.setImageResource(R.drawable.ic_menu_layer);
                break;
            case "2":
                tripStatus = true;
                emegencyImgbtn.setVisibility(View.GONE);
                flowstatus = 1;
                TripTitle.setText(R.string.driver_has_arrived);
                if (flowLayout.getVisibility() == View.GONE) {
                    flowLayout.setVisibility(View.GONE);
                }
                menuImg.setVisibility(View.GONE);
                FlowMode(true);
                RemoveGoeFire();
                CallFlowFragment();
                DrawPolyline();
                CheckFavoriteLocation();
                EventBus.getDefault().postSticky(new TripStatus(status));
                break;
            case "3":
                emegencyImgbtn.setVisibility(View.VISIBLE);
                tripStatus = true;
                isFirstTime = true;
                flowstatus = 1;
                menuImg.setVisibility(View.GONE);
                TripTitle.setText(R.string.welcome_happy_ride);
                if (flowLayout.getVisibility() == View.GONE) {
                    flowLayout.setVisibility(View.GONE);
                }
                FlowMode(true);
                RemoveGoeFire();
                DrawPolyline();
                CheckFavoriteLocation();
                CallFlowFragment();
                EventBus.getDefault().postSticky(new TripStatus(status));
                if (startLatLng != null && mMap != null) {
                    onDirectionSuccessPlaceMarker();
                }
                if (!multiLocations.isEmpty() && stopsImgbtn.getVisibility() == View.GONE) {
                    stopsImgbtn.setVisibility(View.VISIBLE);
                }
                break;
            case "4":
                startLatLng = null;
                currentlocationImgbtn.setVisibility(View.GONE);
                support_imgbtn.setVisibility(View.GONE);
                emegencyImgbtn.setVisibility(View.GONE);
                stopsImgbtn.setVisibility(View.GONE);
                menuImg.setVisibility(View.GONE);
                dismissDialog();
                mMap.clear();
                resetMarker();
                CommonData.Droplng = 0.0;
                CommonData.Droplat = 0.0;
                RemoveFLowCarLister();
                tripStatus = false;
                flowstatus = 0;
                if (flowLayout.getVisibility() == View.GONE) {
                    flowLayout.setVisibility(View.GONE);
                }
                TripTitle.setText(R.string.your_trip_has_eded);
                FlowMode(true);
                RemoveFragment(Constants.TripFlowFragmant);
                Constants.TripFlowFragmant = new SummaryFragment();
                moveToFragment(Constants.TripFlowFragmant);
                if (mCurrentLocation != null) {
                    Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
                }
                setCurrentlocation();
                RemoveflowPolyline();
                CheckFavoriteLocation();
                walletPResenter();
                stopAnim();
                TripFlowReference.removeEventListener(TripFlowValue);
                break;
            case "5":
                System.out.println("STATUS DRIVER TripFlowSwitch :::" + status);
                SharedHelper.putKey(context, "trip_id", "null");
                flowstatus = 0;
                mMap.clear();
                resetMarker();
                currentlocationImgbtn.setVisibility(View.GONE);
                support_imgbtn.setVisibility(View.GONE);
                emegencyImgbtn.setVisibility(View.GONE);
                stopsImgbtn.setVisibility(View.GONE);
                Constants.TripFlowFragmant = null;
                CheckFavoriteLocation();
                if (flowLayout.getVisibility() == View.VISIBLE) {
                    flowLayout.setVisibility(View.GONE);
                }
                RemoveFragment(Constants.TripFlowFragmant);
                removeAllFragments(FragmentManage);
                startLatLng = null;
                tripStatus = false;
                CommonData.Droplng = 0.0;
                CommonData.Droplat = 0.0;
                NormalMode();
                stopAnim();
                RemoveFLowCarLister();
                Utiles.ClearFirebase(SharedHelper.getKey(context, "userid"));
                if (mCurrentLocation != null) {
                    Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
                }
                setCurrentlocation();
                RemoveflowPolyline();
                TripFlowReference.removeEventListener(TripFlowValue);
                Intent intent = new Intent(this, HomeActivity.class);
                startActivity(intent);
                finish();
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

    public void RemoveFLowCarLister() {
        if (TripFlowCarDataBase != null) {
            TripFlowCarDataBase.removeEventListener(TripFlowCarValue);
        }
        if (pickUPrDropMarker != null) {
            pickUPrDropMarker.remove();
            pickUPrDropMarker = null;

        }
        resetMarker();
    }

    public void CallFlowFragment() {
        if (Constants.TripFlowFragmant == null) {
            Constants.TripFlowFragmant = new TripFlowFragment();
            ServiceFow(Constants.TripFlowFragmant);
        } else {
            if (pickupAddressTxt.getText().toString().trim().isEmpty() || dropAddressTxt.getText().toString().trim().isEmpty()) {
                Constants.TripFlowFragmant = new TripFlowFragment();
                ServiceFow(Constants.TripFlowFragmant);
            }
        }
    }

    public void RemoveGoeFire() {
        System.out.println("enter the marker size" + markers.size());
        for (Marker marker : markers.values()) {
            marker.remove();
            System.out.println("enter the marker remove in android");
        }
        markers.clear();
        if (geoQuery != null) {
            geoQuery.removeAllListeners();
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onResume() {
        super.onResume();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonResume");
        setTextWalletBalance();
        CheckFavoriteLocation();

        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, context);
        txtUserName.setText(Utiles.NullPointer(SharedHelper.getKey(context, "fname")) + " " + Utiles.NullPointer(SharedHelper.getKey(context, "lname")));

    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onPause() {
        super.onPause();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonPause");

    }


    @SuppressLint("SetTextI18n")
    @Override
    protected void onRestart() {
        super.onRestart();
        System.out.println("1a" + isFinishing());
        System.out.println("1aonRestart");

    }


    @SuppressLint("SetTextI18n")
    public void setTextWalletBalance() {
        /*if (!SharedHelper.getKey(context, "wallet_amout").isEmpty()) {
            wallet_balance_txt.setText("Wallet Balance : $" + SharedHelper.getKey(context, "wallet_amout"));
        }*/

    }

    public static String getCountryCode(Context context, double latitude, double longitude) {
        Geocoder geocoder = new Geocoder(context, Locale.getDefault());
        List<Address> addresses;
        try {
            addresses = geocoder.getFromLocation(latitude, longitude, 1);
            if (addresses != null && !addresses.isEmpty()) {
                if (addresses.get(0).getCountryCode() != null) {
                    return addresses.get(0).getCountryCode();
                } else {
                    return "";
                }

            }
        } catch (IOException ioe) {
            return "";
        }
        return "";
    }

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(ViewPumpContextWrapper.wrap(newBase));
    }


    @SuppressLint("StaticFieldLeak")
    private class GetLocationAsync extends AsyncTask<String, Void, String> {

        double x, y;
        StringBuilder str;

        public GetLocationAsync(double latitude, double longitude) {
            // TODO Auto-generated constructor stub
            x = latitude;
            y = longitude;


        }

        @Override
        protected void onPreExecute() {
        }

        @SuppressLint("NewApi")
        @Override
        protected String doInBackground(String... params) {

            try {
                Geocoder geocoder;
                List<Address> addresses;
                geocoder = new Geocoder(getApplicationContext(), Locale.getDefault());
                addresses = geocoder.getFromLocation(x, y, 1); // Here 1 represent max location result to returned, by documents it recommended 1 to 5
                if (addresses != null && !addresses.isEmpty())
                    CommonData.strPickupAddress = addresses.get(0).getAddressLine(0); // If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()

            } catch (IOException e) {
                Log.e("tag", Objects.requireNonNull(e.getMessage()));
            }
            return null;

        }

        @Override
        protected void onPostExecute(String result) {
            try {
                System.out.println("Address is " + CommonData.strPickupAddress);
                if (CommonData.strPickupAddress != null && !CommonData.strPickupAddress.isEmpty()) {
                    whereToTxt.setText(CommonData.strPickupAddress);
                    CommonData.Pickuplat = x;
                    CommonData.Pickuplng = y;
                } else {
                    googleGeocoderPresenter.getAddressFromLocation(new LatLng(x, y), context);

                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onProgressUpdate(Void... values) {

        }
    }

    private void setCallNearbyService() {
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("drivergender", SharedHelper.getKey(context, "drivergender"));
        if (Constants.twodriver.equalsIgnoreCase("true")) {
            map.put("tripType", "twodriver");
        } else if (Constants.outstation.equalsIgnoreCase("true")) {
            map.put("tripType", "outstation");
        } else if (Constants.hourly.equalsIgnoreCase("true")) {
            map.put("tripType", "rental");
        } else {
            map.put("tripType", "daily");
        }
        if (isMultipleStop) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("multiple", new JSONArray(new Gson().toJson(multipleAddressModels)));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            map.put("isMultiLocation", "true");
            map.put("multiLocation", String.valueOf(jsonObject));
        } else {
            map.put("isMultiLocation", "false");
        }
        servicePresenter.getServiceFare(activity, map);
    }

    public void GetCaricon(String data) {

        switch (data.toLowerCase().trim()) {

            case "mini":
                bitmapDescriptor = BitmapDescriptorFactory.fromResource(R.mipmap.ic_mini);
                break;
            case "sedan":
                bitmapDescriptor = BitmapDescriptorFactory.fromResource(R.mipmap.ic_sedan);
                break;
            case "suv":
                bitmapDescriptor = BitmapDescriptorFactory.fromResource(R.mipmap.ic_suv);
                break;
            case "auto":
                bitmapDescriptor = BitmapDescriptorFactory.fromResource(R.mipmap.ic_car_cion);
                break;
            default:
                bitmapDescriptor = BitmapDescriptorFactory.fromResource(R.mipmap.ic_car_cion);
                break;

        }


    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void Onmessage(EstimationChanges event) {
        try {
            switch (event.getMessage()) {
                case "change drop":
                    Intent intent = new Intent(context, GooglePlaceSearch.class);
                    startActivityForResult(intent, GOOGLESEARCHCODE);
                    removeFragment();
                    break;
                case "Outstation":
                    removeFragment();
                    moveToFragment(new OutStationFragment());
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Subscribe(threadMode = ThreadMode.MAIN)
    public void Onmessage(CategoryPassing event) {
        try {
            switch (event.passing) {
                case "Service":
                    bottomSheetcategory.dismiss();
                    ServiceFagment = new RedEstimateFragment();
                    fragmentslist.add(ServiceFagment);
                    ServiceFow(ServiceFagment);
                    break;
                case "CarDelivery":
                    bottomSheetCarDropFragment.dismiss();
                    break;
                case "AvailableStatus":
                    driverNotAvailableDialog();
                    break;

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void removeFragment() {
        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        if (fragmentslist.size() == 0 && !tripStatus) {
            flowstatus = 0;
            RemovePolyline();
            NormalMode();
            stopAnim();
            setCurrentlocation();
            menuImg.setImageResource(R.drawable.ic_menu_layer);
            if (mCurrentLocation != null) {
                Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
            }
            CheckFavoriteLocation();
        }
    }

    public void Calltosupport() {
        if (supportNumber != null && !supportNumber.isEmpty()) {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:" + supportNumber));
            if (intent.resolveActivity(activity.getPackageManager()) != null) {
                activity.startActivity(intent);
            }
        } else {
            Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
        }

    }

    private void resetMarker() {
        if (myMarker != null) {
            myMarker.remove();
        }
        myMarker = null;
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED)
    public void Event(MutlipleDestination event) {
        StartRequestFlow(false);
        EventBus.getDefault().postSticky(new EstimationChanges("estimation"));
    }


}


