package com.soofer.app.Activity;

import static com.soofer.app.CommonClass.Utiles.RemoveRefenceListioner;
import static com.soofer.app.MainActivity.LastTripDatabase;
import static com.soofer.app.MainActivity.LastTripValueEvent;
import static com.soofer.app.MainActivity.TripFlowReference;
import static com.soofer.app.MainActivity.TripFlowValue;

import static io.agora.base.internal.ContextUtils.getApplicationContext;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.cardview.widget.CardView;
import androidx.core.app.ActivityCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.libraries.places.api.Places;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.Mapcustomize.MultiTouchMapFragment;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Fragment.ContactFragment;
import com.soofer.app.Fragment.FavoriteLocationFragment;
import com.soofer.app.Fragment.InviteFriends;
import com.soofer.app.Fragment.NotificationFragment;
import com.soofer.app.Fragment.OffersFragment;
import com.soofer.app.Fragment.PaymentFragmentNew;
import com.soofer.app.Fragment.SupportFragment;
import com.soofer.app.Fragment.WalletFragment;
import com.soofer.app.Fragment.YourTripFragment;
import com.soofer.app.MainActivity;
import com.soofer.app.Model.LocalModel.LocalAddressStoreModel;
import com.soofer.app.Navigationdrawer.FragmentDrawer;
import com.soofer.app.Presenter.LogoutPresenter;
import com.soofer.app.R;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class HomeActivity extends BaseActivity implements OnMapReadyCallback, FragmentDrawer.FragmentDrawerListener, GoogleApiClient.ConnectionCallbacks, LocationListener, GoogleApiClient.OnConnectionFailedListener, GoogleMap.OnCameraIdleListener {

    @BindView(R.id.menu_img_home)
    ImageButton menuImge;
    @BindView(R.id.tvRiderto)
    TextView tvRiderto;
    @BindView(R.id.tvRequestNow)
    TextView tvRequestNow;
    @BindView(R.id.tvAddressLable1)
    TextView tvAddressLable1;
    @BindView(R.id.tvAddress1)
    TextView tvAddress1;
    @BindView(R.id.tvAddressLable2)
    TextView tvAddressLable2;
    @BindView(R.id.tvAddress2)
    TextView tvAddress2;
    @BindView(R.id.imgBanner)
    ImageView imgBanner;
    @BindView(R.id.ltRequestDirect)
    CardView ltRequestDirect;
    @BindView(R.id.ltRideDaily)
    CardView ltRideDaily;
    @BindView(R.id.ltHourlyRental)
    CardView ltHourlyRental;
    @BindView(R.id.ltOutstation)
    CardView ltOutstation;
    @BindView(R.id.ltTwoDriver)
    CardView ltTwoDriver;
    @BindView(R.id.ltMap)
    CardView ltMap;
    @BindView(R.id.where_to_txt)
    TextView whereToTxt;
    @BindView(R.id.ltSchedule)
    TextView ltSchedule;
    @BindView(R.id.ltAddress1)
    LinearLayout ltAddress1;
    @BindView(R.id.ltAddress2)
    LinearLayout ltAddress2;
    @BindView(R.id.ltClickMap)
    View ltClickMap;
    @BindView(R.id.ltFavAddress)
    View ltFavAddress;
    RelativeLayout logout_layout;
    AlertDialog logoutAlert;
    ImageView userProfileImage;
    ImageView userProfileImageHome;
    TextView txtUserName;
    Context context = HomeActivity.this;

    public static ArrayList<Fragment> fragmentslist = new ArrayList<>();
    ArrayList<LocalAddressStoreModel> localAddressStoreModel = new ArrayList<>();

    MultiTouchMapFragment mapFragment;
    DrawerLayout mDrawerLayout;
    FragmentDrawer drawerFragment;
    Location mCurrentLocation;
    GoogleApiClient mGoogleApiClient;
    LocationManager locationManager;
    GoogleMap mMap;
    protected static Fragment fragment;
    public static FragmentManager FragmentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle safeState = null;
        if (savedInstanceState != null) {
            try {
                savedInstanceState.setClassLoader(getClassLoader());
                safeState = savedInstanceState;
            } catch (Exception e) {
                // Stale or unrestorable state — discard it
                safeState = null;
            }
        }
        super.onCreate(safeState);
        setContentView(R.layout.activity_home);
        ButterKnife.bind(this);
        fragmentslist.clear();
        normalValue();
        findviewById();
        setData();
        if (!Places.isInitialized()) Places.initialize(this, Constants.GoogleDirectionkey);
        mGoogleApiClient = new GoogleApiClient.Builder(this).addConnectionCallbacks(this).addOnConnectionFailedListener(this).addApi(LocationServices.API).build();

        logout_layout = (RelativeLayout) mDrawerLayout.findViewById(R.id.logout_layout);
        logout_layout.setOnClickListener(v -> Alertdialog(getString(R.string.are_you_sure_you_want_to_logout)));
        LastTripStatusCheck();
        if (SharedHelper.getKey(this, "trip_id") != null && !SharedHelper.getKey(this, "trip_id").equalsIgnoreCase("null") && !SharedHelper.getKey(this, "trip_id").isEmpty() && !SharedHelper.getKey(this, "trip_id").equalsIgnoreCase("0")) {
            FirebaseTripFlow();
        }
    }


    public void FirebaseTripFlow() {
        RemoveRefenceListioner(TripFlowReference, TripFlowValue);
        TripFlowReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(this, "trip_id"));
        TripFlowValue = TripFlowReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    Object status = dataSnapshot.child("status").getValue();
                    Object driver_token = dataSnapshot.child("driver_token").getValue();
                    if (status != null) {
                        if (!Constants.FlowStatus.equalsIgnoreCase(status.toString())) {
                            if (status.toString().equals("5")) {
                                SharedHelper.putKey(getApplicationContext(), "trip_id", "null");
                            } else {
                                RemoveRefenceListioner(TripFlowReference, TripFlowValue);
                                RemoveRefenceListioner(LastTripDatabase, LastTripValueEvent);
                                Intent i = new Intent(getApplicationContext(), MainActivity.class);
                                i.putExtra("strVehicleCode", "OnTrip");
                                i.putExtra("serviceTypeID", "");
                                startActivity(i);
                                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                            }

                        }
                        if (driver_token != null && !driver_token.equals("0")) {
                            Constants.strDriver = driver_token.toString();
                        }
                    }
                }


            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("tag", "enter the error response" + databaseError.getMessage());
            }
        });
    }

    public void LastTripStatusCheck() {
        RemoveRefenceListioner(LastTripDatabase, LastTripValueEvent);
        LastTripDatabase = FirebaseDatabase.getInstance().getReference().child("riders_data").child(SharedHelper.getKey(this, "userid"));
        System.out.println("USER ID:::::"+SharedHelper.getKey(this, "userid"));
        LastTripValueEvent = LastTripDatabase.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    if (dataSnapshot.child("tripstatus").getValue() == null) {
                        return;
                    }
                    System.out.println("tripstatus::" + dataSnapshot.child("tripstatus").getValue());
                    System.out.println("current_tripid::" + dataSnapshot.child("current_tripid").getValue());
                    String svType = CommonData.TripType;
                    if (svType.isEmpty() || svType.equalsIgnoreCase("outstation") || svType.equalsIgnoreCase("rental") || svType.equalsIgnoreCase("daily") || svType.equalsIgnoreCase("twodriver")) {
                        if (!Constants.CheckRiderStatus.equalsIgnoreCase(dataSnapshot.child("tripstatus").getValue().toString()) && !dataSnapshot.child("tripstatus").getValue().toString().equalsIgnoreCase("0")) {
                            Constants.CheckRiderStatus = Objects.requireNonNull(dataSnapshot.child("tripstatus").getValue()).toString();
                            SharedHelper.putKey(context, "trip_id", Objects.requireNonNull(dataSnapshot.child("current_tripid").getValue()).toString());
                            Checkstatus(Objects.requireNonNull(dataSnapshot.child("tripstatus").getValue()).toString(), dataSnapshot);
                        }
                    }
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("tag", databaseError.getMessage());
            }
        });
    }

    @SuppressLint("SetTextI18n")
    public void Checkstatus(String status, DataSnapshot dataSnapshot) {
        switch (status) {
            case "Processing":
                callMain();
                break;
            case "No Driver Found":
                SharedHelper.putKey(this, "trip_id", "null");
                break;
            case "Accepted":
                callMain();
                break;
            case "canceled":
                SharedHelper.putKey(this, "trip_id", "null");
                break;

        }

    }

    public void callMain() {
        RemoveRefenceListioner(LastTripDatabase, LastTripValueEvent);
        RemoveRefenceListioner(TripFlowReference, TripFlowValue);
        Intent i = new Intent(getApplicationContext(), MainActivity.class);
        i.putExtra("strVehicleCode", "OnTrip");
        i.putExtra("serviceTypeID", "");
        startActivity(i);
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
    }

    public void Alertdialog(String Message) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(this);
        builder1.setTitle(R.string.logout);
        builder1.setMessage(Message);
        builder1.setCancelable(true);
        builder1.setPositiveButton(R.string.yes, (dialog, id) -> {
            dialog.dismiss();

            try {
                CommonData.addressList.clear();
                fragmentslist.clear();
            } catch (Exception e) {
                e.printStackTrace();
            }
            LogoutPresenter logoutPresenter = new LogoutPresenter();
            logoutPresenter.LogoutData(this);
            SharedHelper.clearSharedPreferences(getApplicationContext());
            Intent intent = new Intent(getApplicationContext(), WelcomeActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
            finish();

        });
        builder1.setNegativeButton(R.string.no, (dialog, which) -> dialog.dismiss());
        logoutAlert = builder1.create();
        logoutAlert.show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            Utiles.clearInstance();
            if (logoutAlert != null && logoutAlert.isShowing()) {
                logoutAlert.dismiss();

            }
            if (TripFlowReference != null) TripFlowReference.removeEventListener(TripFlowValue);
            if (LastTripDatabase != null) LastTripDatabase.removeEventListener(LastTripValueEvent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("SetTextI18n")
    private void setData() {
        String favorite = SharedHelper.getKey(this, "recent");
        if (!favorite.isEmpty()) {
            Type type = new TypeToken<List<LocalAddressStoreModel>>() {
            }.getType();
            localAddressStoreModel = new Gson().fromJson(favorite, type);
        }
        if (!localAddressStoreModel.isEmpty()) {
            ltFavAddress.setVisibility(View.VISIBLE);
            ltRequestDirect.setVisibility(View.VISIBLE);
            ltAddress1.setVisibility(View.VISIBLE);
            tvRiderto.setText("Ride to " + localAddressStoreModel.get(0).getStrTitle());
            tvAddressLable1.setText(localAddressStoreModel.get(0).getStrTitle());
            tvAddress1.setText(localAddressStoreModel.get(0).getStrAddress());

            if (localAddressStoreModel.size() >= 2) {
                ltAddress2.setVisibility(View.VISIBLE);
                tvAddressLable2.setText(localAddressStoreModel.get(1).getStrTitle());
                tvAddress2.setText(localAddressStoreModel.get(1).getStrAddress());

            }
        } else {
            ltRequestDirect.setVisibility(View.GONE);
            ltFavAddress.setVisibility(View.GONE);
        }

    }

    @SuppressLint("SetTextI18n")
    public void findviewById() {
        //maps
        mapFragment = (MultiTouchMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout_home);
        drawerFragment = (FragmentDrawer) getSupportFragmentManager().findFragmentById(R.id.fragment_drawer);
        drawerFragment.setUp(R.id.fragment_drawer, mDrawerLayout, null);
        drawerFragment.setDrawerListener(this);
        userProfileImage = (ImageView) mDrawerLayout.findViewById(R.id.rider_profile_image);
        userProfileImageHome = (ImageView) findViewById(R.id.menu_img_home);
        txtUserName = (TextView) mDrawerLayout.findViewById(R.id.userName);
        txtUserName.setOnClickListener(v -> startActivity(new Intent(context, ProfileActivity.class)));

        ltOutstation.setVisibility(View.GONE);
        ltHourlyRental.setVisibility(View.GONE);
        ltTwoDriver.setVisibility(View.GONE);

        if (SharedHelper.getKey(this, "outstationflow").equalsIgnoreCase("true")) {
            ltOutstation.setVisibility(View.VISIBLE);
        }

        if (SharedHelper.getKey(this, "rentalflow").equalsIgnoreCase("true")) {
            ltHourlyRental.setVisibility(View.VISIBLE);
        }

        if (SharedHelper.getKey(this, "twoDriverFlow").equalsIgnoreCase("true")) {
            ltTwoDriver.setVisibility(View.VISIBLE);
        }

    }

    @SuppressLint("NonConstantResourceId")
    @OnClick({R.id.menu_img_home, R.id.ltRequestDirect, R.id.ltRideDaily, R.id.ltHourlyRental, R.id.ltOutstation, R.id.ltTwoDriver, R.id.where_to_txt, R.id.ltSchedule, R.id.ltAddress1, R.id.ltAddress2, R.id.ltClickMap})
    public void onClick(View view) {
        Intent i;
        switch (view.getId()) {
            case R.id.menu_img_home:
                System.out.println("FRAGMNT LIST:::"+fragmentslist.size());
                if (!fragmentslist.isEmpty()) {
                    RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
                    fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));

                    if (fragmentslist.size() == 0) {
                        menuImge.setImageResource(R.drawable.ic_user_profile);
                        setCurrentlocation();
                    }
                } else {
                    mDrawerLayout.openDrawer(GravityCompat.START);
                }
                break;
            case R.id.ltRequestDirect:
            case R.id.ltAddress1:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                CommonData.Droplat = Double.parseDouble(localAddressStoreModel.get(0).getStrLat());
                CommonData.Droplng = Double.parseDouble(localAddressStoreModel.get(0).getStrLng());
                CommonData.strDropAddresss = localAddressStoreModel.get(0).getStrAddress();
                normalValue();
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "HomeIntent");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltRideDaily:
            case R.id.ltClickMap:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                normalValue();
                SharedHelper.putKey(context, "trip_id", "null");
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Normal");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltHourlyRental:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                normalValue();
                Constants.hourly = "true";
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Rental");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltOutstation:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                normalValue();
                Constants.outstation = "true";
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Outstation");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltTwoDriver:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                normalValue();
                Constants.isTwoDriver = true;
                Constants.twodriver = "true";
                SharedHelper.putKey(context, "trip_id", "null");
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "TwoDriver");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.where_to_txt:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                normalValue();
                Intent intent = new Intent(getApplicationContext(), GooglePlaceSearch.class);
                startActivityForResult(intent, 0);
                break;
            case R.id.ltSchedule:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                normalValue();
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Riderlater");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltAddress2:
                CommonData.strDate = "";
                CommonData.strTime = "";
                CommonData.strTimes = "";
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                CommonData.Droplat = Double.parseDouble(localAddressStoreModel.get(1).getStrLat());
                CommonData.Droplng = Double.parseDouble(localAddressStoreModel.get(1).getStrLng());
                CommonData.strDropAddresss = localAddressStoreModel.get(1).getStrAddress();
                normalValue();
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "HomeIntent");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
        }
    }

    public void normalValue() {
        Constants.isTwoDriver = false;
        Constants.hourly = "false";
        Constants.twodriver = "false";
        Constants.outstation = "false";
    }

    public void RemoveFragment(Fragment fragment) {
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    if (fragment != null) {
                        FragmentManager.beginTransaction().remove(fragment).setTransition(FragmentTransaction.TRANSIT_FRAGMENT_CLOSE).commitAllowingStateLoss();
                    }
                });

            }
        } catch (Exception e) {
            Log.i("tag", e.getMessage());

        }

    }

    public void setCurrentlocation() {
        mCurrentLocation = getFusedLocation();
        if (mCurrentLocation != null) {
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
            getAddress(latLng);
            CameraPosition cameraPosition = new CameraPosition.Builder().target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE).tilt(0)                                     // Sets the tilt of the camera to 0 degrees
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
            for (Address addresss : addresses) {
                CommonData.strCountryCode = addresss.getCountryCode();
                if (CommonData.strCountryCode != null && !CommonData.strCountryCode.isEmpty()) {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
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
        if (mCurrentLocation == null) {
            locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
            if (locationManager != null) {
                try {
                    locationManager.removeUpdates(this);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, Constants.MIN_TIME_BW_UPDATES, Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);

                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                }
                if (mCurrentLocation == null) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, Constants.MIN_TIME_BW_UPDATES, Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);

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

    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }

    @Override
    public void onDrawerItemSelected(View view, int position) {
        switch (position) {
            case 0:
                startActivity(new Intent(getApplicationContext(), ProfileActivity.class));
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 1:
                fragment = new WalletFragment();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);

                // mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 2:
                fragment = new PaymentFragmentNew();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 3:
                fragment = new YourTripFragment();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 4:
                fragment = new InviteFriends();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 5:
                fragment = new ContactFragment();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 6:
                fragment = new SupportFragment();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                break;
            case 7:
                fragment = new OffersFragment();
                moveToFragments(fragment);
                mDrawerLayout.closeDrawer(GravityCompat.START);
                mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
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
        System.out.println("frag " + fragment);
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    FragmentManager.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE).replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();
                });
            }
        } catch (Exception e) {
            System.out.println("sss " + e);
            e.printStackTrace();
        }
    }

    private void moveToFragments(Fragment fragment) {
        Reintialize();
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    mDrawerLayout.closeDrawer(GravityCompat.START);
                    mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    FragmentManager.beginTransaction().setCustomAnimations(R.anim.slide_in_left, R.anim.slide_out_right).replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

                });

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void Reintialize() {
        FragmentManager = getSupportFragmentManager();
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onLocationChanged(@NonNull Location location) {

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(@NonNull String provider) {

    }

    @Override
    public void onProviderDisabled(@NonNull String provider) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    @Override
    public void onCameraIdle() {

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 0:
                if (resultCode == Activity.RESULT_OK) {
                    RemoveRefenceListioner(TripFlowReference, TripFlowValue);
                    RemoveRefenceListioner(LastTripDatabase, LastTripValueEvent);
                    Intent i = new Intent(getApplicationContext(), MainActivity.class);
                    i.putExtra("strVehicleCode", "HomeIntent");
                    startActivity(i);
                    overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                }
                break;
        }
    }

    @Override
    public void onBackPressed() {
        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        if (fragmentslist.isEmpty()) {
            setCurrentlocation();
            userProfileImageHome = (ImageView) findViewById(R.id.menu_img_home);
            Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImageHome, context);
            finishAffinity();
        }
        mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
        super.onBackPressed();
    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onResume() {
        super.onResume();
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, context);
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImageHome, context);
        txtUserName.setText(Utiles.NullPointer(SharedHelper.getKey(context, "fname")) + " " + Utiles.NullPointer(SharedHelper.getKey(context, "lname")));
        normalValue();
    }

    @Override
    protected void onStart() {
        super.onStart();
        normalValue();
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        normalValue();
    }
}