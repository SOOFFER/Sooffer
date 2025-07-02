package com.soofer.app.TripFlowScreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.Gson;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.EstimationChanges;
import com.soofer.app.EventBus.RequestStatus;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.Model.RequestModel;
import com.soofer.app.Presenter.EstimationFarePresenter;
import com.soofer.app.Presenter.RequestFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.View.EstimationView;
import com.soofer.app.View.SetrequestView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.isRiderLater;
import static com.soofer.app.CommonClass.CommonData.strEstimationResponse;
import static com.soofer.app.CommonClass.Constants.CheckRiderStatus;
import static com.soofer.app.CommonClass.Utiles.clearInstance;
import static com.soofer.app.CommonClass.Utiles.returnString;


public class EstimationFareFragment extends BaseFragment implements EstimationView, SetrequestView {


    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.distance_txt)
    TextView distanceTxt;
    @BindView(R.id.distance_fare_txt)
    TextView distanceFareTxt;
    @BindView(R.id.time_txt)
    TextView timeTxt;
    @BindView(R.id.time_fare_txt)
    TextView timeFareTxt;
    @BindView(R.id.schude_trip)
    Button schudeTrip;
    @BindView(R.id.request_now)
    Button requestNow;
    Unbinder unbinder;

    CallRequest callRequest;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.base_fare_detail_txt)
    TextView baseFareDetailTxt;


    @BindView(R.id.fare_title_txt)
    TextView fareTitleTxt;
    @BindView(R.id.Cancel_fee_txt)
    TextView CancelFeeTxt;
    @BindView(R.id.cancel_linear_layout)
    LinearLayout cancelLinearLayout;
    @BindView(R.id.fare_linear_layout)
    LinearLayout fareLinearLayout;
    @BindView(R.id.night_charge_txt)
    TextView nightChargeTxt;
    @BindView(R.id.picku_charge_layout)
    LinearLayout pickuChargeLayout;
    @BindView(R.id.access_fee_layout)
    LinearLayout accessFeeLayout;

    @BindView(R.id.use_wallet)
    CheckBox useWallet;
    @BindView(R.id.time_fare_detail_txt)
    TextView timeFareDetailTxt;
    int hour;
    int minute;
    String time;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;
    Context context;

    public EstimationFareFragment() {

    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_estimation_fare, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();


        //  Calendar c = Calendar.getInstance();

        /*int Hr24 = c.get(Calendar.HOUR_OF_DAY);
        int Min = c.get(Calendar.MINUTE);
*/

        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        System.out.println("hours"+hour+"minutes"+minute);
         time=hour+":"+minute;
        System.out.println("time"+time);


        if (isRiderLater) {
            schudeTrip.setVisibility(View.VISIBLE);
        } else {
            schudeTrip.setVisibility(View.GONE);
        }

        if (SharedHelper.getKey(context, "wallet_amout") == null || SharedHelper.getKey(context, "wallet_amout").isEmpty() || SharedHelper.getKey(context, "wallet_amout").equalsIgnoreCase("0")) {
            useWallet.setVisibility(View.GONE);
        } else {
            useWallet.setVisibility(View.VISIBLE);
        }
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        estimationFareCalculation();
        return view;
    }

    private void estimationFareCalculation(){
        EstimationFarePresenter estimationFarePresenter = new EstimationFarePresenter(this);
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("serviceType", CommonData.strServiceType);
        //map.put("time", String.valueOf(Hr24) + ":" + String.valueOf(Min));

        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
        map.put("tripType", "daily");
        map.put("time", "");
        /*  map.put("cityLimitCalculation", strCityLimit);*/
        map.put("promoCode", CommonData.strpromocode);
        map.put("pickupCity", CommonData.strPickupCity);
        map.put("drivergender",SharedHelper.getKey(context,"drivergender"));
        estimationFarePresenter.getEstimationFare(map, activity);
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.schude_trip, R.id.request_now})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.schude_trip:
                try {
                    if (useWallet.isChecked()) {
                        CommonData.strPaymentType = "Wallet";
                    }

                    callRequest = (CallRequest) getActivity();
                    callRequest.Ridelater();
                } catch (Exception e) {
                    Log.e("tag", "Eception of request screen" + e.getMessage());
                }
                break;
            case R.id.request_now:
                if (useWallet.isChecked()) {
                    CommonData.strPaymentType = "Wallet";
                }
                CheckRiderStatus = "Processing";
                HashMap<String, String> map = new HashMap<>();
                map.put("paymentMode", CommonData.strPaymentType);
                map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
                //     map.put("cityLimitCalculation", strCityLimit);
                map.put("distanceDetails", returnString(strEstimationResponse, true));
                map.put("timeFare", CommonData.strTimeFare);
                map.put("promoAmt", "");
                map.put("serviceType", CommonData.strServiceType);
                map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
                map.put("time", "");
                map.put("promo", CommonData.strpromocode);
                map.put("tripTime", time);
                map.put("pickupCity", CommonData.strPickupCity);
                map.put("requestFrom", "app");
                map.put("bookingType", "rideNow");
                map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
                map.put("tripType", "daily");
                RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
                // requestFlowPresenter.setRequesApi(map, activity);
                break;
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccess(Response<EstimationModel> response) {
        strEstimationResponse = new Gson().toJson(response.body());
        System.out.println("Estimationghfjh"+strEstimationResponse);

        try {
            assert response.body() != null;
            if (response.body().getSuccess()) {
                try {
                    if (response.body().getVehicleDetailsAndFare().getFareDetails().getFareType().equalsIgnoreCase("kmrate")) {
                        fareLinearLayout.setVisibility(View.VISIBLE);
                    } else {
                        fareLinearLayout.setVisibility(View.GONE);
                    }
                    if (!response.body().getVehicleDetailsAndFare().getFareDetails().getOldCancellationAmt().equalsIgnoreCase("0")) {
                        cancelLinearLayout.setVisibility(View.VISIBLE);
                    } else {
                        cancelLinearLayout.setVisibility(View.GONE);
                    }
                    if (response.body().getVehicleDetailsAndFare().getApplyValues().getApplyNightCharge()) {
                        if (response.body().getVehicleDetailsAndFare().getFareDetails().getNightObj().getIsApply()) {
                            nightChargeTxt.setVisibility(View.VISIBLE);
                            nightChargeTxt.setText(response.body().getVehicleDetailsAndFare().getFareDetails().getNightObj().getAlertLable());
                        } else {
                            nightChargeTxt.setVisibility(View.GONE);
                        }
                    } else {
                        nightChargeTxt.setVisibility(View.GONE);
                    }

                    fareTitleTxt.setText("Estimated Fare (Distance " + response.body().getDistanceDetails().getDistanceLable() + ")");
                    CancelFeeTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getOldCancellationAmt());
                    baseFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTax());


                    totalAmountTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTotalFare());
                    distanceFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getKMFare());

                    timeFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getPickupCharge());
                    baseFareDetailTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getBaseFare());
                    timeFareDetailTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTravelFare());

                    //isValidation(response.body().getVehicleDetailsAndFare().getFareDetails().getTravelFare(),timeFareDetailTxt);
                    // isValidation(response.body().getVehicleDetailsAndFare().getFareDetails().getBaseFare(),baseFareDetailTxt);
                    // isValidation(response.body().getVehicleDetailsAndFare().getFareDetails().getPickupCharge(),timeFareTxt);

                    // distanceTxt.setText("Distance (" + response.body().getDistanceDetails().getDistanceLable() + ")");

                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            }
        } catch (Exception e) {
            Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            requestNow.setEnabled(false);
            e.printStackTrace();
        }


    }

    @Override
    public void OnFailure(Response<EstimationModel> response) {
        Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");

    }

    @Override
    public void OnSuccessfully(Response<RequestModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            try {
                callRequest = (CallRequest) getActivity();
                callRequest.callReuest();
                CommonData.strpromocode = "";
                //CheckRiderStatus = "Processing";
                CommonData.strRequestId = Response.body().getRequestDetails();
            } catch (Exception e) {
                Log.e("tag", "Eception of request screen" + e.getMessage());
            }
        } else {
            Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
        }

    }

    @Override
    public void OnRequestFailure(Response<RequestModel> Response) {

        try {
            assert Response.errorBody() != null;
            JSONObject errorbody = new JSONObject(Response.errorBody().string());
            System.out.println("enter the server details" + errorbody);
            if (errorbody.has("message")) {
                Utiles.displayMessage(getView(), context, errorbody.optString("message"));
            }
           /* try {
                callRequest = (CallRequest) getActivity();
                callRequest.callReuest();
            } catch (Exception e) {
                Log.e("tag", "Eception of request screen" + e.getMessage());
            }*/
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

    }

    public void isValidation(String value, View view) {
        if (value != null && !value.equalsIgnoreCase("0"))
            view.setVisibility(View.VISIBLE);
        else
            view.setVisibility(View.GONE);
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
    public void Onmessage(RequestStatus event) {
        try {
            String status = event.getMessage();
            if (status.equalsIgnoreCase("No Vehicle")) {
                if (requestNow.isEnabled()) {
                    requestNow.setEnabled(false);
                    requestNow.setAlpha(0.5f);
                }

            } else {
                if (!requestNow.isEnabled()) {
                    requestNow.setEnabled(true);
                    requestNow.setAlpha(1.0f);
                }
            }
            requestNow.setText(status);
            Log.d("Tag", "Test status" + status);
        } catch (Exception e) {
            e.printStackTrace();
        }
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void Onmessage(EstimationChanges event) {
        try {
            estimationFareCalculation();
        } catch (Exception e) {
            e.printStackTrace();
        }
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

}
