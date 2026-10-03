package com.soofer.driver.TripflowFragment;


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
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.driver.Activity.ChatActivity;
import com.soofer.driver.BuildConfig;
import com.soofer.driver.CommonClass.PermissionManager;
import com.soofer.driver.CommonClass.Stopwatch;
import com.soofer.driver.CustomizeDialog.MeterDialog;
import com.soofer.driver.CustomizeDialog.RiderVehicleDetails;
import com.soofer.driver.EventBus.CancelReason;
import com.soofer.driver.Model.ImageUploadModel;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.CustomizeDialog.OTPDialog;
import com.soofer.driver.CustomizeDialog.RiderProfile;
import com.soofer.driver.EventBus.DestinationAddressEvent;
import com.soofer.driver.FlowInterface.RequestInterface;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.Presenter.TripFlowPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.TripFlowView;
import com.soofer.driver.View.TripInterface;
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
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;

import static com.soofer.driver.CommonClass.CommonData.LastPastTime;
import static com.soofer.driver.CommonClass.CommonData.currentTime;
import static com.soofer.driver.CommonClass.CommonData.distance;
import static com.soofer.driver.CommonClass.CommonData.outsitedistance;
import static com.soofer.driver.CommonClass.CommonData.p;
import static com.soofer.driver.CommonClass.CommonData.startTime;
import static com.soofer.driver.CommonClass.CommonData.stopWatch;
import static com.soofer.driver.CommonClass.CommonData.strDistanceBegin;
import static com.soofer.driver.CommonClass.CommonData.strTotalDistance;
import static com.soofer.driver.CommonClass.Utiles.clearInstance;
import static com.soofer.driver.MainActivity.destLocation;
import static com.soofer.driver.MainActivity.getCurrentTime;
import static com.soofer.driver.MainActivity.waypoints_one;
import static com.soofer.driver.MainActivity.waypoints_two;

