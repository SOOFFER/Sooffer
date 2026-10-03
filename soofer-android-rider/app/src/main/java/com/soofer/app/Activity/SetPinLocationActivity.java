package com.soofer.app.Activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
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
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.gson.Gson;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.SuccessDialogDialog;
import com.soofer.app.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.app.Model.FavoriteAddressModel;
import com.soofer.app.Presenter.AddAddressPresenter;
import com.soofer.app.Presenter.GoogleGeocoderPresenter;
import com.soofer.app.R;
import com.soofer.app.View.AddressView;
import com.soofer.app.View.GoogleGeoCoderView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.reactivex.disposables.CompositeDisposable;
import retrofit2.Response;

public class SetPinLocationActivity extends BaseActivity implements OnMapReadyCallback, LocationSource, LocationListener,
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener,
        GoogleMap.OnCameraMoveListener, GoogleMap.OnCameraIdleListener,
        GoogleGeoCoderView, AddressView {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.address_txt)
    TextView addressTxt;
    CompositeDisposable compositeDisposable = new CompositeDisposable();

    String completeAddress, strAddressLabel = "Home";
    Activity activity = SetPinLocationActivity.this;

    LocationManager locationManager;
    GoogleMap mMap;
    GoogleApiClient mGoogleApiClient;

    Location mCurrentLocation;
    @BindView(R.id.Add_location_btn)
    Button AddLocationBtn;
    LatLng pinLocation;
    GoogleGeocoderPresenter googleGeocoderPresenter;
    Context context = this;
    LatLng Centerlatlng;
    @BindView(R.id.radiohome)
    RadioButton radiohome;
    @BindView(R.id.radioWork)
    RadioButton radioWork;
    @BindView(R.id.other_radio)
    RadioButton otherRadio;
    @BindView(R.id.chooseRadio)
    RadioGroup chooseRadio;
    @BindView(R.id.home_img)
    ImageView homeImg;
    @BindView(R.id.setaddress_txt)
    TextView setaddressTxt;
    @BindView(R.id.customize_lable_edt)
    EditText customizeLableEdt;
    @BindView(R.id.home_layout)
    RelativeLayout homeLayout;
    @BindView(R.id.cancel_txt)
    TextView cancelTxt;
    @BindView(R.id.save_txt)
    TextView saveTxt;
    @BindView(R.id.favorite)
    CardView favorite;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.search_layout)
    LinearLayout search_layout;
    TextWatcher textWatcher;

    AddAddressPresenter addAddressPresenter;

    private SuccessDialogDialog dialogClass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_pin_location);
        ButterKnife.bind(this);
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        switch (CommonData.HeaderTitle) {
            case "pickup":
                favorite.setVisibility(View.GONE);
                header.setVisibility(View.VISIBLE);
                AddLocationBtn.setVisibility(View.VISIBLE);
                search_layout.setVisibility(View.VISIBLE);
                break;
            case "drop":
                favorite.setVisibility(View.GONE);
                header.setVisibility(View.VISIBLE);
                AddLocationBtn.setVisibility(View.VISIBLE);
                search_layout.setVisibility(View.VISIBLE);
                break;
            case "favorite":
                favorite.setVisibility(View.VISIBLE);
                header.setVisibility(View.GONE);
                search_layout.setVisibility(View.GONE);
                AddLocationBtn.setVisibility(View.GONE);
                break;
            case "Add Favorite Location":
                favorite.setVisibility(View.VISIBLE);
                header.setVisibility(View.GONE);
                search_layout.setVisibility(View.GONE);
                AddLocationBtn.setVisibility(View.GONE);
                break;
            case "Set pin Location":
                favorite.setVisibility(View.GONE);
                header.setVisibility(View.VISIBLE);
                search_layout.setVisibility(View.VISIBLE);
                AddLocationBtn.setVisibility(View.VISIBLE);
                break;
        }


        LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;

        try {
            assert lm != null;
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        if (!gps_enabled) {

            GPSTurnOnAlert();
        }
        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));

        //map
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        assert mapFragment != null;
        mapFragment.getMapAsync(this);
        addressTxt.setSelected(true);
        if (!CommonData.HeaderTitle.isEmpty()) {
            titleTxt.setText(CommonData.HeaderTitle);
        }

        googleGeocoderPresenter = new GoogleGeocoderPresenter(this, compositeDisposable);
        addAddressPresenter = new AddAddressPresenter(this);

        chooseRadio.setOnCheckedChangeListener((group, checkedId) -> {
            switch (checkedId) {
                case R.id.radiohome:
                    homeImg.setImageResource(R.drawable.ic_homelayer);
                    customizeLableEdt.removeTextChangedListener(textWatcher);
                    customizeLableEdt.setVisibility(View.GONE);
                    strAddressLabel = "Home";
                    break;
                case R.id.radioWork:
                    customizeLableEdt.removeTextChangedListener(textWatcher);
                    customizeLableEdt.setVisibility(View.GONE);
                    homeImg.setImageResource(R.drawable.ic_work_layer);
                    strAddressLabel = "Work";
                    break;
                case R.id.other_radio:
                    customizeLableEdt.addTextChangedListener(textWatcher);
                    customizeLableEdt.setVisibility(View.VISIBLE);
                    isEmptyLable();
                    homeImg.setImageDrawable(activity.getResources().getDrawable(R.drawable.ic_heartlayer));
                    break;
            }

        });


        textWatcher = new TextWatcher() {

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                isEmptyLable();

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count,
                                          int after) {

            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        };


    }

    public void isEmptyLable() {
        if (customizeLableEdt.getText().toString().isEmpty()) {
            saveTxt.setEnabled(false);
        } else {
            saveTxt.setEnabled(true);
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
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();
                final LocationSettingsStates state = result.getLocationSettingsStates();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        // All location settings are satisfied. The client can initialize location
                        // requests here.
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        // Location settings are not satisfied. But could be fixed by showing the user
                        // a dialog.
                        try {
                            // Show the dialog by calling startResolutionForResult(),
                            // and check the result in onActivityResult().
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
            }
        });
    }


    @Override
    public void onLocationChanged(Location location) {

        if (mCurrentLocation == null && location != null) {
            mCurrentLocation = location;
            getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
            LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE)
                    .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                    .build();

            mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
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

    }

    @Override
    public void deactivate() {

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
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

        switch (CommonData.HeaderTitle) {
            case "pickup":
                addressTxt.setText(CommonData.strPickupAddress);
                setLocation(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng));
                titleTxt.setText(activity.getResources().getString(R.string.pickup_address));
                break;
            case "drop":
                titleTxt.setText(activity.getResources().getString(R.string.drop_address));
                addressTxt.setText(CommonData.strDropAddresss);
                setLocation(new LatLng(CommonData.Droplat, CommonData.Droplng));
                break;
            case "favorite":
                if (CommonData.isPickup) {
                    setaddressTxt.setText(CommonData.strPickupAddress);
                    setLocation(new LatLng(CommonData.Pickuplat, CommonData.Pickuplng));
                } else {
                    setaddressTxt.setText(CommonData.strDropAddresss);
                    setLocation(new LatLng(CommonData.Droplat, CommonData.Droplng));
                }
                break;
            case "Set pin Location":
                mCurrentLocation = getFusedLocation();
                if (mCurrentLocation != null) {
                    getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
                    LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());

                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(latLng)                              // Sets the center of the map to current location
                            .zoom(Constants.MAP_ZOOM_SIZE)
                            .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                            .build();

                    mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                }
                break;
            case "Add Favorite Location":
                mCurrentLocation = getFusedLocation();
                if (mCurrentLocation != null) {
                    getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
                    LatLng latLng = new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude());

                    CameraPosition cameraPosition = new CameraPosition.Builder()
                            .target(latLng)                              // Sets the center of the map to current location
                            .zoom(Constants.MAP_ZOOM_SIZE)
                            .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                            .build();

                    mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                }
                break;
        }


        mMap.setMyLocationEnabled(false);
        mMap.getUiSettings().setMyLocationButtonEnabled(false);
        mMap.setOnCameraMoveListener(this);
        mMap.setOnCameraIdleListener(this);


        mCurrentLocation = getFusedLocation();

    }

    public void setLocation(LatLng location) {
        pinLocation = location;
        if (location != null) {
            //  getAddress(new LatLng(mCurrentLocation.getLatitude(), mCurrentLocation.getLongitude()));
            LatLng latLng = new LatLng(location.latitude, location.longitude);


            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(latLng)                              // Sets the center of the map to current location
                    .zoom(Constants.MAP_ZOOM_SIZE)
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

                mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

                if (mCurrentLocation == null) {

                    System.out.println("Location Provoider:" + " GPS Location Fail: Network Location");

                    locationManager.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            Constants.MIN_TIME_BW_UPDATES,
                            Constants.MIN_DISTANCE_CHANGE_FOR_UPDATES, this);

                    mCurrentLocation = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                }
            }
        }
        CommonData.CurrentLocation = mCurrentLocation;
        return mCurrentLocation;
    }

    public void getAddress(LatLng LatLng) {
        try {
            pinLocation = LatLng;
            Geocoder geocoder;
            List<Address> addresses;
            geocoder = new Geocoder(this, Locale.getDefault());
            addresses = geocoder.getFromLocation(LatLng.latitude, LatLng.longitude, 1); // Here 1 represent max location result to returned, by documents it recommended 1 to 5
            completeAddress = addresses.get(0).getAddressLine(0); // If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()

            setaddressTxt.setText(completeAddress);
            addressTxt.setText(completeAddress);
            AddLocationBtn.setClickable(true);
        } catch (IOException e) {
            e.printStackTrace();
            googleGeocoderPresenter.getAddressFromLocation(LatLng,this);
        }
    }

    @Override
    public void geocoderOnSucessful(GeocoderModel geocoderModel) {
        if (geocoderModel.getStatus().equalsIgnoreCase("OK")) {
            completeAddress = geocoderModel.getResults().get(0).getFormattedAddress();
            setaddressTxt.setText(completeAddress);
            addressTxt.setText(completeAddress);
            AddLocationBtn.setClickable(true);
        } else {
            if (Centerlatlng == null) {
                googleGeocoderPresenter.getAddressFromLocation(new LatLng(CommonData.CurrentLocation.getLatitude(), CommonData.CurrentLocation.getLongitude()), this);

            } else {
                googleGeocoderPresenter.getAddressFromLocation(new LatLng(Centerlatlng.latitude, Centerlatlng.longitude),this);

            }
        }
    }

    @Override
    public void geocoderOnFailure(Throwable throwable) {

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onCameraIdle() {
        Centerlatlng = mMap.getCameraPosition().target;
        addressTxt.setText(activity.getResources().getString(R.string.getting_address));
        AddLocationBtn.setClickable(false);
        try {
            new GetLocationAsync(Centerlatlng.latitude, Centerlatlng.longitude).execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick({R.id.cancel_txt, R.id.save_txt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cancel_txt:
                finish();
                break;
            case R.id.save_txt:
                setAddress();
                break;
        }
    }

    public void setAddress() {
        if (otherRadio.isChecked()) {
            strAddressLabel = customizeLableEdt.getText().toString();
        }
        HashMap<String, String> map = new HashMap<>();
        map.put("lable", strAddressLabel);
        map.put("address", setaddressTxt.getText().toString());
        map.put("lat", String.valueOf(pinLocation.latitude));
        map.put("lng", String.valueOf(pinLocation.longitude));
        addAddressPresenter.addAddress(activity, map);


    }

    @Override
    public void OnSuccessfully(Response<FavoriteAddressModel> Response) {
        System.out.println("enter the resjon response" + new Gson().toJson(Response.body()));
        CommonData.addressList = Response.body().getAddress();
        SharedHelper.putKey(context,"favorite",new Gson().toJson(CommonData.addressList));
        dialogClass = new SuccessDialogDialog(activity);
        dialogClass.setCancelable(false);
        Objects.requireNonNull(dialogClass.getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
        dialogClass.show();

    }

    @Override
    public void OnFailure(Response<FavoriteAddressModel> Response) {
        try {
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getCurrentFocus(), this, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getCurrentFocus(), this, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    private class GetLocationAsync extends AsyncTask<String, Void, String> {

        double x, y;
        StringBuilder str;

        public GetLocationAsync(double latitude, double longitude) {
            // TODO Auto-generated constructor stub
            x = latitude;
            y = longitude;
            pinLocation = new LatLng(x, y);


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

                if (addresses != null && !addresses.isEmpty()) {
                    completeAddress = addresses.get(0).getAddressLine(0); // If any additional address line present than only, check with max available address lines by getMaxAddressLineIndex()
                } else {
                    googleGeocoderPresenter.getAddressFromLocation(new LatLng(x, y), context);
                }

            } catch (IOException e) {
                Log.e("tag", e.getMessage());
            }
            return null;

        }

        @Override
        protected void onPostExecute(String result) {
            try {
                System.out.println("Address is " + completeAddress);
                if (completeAddress != null && !completeAddress.isEmpty()) {
                    setaddressTxt.setText(completeAddress);
                    addressTxt.setText(completeAddress);
                    AddLocationBtn.setClickable(true);
                } else {
                    googleGeocoderPresenter.getAddressFromLocation(new LatLng(x, y),context);

                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onProgressUpdate(Void... values) {

        }
    }


    @Override
    public void onCameraMove() {


    }

    @SuppressLint("ShowToast")
    @OnClick({R.id.back_img, R.id.address_txt, R.id.setaddress_txt, R.id.Add_location_btn})
    public void onViewClickedss(View view) {
        Intent intent = new Intent(this, GooglePlaceSearch.class);
        switch (view.getId()) {
            case R.id.back_img:
                finish();
                break;
            case R.id.address_txt:
                intent.putExtra("setpin", "setpin");
                startActivityForResult(intent, 0);
                break;
            case R.id.setaddress_txt:
                intent.putExtra("setpin", "setpin");
                startActivityForResult(intent, 0);

                break;
            case R.id.Add_location_btn:
                if (completeAddress != null && !completeAddress.isEmpty()) {
                    if (CommonData.HeaderTitle.equalsIgnoreCase("pickup") || CommonData.HeaderTitle.equalsIgnoreCase("drop") || CommonData.HeaderTitle.equalsIgnoreCase("Set pin Location")) {
                        setPickupAndDropAddress();
                        Intent PutAddress = new Intent();
                        Bundle bundle = new Bundle();
                        bundle.putParcelable("maps_location", pinLocation);
                        PutAddress.putExtra("bundle", bundle);
                        PutAddress.putExtra("address", completeAddress);
                        setResult(Activity.RESULT_OK, PutAddress);
                        finish();

                    }
                } else {
                    Utiles.CommonToast(activity, activity.getResources().getString(R.string.please_select_your_Address));
                }

                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 0) {
            if (resultCode == Activity.RESULT_OK) {
                Bundle b = data.getExtras();
                assert b != null;
                LatLng latLng = new LatLng(b.getDouble("droplat"), b.getDouble("droplng"));
                CameraPosition cameraPosition = new CameraPosition.Builder()
                        .target(latLng)                              // Sets the center of the map to current location
                        .zoom(Constants.MAP_ZOOM_SIZE)
                        .tilt(0)                                     // Sets the tilt of the camera to 0 degrees
                        .build();
                pinLocation = new LatLng(b.getDouble("droplat"), b.getDouble("droplng"));
                completeAddress = CommonData.strSetpinAddress;
                mMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
                addressTxt.setText(CommonData.strSetpinAddress);
                AddLocationBtn.setClickable(true);

            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
        try {
            if (dialogClass != null && dialogClass.isShowing()) {
                dialogClass.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setPickupAndDropAddress() {
        switch (CommonData.HeaderTitle) {
            case "pickup":
                CommonData.strPickupAddress = completeAddress;
                CommonData.Pickuplat = pinLocation.latitude;
                CommonData.Pickuplng = pinLocation.longitude;

                break;
            case "drop":
                CommonData.strDropAddresss = completeAddress;
                CommonData.Droplat = pinLocation.latitude;
                CommonData.Droplng = pinLocation.longitude;
                break;

        }
    }
}
