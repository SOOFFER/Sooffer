package com.bismillah.driver.TripflowFragment;


import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bismillah.driver.CommonClass.PermissionManager;
import com.bismillah.driver.CustomizeDialog.MeterDialog;
import com.bismillah.driver.CustomizeDialog.RiderVehicleDetails;
import com.bismillah.driver.EventBus.CancelReason;
import com.bismillah.driver.EventBus.HailRequest;
import com.bismillah.driver.EventBus.ServiceWidgetEvent;
import com.bismillah.driver.Fragment.DriverCreditFragment;
import com.bismillah.driver.Model.ImageUploadModel;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.CustomizeDialog.OTPDialog;
import com.bismillah.driver.CustomizeDialog.RiderProfile;
import com.bismillah.driver.EventBus.DestinationAddressEvent;
import com.bismillah.driver.FlowInterface.RequestInterface;
import com.bismillah.driver.MainActivity;
import com.bismillah.driver.Model.TripFlowModel;
import com.bismillah.driver.Presenter.TripFlowPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.TripFlowView;
import com.bismillah.driver.View.TripInterface;
import com.tapadoo.alerter.Alerter;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.CommonData.LastPastTime;
import static com.bismillah.driver.CommonClass.CommonData.currentTime;
import static com.bismillah.driver.CommonClass.CommonData.distance;
import static com.bismillah.driver.CommonClass.CommonData.outsitedistance;
import static com.bismillah.driver.CommonClass.CommonData.p;
import static com.bismillah.driver.CommonClass.CommonData.startTime;
import static com.bismillah.driver.CommonClass.CommonData.stopWatch;
import static com.bismillah.driver.CommonClass.CommonData.strDistanceBegin;
import static com.bismillah.driver.CommonClass.CommonData.strTotalDistance;
import static com.bismillah.driver.CommonClass.Utiles.clearInstance;
import static com.bismillah.driver.MainActivity.destLocation;
import static com.bismillah.driver.MainActivity.getCurrentTime;
import static com.bismillah.driver.MainActivity.waypoints_one;
import static com.bismillah.driver.MainActivity.waypoints_two;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;


@SuppressLint("ValidFragment")
public class TripFlowFragment extends BaseFragment implements TripFlowView, TripInterface, MeterDialog.MeterCallback {

    private RequestInterface requestInterface;
    @BindView(R.id.address)
    TextView address;
    @BindView(R.id.trip_btn)
    Button tripBtn;
    @BindView(R.id.rider_detail_layout)
    LinearLayout riderDetailLayout;
    @BindView(R.id.vehicle_detail_layout)
    LinearLayout vehicleDetailLayout;
    @BindView(R.id.navigation_layout)
    LinearLayout navigationLayout;
    Unbinder unbinder;
    @BindView(R.id.overall_layout)
    LinearLayout overallLayout;
    private String tripStatus, strTripStatus = "";
    private boolean safeRide;
    private Location mCurrentLocation;
    private Double routeLat, routeLng, waypoint1Lat, waypoint1Lng, waypoint2Lat, waypoint2Lng;
    private RiderProfile riderDialog;
    private RiderVehicleDetails riderVehicleDetails;
    private OTPDialog otpDialog;
    private Dialog meterDialog;
    private Dialog SelectImage;
    private Integer duration = 0;
    private String strDistance = "0";
    private String strhillstaton = "0";
    private String strTollAmount = "0";
    Boolean isPermissionGivenAlready = false;
    private PermissionManager permissionManager;
    private File photoFile;
    public String path;
    Uri uri = null;
    Button btnTakeImage;
    ImageView imgLeft, imgRight, imgFront, imgBack;
    ArrayList<File> imageList = new ArrayList<>();
    ArrayList<MultipartBody.Part> imageMultipart = new ArrayList<MultipartBody.Part>();

    Fragment fragment = null;
    AlertDialog logoutAlert;

    @SuppressLint("ValidFragment")
    public TripFlowFragment(String status, Location mCurrentLocation, boolean safeRide) {
        this.tripStatus = status;
        this.mCurrentLocation = mCurrentLocation;
        this.safeRide = safeRide;
    }

    private Activity activity;
    private Context context;

