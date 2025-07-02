package com.soofer.app.TripFlowScreen;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.EstimationDialog;
import com.soofer.app.CustomizeDialog.Fare_EstimationDialog;
import com.soofer.app.CustomizeDialog.Female_driverDialog;
import com.soofer.app.CustomizeDialog.OutstationAlertDialog;
import com.soofer.app.CustomizeDialog.PromocodeDialog;
import com.soofer.app.EventBus.EstimationChanges;
import com.soofer.app.EventBus.FLowRealtimeChanges;
import com.soofer.app.EventBus.FemaleDriverFlow;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Fragment.PaymentFragment;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.Model.RequestModel;
import com.soofer.app.Presenter.EstimationFarePresenter;
import com.soofer.app.Presenter.RequestFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.TripFlowScreen.bottomSheetDialogFragment.PaymentMethodBottomFragment;
import com.soofer.app.View.EstimationView;
import com.soofer.app.View.SetrequestView;
import com.google.gson.Gson;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Objects;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strDate;
import static com.soofer.app.CommonClass.CommonData.strEstimationResponse;
import static com.soofer.app.CommonClass.CommonData.strTimes;
import static com.soofer.app.CommonClass.Constants.CheckRiderStatus;
import static com.soofer.app.CommonClass.Constants.isMultipleStop;
import static com.soofer.app.CommonClass.Constants.multipleAddressModels;
import static com.soofer.app.CommonClass.Utiles.StartAnimation;
import static com.soofer.app.CommonClass.Utiles.returnString;

/**
 * A simple {@link Fragment} subclass.
 */
public class RedEstimateFragment extends BaseFragment implements EstimationView, SetrequestView {