import androidx.annotation.NonNull;
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
    private Boolean onClickEnd = false;
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
    ImageView imgLeft, imgRight, imgFront, imgBack,imgSide1,imgSide2;
    ArrayList<File> imageList = new ArrayList<>();
    ArrayList<MultipartBody.Part> imageMultipart = new ArrayList<MultipartBody.Part>();

    public static Integer waitingTimeStart = 0;
    public static Integer waitingTimeEnd = 0;
    public static Integer waitingTime;
    public static Integer waitingTimeInSec;

    Fragment fragment = null;
    AlertDialog logoutAlert;

    @SuppressLint("ValidFragment")
    public TripFlowFragment(String status, Location mCurrentLocation, boolean safeRide) {
        this.tripStatus = status;
        this.mCurrentLocation = mCurrentLocation;
        this.safeRide = safeRide;
    }

    public TripFlowFragment(){

    }

    private Activity activity;
    private Context context;

    private Response<TripFlowModel> response = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        activity = (Activity) context;
        this.context = context;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_trip_flow, container, false);
        unbinder = ButterKnife.bind(this, view);
        address.setSelected(true);
        permissionManager = new PermissionManager();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        waitingTime = 0;
        if (tripStatus != null) {
            switch (tripStatus) {
                case "1":
                    tripBtn.setText(activity.getResources().getString(R.string.tap_to_arrive));
                    strTripStatus = "Tap to Arrive";
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
                    strTripStatus = "Tap to Arrive";
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

    public static String getCurrentTimes(Boolean isStartTime) {

        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        Date currentLocalTime = cal.getTime();
        DateFormat date = new SimpleDateFormat("mm");//24 Hour Format
        date.setTimeZone(TimeZone.getDefault());
        String localTime = date.format(currentLocalTime);
        Integer loTime = Integer.valueOf(localTime);
        if (isStartTime) {
            waitingTimeStart = loTime;
        } else {
            waitingTimeEnd = loTime;
        }
        return localTime.replaceAll(":", ".");

    }


    private void openDialogCamera(String status) {
        imageList.clear();
        SelectImage = new Dialog(activity);
        SelectImage.setContentView(R.layout.dialog_choose_image);
        Window window = SelectImage.getWindow();
        if (window != null) {
            window.setLayout(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
        }
        SelectImage.show();
        btnTakeImage = SelectImage.findViewById(R.id.btn_SaveImage);
        imgLeft = SelectImage.findViewById(R.id.imgLeft);
        imgRight = SelectImage.findViewById(R.id.imgRight);
        imgFront = SelectImage.findViewById(R.id.imgFront);
        imgBack = SelectImage.findViewById(R.id.imgBack);
        imgSide1 = SelectImage.findViewById(R.id.imgSide1);
        imgSide2 = SelectImage.findViewById(R.id.imgSide2);
        btnTakeImage.setOnClickListener(v -> {
                if (btnTakeImage.getText().toString().equalsIgnoreCase(context.getResources().getString(R.string.save_images))) {
                    if (imageList.size() == 6) {
                        Utiles.ShowLoader(activity);
                        new Thread(() -> {
                            for (File file : imageList) {
                                Utiles.compressForUpload(file);
                            }

                            HashMap<String, RequestBody> map = new HashMap<>();
                            map.put("tripId", RequestBody.create(MediaType.parse("text/plain"), SharedHelper.getKey(context, "trip_id")));
                            map.put("status", RequestBody.create(MediaType.parse("text/plain"), status));

                            MultipartBody.Part part0 = MultipartBody.Part.createFormData("image", imageList.get(0).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(0).toString())), imageList.get(0)));
                            MultipartBody.Part part1 = MultipartBody.Part.createFormData("image", imageList.get(1).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(1).toString())), imageList.get(1)));
                            MultipartBody.Part part2 = MultipartBody.Part.createFormData("image", imageList.get(2).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(2).toString())), imageList.get(2)));
                            MultipartBody.Part part3 = MultipartBody.Part.createFormData("image", imageList.get(3).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(3).toString())), imageList.get(3)));
                            MultipartBody.Part part4 = MultipartBody.Part.createFormData("image", imageList.get(4).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(4).toString())), imageList.get(4)));
                            MultipartBody.Part part5 = MultipartBody.Part.createFormData("image", imageList.get(5).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(imageList.get(5).toString())), imageList.get(5)));

                            activity.runOnUiThread(() -> {
                                TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
                                tripFlowPresenter.TripFlowStatusMultiPartApi(map, activity,
                                        part0, part1, part2, part3, part4, part5);
                            });
                        }).start();
                    }
                } else {
                    goToImageIntent();
                }
        });

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        if(ChatActivity.activity !=null) {
            ChatActivity.activity.finish();
        }
        DialogDismiss(riderDialog);
        DialogDismiss(otpDialog);
        DialogDismiss(meterDialog);
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

    public void goToImageIntent() {
        isPermissionGivenAlready = true;
        takePhotoFromCamera();
    }

    private void takePhotoFromCamera() {
        if (permissionManager.userHasPermission(activity)) {
            takePicture();
        } else {
            permissionManager.requestPermission(activity);
        }
    }

    private void takePicture() {
        if (activity == null) return;
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(activity.getPackageManager()) != null) {
            Uri photoURI = null;
            try {
                photoFile = Utiles.createImageFileWith(activity);
                path = photoFile.getAbsolutePath();
                uri = Uri.parse(path);
                if (imageList.size() <= 6) {
                    imageList.add(photoFile);
                }
                if (imageList.size() == 6) {
                    btnTakeImage.setText(context.getResources().getString(R.string.save_images));
                }
                switch (imageList.size()) {
                    case 1:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgLeft);
                        break;
                    case 2:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgRight);
                        break;
                    case 3:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgFront);
                        break;
                    case 4:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgBack);
                        break;
                    case 5:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgSide1);
                        break;
                    case 6:
                        Glide.with(activity).load(path)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true).into(imgSide2);
                        break;
                }
                photoURI = FileProvider.getUriForFile(activity, activity.getResources().getString(R.string.file_provider_authority), photoFile);
            } catch (IOException ex) {
                Log.e("TakePicture", ex.getMessage());
            }
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            activity.startActivityForResult(takePictureIntent, 4);
        }
    }


    @OnClick({R.id.trip_btn, R.id.rider_detail_layout,R.id.vehicle_detail_layout, R.id.navigation_layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.trip_btn:
                switch (strTripStatus) {
                    case "Tap to Arrive":
                         ArriveAlertdialog();
                        break;
                    case "Tap to Start":
                        if (response != null) {
                            if (response.body() != null) {
                                if (response.body().getSuccess())
                                    getCurrentTimes(false);
                                if (response.body().getFirstDriver()) {
                                        ShowOTPDialog(true, response.body().getStartOTP());
                                    } else {
                                        openDialogCamera("Start");
                                    }
                            }
                        }

                        break;
                    case "Tap to End":
                        assert response.body() != null;
                        if(response.body().getDriver() && response.body().getFirstDriver() ) {
                            waitingTimeStart = 0;
                            waitingTimeEnd = 0;
                            onClickEnd = true;
                            PresenterCall("3", CommonData.driveAllovanceDis, "false");
                        } else {
                            waitingTimeStart = 0;
                            waitingTimeEnd = 0;
                            EndAlertdialog();
                        }
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
                    if (destLocation != null && response != null && response.body() != null) {
                        routeLat = destLocation.latitude;
                        routeLng = destLocation.longitude;

                        List<?> multiLocationList = response.body().getMultiLocation();
                        boolean hasMultiLocation = multiLocationList != null && !multiLocationList.isEmpty();

                        if (!hasMultiLocation) {
                            // No stops — go directly to destination
                            GoogleNavi();
                        } else {
                            // 1 or 2 stops — extract from multiLocation API response
                            waypoint1Lat = null; waypoint1Lng = null;
                            waypoint2Lat = null; waypoint2Lng = null;

                            // Index 1 → first stop (waypoint 1)
                            TripFlowModel.MultiLocation stop1 =
                                    (TripFlowModel.MultiLocation) multiLocationList.get(1);
                            waypoint1Lat = Double.valueOf(stop1.getDoubleLat());
                            waypoint1Lng = Double.valueOf(stop1.getDoubleLng());

                            if (multiLocationList.size() > 3) {
                                // Index 2 → second stop (waypoint 2)
                                TripFlowModel.MultiLocation stop2 =
                                        (TripFlowModel.MultiLocation) multiLocationList.get(2);
                                waypoint2Lat = Double.valueOf(stop2.getDoubleLat());
                                waypoint2Lng = Double.valueOf(stop2.getDoubleLng());
                            }

                            GoogleNavigation();
                        }
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
                    getCurrentTimes(true);
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
                            if(response.body().getFirstDriver()){
                                if (SharedHelper.getKey(context, "ride_type").equalsIgnoreCase("outstation")) {
                                    meterDialog = new MeterDialog(activity, false, this);
                                    meterDialog.setCancelable(true);
                                    Objects.requireNonNull(meterDialog.getWindow()).getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                                    meterDialog.show();
                                } else {
                                    addEndTrip();
                                }
                            } else {
                                openDialogCamera("End");
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
                .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
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

    private void GoogleNavi() {
        if (routeLat != null && routeLng != null
                && !routeLat.isNaN() && !routeLng.isNaN()) {
            Uri gmmIntentUri = Uri.parse("google.navigation:q=" + routeLat + "," + routeLng);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            activity.startActivity(mapIntent);
        }
    }

    private void GoogleNavigation() {
        if (routeLat == null || routeLng == null
                || routeLat.isNaN() || routeLng.isNaN()) return;

        StringBuilder waypointsBuilder = new StringBuilder();

        // Stop A = waypoint1
        if (waypoint1Lat != null && waypoint1Lng != null
                && !waypoint1Lat.isNaN() && !waypoint1Lng.isNaN()) {
            waypointsBuilder.append(waypoint1Lat).append(",").append(waypoint1Lng);
        }

        // Stop B (if 2 stops) = waypoint2
        if (waypoint2Lat != null && waypoint2Lng != null
                && !waypoint2Lat.isNaN() && !waypoint2Lng.isNaN()) {
            if (waypointsBuilder.length() > 0) waypointsBuilder.append("|");
            waypointsBuilder.append(waypoint2Lat).append(",").append(waypoint2Lng);
        }

        // Current driver location as origin
        double originLat = MainActivity.mCurrentLocation.getLatitude();
        double originLng = MainActivity.mCurrentLocation.getLongitude();

        String uriString = "https://www.google.com/maps/dir/?api=1"
                + "&origin=" + originLat + "," + originLng        // ← driver's current location
                + "&destination=" + routeLat + "," + routeLng     // ← final destination (point B)
                + "&waypoints=" + waypointsBuilder.toString()      // ← stop(s) in between
                + "&travelmode=driving";

        Log.d("GoogleNavigation", "URI: " + uriString);

        Uri gmmIntentUri = Uri.parse(uriString);
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");

        if (mapIntent.resolveActivity(activity.getPackageManager()) != null) {
            activity.startActivity(mapIntent);
        } else {
            // Fallback: open in browser if Maps not installed
            mapIntent.setPackage(null);
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
                if (requestInterface != null) {
                    requestInterface.FlowDetails(Response);
                }
                if(onClickEnd){
                    onClickEnd = false;
                    if(Response.body().getFirstDriver() && Response.body().getFirstDriverCompleted()) {
                        EndAlertdialog();
                    } else {
                        Utiles.CommonToast(activity, getString(R.string.still_vehicle_photo_verification_not_completed));
                    }
                }
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
        }
    }

    @Override
    public void OnFailureUpload(Response<ImageUploadModel> Response) {

    }

    private void PresenterCall(String Status, String distanceDriver, String status) {
        if(SelectImage !=null && SelectImage.isShowing()) {
            return;
        } else {
            try {
                HashMap<String, String> map = new HashMap<>();
                map.put("status", Status);
                map.put("tripId", SharedHelper.getKey(context, "trip_id"));
                map.put("newUpdate", status);
                String safe;
                if (safeRide) {
                    safe = "true";
                } else {
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
                } else if (Status.equalsIgnoreCase("4") || Status.equalsIgnoreCase("7")) {
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
                    waitingTime = waitingTimeEnd - waitingTimeStart;
                    waitingTimeInSec = waitingTime * 60;
                    map.put("waitingSecond", waitingTimeInSec.toString());
                    map.put("waitingTime", waitingTimeInSec.toString());
                    map.put("distance", strTotalDistance);
                    map.put("duration", String.valueOf(duration));
                    map.put("endMeter", strDistance);
                    map.put("tollFee", Constants.tollfee);

                } else {
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
                    if (CommonData.stopWatch == null) {
                        CommonData.stopWatch = new Stopwatch();
                        CommonData.stopWatch.start();
                    }
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
                if (CommonData.stopWatch == null) {
                    CommonData.stopWatch = new Stopwatch();
                    CommonData.stopWatch.start();
                }
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

}