    private Response<TripFlowModel> response = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_trip_flow, container, false);
        unbinder = ButterKnife.bind(this, view);
        address.setSelected(true);
        activity = getActivity();
        context = getContext();
        permissionManager = new PermissionManager();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        if (tripStatus != null) {
            switch (tripStatus) {
                case "1":
                    tripBtn.setText(activity.getResources().getString(R.string.tap_to_arrive));
                    strTripStatus = "Tap to arrive";
                    PresenterCall("1", "", "false");
                    break;
                case "2":
                    tripBtn.setText(activity.getResources().getString(R.string.top_to_start));
                    strTripStatus = "Tap to Start";
                    PresenterCall("2", "", "false");
                    break;
                case "3":
                    tripBtn.setText(activity.getResources().getString(R.string.tap_to_end));
                    PresenterCall("3", CommonData.driveAllovanceDis, "false");
                    strTripStatus = "Tap to End";
                    strDistanceBegin = "distancebegin";
                    // distance = 0;
                    p = 0;

                    break;
                case "empty":
                    tripBtn.setText(activity.getResources().getString(R.string.tap_to_arrive));
                    strTripStatus = "Tap to arrive";
                    PresenterCall("1", "", "false");
                    break;
                case "6":
                    tripBtn.setText(activity.getResources().getString(R.string.top_to_start));
                    strTripStatus = "Tap to Start";
                    safeRide = true;
                    PresenterCall("6", "", "false");
                    break;
                case "7":
                    tripBtn.setText(activity.getResources().getString(R.string.tap_to_end));
                    strTripStatus = "Tap to End";
                    safeRide = true;
                    PresenterCall("7", "", "false");
                    break;
            }


        }

        if (SharedHelper.getKey(activity, "trip_mode") != null && SharedHelper.getKey(activity, "trip_mode").equalsIgnoreCase("hail")) {
            riderDetailLayout.setVisibility(View.GONE);
        }
        if (SharedHelper.getKey(activity,"vehicle_detail").equalsIgnoreCase("true")){
            vehicleDetailLayout.setVisibility(View.VISIBLE);
        }
        else{
            vehicleDetailLayout.setVisibility(View.GONE);
        }

        return view;
    }

    private void openDialogCamera(String status) {

        SelectImage = new Dialog(context);
        SelectImage.setContentView(R.layout.dialog_choose_image);
        SelectImage.show();
        btnTakeImage = SelectImage.findViewById(R.id.btn_SaveImage);
        imgLeft = SelectImage.findViewById(R.id.imgLeft);
        imgRight = SelectImage.findViewById(R.id.imgRight);
        imgFront = SelectImage.findViewById(R.id.imgFront);
        imgBack = SelectImage.findViewById(R.id.imgBack);
        btnTakeImage.setOnClickListener(v -> {
            if (btnTakeImage.getText().toString().equalsIgnoreCase("Save Images")) {
                HashMap<String, RequestBody> map = new HashMap();
                map.put("tripId", RequestBody.create(MediaType.parse("text/plain"), SharedHelper.getKey(context, "trip_id")));
                map.put("status", RequestBody.create(MediaType.parse("text/plain"), status));
                if (imageList.size() == 4) {
                    TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
                    tripFlowPresenter.TripFlowStatusMultiPartApi(map, activity,
                            MultipartBody.Part.createFormData("image", imageList.get(0).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(0).getName())), imageList.get(0))),
                            MultipartBody.Part.createFormData("image", imageList.get(1).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(1).getName())), imageList.get(0))),
                            MultipartBody.Part.createFormData("image", imageList.get(2).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(2).getName())), imageList.get(0))),
                            MultipartBody.Part.createFormData("image", imageList.get(3).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(3).getName())), imageList.get(0)))
                    );
                }
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (checkStoragePermission()) {
                        requestPermissions(new String[]{Manifest.permission.CAMERA,
                                Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 100);
                    } else {
                        goToImageIntent();
                    }
                } else {
                    goToImageIntent();
                }
            }

        });

    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    private boolean checkStoragePermission() {
        return ContextCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED;
    }

    public void goToImageIntent() {
        isPermissionGivenAlready = true;
        takePhotoFromCamera();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        DialogDismiss(riderDialog);
        DialogDismiss(otpDialog);
        DialogDismiss(meterDialog);
        unbinder.unbind();
    }

    private void DialogDismiss(Dialog dialog) {
        try {
            if (dialog != null && dialog.isShowing()) {
                dialog.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick({R.id.trip_btn, R.id.rider_detail_layout,R.id.vehicle_detail_layout, R.id.navigation_layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.trip_btn:
                switch (strTripStatus) {
                    case "Tap to arrive":
                         ArriveAlertdialog();
                     /*   if (response == null | CommonData.CurrentLocation==null){
                            alertMessage(activity.getResources().getString(R.string.we_cant_get_your_location));
                            return;
                        }
                        assert response.body() != null;
                        double distanceInKiloMeters = (LatLngToLocation("a",Double.parseDouble(response.body().getPickupdetails().getStartcoords().get(1)), Double.parseDouble(response.body().getPickupdetails().getStartcoords().get(0)) ).distanceTo(CommonData.CurrentLocation)) / 1000; // as distance is in meter
                        if (distanceInKiloMeters <= 0.1){*/

                      /*  }else {
                            alertMessage(activity.getResources().getString(R.string.your_cant_after_reaching));
                        }*/

                        break;
                    case "Tap to Start":
                        if (response != null) {
                            assert response.body() != null;
                            if (response.body().getSuccess())
                                if (response.body().getIsFirstDriver()) {
                                    ShowOTPDialog(true, response.body().getStartOTP());
                                } else {
                                    openDialogCamera("Start");
                                }
                        }

                        break;
                    case "Tap to End":

                        EndAlertdialog();

                        //  PresenterCall("4");
                      /*  if (response != null) {
                            ShowOTPDialog(false, response.body().getEndOTP());
                        }*/



                      /*  FirebaseTripStatus("4");
                        Constants.Previousstatus = "4";
                        stopWatch.pause();
                        try {
                            requestInterface = (RequestInterface) getActivity();
                            requestInterface.summaryFragment();
                        } catch (Exception e) {
                            Log.e("tag", "Eception of request screen" + e.getMessage());
                        }
                        tripBtn.setEnabled(false);*/
                        break;
                }
                break;
            case R.id.rider_detail_layout:
                riderDialog = new RiderProfile(activity, response);
                riderDialog.setCancelable(true);
                Objects.requireNonNull(riderDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                riderDialog.show();
                break;
            case R.id.vehicle_detail_layout:
                riderVehicleDetails = new RiderVehicleDetails(context);
                riderVehicleDetails.setCancelable(true);
                Objects.requireNonNull(riderVehicleDetails.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                riderVehicleDetails.show();
                break;
            case R.id.navigation_layout:
                try {
                    if (destLocation != null && waypoints_one == null && waypoints_two == null) {
                        routeLat = destLocation.latitude;
                        routeLng = destLocation.longitude;
                        GoogleNavi();
                    } else if (destLocation != null && waypoints_one != null && waypoints_two != null){
                        routeLat = destLocation.latitude;
                        routeLng = destLocation.longitude;
                        waypoint1Lat = waypoints_one.latitude;
                        waypoint1Lng = waypoints_one.longitude;
                        waypoint2Lat = waypoints_two.latitude;
                        waypoint2Lng = waypoints_two.longitude;
                        GoogleNavigation();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }
    }

    public void ArriveAlertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setMessage(R.string.sure_tap_to_arrive);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    PresenterCall("2", "", "true");
                    FirebaseTripStatus("2");
                    tripBtn.setText(activity.getResources().getString(R.string.top_to_start));
                    strTripStatus = "Tap to Start";
                    Constants.Previousstatus = "2";
                    strDistanceBegin = "distancebegin";
                    distance = 0;
                    outsitedistance = 0;
                    p = 0;
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no),
                (dialog, which) ->
                        dialog.dismiss());
        logoutAlert = builder1.create();
        logoutAlert.show();
    }

    public void EndAlertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setMessage(R.string.sure_end_the_trip);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    if (response != null) {
                        assert response.body() != null;
                        if (response.body().getSuccess())
                            if (!response.body().getIsFirstDriver()) {
                                openDialogCamera("End");
                            } else {
                                if (/*SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("rental") ||*/ SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("outstation")) {
                                    meterDialog = new MeterDialog(activity, false, this);
                                    meterDialog.setCancelable(true);
                                    Objects.requireNonNull(meterDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                                    meterDialog.show();
                                } else {
                                    addEndTrip();
                                }
                            }
                    }
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no),
                (dialog, which) ->
                        dialog.dismiss());
        logoutAlert = builder1.create();
        logoutAlert.show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED)
    public void Onmesssage(CancelReason event) {
        riderDialog.dismiss();
        fragment = new CancelFragment();
        moveToFragment(fragment);
    }

    private void moveToFragment(Fragment fragment) {
        getActivity().getSupportFragmentManager().beginTransaction()
                .replace(R.id.container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
    }

    private void addEndTrip() {
        String starttime = SharedHelper.getKey(context, "starttime");
        String endtime = getCurrentTime();

        @SuppressLint("SimpleDateFormat")
        DateFormat format = new SimpleDateFormat("HH:mm");//24 Hour Format
        Date d1;
        Date d2;
        try {
            d1 = format.parse(starttime);
            d2 = format.parse(endtime);

            assert d1 != null;
            assert d2 != null;
            long diff = d2.getTime() - d1.getTime();
            long diffMinutes = diff / (60 * 1000);
            duration = (int) (long) diffMinutes;

            System.out.println("THe time difference" + diffMinutes);

        } catch (Exception e) {
            e.printStackTrace();
        }
        PresenterCall("4", "", "true");
        waypoints_one = null;
        waypoints_two = null;
    }

    private void GoogleNavi(){
        if (!routeLat.isNaN() && !routeLng.isNaN()) {
            Uri gmmIntentUri = Uri.parse("google.navigation:q=" + routeLat + "," + routeLng);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            activity.startActivity(mapIntent);
        }
    }

    private void GoogleNavigation() {
        if (!routeLat.isNaN() && !routeLng.isNaN() && !waypoint1Lat.isNaN() && !waypoint1Lng.isNaN() && !waypoint2Lat.isNaN() && !waypoint2Lng.isNaN()) {

            System.out.println("Navi Test"+ routeLat + "<<<---->>>" + routeLng);
            System.out.println("Waypoint_1 Check"+ waypoint1Lat + "<<<---->>>" + waypoint1Lng);
            System.out.println("Waypoint_2 Check"+ waypoint2Lat + "<<<---->>>" + waypoint2Lng);

                Uri gmmIntentUri = Uri.parse("https://www.google.com/maps/dir/?api=1&destination=" + routeLat + "," + routeLng +"&waypoints=" + waypoint1Lat + ","  +waypoint1Lng + "|"  + waypoint2Lat + "," +waypoint2Lng +"&travelmode=driving");
                Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
                mapIntent.setPackage("com.google.android.apps.maps");
                activity.startActivity(mapIntent);
        }
    }

    private void ShowOTPDialog(boolean status, String Otp) {
        otpDialog = new OTPDialog(activity, Otp, this, status);
        otpDialog.setCancelable(true);
        Objects.requireNonNull(otpDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
        otpDialog.show();
    }

    @Override
    public void OnSuccessfullys(Response<TripFlowModel> Response) {

        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            this.response = Response;
            try {
                if (Constants.Previousstatus.equalsIgnoreCase("3")) {
                    address.setText(Response.body().getPickupdetails().getEnd());
                } else {
                    address.setText(Response.body().getPickupdetails().getStart());
                }
                Constants.tollfee = Response.body().getFare().getToll_fare();
                requestInterface = (RequestInterface) getActivity();
                assert requestInterface != null;
                requestInterface.FlowDetails(Response);
            } catch (Exception e) {
                Log.e("tag", "Eception of request screen" + e.getMessage());
            }

        } else {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
        SharedHelper.putKey(context,"rider_id",Utiles.Nullpointer(Response.body().getRider().getId()));

    }

    @Override
    public void OnFailures(Response<TripFlowModel> Response) {
        try {
            assert Response.errorBody() != null;
            Utiles.showErrorMessage(Response.errorBody().string(), activity, getView());
        } catch (IOException e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), context, context.getString(R.string.poor_network));
        }
    }

    @Override
    public void OnSuccessfullyUpload(Response<ImageUploadModel> Response) {
        assert Response.body() != null;
        if (Response.body().isSuccess()) {
            if (SelectImage.isShowing()) {
                imageList.clear();
                SelectImage.dismiss();
            }
//            if (/*SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("rental") ||*/ SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("outstation")) {
//                meterDialog = new MeterDialog(activity, false, this);
//                meterDialog.setCancelable(true);
//                Objects.requireNonNull(meterDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
//                meterDialog.show();
//            } else {
//                addEndTrip();
//                           /* meterDialog = new TollDialog(activity,  false,this);
//                            meterDialog.setCancelable(true);
//                            Objects.requireNonNull(meterDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
//                            meterDialog.show();*/
//            }
           /* if (Response.body().getDocs().getStatus().equalsIgnoreCase("start")) {
                ShowOTPDialog(true, response.body().getStartOTP());
            } else {

            }*/
        }
    }

    @Override
    public void OnFailureUpload(Response<ImageUploadModel> Response) {

    }

    private void PresenterCall(String Status, String distanceDriver, String status) {
        try {
            HashMap<String, String> map = new HashMap<>();
            map.put("status", Status);
            map.put("tripId", SharedHelper.getKey(context, "trip_id"));
            map.put("newUpdate", status);
            String safe;
            if(safeRide){
                safe ="true";
            }else{
                safe = "false";
            }
            map.put("safeRide", safe);

            if (Status.equalsIgnoreCase("3") || Status.equalsIgnoreCase("6")) {
                map.put("allowanceDistance", distanceDriver);
                map.put("pickupLat", String.valueOf(MainActivity.mCurrentLocation.getLatitude()));
                map.put("pickupLng", String.valueOf(MainActivity.mCurrentLocation.getLongitude()));
                map.put("startTime", getCurrentTime());
                map.put("endAddress", "");
                map.put("endTime", "");
                map.put("dropLat", "");
                map.put("dropLng", "");
                map.put("distance", "");
                map.put("duration", "");
                map.put("waitingTime", "");
                map.put("startMeter", strDistance);
                map.put("fromAddress", getCompleteAddressString(MainActivity.mCurrentLocation.getLatitude(), MainActivity.mCurrentLocation.getLongitude()));
            } else
            if (Status.equalsIgnoreCase("4")|| Status.equalsIgnoreCase("7")) {
                Constants.Previousstatus = "3";
                if (!strhillstaton.isEmpty()) {
                    JSONArray jsonArray = new JSONArray();
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", "hillKm");
                    jsonObject.put("amount", strhillstaton);
                    map.put("hillKm", strhillstaton);
                }
                map.put("pickupLat", "");
                map.put("pickupLng", "");
                map.put("startTime", "");
                map.put("dropLat", String.valueOf(MainActivity.mCurrentLocation.getLatitude()));
                map.put("dropLng", String.valueOf(MainActivity.mCurrentLocation.getLongitude()));
                map.put("endTime", getCurrentTime());
                map.put("fromAddress", "");
                map.put("endAddress", getCompleteAddressString(MainActivity.mCurrentLocation.getLatitude(), MainActivity.mCurrentLocation.getLongitude()));
                map.put("waitingSecond", String.valueOf(stopWatch.getElapsedTimeSecs() + 60 * stopWatch.getElapsedTimeMin() + 60 * 60 * stopWatch.getElapsedTimeHour()));
                map.put("waitingTime", String.valueOf(stopWatch.getElapsedTimeSecs() + 60 * stopWatch.getElapsedTimeMin() + 60 * 60 * stopWatch.getElapsedTimeHour()));
                map.put("distance", strTotalDistance);
                map.put("duration", String.valueOf(duration));
                map.put("endMeter", strDistance);
                map.put("tollFee", Constants.tollfee);

            } else
            {
                map.put("pickupLat", "");
                map.put("pickupLng", "");
                map.put("startTime", "");
                map.put("endTime", "");
                map.put("fromAddress", "");
                map.put("dropLat", "");
                map.put("dropLng", "");
                map.put("distance", "");
                map.put("duration", "");
                map.put("waitingTime", "");
                map.put("endAddress", "");
            }
            TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
            tripFlowPresenter.TripFlowStatusApi(map, activity);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void FirebaseTripStatus(String tripStatus) {
        DatabaseReference Accept = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        HashMap<String, Object> updatestatus = new HashMap<>();
        updatestatus.put("status", tripStatus);
        Accept.updateChildren(updatestatus);

    }

    @SuppressLint("LongLogTag")
    private String getCompleteAddressString(double LATITUDE, double LONGITUDE) {
        String strAdd = "";
        Geocoder geocoder = new Geocoder(context, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(LATITUDE, LONGITUDE, 1);
            if (addresses != null) {
                Address returnedAddress = addresses.get(0);
                StringBuilder strReturnedAddress = new StringBuilder(" ");

                for (int i = 0; i <= returnedAddress.getMaxAddressLineIndex(); i++) {
                    strReturnedAddress.append(returnedAddress.getAddressLine(i)).append("\n");
                }
                strAdd = strReturnedAddress.toString();
                Log.w("My Current loction address", strReturnedAddress.toString());
            } else {
                Log.w("My Current loction address", "No Address returned!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.w("My Current loction address", "Canont get Address!");
        }
        return strAdd;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void CheckTripStatus(boolean ischeck) {
        if (ischeck) {
            System.out.println("enter the your" + SharedHelper.getKey(context, "ride_type"));
            if (/*SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("rental") || */SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("outstation")) {
                meterDialog = new MeterDialog(activity, true, this);
                meterDialog.setCancelable(true);
                Objects.requireNonNull(meterDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                meterDialog.show();
            } else {
                PresenterCall("3", String.valueOf(distance), "true");
                FirebaseTripStatus("3");
                SharedHelper.putKey(context, "starttime", getCurrentTime());
                tripBtn.setText(activity.getResources().getString(R.string.tap_to_end));
                strTripStatus = "Tap to End";
                Constants.Previousstatus = "3";
                strDistanceBegin = "distancebegin";
                distance = 0;
                startTime = 0;
                currentTime = 0;
                LastPastTime = 0;
                p = 0;
                try {
                    stopWatch.start();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        } else {
            FirebaseTripStatus("4");
            Constants.Previousstatus = "4";
            try {
                requestInterface = (RequestInterface) getActivity();
                assert requestInterface != null;
                requestInterface.summaryFragment();
            } catch (Exception e) {
                Log.e("tag", "Eception of request screen" + e.getMessage());
            }
            tripBtn.setEnabled(false);
        }

    }

    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);
        super.onStop();
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(DestinationAddressEvent event) {
        if (Constants.Previousstatus.equalsIgnoreCase("3")) {
            address.setText(event.getAddress());
        }
        EventBus.getDefault().removeStickyEvent(DestinationAddressEvent.class); // don't forget to remove the sticky event if youre done with it
    }

    @Override
    public void onSuccess(JSONObject object, boolean ischeck) {
        if (ischeck) {
            strDistance = object.optString("distance");
            PresenterCall("3", String.valueOf(distance), "true");
            FirebaseTripStatus("3");
            SharedHelper.putKey(context, "starttime", getCurrentTime());
            tripBtn.setText(activity.getResources().getString(R.string.tap_to_end));
            strTripStatus = "Tap to End";
            Constants.Previousstatus = "3";
            strDistanceBegin = "distancebegin";
            distance = 0;
            startTime = 0;
            currentTime = 0;
            LastPastTime = 0;
            p = 0;
            try {
                stopWatch.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            if (object.optString("trip_type").equalsIgnoreCase("normal")) {
                strTollAmount = object.optString("toll_amount");
            } else {
                strDistance = object.optString("distance");
                strhillstaton = object.optString("hillstation");
                strTollAmount = object.optString("toll_amount");

            }

            addEndTrip();
        }

    }

    public Location LatLngToLocation(String locatin, Double lat, Double lng) {
        final Location location = new Location(locatin);
        location.setLatitude(lat);
        location.setLongitude(lng);
        return location;
    }

    private void alertMessage(String message) {
        Alerter.create(activity)
                .setTitle(activity.getResources().getString(R.string.app_name))
                .setText(message)
                .setBackgroundColorRes(R.color.colorAccent)
                .show();
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
        if (takePictureIntent.resolveActivity(getActivity().getPackageManager()) != null) {
            Uri photoURI = null;
            try {
                photoFile = createImageFileWith();
                path = photoFile.getAbsolutePath();
                uri = Uri.parse(path);
                if (imageList.size() <= 4) {
                    imageList.add(photoFile);
                }
                if (imageList.size() == 4) {
                    btnTakeImage.setText("Save Images");
                }
                switch (imageList.size()) {
                    case 1:
                        Glide.with(activity)
                                .load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true)
                                .into(imgLeft);
                        break;
                    case 2:
                        Glide.with(activity)
                                .load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true)
                                .into(imgRight);
                        break;
                    case 3:
                        Glide.with(activity)
                                .load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true)
                                .into(imgFront);
                        break;
                    case 4:
                        Glide.with(activity)
                                .load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true)
                                .into(imgBack);
                        break;
                }

                photoURI = FileProvider.getUriForFile(getActivity(), getString(R.string.file_provider_authority), photoFile);
                Log.e("response", "" + path + "////" + photoURI);

            } catch (IOException ex) {
                Log.e("TakePicture", ex.getMessage());
            }
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.LOLLIPOP) {
                takePictureIntent.setClipData(ClipData.newRawUri("", photoURI));
                takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            }
            startActivityForResult(takePictureIntent, 4);
        }
    }

    public File createImageFileWith() throws IOException {
        final String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        final String imageFileName = "JPEG_" + timestamp;
        File storageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "pics");
        storageDir.mkdirs();
        return File.createTempFile(imageFileName, ".jpg", storageDir);
    }
}