    @BindView(R.id.car_type_imge)
    ImageView carTypeImge;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.estimate)
    LinearLayout estimate;
    @BindView(R.id.cash_imge)
    ImageView cashImge;
    @BindView(R.id.payment_type)
    TextView paymentType;
    @BindView(R.id.apply_coupon_imge)
    ImageView applyCouponImge;
    @BindView(R.id.apply_coupon_layout)
    LinearLayout applyCouponLayout;
    @BindView(R.id.request_now)
    Button requestNow;
    @BindView(R.id.request_layout)
    LinearLayout requestLayout;
    Unbinder unbinder;
    @BindView(R.id.use_wallet)
    CheckBox useWallet;

    String utcoffsetvalue;

    private Activity activity;
    private Context context;
    private FragmentManager fragmentManager;

    private Response<EstimationModel> response;
    private CallRequest callRequest;
    private EstimationFarePresenter estimationFarePresenter;
    private String strTotal = "";
    private String time = "";
    private AlertDialog walletAlert;
    Fare_EstimationDialog red_estimates;

    public RedEstimateFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_red_estimate, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        fragmentManager = getFragmentManager();
        if (SharedHelper.getKey(context, "wallet_amout") == null || SharedHelper.getKey(context, "wallet_amout").isEmpty() || SharedHelper.getKey(context, "wallet_amout").equalsIgnoreCase("0")) {
            useWallet.setVisibility(View.GONE);
        } else {
            useWallet.setVisibility(View.VISIBLE);
        }
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        estimationFarePresenter = new EstimationFarePresenter(this);
        estimationRequest();
        Utiles.Documentimg(CommonData.strServiceImage, carTypeImge, activity);
        carTypeImge.setColorFilter(activity.getResources().getColor(R.color.colorPrimary));



        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }

    @Optional
    @OnClick({R.id.estimate, R.id.apply_coupon_layout, R.id.request_now, R.id.change_payment_Layout,R.id.fare_estimation_Layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.estimate:
                EstimationDialog estimates = new EstimationDialog(activity, response);
                estimates.setCancelable(true);
                Objects.requireNonNull(estimates.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
                try {
                    final View decorView = estimates.getWindow().getDecorView();
                    StartAnimation(decorView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                estimates.show();

                break;
            case R.id.apply_coupon_layout:
                PromocodeDialog dialogClass = new PromocodeDialog(activity, strTotal, value -> {
                    totalAmountTxt.setText("$" + value);
                    response.body().getVehicleDetailsAndFare().getFareDetails().setTotalFare(value);

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
                break;
            case R.id.request_now:
                if (useWallet.isChecked()) {
                    CommonData.strPaymentType = "Wallet";
                }else {
                    CommonData.strPaymentType = "card";
                }

                if (CommonData.strPaymentType.equalsIgnoreCase("Wallet")){
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
                    map.put("pickupCity", CommonData.strPickupCity);
                    map.put("requestFrom", "app");
                    if (strDate.isEmpty()) {
                        map.put("bookingType", "rideNow");
                        CommonData.TripType = "";
                    } else {
                        map.put("bookingType", "rideLater");
                        CommonData.TripType = "daily";
                    }
                    map.put("tripDate", strDate);
                    map.put("tripTime", strTimes);
                    if (isMultipleStop) {
                        JSONObject jsonObject = new JSONObject();
                        try {
                            jsonObject.put("multiple", new Gson().toJson(multipleAddressModels));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        map.put("isMultiLocation", "true");
                        map.put("multiLocation", String.valueOf(jsonObject));
                    } else {
                        map.put("isMultiLocation", "false");
                    }
                    map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
                    map.put("tripType", "daily");
                    map.put("tripDate", strDate);
                    map.put("tripTime", strTimes);
                    map.put("vehicleId", com.soofer.app.CommonClass.Constants.Vehicle_id);
                    map.put("safeRide", String.valueOf(com.soofer.app.CommonClass.Constants.isDriver));
                    map.put("drivergender",SharedHelper.getKey(activity,"gender"));
                    SharedHelper.putKey(activity,"drivergender",SharedHelper.getKey(activity,"gender"));
//                    SharedHelper.getKey(context,"drivergender")
                    map.put("utc",getTimeZone());
                    map.put("utcOffset",utcoffsetvalue);
                    RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
                    requestFlowPresenter.setRequesApi(map, activity, "normal");
                }else {

                    if (SharedHelper.getKey(context, "card_number") != null && !SharedHelper.getKey(context, "card_number").isEmpty()) {
                        CheckRiderStatus = "Processing";
                        HashMap<String, String> map = new HashMap<>();
                        map.put("paymentMode", CommonData.strPaymentType);
                        map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
                        map.put("distanceDetails", returnString(strEstimationResponse, true));
                        map.put("timeFare", CommonData.strTimeFare);
                        map.put("promoAmt", "");
                        map.put("serviceType", CommonData.strServiceType);
                        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
                        map.put("time", "");
                        map.put("promo", CommonData.strpromocode);
                        map.put("pickupCity", CommonData.strPickupCity);
                        map.put("requestFrom", "app");
                        if (strDate.isEmpty()) {
                            map.put("bookingType", "rideNow");
                            CommonData.TripType = "";
                        } else {
                            map.put("bookingType", "rideLater");
                            CommonData.TripType = "daily";
                        }
                        map.put("tripDate", strDate);
                        map.put("tripTime", strTimes);
                        if (isMultipleStop) {
                            JSONObject jsonObject = new JSONObject();
                            try {
                                jsonObject.put("multiple", new Gson().toJson(multipleAddressModels));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            map.put("isMultiLocation", "true");
                            map.put("multiLocation", String.valueOf(jsonObject));
                        } else {
                            map.put("isMultiLocation", "false");
                        }
                        map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
                        map.put("tripType", "daily");
                        map.put("tripDate", strDate);
                        map.put("tripTime", strTimes);
                        map.put("vehicleId", com.soofer.app.CommonClass.Constants.Vehicle_id);
                        map.put("safeRide", String.valueOf(com.soofer.app.CommonClass.Constants.isDriver));
//                        map.put("drivergender", SharedHelper.getKey(context, "drivergender"));
                        map.put("drivergender",SharedHelper.getKey(activity,"gender"));
                        SharedHelper.putKey(activity,"drivergender",SharedHelper.getKey(activity,"gender"));
                        map.put("utc", getTimeZone());
                        map.put("utcOffset", utcoffsetvalue);
                        RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
                        requestFlowPresenter.setRequesApi(map, activity, "normal");
                    } else {
                        Alertdialog();
                    }
                }
                break;
            case R.id.change_payment_Layout:
             /*   if (dialogFragment != null) {
                    dialogFragment.dismiss();
                }
                dialogFragment = new PaymentMethodBottomFragment();
                dialogFragment.show(fragmentManager, "show_payment");*/
                break;
            case R.id.fare_estimation_Layout:
                Fare_EstimationDialog Fare_estimates = new Fare_EstimationDialog(activity, response);
                Fare_estimates.setCancelable(true);
                Objects.requireNonNull(Fare_estimates.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
                try {
                    final View decorView = Fare_estimates.getWindow().getDecorView();
                    StartAnimation(decorView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Fare_estimates.show();
                break;

        }
    }

    public void Alertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(getResources().getString(R.string.app_name));
        builder1.setMessage(R.string.please_added_card);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                R.string.ok,
                (dialog, id) -> {
                    dialog.dismiss();
                    Utiles.hideKeyboard(activity);
                    Fragment fragment = new PaymentFragment();
                    FragmentCalling(fragment);
                });

        walletAlert = builder1.create();
        walletAlert.show();
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.containter, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }

    private String getTimeZone() {
        TimeZone tz = TimeZone.getDefault();
        Calendar cal = GregorianCalendar.getInstance(tz);
        int offsetInMillis = tz.getOffset(cal.getTimeInMillis());
        @SuppressLint("DefaultLocale")
        String offset = String.format(
                "%02d:%02d", Math.abs(offsetInMillis / 3600000), Math.abs(
                        offsetInMillis / 60000 % 60
                ));
        if(offsetInMillis >=0){
            utcoffsetvalue= "+"+offset;
            offset= "+"+offset;
        } else {
            utcoffsetvalue= "-"+offset;
            offset= "-"+offset;
        }
        System.out.println("Time Zone  "+offset+" offset value  :  "+utcoffsetvalue);
        return offset;

    }
    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccess(Response<EstimationModel> response) {
        this.response = response;
        strEstimationResponse = new Gson().toJson(response.body());

        System.out.println("jdhfguysazdfgikhjf"+strEstimationResponse);

        try {
            if (response.isSuccessful()) {
                assert response.body() != null;
                totalAmountTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTotalFare());
                strTotal = response.body().getVehicleDetailsAndFare().getFareDetails().getTotalFare();
            } else {
                Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
        }
    }

    @Override
    public void OnFailure(Response<EstimationModel> response) {

        System.out.println("failurrreeee"+response.body());
        if (response.errorBody() != null) {
            try {
                String message = response.errorBody().string();
                JSONObject jsonObject = new JSONObject(message);
                boolean isOutstation = jsonObject.optBoolean("outstation");
                if (isOutstation) {
                    riderAlert(activity);
                }
                Utiles.showErrorMessage(message, activity, getView());
                String messag = jsonObject.optString("message");
                if (messag != null && messag.startsWith("Service not available")) {
                    fragmentManager.popBackStackImmediate();
                    callRequest = (CallRequest) getActivity();
                    callRequest.ClearServiceFragment();
                }

            } catch (Exception e) {
                e.printStackTrace();
                Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            }
        } else {
            Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
        }


    }

    @Override
    public void OnSuccessfully(Response<RequestModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            try {
                Utiles.CommonToast(activity, Response.body().getMessage());
                callRequest = (CallRequest) getActivity();
                if (strDate.isEmpty()) {
                    assert callRequest != null;
                    callRequest.callReuest();
                } else {
                    fragmentManager.popBackStackImmediate();
                    callRequest.ClearServiceFragment();
                }

                CommonData.strpromocode = "";
                strDate ="";
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
        if (Response.errorBody() != null) {
            try {
                assert Response.errorBody() != null;
                Utiles.showErrorMessage(Response.errorBody().string(), activity, getView());
            } catch (Exception e) {
                e.printStackTrace();
                Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            }
        } else {
            Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
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
    public void Onmessage(EstimationChanges event) {
        try {
            if (event.getMessage().equalsIgnoreCase("estimation")) {
                estimationRequest();
                EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void Onmessage(FemaleDriverFlow event) {

                if (CommonData.gender.equalsIgnoreCase( "female")) {
                    CommonData.gender = "";
                    Female_driverDialog female_driverDialog = new Female_driverDialog(activity);
                    female_driverDialog.setCancelable(true);
                    Objects.requireNonNull(female_driverDialog.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
                    try {
                        final View decorView = female_driverDialog.getWindow().getDecorView();
                        StartAnimation(decorView);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    female_driverDialog.show();

                } else if (CommonData.gender.equalsIgnoreCase("male")) {
                    CommonData.gender = "";
                CheckRiderStatus = "Processing";
                HashMap<String, String> map = new HashMap<>();
                map.put("paymentMode", CommonData.strPaymentType);
                map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
                map.put("distanceDetails", returnString(strEstimationResponse, true));
                map.put("timeFare", CommonData.strTimeFare);
                map.put("promoAmt", "");
                map.put("serviceType", CommonData.strServiceType);
                map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
                map.put("time", "");
                map.put("promo", CommonData.strpromocode);
                map.put("pickupCity", CommonData.strPickupCity);
                map.put("requestFrom", "app");
                if (strDate.isEmpty()) {
                    map.put("bookingType", "rideNow");
                    CommonData.TripType = "";
                } else {
                    map.put("bookingType", "rideLater");
                    CommonData.TripType = "daily";
                }
                map.put("tripDate", strDate);
                map.put("tripTime", strTimes);
                if (isMultipleStop) {
                    JSONObject jsonObject = new JSONObject();
                    try {
                        jsonObject.put("multiple", new Gson().toJson(multipleAddressModels));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    map.put("isMultiLocation", "true");
                    map.put("multiLocation", String.valueOf(jsonObject));
                } else {
                    map.put("isMultiLocation", "false");
                }
                map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
                map.put("tripType", "daily");
                map.put("tripDate", strDate);
                map.put("tripTime", strTimes);
                map.put("vehicleId", com.soofer.app.CommonClass.Constants.Vehicle_id);
                map.put("safeRide", String.valueOf(com.soofer.app.CommonClass.Constants.isDriver));
                map.put("drivergender","Male");
                SharedHelper.putKey(activity,"drivergender","Male");
//                    SharedHelper.getKey(context,"drivergender")
                map.put("utc",getTimeZone());
                map.put("utcOffset",utcoffsetvalue);
                RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
                requestFlowPresenter.setRequesApi(map, activity, "normal");
            } else if (CommonData.gender.equalsIgnoreCase("cancel")) {
                    CommonData.gender = "";
                    Constants.TripFlowFragmant = null;
                    callRequest = (CallRequest) getActivity();
                    callRequest.ClearServiceFragment();
                    getFragmentManager().popBackStackImmediate();

                }

    }


    private void estimationRequest() {

        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("serviceType", CommonData.strServiceType);

        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
        if (isMultipleStop) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("multiple", new JSONArray(new Gson().toJson(multipleAddressModels)));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            map.put("isMultiLocation", "true");
            map.put("multiLocation", String.valueOf(jsonObject));
            System.out.println("enter the muliple destionation" + jsonObject);
        } else {
            map.put("isMultiLocation", "false");
        }
        map.put("tripType", "daily");
        map.put("time", "");
        map.put("tripDate", strDate);
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        System.out.println("hours"+hour+"minutes"+minute);
        String time=hour+":"+minute;
        System.out.println("time"+time);

        map.put("tripTime", time);
        System.out.println("muthu"+time);
        map.put("encodePath", CommonData.strEncodePolyline);

        if (strDate.isEmpty()) {
            map.put("bookingType", "rideNow");
        } else {
            map.put("bookingType", "rideLater");
        }
        /*  map.put("cityLimitCalculation", strCityLimit);*/
        map.put("promoCode", CommonData.strpromocode);
        map.put("pickupCity", CommonData.strPickupCity);

        estimationFarePresenter.getEstimationFare(map, activity);
    }

    private void riderAlert(Activity activity) {
        OutstationAlertDialog dialogClass = new OutstationAlertDialog(activity);
        dialogClass.setCancelable(false);
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.slideupdown;
        Window window = dialogClass.getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();
        wlp.gravity = Gravity.BOTTOM;
        wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
        window.setAttributes(wlp);
        dialogClass.show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Event(FLowRealtimeChanges event) {
        try {
            if (CommonData.strPaymentType.equalsIgnoreCase("card")) {
                paymentType.setText("Online Payment");

            } else if (CommonData.strPaymentType.equalsIgnoreCase("Others")) {
                paymentType.setText("Others");
            }
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }

        EventBus.getDefault().removeStickyEvent(FLowRealtimeChanges.class); // don't forget to remove the sticky event if youre done with it
    }


}
