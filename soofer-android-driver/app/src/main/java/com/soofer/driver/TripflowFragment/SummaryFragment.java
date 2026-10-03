package com.soofer.driver.TripflowFragment;

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

import com.soofer.driver.Adapter.FareAdapter;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Model.FareModel;
import com.soofer.driver.Model.ImageUploadModel;
import com.soofer.driver.Presenter.DriverProfilePresenter;
import com.soofer.driver.View.ProfileView;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.FlowInterface.RequestInterface;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.FareCaluationModel;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.Presenter.FeedBackPresenter;
import com.soofer.driver.Presenter.TripFlowPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.TripFlowView;
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

import static com.soofer.driver.CommonClass.Utiles.clearInstance;
import static com.soofer.driver.CommonClass.Utiles.hideKeyboard;


@SuppressLint("ValidFragment")
public class SummaryFragment extends BaseFragment implements ProfileView {


    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.tipsLayout)
    LinearLayout tipsLayout;


    @BindView(R.id.tipsAmount)
    TextView tipsAmount;
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

    @BindView(R.id.walletDetect)
    TextView walletDetect;

    @BindView(R.id.walletlayout)
    LinearLayout walletlayout;
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
        FareCalculation();
        CommonData.strDistanceBegin = "totaldistancend";
        Calendar c = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyy hh:mm a");
        String formattedDate = df.format(c.getTime());
        dateTimeTxt.setText(formattedDate);
        FirebaseTripStatus("datetime", formattedDate);
        ProfilePresenter();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
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
            SharedHelper.putKey(context,"driver_earned",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());
            SharedHelper.putKey(context,"wallet_credition",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getBankDeposit());
            SharedHelper.putKey(context,"driver_tax",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTax());
            SharedHelper.putKey(context,"GatewayCharge",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getGateway());
            SharedHelper.putKey(context,"driver_cash",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getCashCollected());
            SharedHelper.putKey(context,"driver_tips",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTips());
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
                    System.out.println("TRIP TYPE::::"+dataSnapshot.child("triptype").getValue());
                    if (dataSnapshot.child("triptype").getValue() != null && Objects.requireNonNull(dataSnapshot.child("triptype").getValue()).toString().equalsIgnoreCase("daily")) {
                        normal_flow_layout.setVisibility(View.VISIBLE);
                        rental_outstation_card_layout.setVisibility(View.GONE);
                    } else {
                        if(dataSnapshot.child("triptype").getValue() != null){
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
                        } else {
                            normal_flow_layout.setVisibility(View.GONE);
                            rental_outstation_card_layout.setVisibility(View.GONE);
                            return;
                        }
                    }

                    System.out.println("SUMMARY VALUE:::::"+dataSnapshot);

                    if (dataSnapshot.child("pickup_address").getValue() != null) {
                        pickupTxt.setText(Objects.requireNonNull(dataSnapshot.child("pickup_address").getValue()).toString());
                    }

                    if (dataSnapshot.child("Drop_address").getValue() != null) {
                        dropAddressTxt.setText(Objects.requireNonNull(dataSnapshot.child("Drop_address").getValue()).toString());
                    }

                    if (dataSnapshot.child("tipsToDriver").getValue() != null) {
                        tipsLayout.setVisibility(View.VISIBLE);
                        tipsAmount.setText("$" + Objects.requireNonNull(dataSnapshot.child("tipsToDriver").getValue()).toString());
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
//                    if (dataSnapshot.child("minFare").getValue() != null) {
//                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFare").getValue()).toString());
//
//                    }
                    if (dataSnapshot.child("surgeAmt").getValue() != null) {
                        surgeedt.setText("$" + Objects.requireNonNull(dataSnapshot.child("surgeAmt").getValue()).toString());
                    }
                    if (dataSnapshot.child("minFareAdded").getValue() != null) {
                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFareAdded").getValue()).toString());

                    }

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
                        if (dataSnapshot.child("pay_type").getValue().toString().equalsIgnoreCase("wallet")){

                            walletlayout.setVisibility(View.VISIBLE);
                            walletDetect.setText("$" + "-"+Objects.requireNonNull(dataSnapshot.child("walletdebt").getValue()).toString());
                        }else {

                            walletlayout.setVisibility(View.GONE);
                        }

                    }
                    if (dataSnapshot.child("tax").getValue() != null) {
                        detectFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("tax").getValue()).toString());

                    }
                    if (dataSnapshot.child("basefare").getValue() != null) {
                        basesFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("basefare").getValue()).toString());

                    }
                    if (dataSnapshot.child("distance").getValue() != null) {
                        distanceTxt.setText(dotLimitation(Double.parseDouble(Objects.requireNonNull(dataSnapshot.child("distance").getValue()).toString())) + " Mi");

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

                    if (dataSnapshot.child("multiplestop").getValue() != null && Objects.requireNonNull(dataSnapshot.child("multiplestop").getValue()).toString().equalsIgnoreCase("true")){
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

    private void setFareVisibility(LinearLayout layout, String value, String prefix, TextView textView) {
        if (value == null || value.trim().isEmpty()) {
            layout.setVisibility(View.GONE);
            return;
        }

        try {
            // Remove any existing currency symbols and extra spaces
            String cleanValue = value.replaceAll("[^0-9.]", "").trim();

            if (cleanValue.isEmpty()) {
                layout.setVisibility(View.GONE);
                return;
            }

            double fareAmount = Double.parseDouble(cleanValue);

            if (fareAmount == 0.0 || fareAmount == 0) {
                layout.setVisibility(View.GONE);
            } else {
                layout.setVisibility(View.VISIBLE);
                textView.setText(prefix + value);
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
            layout.setVisibility(View.GONE);
        }
    }

    private boolean isZeroValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }
        try {
            String cleanValue = value.replaceAll("[^0-9.]", "").trim();

            if (cleanValue.isEmpty()) {
                return true;
            }

            double amount = Double.parseDouble(cleanValue);
            return amount == 0.0 || "0".equals(value) || "0.00".equals(value);
        } catch (NumberFormatException e) {
            return true;
        }
    }

    private String dotLimitation(double values) {
        return new DecimalFormat("##.##").format(values);
    }

}
