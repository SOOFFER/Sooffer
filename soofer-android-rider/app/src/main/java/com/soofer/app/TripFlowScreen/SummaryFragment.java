package com.soofer.app.TripFlowScreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
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

import com.soofer.app.Adapter.FareAdapter;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.paymentModule.RazorPayPaymentModule;
import com.soofer.app.EventBus.MakePaymentEvent;
import com.soofer.app.Model.FareModel;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.FeedbackModel;
import com.soofer.app.Presenter.FeedBackPresenter;
import com.soofer.app.Presenter.PaypalPresenter;
import com.soofer.app.Presenter.Tips_added;
import com.soofer.app.Presenter.updateLocationPresenter;
import com.soofer.app.R;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.Constants.TripFlowFragmant;
import static com.soofer.app.CommonClass.Utiles.ClearFirebase;
import static com.soofer.app.CommonClass.Utiles.clearInstance;
import static com.soofer.app.CommonClass.Utiles.hideKeyboard;
import static com.soofer.app.CommonClass.Utiles.showErrorMessage;


public class SummaryFragment extends BaseFragment implements PaypalPresenter.paymentView {

    private DatabaseReference databaseReference;
    private ValueEventListener valueEventListener;

    private CallRequest callRequest;
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
    @BindView((R.id.tips))
    EditText tipstxt;
    @BindView(R.id.submit_txt)
    Button submitTxt;
    Unbinder unbinder;
    Context context;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.surgeedt)
    TextView sureedt;
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

    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.night_charge_txt)
    TextView nightChargeTxt;

    @BindView(R.id.Ride_fare_txt)
    TextView RideFareTxt;
    @BindView(R.id.ride_fare_layout)
    LinearLayout rideFareLayout;

    @BindView(R.id.waiting_layout)
    LinearLayout waitingLayout;
    @BindView(R.id.pickup_layout)
    LinearLayout pickupLayout;
    @BindView(R.id.taxi_layout)
    LinearLayout taxiLayout;
    @BindView(R.id.WaiingTimt_txt)
    TextView WaiingTimtTxt;
    @BindView(R.id.Waiting_fare_txt)
    TextView WaitingFareTxt;
    @BindView(R.id.bases_fare_txt)
    TextView basesFareTxt;

    @BindView(R.id.hill_amount__txt)
    TextView hillAmount_Txt;
    @BindView(R.id.hill_amount__layout)
    LinearLayout hillAmountLayout;

    @BindView(R.id.normal_flow_layout)
    CardView normal_flow_layout;
    @BindView(R.id.mini_fare_txt)
    TextView miniFareTxt;

    @BindView(R.id.booking_fare_txt)
    TextView bookingFareTxt;
    @BindView(R.id.gateway_txt)
    TextView gatewayTxt;

    @BindView(R.id.rental_outstation_card_layout)
    CardView rental_outstation_card_layout;

    @BindView(R.id.outstation_fare_recycleview)
    RecyclerView outstation_fare_recycleview;

    @BindView(R.id.payable_txt)
    TextView payableTxt;
    @BindView(R.id.nighttxt)
    TextView nighttxtt;
    @BindView(R.id.balance_layout)
    LinearLayout balanceLayout;

    @BindView(R.id.multistop)
    TextView multistop;

    @BindView(R.id.layout_amount)
    LinearLayout layoutamount;

    @BindView(R.id.walletDetect)
    TextView walletDetect;

    @BindView(R.id.walletlayout)
    LinearLayout walletlayout;


    private FareAdapter fareAdapter;

    private RazorPayPaymentModule razorPayModule;

    public SummaryFragment() {
        // Required empty public constructor
    }

    private String paymentAmount = "0";
    private Activity activity;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }
    @BindView(R.id.toll_fare_txt)
    TextView tollFareTxt;

    private PaypalPresenter paypalPresenter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        View view = inflater.inflate(R.layout.fragment_summary, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        context = getContext();
        titleTxt.setSelected(true);
        FareCalculation();
        razorPayModule = new RazorPayPaymentModule(activity);
        paypalPresenter = new PaypalPresenter(activity,this);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.submit_txt)
    public void onViewClicked() {
        try {
            hideKeyboard(activity);
           /* System.out.println("enter the payment type"+paymentTypeTxt.getText().toString());
            if (paymentTypeTxt.getText().toString().equalsIgnoreCase("card") || paymentTypeTxt.getText().toString().equalsIgnoreCase("Wallet") && !paymentAmount.equalsIgnoreCase("0") ) {
                if (paymentTypeTxt.getText().toString().equalsIgnoreCase("wallet")) {
                    PaymentTypeDialog dialogClass = new PaymentTypeDialog(activity, type -> {
                        switch (type) {
                            case "cash":
                                sentFeedBack();
                                ClearFirebase(SharedHelper.getKey(context, "userid"));
                                callRequest = (CallRequest) getActivity();
                                callRequest.ClearServiceFragment();
                                TripFlowFragmant = null;
                                SharedHelper.putKey(context, "trip_id", "null");
                                break;
                            case "card":
                                getPayment();
                                break;
                        }

                    });
                    dialogClass.setCancelable(true);
                    Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
                    try {
                        final View decorView = dialogClass.getWindow().getDecorView();
                        StartAnimation(decorView);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    dialogClass.show();
                }else {
                    getPayment();
                }

            } else {*/
            Tips_added tips = new Tips_added();
            HashMap<String, String> map = new HashMap<>();
            map.put("tripNo", SharedHelper.getKey(context, "trip_id"));
            map.put("tips",tipstxt.getText().toString());
            tips.addTips(activity, map);


                sentFeedBack();
                ClearFirebase(SharedHelper.getKey(context, "userid"));
                callRequest = (CallRequest) getActivity();
                callRequest.ClearServiceFragment();
                TripFlowFragmant = null;
                SharedHelper.putKey(context, "trip_id", "null");

            /*Intent intent = new Intent(context, HomeActivity.class);
            startActivity(intent);*/

           /* }*/
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
    private void getPayment(){
        razorPayModule.makePayment(paymentAmount,"Trip Payment");
    }
    private void FareCalculation() {
        databaseReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        valueEventListener = databaseReference.addValueEventListener(new ValueEventListener() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                try {
                    if(dataSnapshot.child("triptype").getValue()!=null && Objects.requireNonNull(dataSnapshot.child("triptype").getValue()).toString().equalsIgnoreCase("daily") ){
                        normal_flow_layout.setVisibility(View.VISIBLE);
                        rental_outstation_card_layout.setVisibility(View.GONE);
                    }else {
                        normal_flow_layout.setVisibility(View.GONE);
                        rental_outstation_card_layout.setVisibility(View.VISIBLE);
                        Object object = dataSnapshot.child("invoiceBill").getValue();
                        if(object!=null){
                            Type listType = new TypeToken<List<FareModel>>() {}.getType();
                            List<FareModel> fareModel = new Gson().fromJson(object.toString() , listType);
                            if(fareAdapter==null){
                                fareAdapter = new FareAdapter(activity,fareModel);
                                outstation_fare_recycleview.setAdapter(fareAdapter);
                            }else {
                                fareAdapter.notifyDataSetChanged();
                            }

                        }
                    }
                    if (dataSnapshot.child("datetime").getValue() != null) {
                        dateTimeTxt.setText(Objects.requireNonNull(dataSnapshot.child("datetime").getValue()).toString());
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
                    if (dataSnapshot.child("discount").getValue() != null) {
                        discountAmountTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("discount").getValue()).toString());

                    }
                    if (dataSnapshot.child("gatewayCharge").getValue() != null) {
                        gatewayTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("gatewayCharge").getValue()).toString());

                    }
                    if (dataSnapshot.child("convance_fare").getValue() != null) {
                        baseFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("convance_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("discount").getValue() != null) {
                        discountAmountTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("discount").getValue()).toString());

                    }
                    if (dataSnapshot.child("time_fare").getValue() != null) {
                        timeFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("time_fare").getValue()).toString());

                    }
                    if (dataSnapshot.child("distance_fare").getValue() != null) {
                        distanceFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("distance_fare").getValue()).toString());
                        RideFareTxt.setText("$" + dataSnapshot.child("distance_fare").getValue().toString());
                    }
                    if (dataSnapshot.child("surgeAmt").getValue() != null) {
                        sureedt.setText("$" + Objects.requireNonNull(dataSnapshot.child("surgeAmt").getValue()).toString());
                    }
                    if (dataSnapshot.child("oldBalance").getValue() != null) {
                        balanceFareTxt.setText("$" + dataSnapshot.child("oldBalance").getValue().toString());

                    }
                    if (dataSnapshot.child("pay_type").getValue() != null && !dataSnapshot.child("pay_type").getValue().toString().equalsIgnoreCase("0")) {
                        paymentTypeTxt.setText(dataSnapshot.child("pay_type").getValue().toString());
                        if (dataSnapshot.child("pay_type").getValue().toString().equalsIgnoreCase("wallet")){
                            layoutamount.setVisibility(View.GONE);
                            walletlayout.setVisibility(View.VISIBLE);
                            walletDetect.setText("$" + "-"+Objects.requireNonNull(dataSnapshot.child("walletdebt").getValue()).toString());
                        }else {
                            layoutamount.setVisibility(View.VISIBLE);
                            walletlayout.setVisibility(View.GONE);
                        }
                    }
                    if (dataSnapshot.child("tax").getValue() != null) {
                        detectFareTxt.setText("$" + dataSnapshot.child("tax").getValue().toString());

                    }
                    if (dataSnapshot.child("tollFee").getValue() != null) {
                        tollFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("tollFee").getValue()).toString());

                    }
                    if (dataSnapshot.child("distance").getValue() != null) {
                        distanceTxt.setText(dotLimitation(Double.parseDouble(dataSnapshot.child("distance").getValue().toString())) + " mi");

                    }
                    if (dataSnapshot.child("time").getValue() != null) {
                        timeTxt.setText(dataSnapshot.child("time").getValue().toString() + " Mins");
                    }
                    if (dataSnapshot.child("ispay").getValue() != null && !dataSnapshot.child("ispay").getValue().equals("0")) {
                        paymentAmount = dataSnapshot.child("ispay").getValue().toString();
                        balanceLayout.setVisibility(View.VISIBLE);
                        payableTxt.setText("$" + paymentAmount);

                    } else {
                        balanceLayout.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("isNight").getValue() != null && !dataSnapshot.child("isNight").getValue().equals("0")) {
                        nightChargeTxt.setText(dataSnapshot.child("isNight").getValue().toString());
                        nightChargeTxt.setVisibility(View.VISIBLE);
                    } else {
                        nightChargeTxt.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("waitingTime").getValue() != null) {
                        WaiingTimtTxt.setText( Objects.requireNonNull(dataSnapshot.child("waitingTime").getValue()).toString()+" Mins");

                    }
                    if (dataSnapshot.child("waiting_fare").getValue() != null) {
                        WaitingFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("waiting_fare").getValue()).toString());

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
                        }else {
                            pickupLayout.setVisibility(View.GONE);
                        }

                    } else {
                        pickupLayout.setVisibility(View.GONE);
                    }
                    if (dataSnapshot.child("basefare").getValue() != null) {
                        basesFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("basefare").getValue()).toString());

                    }
                    if (dataSnapshot.child("minFareAdded").getValue() != null) {
                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFareAdded").getValue()).toString());

                    }
                    if (dataSnapshot.child("minFareAdded").getValue() != null) {
                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFareAdded").getValue()).toString());

                    }
