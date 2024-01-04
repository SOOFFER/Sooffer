package com.bismillah.driver.TripflowFragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;

import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bismillah.driver.Adapter.FareAdapter;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.Model.DriverProfileModel;
import com.bismillah.driver.Model.FareModel;
import com.bismillah.driver.Model.ImageUploadModel;
import com.bismillah.driver.Presenter.DriverProfilePresenter;
import com.bismillah.driver.View.DriverView;
import com.bismillah.driver.View.ProfileView;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.FlowInterface.RequestInterface;
import com.bismillah.driver.MainActivity;
import com.bismillah.driver.Model.FareCaluationModel;
import com.bismillah.driver.Model.TripFlowModel;
import com.bismillah.driver.Presenter.FeedBackPresenter;
import com.bismillah.driver.Presenter.TripFlowPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.TripFlowView;
import com.google.gson.reflect.TypeToken;

import org.jetbrains.annotations.NotNull;

import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.Utiles.clearInstance;
import static com.bismillah.driver.CommonClass.Utiles.hideKeyboard;


@SuppressLint("ValidFragment")
public class SummaryFragment extends BaseFragment implements TripFlowView, ProfileView {


    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.discount_amount_txt)
    TextView discountAmountTxt;
    @BindView(R.id.pickup_txt)
    TextView pickupTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.driver_rating)
    RatingBar driverRating;
    @BindView(R.id.feedback_txt)
    EditText feedbackTxt;
    @BindView(R.id.submit_txt)
    Button submitTxt;
    Unbinder unbinder;
    @BindView(R.id.pickup_layout)
    LinearLayout pickupLayout;
    @BindView(R.id.taxi_layout)
    LinearLayout taxiLayout;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.waitings_layout)
    LinearLayout waitingLayout;
    @BindView(R.id.WaiingTimt_txt)
    TextView WaiingTimtTxt;
    @BindView(R.id.Waiting_fare_txt)
    TextView WaitingFareTxt;
    @BindView(R.id.bases_fare_txt)
    TextView basesFareTxt;

    private DatabaseReference databaseReference;
    private ValueEventListener valueEventListener;

    private Activity activity;
    private Context context;
    private RequestInterface requestInterface;
    private FareCaluationModel fareCaluationModel;
    private String status, strendAdrresss;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.distance_fare_txt)
    TextView distanceFareTxt;
    @BindView(R.id.time_fare_txt)
    TextView timeFareTxt;
    @BindView(R.id.balance_fare_txt)
    TextView balanceFareTxt;
    @BindView(R.id.payment_type_txt)
    TextView paymentTypeTxt;
    @BindView(R.id.detect_fare_txt)
    TextView detectFareTxt;
    @BindView(R.id.distance_txt)
    TextView distanceTxt;
    @BindView(R.id.time_txt)
    TextView timeTxt;
    @BindView(R.id.ordinary)
    LinearLayout ordinary;
    @BindView(R.id.cancellation_layout)
    LinearLayout cancellationLayout;

    @BindView(R.id.Ride_fare_txt)
    TextView RideFareTxt;
    @BindView(R.id.ride_fare_layout)
    LinearLayout rideFareLayout;


    @BindView(R.id.hill_amount__txt)
    TextView hillAmount_Txt;
    @BindView(R.id.toll_fare_txt)
    TextView tollFareTxt;
    @BindView(R.id.booking_fare_txt)
    TextView bookingFareTxt;
    @BindView(R.id.hill_amount__layout)
    LinearLayout hillAmountLayout;


    @BindView(R.id.normal_flow_layout)
    CardView normal_flow_layout;

    @BindView(R.id.rental_outstation_card_layout)
    CardView rental_outstation_card_layout;

    @BindView(R.id.outstation_fare_recycleview)
    RecyclerView outstation_fare_recycleview;
    private FareAdapter fareAdapter;

    @BindView(R.id.mini_fare_txt)
    TextView miniFareTxt;
    @BindView(R.id.gateway_txt)
    TextView gatewayTxt;
    @BindView(R.id.edtMake)
    TextView edtmake;

    @BindView(R.id.edtModel)
    TextView edtmodel;

    @BindView(R.id.edtcolor)
    TextView edtcolor;

    @BindView(R.id.edtNumber)
    TextView edtphonenumber;

    @BindView(R.id.multistop)
    TextView multistop;

    @BindView(R.id.surgetxtedt)
    TextView surgeedt;

    @BindView(R.id.vehicledetails)
    CardView vehicledetails;

    public SummaryFragment() {

    }


    @SuppressLint("ValidFragment")
    public SummaryFragment(FareCaluationModel fareCaluationModel, String status) {
        this.fareCaluationModel = fareCaluationModel;
        this.status = status;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_summary, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        System.out.println("frag "+SharedHelper.getKey(context, "driver_earned"));

        titleTxt.setSelected(true);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        if (status.equalsIgnoreCase("Api")) {
            strendAdrresss = getCompleteAddressString(fareCaluationModel.getmCurrentLocation().getLatitude(), fareCaluationModel.getmCurrentLocation().getLongitude());
            dropAddressTxt.setText(strendAdrresss);
            FirebaseTripStatus("Drop_address", strendAdrresss);
            FirebaseTripStatus("distance", fareCaluationModel.getDistance());
            FirebaseTripStatus("waitingTime", fareCaluationModel.getWaitingTime());
            PresenterCall("4");
            submitTxt.setEnabled(false);
            FareCalculation();
        } else {
            FareCalculation();
        }
        CommonData.strDistanceBegin = "totaldistancend";

        //get current Date and Time
        Calendar c = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyy hh:mm a"); // 12 hours formate
        String formattedDate = df.format(c.getTime());
        dateTimeTxt.setText(formattedDate);
        FirebaseTripStatus("datetime", formattedDate);
        ProfilePresenter();

        return view;


    }

    public void PresenterCall(String Status) {
        distanceTxt.setText(dotLimitation(Double.parseDouble(fareCaluationModel.getDistance())) + " Mile");
        timeTxt.setText(fareCaluationModel.getDuration() + " Min");
        HashMap<String, String> map = new HashMap<>();
        map.put("status", Status);
        map.put("tripId", SharedHelper.getKey(context, "trip_id"));
        map.put("distance", fareCaluationModel.getDistance());
        map.put("duration", fareCaluationModel.getDuration());
        map.put("dropLat", String.valueOf(fareCaluationModel.getmCurrentLocation().getLatitude()));
        map.put("dropLng", String.valueOf(fareCaluationModel.getmCurrentLocation().getLongitude()));
        map.put("pickupLat", "");
        map.put("pickupLng", "");
        map.put("endAddress", strendAdrresss);
        map.put("startTime", "");
        map.put("allowanceDistance", "");
        map.put("waitingTime", fareCaluationModel.getWaitingTime());
        map.put("endTime", MainActivity.getCurrentTime());
        map.put("fromAddress", "");
        TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
        tripFlowPresenter.TripFlowStatusApi(map, activity);
        System.out.println("enter the trip presenter" + map);


    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();

    }

    @OnClick(R.id.submit_txt)
    public void onViewClicked() {
        hideKeyboard(activity);
        Utiles.ClearFirebase(context);
        CommonData.strDistanceBegin = "totaldistancend";

        CommonData.p = 1;
        CommonData.lStart = null;
        CommonData.lEnd = null;
        sentFeedBack();
        SharedHelper.putKey(context, "trip_id", "null");
        try {
            requestInterface = (RequestInterface) getActivity();
            requestInterface.ClearFragment();
            Intent i = new Intent(context, MainActivity.class);
            startActivity(i);
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }

    }


    public void ProfilePresenter() {
        //  showLoader();
        DriverProfilePresenter driverProfilePresenter = new DriverProfilePresenter(this);
        driverProfilePresenter.getProfile(activity, false);
    }


    @Override
    public void OnSuccessfully(Response<List<DriverProfileModel>> Response) {
        //  dismissiLoader();
        if (Response.body() != null && !Response.body().isEmpty()) {
            List<DriverProfileModel> driverProfileModels = Response.body();
            SharedHelper.putKey(context, "fname", driverProfileModels.get(0).getFname());
            SharedHelper.putKey(context, "drivercode", driverProfileModels.get(0).getCode());
            SharedHelper.putKey(context, "attendance", driverProfileModels.get(0).getAttendance().toString());
            SharedHelper.putKey(context, "code", driverProfileModels.get(0).getCode());
            SharedHelper.putKey(context, "gender", Response.body().get(0).getGender());
            SharedHelper.putKey(context, "lname", driverProfileModels.get(0).getLname());
            SharedHelper.putKey(context, "email", driverProfileModels.get(0).getEmail());
            SharedHelper.putKey(context, "phcode", driverProfileModels.get(0).getPhcode());
            SharedHelper.putKey(context, "phone", driverProfileModels.get(0).getPhone());
            SharedHelper.putKey(context, "lang", driverProfileModels.get(0).getLang());
            SharedHelper.putKey(context, "cur", driverProfileModels.get(0).getCur());
            SharedHelper.putKey(context, "filepath", driverProfileModels.get(0).getBaseurl());
            SharedHelper.putOnline(activity, "isconnect", driverProfileModels.get(0).getIsConnected());
            SharedHelper.putKey(context, "card_number", Response.body().get(0).getCard().getLast4());
            if (Utiles.IsNull(driverProfileModels.get(0).getLicence())) {
                SharedHelper.putKey(context, "licence", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicence());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getInsurance())) {
                SharedHelper.putKey(activity, "insurance", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsurance());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getPassing())) {
                SharedHelper.putKey(activity, "passing", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassing());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getInsuranceBackImg())) {
                SharedHelper.putKey(activity, "insuranceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsuranceBackImg());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getPassingBackImg())) {
                SharedHelper.putKey(activity, "passingBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassingBackImg());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getLicenceBackImg())) {
                SharedHelper.putKey(activity, "licenceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicenceBackImg());

            }
            SharedHelper.putKey(activity, "licence_date", driverProfileModels.get(0).getLicenceexp());
            //    SharedHelper.putKey(getApplicationContext(), "insurance_date", driverProfileModels.get(0).getInsuranceexp());
            // SharedHelper.putKey(getApplicationContext(), "passing_date", driverProfileModels.get(0).getPassingexp());

            SharedHelper.putKey(context, "profile", driverProfileModels.get(1).getProfileurl());
            try {
                Constants.WalletAlertEnable = driverProfileModels.get(3).getIsDriverCreditModuleEnabledForUseAfterLogin();
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (driverProfileModels.get(2).getCurrentActiveTaxi() != null) {
                SharedHelper.putKey(context, "vehicleId", driverProfileModels.get(2).getCurrentActiveTaxi().getId());
                SharedHelper.putKey(context, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
                SharedHelper.putKey(context, "vmake", driverProfileModels.get(2).getCurrentActiveTaxi().getMakename());
                SharedHelper.putKey(context, "vmodel", driverProfileModels.get(2).getCurrentActiveTaxi().getModel());
                SharedHelper.putKey(context, "numplate", driverProfileModels.get(2).getCurrentActiveTaxi().getLicence());
                SharedHelper.putKey(context, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
            } else {
               System.out.println("aaa ");
            }
            SharedHelper.putKey(context, "support_num", Response.body().get(5).getConfigData().getSupportNo());
            SharedHelper.putKey(context, "google_key", Response.body().get(5).getConfigData().getGoogleApi());
            SharedHelper.putKey(context, "google_autocomplete", Response.body().get(5).getConfigData().getGoogleApiAutoComplete());

            SharedHelper.putKey(context,"driver_earned",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());
            SharedHelper.putKey(context,"driver_admin",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getAdminCommision());
            SharedHelper.putKey(context,"driver_tax",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTax());
            SharedHelper.putKey(context,"driver_cash",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getCashCollected());
            SharedHelper.putKey(context,"driver_ridefare",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getRideFare());
            SharedHelper.putKey(context,"date",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getDate());
            SharedHelper.putKey(context,"km",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotalDistance());
            SharedHelper.putKey(context,"rides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotTrips());
            SharedHelper.putKey(context,"perdayrides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getPerdayride());
            SharedHelper.putKey(context,"perdaykm",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getPerdaykm());


            Log.d("testing", "testing: "+driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());

        }

    }

    @Override
    public void OnFailure(Response<List<DriverProfileModel>> Response) {
        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
    }

    public void FirebaseTripStatus(String key, String value) {
        DatabaseReference Accept = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        HashMap<String, Object> updatestatus = new HashMap<>();
        updatestatus.put(key, value);
        Accept.updateChildren(updatestatus);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccessfullys(Response<TripFlowModel> Response) {
        System.out.println("enter json reponse" + new Gson().toJson(Response.body()));
        assert Response.body() != null;
        FirebaseTripStatus("convance_fare", Response.body().getFare().getPickupCharge());
        FirebaseTripStatus("total_fare", Response.body().getFare().getTotalFare());
        FirebaseTripStatus("time_fare", Response.body().getFare().getWaitingFare());
        FirebaseTripStatus("discount", Response.body().getFare().getDiscountAmt());
        FirebaseTripStatus("ispay", Response.body().getFare().getBalanceFare());
        if (Response.body().getFare().getApplyValues().getApplyNightCharge()) {
            if (Response.body().getFare().getNightObj().getIsApply()) {
                FirebaseTripStatus("isNight", Response.body().getFare().getNightObj().getAlertLable());
            } else {
                FirebaseTripStatus("isNight", "0");
            }
        } else {
            FirebaseTripStatus("isNight", "0");
        }
        if (Response.body().getFare().getApplyValues().getApplyPeakCharge()) {
            if (Response.body().getFare().getPeakObj().getIsApply()) {
                FirebaseTripStatus("isNight", Response.body().getFare().getPeakObj().getAlertLable());
            } else {
                FirebaseTripStatus("isNight", "0");
            }
        } else {
            FirebaseTripStatus("isNight", "0");
        }
        if (Response.body().getFare().getApplyValues().getApplyPickupCharge()) {
            FirebaseTripStatus("isPickup", "1");
        } else {
            FirebaseTripStatus("isPickup", "0");
        }
        if (Response.body().getFare().getApplyValues().getApplyWaitingTime()) {
            FirebaseTripStatus("isWaiting", "1");
        } else {
            FirebaseTripStatus("isWaiting", "0");
        }
        if (Response.body().getFare().getApplyValues().getApplyTax()) {
            FirebaseTripStatus("isTax", "1");
        } else {
            FirebaseTripStatus("isTax", "0");
        }
        FirebaseTripStatus("ispay", Response.body().getFare().getBalanceFare());
        FirebaseTripStatus("pay_type", Response.body().getFare().getPaymentMode());
        FirebaseTripStatus("tax", Response.body().getFare().getTax());
        FirebaseTripStatus("trip_type", Response.body().getFare().getFareType());
        FirebaseTripStatus("cancel_fare", Response.body().getFare().getOldCancellationAmt());
        FirebaseTripStatus("pickup_address", Response.body().getPickupdetails().getStart());
        FirebaseTripStatus("time", Response.body().getFare().getWaitingTime());


        if (Response.body().getFare().getFareType().equalsIgnoreCase("flatrate")) {
            ordinary.setVisibility(View.GONE);
            rideFareLayout.setVisibility(View.VISIBLE);
            RideFareTxt.setText("$" + Response.body().getFare().getFlatFare());
            FirebaseTripStatus("distance_fare", Response.body().getFare().getFlatFare());
        } else {
            ordinary.setVisibility(View.VISIBLE);
            rideFareLayout.setVisibility(View.GONE);
            RideFareTxt.setText("$" + Response.body().getFare().getKMFare());
            FirebaseTripStatus("distance_fare", Response.body().getFare().getKMFare());
        }
        if (Response.body().getFare().getOldCancellationAmt().equalsIgnoreCase("0")) {
            cancellationLayout.setVisibility(View.GONE);


        } else {
            cancellationLayout.setVisibility(View.VISIBLE);
        }
        try {
            totalAmountTxt.setText("$" + Response.body().getFare().getTotalFare());
            pickupTxt.setText(Response.body().getPickupdetails().getStart());
            submitTxt.setEnabled(true);
            baseFareTxt.setText("$" + Response.body().getFare().getPickupCharge());
            discountAmountTxt.setText("$" + Response.body().getFare().getTax());
            timeFareTxt.setText("$" + Response.body().getFare().getWaitingFare());

            distanceFareTxt.setText("$" + Response.body().getFare().getDistance());
            balanceFareTxt.setText("$" + Response.body().getFare().getOldCancellationAmt());
            paymentTypeTxt.setText(Response.body().getFare().getPaymentMode());
            detectFareTxt.setText("$" + Response.body().getFare().getTax());
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    @Override
    public void OnFailures(Response<TripFlowModel> Response) {
        submitTxt.setEnabled(true);
        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
    }

    @Override
    public void OnSuccessfullyUpload(Response<ImageUploadModel> Response) {

    }

    @Override
    public void OnFailureUpload(Response<ImageUploadModel> Response) {

    }

    @SuppressLint("LongLogTag")
    public String getCompleteAddressString(double LATITUDE, double LONGITUDE) {
        String strAdd = "";
        Geocoder geocoder = new Geocoder(context, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(LATITUDE, LONGITUDE, 1);
            if (addresses != null) {
                Address returnedAddress = addresses.get(0);
                StringBuilder strReturnedAddress = new StringBuilder("");

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

    private void sentFeedBack() {
        HashMap<String, String> map = new HashMap<>();
        map.put("rating", String.valueOf(driverRating.getRating()));
        map.put("tripId", SharedHelper.getKey(context, "trip_id"));
        map.put("comments", feedbackTxt.getText().toString());
        FeedBackPresenter feedBackPresenter = new FeedBackPresenter();
        feedBackPresenter.getFeedBack(activity, map);

    }

    public void FareCalculation() {
        databaseReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        valueEventListener = databaseReference.addValueEventListener(new ValueEventListener() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                try {
                    if (dataSnapshot.child("triptype").getValue() != null && Objects.requireNonNull(dataSnapshot.child("triptype").getValue()).toString().equalsIgnoreCase("daily")) {
                        normal_flow_layout.setVisibility(View.VISIBLE);
                        rental_outstation_card_layout.setVisibility(View.GONE);
                    } else {
                        normal_flow_layout.setVisibility(View.GONE);
                        rental_outstation_card_layout.setVisibility(View.VISIBLE);
                        Object object = dataSnapshot.child("invoiceBill").getValue();
                        if (object != null) {
                            Type listType = new TypeToken<List<FareModel>>() {
                            }.getType();
                            List<FareModel> fareModel = new Gson().fromJson(object.toString(), listType);
                            if (fareAdapter == null) {
                                fareAdapter = new FareAdapter(activity, fareModel);
                                outstation_fare_recycleview.setAdapter(fareAdapter);
                            } else {
                                fareAdapter.notifyDataSetChanged();
                            }

                        }
                    }
                    if (dataSnapshot.child("datetime").getValue() != null) {
                        dateTimeTxt.setText(Objects.requireNonNull(dataSnapshot.child("datetime").getValue()).toString());
                    }


                    if (dataSnapshot.child("safeRideData").child("edtMake").getValue() != null) {
                        vehicledetails.setVisibility(View.VISIBLE);
                        edtmake.setText(Objects.requireNonNull(dataSnapshot.child("safeRideData").child("edtMake").getValue()).toString());
                    }

                    if (dataSnapshot.child("safeRideData").child("edtModel").getValue() != null) {
                        vehicledetails.setVisibility(View.VISIBLE);
                        edtmodel.setText(Objects.requireNonNull(dataSnapshot.child("safeRideData").child("edtModel").getValue()).toString());
                    }

                    if (dataSnapshot.child("safeRideData").child("edtcolor").getValue() != null) {
                        vehicledetails.setVisibility(View.VISIBLE);
                        edtcolor.setText(Objects.requireNonNull(dataSnapshot.child("safeRideData").child("edtcolor").getValue()).toString());
                    }
                    System.out.println("uydsfuyvdfu"+dataSnapshot.child("safeRideData").child("edtPhoneNumber").getValue());
                    if (dataSnapshot.child("safeRideData").child("edtPhoneNumber").getValue() != null) {
                        vehicledetails.setVisibility(View.VISIBLE);
                        edtphonenumber.setText(Objects.requireNonNull(dataSnapshot.child("safeRideData").child("edtPhoneNumber").getValue()).toString());
                    }


                    if (dataSnapshot.child("pickup_address").getValue() != null) {
                        pickupTxt.setText(Objects.requireNonNull(dataSnapshot.child("pickup_address").getValue()).toString());
                    }
                    if (dataSnapshot.child("Drop_address").getValue() != null) {
                        dropAddressTxt.setText(Objects.requireNonNull(dataSnapshot.child("Drop_address").getValue()).toString());
                    }
                    if (dataSnapshot.child("total_fare").getValue() != null) {
                        totalAmountTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("total_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("booking").getValue() != null) {
                        bookingFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("booking").getValue()).toString());

                    }
                    if (dataSnapshot.child("gatewayCharge").getValue() != null) {
                        gatewayTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("gatewayCharge").getValue()).toString());

                    }
                    if (dataSnapshot.child("discount").getValue() != null) {
                        discountAmountTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("discount").getValue()).toString());

                    }
                    if (dataSnapshot.child("minFare").getValue() != null) {
                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFare").getValue()).toString());

                    }
                    if (dataSnapshot.child("surgeAmt").getValue() != null) {
                        surgeedt.setText("$" + Objects.requireNonNull(dataSnapshot.child("surgeAmt").getValue()).toString());
                    }
//                    if (dataSnapshot.child("minFareAdded").getValue() != null) {
//                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFareAdded").getValue()).toString());
//
//                    }

                    if (dataSnapshot.child("discount").getValue() != null) {
                        discountAmountTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("discount").getValue()).toString());

                    }
                    if (dataSnapshot.child("time_fare").getValue() != null) {
                        timeFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("time_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("waitingTime").getValue() != null) {
                        WaiingTimtTxt.setText(Objects.requireNonNull(dataSnapshot.child("waitingTime").getValue()).toString() + " Mins");

                    }
                    if (dataSnapshot.child("waiting_fare").getValue() != null) {
                        WaitingFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("waiting_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("distance_fare").getValue() != null) {
                        distanceFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("distance_fare").getValue()).toString());
                        RideFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("distance_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("oldBalance").getValue() != null) {
                        balanceFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("oldBalance").getValue()).toString());

                    }
                    if (dataSnapshot.child("tollFee").getValue() != null) {
                        tollFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("tollFee").getValue()).toString());

                    }
                    if ((dataSnapshot.child("pay_type").getValue() != null) && !dataSnapshot.child("pay_type").getValue().toString().equalsIgnoreCase("0")) {
                        paymentTypeTxt.setText(Objects.requireNonNull(dataSnapshot.child("pay_type").getValue()).toString());

                    }
                    if (dataSnapshot.child("tax").getValue() != null) {
                        detectFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("tax").getValue()).toString());

                    }
                    if (dataSnapshot.child("basefare").getValue() != null) {
                        basesFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("basefare").getValue()).toString());

                    }
                    if (dataSnapshot.child("distance").getValue() != null) {
                        distanceTxt.setText(dotLimitation(Double.parseDouble(Objects.requireNonNull(dataSnapshot.child("distance").getValue()).toString())) + " mi");

                    }
                    if (dataSnapshot.child("time").getValue() != null) {
                        timeTxt.setText(Objects.requireNonNull(dataSnapshot.child("time").getValue()).toString() + " Mins");

                    }
                    if (dataSnapshot.child("isTax").getValue() != null && !Objects.requireNonNull(dataSnapshot.child("isTax").getValue()).toString().equalsIgnoreCase("0")) {
                        taxiLayout.setVisibility(View.VISIBLE);

                    } else {
                        taxiLayout.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("isWaiting").getValue() != null && !Objects.requireNonNull(dataSnapshot.child("isWaiting").getValue()).toString().equalsIgnoreCase("0")) {
                        waitingLayout.setVisibility(View.VISIBLE);

                    } else {
                        waitingLayout.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("isPickup").getValue() != null && !Objects.requireNonNull(dataSnapshot.child("isPickup").getValue()).toString().equalsIgnoreCase("0")) {
                        pickupLayout.setVisibility(View.VISIBLE);
                        if (dataSnapshot.child("convance_fare").getValue() != null && !Objects.equals(dataSnapshot.child("convance_fare").getValue(), "0")) {
                            baseFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("convance_fare").getValue()).toString());
                            pickupLayout.setVisibility(View.VISIBLE);
                        } else {
                            pickupLayout.setVisibility(View.GONE);
                        }
                    } else {
                        pickupLayout.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("trip_type").getValue() != null) {
                        if (Objects.requireNonNull(dataSnapshot.child("trip_type").getValue()).toString().equalsIgnoreCase("flatrate")) {
                            ordinary.setVisibility(View.GONE);
                            rideFareLayout.setVisibility(View.VISIBLE);
                        } else {
                            ordinary.setVisibility(View.VISIBLE);
                            rideFareLayout.setVisibility(View.GONE);
                        }

                    }
                    if (dataSnapshot.child("oldBalance").getValue() != null) {
                        if (Objects.requireNonNull(dataSnapshot.child("oldBalance").getValue()).toString().equalsIgnoreCase("0")) {
                            cancellationLayout.setVisibility(View.GONE);
                        } else {
                            cancellationLayout.setVisibility(View.VISIBLE);
                        }

                    }

                    if (dataSnapshot.child("hill_amount").getValue() != null) {
                        if (Objects.requireNonNull(dataSnapshot.child("hill_amount").getValue()).toString().equalsIgnoreCase("0")) {
                            hillAmountLayout.setVisibility(View.GONE);
                        } else {
                            hillAmountLayout.setVisibility(View.VISIBLE);
                            hillAmount_Txt.setText("$" + Objects.requireNonNull(dataSnapshot.child("hill_amount").getValue()).toString());
                        }

                    }

                    if (Objects.requireNonNull(dataSnapshot.child("multiplestop").getValue()).toString().equalsIgnoreCase("true")){
                        multistop.setVisibility(View.VISIBLE);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }

            }

            @Override
            public void onCancelled(@NotNull DatabaseError databaseError) {

            }
        });
    }

    private String dotLimitation(double values) {
        return new DecimalFormat("##.##").format(values);
    }

}
