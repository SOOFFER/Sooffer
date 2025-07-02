package com.soofer.app.Activity;

import static com.soofer.app.MainActivity.FragmentManage;
import static com.soofer.app.MainActivity.googleGeocoderPresenter;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.app.ActivityCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

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
import com.soofer.app.Fragment.PaymentFragment;
import com.soofer.app.Fragment.SupportFragment;
import com.soofer.app.Fragment.WalletFragment;
import com.soofer.app.Fragment.YourTripFragment;
import com.soofer.app.MainActivity;
import com.soofer.app.Model.LocalModel.LocalAddressStoreModel;
import com.soofer.app.Navigationdrawer.FragmentDrawer;
import com.soofer.app.Presenter.LogoutPresenter;
import com.soofer.app.R;
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
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class HomeActivity extends AppCompatActivity implements OnMapReadyCallback,
        FragmentDrawer.FragmentDrawerListener, GoogleApiClient.ConnectionCallbacks, LocationListener,
        GoogleApiClient.OnConnectionFailedListener, GoogleMap.OnCameraIdleListener {

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
    @BindView(R.id.ltRide)
    CardView ltRide;
    @BindView(R.id.ltHourly)
    CardView ltHourly;
    @BindView(R.id.ltDriver)
    CardView ltDriver;
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
    protected DatabaseReference TripFlowReference,LastTripDatabase;
    protected ValueEventListener TripFlowValue,LastTripValueEvent;

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
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        ButterKnife.bind(this);
        findviewById();
        setData();
        if (!Places.isInitialized())
            Places.initialize(this, SharedHelper.getKey(getApplicationContext(), "google_key"));
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();

        logout_layout = (RelativeLayout) mDrawerLayout.findViewById(R.id.logout_layout);
        logout_layout.setOnClickListener(v -> Alertdialog(getString(R.string.are_you_sure_you_want_to_logout)));
        LastTripStatusCheck();
        if (SharedHelper.getKey(this, "trip_id") != null && !SharedHelper.getKey(this, "trip_id").equalsIgnoreCase("null") && !SharedHelper.getKey(this, "trip_id").isEmpty()) {
            FirebaseTripFlow();
        }
    }


    public void FirebaseTripFlow() {
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
        LastTripDatabase = FirebaseDatabase.getInstance().getReference().child("riders_data").child(SharedHelper.getKey(this, "userid"));
        LastTripValueEvent = LastTripDatabase.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    if(dataSnapshot.child("tripstatus").getValue()==null){
                        return;
                    }

                    String svType = CommonData.TripType;
                    if ((svType.equalsIgnoreCase("outstation"))|| (svType.equalsIgnoreCase("rental")) || (svType.equalsIgnoreCase("daily")))
                    {
                        if (!Constants.CheckRiderStatus.equalsIgnoreCase(dataSnapshot.child("tripstatus").getValue().toString()) && !dataSnapshot.child("tripstatus").getValue().toString().equalsIgnoreCase("0")) {
                            Constants.CheckRiderStatus = Objects.requireNonNull(dataSnapshot.child("tripstatus").getValue()).toString();
                            Checkstatus(Objects.requireNonNull(dataSnapshot.child("tripstatus").getValue()).toString(), dataSnapshot);
                        }}

            /* RemoveView(dataSnapshot.child("tripstatus").getValue().toString());
                Object cancelExceeds = dataSnapshot.child("cancelExceeds").getValue();
                Object oldBalances = dataSnapshot.child("oldBalance").getValue();
                Object lastCanceledDate = dataSnapshot.child("lastCanceledDate").getValue();
                String currentdate = getDateFormate();
                if (cancelExceeds != null && cancelExceeds.toString().equals("1") && lastCanceledDate.toString().equalsIgnoreCase(currentdate)) {
                    CommonFirebaseListoner.cancelExceedss = cancelExceeds.toString();
                    CommonFirebaseListoner.riderAlert(activity, CommonFirebaseListoner.riderCancelLimiitExceeds);
                } else {
                    CommonFirebaseListoner.cancelExceedss = "0";
                    if (cancelExceeds == null) {
                        Utiles.ClearFirabae(SharedHelper.getKey(context, "userid"));
                    } else if (!cancelExceeds.equals("0") && !lastCanceledDate.equals("0")) {
                        Utiles.ClearFirabae(SharedHelper.getKey(context, "userid"));
                    }

                }
                if (oldBalances != null && !oldBalances.toString().isEmpty()) {
                    CommonFirebaseListoner.oldBalance = oldBalances.toString();
                } else {
                    CommonFirebaseListoner.oldBalance = "0";
                }*/


                } else {

                    //Utiles.UpDateRiders(SharedHelper.getKey(context, "userid"), context);
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
                String svType = SharedHelper.getKey(getApplicationContext(), "serviceType");
                if (svType.equalsIgnoreCase("outstation")) {
                    callMain();
                }
                break;
            case "No Driver Found":

                System.out.println("No Driver Found");
                break;
            case "Accepted":
                callMain();
                break;
            case "canceled":
                System.out.println("cancelled");
                break;

        }

    }

    public void callMain()
    {
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
        builder1.setPositiveButton(
                R.string.yes,
                (dialog, id) -> {
                    dialog.dismiss();

                    try {
                        CommonData.addressList.clear();
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
            if (TripFlowReference != null)
                TripFlowReference.removeEventListener(TripFlowValue);
            if (LastTripDatabase != null)
                LastTripDatabase.removeEventListener(LastTripValueEvent);
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
        mapFragment = (MultiTouchMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout_home);
        drawerFragment = (FragmentDrawer)
                getSupportFragmentManager().findFragmentById(R.id.fragment_drawer);
        drawerFragment.setUp(R.id.fragment_drawer, mDrawerLayout, null);
        drawerFragment.setDrawerListener(this);
        userProfileImage = (ImageView) mDrawerLayout.findViewById(R.id.rider_profile_image);
        userProfileImageHome = (ImageView) findViewById(R.id.menu_img_home);
        txtUserName = (TextView) mDrawerLayout.findViewById(R.id.userName);
        txtUserName.setOnClickListener(v -> startActivity(new Intent(context, ProfileActivity.class)));
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImage, context);
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImageHome, context);
        txtUserName.setText(Utiles.NullPointer(SharedHelper.getKey(context, "fname")) + Utiles.NullPointer(SharedHelper.getKey(context, "lname")));

    }

    @SuppressLint("NonConstantResourceId")
    @OnClick({R.id.menu_img_home, R.id.ltRequestDirect, R.id.ltRide, R.id.ltHourly, R.id.ltDriver, R.id.where_to_txt, R.id.ltSchedule, R.id.ltAddress1, R.id.ltAddress2, R.id.ltClickMap})
    public void onClick(View view) {
        Intent i;
        switch (view.getId()) {
            case R.id.menu_img_home:
                System.out.println("aa1 "+fragmentslist);
                if (!fragmentslist.isEmpty()) {
                    RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
                    fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));

                    if (fragmentslist.size() == 0) {
                        menuImge.setImageResource(R.drawable.ic_user_profile);
                        setCurrentlocation();
                      /*  if (mCurrentLocation != null) {
                            Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
                        }
                        CheckFavoriteLocation();*/
                    }
                } else {
                    System.out.println("aaa "+fragmentslist);
                    mDrawerLayout.openDrawer(GravityCompat.START);
                }
                break;
            case R.id.ltRequestDirect:
            case R.id.ltAddress1:
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                CommonData.Droplat = Double.parseDouble(localAddressStoreModel.get(0).getStrLat());
                CommonData.Droplng = Double.parseDouble(localAddressStoreModel.get(0).getStrLng());
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "HomeIntent");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltRide:
            case R.id.ltClickMap:
                Constants.isDriver = false;
                Constants.hourly = "false";
                Constants.twodriver = "false";
                SharedHelper.putKey(context, "trip_id", "null");
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Normal");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltHourly:
                Constants.hourly = "true";
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Rental");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltDriver:
                Constants.isDriver  = true;
                Constants.twodriver = "true";
                SharedHelper.putKey(context, "trip_id", "null");
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Driver");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.where_to_txt:
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                Intent intent = new Intent(getApplicationContext(), GooglePlaceSearch.class);
                startActivityForResult(intent, 0);
                break;
            case R.id.ltSchedule:
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "Riderlater");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
            case R.id.ltAddress2:
                if (getFusedLocation() != null && CommonData.Pickuplat == 0.0) {
                    CommonData.Pickuplat = getFusedLocation().getLatitude();
                    CommonData.Pickuplng = getFusedLocation().getLongitude();
                }
                CommonData.Droplat = Double.parseDouble(localAddressStoreModel.get(1).getStrLat());
                CommonData.Droplng = Double.parseDouble(localAddressStoreModel.get(1).getStrLng());
                i = new Intent(getApplicationContext(), MainActivity.class);
                i.putExtra("strVehicleCode", "HomeIntent");
                startActivity(i);
                overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
                break;
        }
    }

    public void RemoveFragment(Fragment fragment) {
        try {
            if (!isFinishing()) {
                runOnUiThread(() -> {
                    if (fragment != null) {
                        FragmentManager.beginTransaction()
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

    public void setCurrentlocation() {
        mCurrentLocation = getFusedLocation();
        if (mCurrentLocation != null) {
//            Geofire(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()), carcategory);
//            getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());

            System.out.println("INSIDE LOCAION CHANGE" + mCurrentLocation.getLatitude() + mCurrentLocation.getLongitude());

            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();

            mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
            if(googleGeocoderPresenter!=null){
                googleGeocoderPresenter.getAddressFromLocation(latLng,this);
            }


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
                fragment = new PaymentFragment();
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
        System.out.println("frag "+fragment);
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
            System.out.println("sss "+e);
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
                    FragmentManager.beginTransaction().setCustomAnimations(R.anim.slide_in_left, R.anim.slide_out_right)
                            .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

                });

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void Reintialize() {
        if (FragmentManager == null) {
            FragmentManager = getSupportFragmentManager();
        }
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
        if (Constants.TripFlowFragmant == null) {
            super.onBackPressed();
        }
        if (!fragmentslist.isEmpty()) {
            RemoveFragment(fragmentslist.get(fragmentslist.size() - 1));
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        if (fragmentslist.size() == 0 ) {
            setCurrentlocation();
            userProfileImageHome = (ImageView) findViewById(R.id.menu_img_home);
            Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), userProfileImageHome, context);
            //        menuImge.setImageResource(R.drawable.ic_user_profile);
        }
        mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);

    }

}