//                    if (dataSnapshot.child("minFareAdded").getValue() != null) {
//                        miniFareTxt.setText("$" + Objects.requireNonNull(dataSnapshot.child("minFareAdded").getValue()).toString());
//
//                    }
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
                    if (Objects.requireNonNull(dataSnapshot.child("multiplestop").getValue()).toString().equalsIgnoreCase("true")){
                        multistop.setVisibility(View.VISIBLE);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
    }

    private void sentFeedBack() {
        HashMap<String, String> map = new HashMap<>();
        map.put("rating", String.valueOf(driverRating.getRating()));
        map.put("tripId", SharedHelper.getKey(context, "trip_id"));
        map.put("comments", feedbackTxt.getText().toString());
        FeedBackPresenter feedBackPresenter = new FeedBackPresenter();
        feedBackPresenter.getFeedBack(activity, map);
        System.out.println("aaa "+map);

    }

    private String dotLimitation(double values) {
        return new DecimalFormat("##.##").format(values);
    }



    @Override
    public void onSuccesPayment(Response<FeedbackModel> response) {

        try {
            sentFeedBack();
            ClearFirebase(SharedHelper.getKey(context, "userid"));
            callRequest = (CallRequest) getActivity();
            assert callRequest != null;
            callRequest.ClearServiceFragment();
            TripFlowFragmant = null;
            SharedHelper.putKey(context, "trip_id", "null");
            assert response.body() != null;
            Utiles.CommonToast(activity, response.body().getMessage());


        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }

    }

    @Override
    public void OnFailurePayment(Response<FeedbackModel> response) {
        try {
            assert response.errorBody() != null;
            String message = response.errorBody().string();
            showErrorMessage(message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, context.getString(R.string.poor_network));
        }

    }

    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        EventBus.getDefault().unregister(this);
        super.onStop();
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(MakePaymentEvent event) {
        HashMap<String,String> hashMap = new HashMap<>();
        hashMap.put("payment_method_nonce","");
        hashMap.put("tripAmount",paymentAmount);
        hashMap.put("trip_id",SharedHelper.getKey(context, "trip_id"));
        hashMap.put("id",event.strPaymentId);
        paypalPresenter.getpayment(hashMap);
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }
}
