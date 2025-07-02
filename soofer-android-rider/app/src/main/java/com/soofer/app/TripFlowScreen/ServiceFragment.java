package com.soofer.app.TripFlowScreen;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;

import com.soofer.app.Activity.PaymentActivity;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.FLowRealtimeChanges;
import com.soofer.app.EventBus.RequestStatus;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Presenter.ServicePresenter;
import com.soofer.app.R;
import com.soofer.app.View.ServiceView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strPickupCity;
import static com.soofer.app.CommonClass.Utiles.clearInstance;


public class ServiceFragment extends BaseFragment implements ServiceView {

    @BindView(R.id.request_btn)
    Button requestBtn;
    Unbinder unbinder;
    CallRequest callRequest;
    @BindView(R.id.basic_img)
    ImageView basicImg;
    @BindView(R.id.normal_img)
    ImageView normalImg;
    @BindView(R.id.luxurious_img)
    ImageView luxuriousImg;
    boolean buttomclick = true;

    Fragment fragment;
    @BindView(R.id.payment_type_txt)
    TextView paymentTypeTxt;
    @BindView(R.id.promocode_txt)
    TextView promocodeTxt;
    @BindView(R.id.recyler_cartype)
    RecyclerView recylercartype;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.no_service_txt)
    TextView noServiceTxt;
    @BindView(R.id.no_service_linearlayout)
    LinearLayout noServiceLinearlayout;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }
    public ServiceFragment(){

    }

    public static List<ServiceModel.VehicleCategory> servieModel = null;
    Activity activity;
    Context context;


    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_service, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        buttomclick = false;
        //   settint(basicImg, luxuriousImg, normalImg);
        CommonData.strPaymentType = "cash";
        LinearLayoutManager layoutaddress = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        recylercartype.setLayoutManager(layoutaddress);
        ServicePresenter servicePresenter = new ServicePresenter(this);
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
      //  map.put("dropLat", String.valueOf(CommonData.Droplat));
       // map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("drivergender", SharedHelper.getKey(context,"drivergender"));
        map.put("tripType", "daily");
        servicePresenter.getServiceFare(activity, map);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }


    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @OnClick({R.id.basic_img, R.id.normal_img, R.id.luxurious_img, R.id.request_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.basic_img:
                if (buttomclick) {
                    CommonData.strServiceType = "Basic";
                    buttomclick = false;
                    settint(basicImg, luxuriousImg, normalImg);
                } else {
                    buttomclick = true;
                    CallFareDetailFragment();
                }
                callRequest = (CallRequest) getActivity();
                //callRequest.SelectedCategory(CommonData.strServiceType);
                getServiceID();
                break;
            case R.id.normal_img:
                CommonData.strServiceType = "Normal";
                if (buttomclick) {
                    buttomclick = false;
                    settint(normalImg, luxuriousImg, basicImg);
                } else {
                    buttomclick = true;
                    CallFareDetailFragment();
                }
                getServiceID();
                callRequest = (CallRequest) getActivity();
          //      callRequest.SelectedCategory(CommonData.strServiceType);
                break;
            case R.id.luxurious_img:
                CommonData.strServiceType = "Luxurious";
                if (buttomclick) {
                    buttomclick = false;
                    settint(luxuriousImg, normalImg, basicImg);
                } else {
                    buttomclick = true;
                    CallFareDetailFragment();
                }
                callRequest = (CallRequest) getActivity();
               // callRequest.SelectedCategory(CommonData.strServiceType);
                getServiceID();
                break;
            case R.id.request_btn:
                /*if (!cancelExceedss.equalsIgnoreCase("0")) {
                    riderAlert(activity, riderCancelLimiitExceeds);
                } else if (isStringToDouble(oldBalance) > isStringToDouble(riderMaximumOldBalance)) {
                    riderAlert(activity, riderOldBalanceExceededMessage);
                } else {
                    if (isOutstationPickup) {
                        OutstationAlertDialog dialogClass = new OutstationAlertDialog(activity);
                        dialogClass.setCancelable(false);
                        dialogClass.getWindow().getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                        dialogClass.show();
                    } else {
                        try {
                            callRequest = (CallRequest) getActivity();
                            callRequest.CallEstimationfare();
                        } catch (Exception e) {
                            Log.e("tag", "Eception of request screen" + e.getMessage());
                        }
                    }
                }*/
                try {
                    callRequest = (CallRequest) getActivity();
                    callRequest.CallEstimationfare();
                } catch (Exception e) {
                    Log.e("tag", "Eception of request screen" + e.getMessage());
                }
                break;
        }
    }

    public Double isStringToDouble(String values) {

        return Double.valueOf(values);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void settint(ImageView currentimage, ImageView remain, ImageView remaitwo) {
        currentimage.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
        remain.setBackground(getResources().getDrawable(R.drawable.car_bg));
        remaitwo.setBackground(getResources().getDrawable(R.drawable.car_bg));
        currentimage.setImageTintList(getResources().getColorStateList(R.color.white));
        remain.setImageTintList(getResources().getColorStateList(R.color.black));
        remaitwo.setImageTintList(getResources().getColorStateList(R.color.black));
    }

    public void FragmentCalling(Fragment fragment) {

        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.container, fragment);
        fragmentTransaction.addToBackStack("tag");
        fragmentTransaction.commit();


    }

    @Override
    public void OnSuccess(Response<ServiceModel> response) {

       // strCityLimit = returnString(new Gson().toJson(response.body()));

        servieModel = response.body().getVehicleCategories();
        if (response.body().getVehicleCategories()!=null && !response.body().getVehicleCategories().isEmpty()) {
            noServiceLinearlayout.setVisibility(View.GONE);
            animationView.setVisibility(View.GONE);
            recylercartype.setVisibility(View.VISIBLE);
         //   isOutstationPickup = response.body().getData().getCityLimitCalculation().getShouldFrontendShowOutStationAlert();
            if (servieModel != null && !servieModel.isEmpty()) {
               // ServiceAdapter serviceAdapter = new ServiceAdapter(activity, servieModel, this);
            //    recylercartype.setAdapter(serviceAdapter);
            }
        } else {
            noServiceLinearlayout.setVisibility(View.VISIBLE);
            animationView.setVisibility(View.VISIBLE);
            recylercartype.setVisibility(View.GONE);
            noServiceTxt.setText("No Service Available");
        }
        strPickupCity = response.body().getPickupCity();
        // getServiceID();
    }

    @Override
    public void OnFailure(Response<ServiceModel> response) {
        noServiceLinearlayout.setVisibility(View.VISIBLE);
        animationView.setVisibility(View.VISIBLE);
        recylercartype.setVisibility(View.GONE);
        Utiles.displayMessage(getView(), context, "Something Went Wrong");

    }

    @Override
    public void show() {

    }

    @Override
    public void hide() {

    }

    public void getServiceID() {
       /* if (servieModel != null && !servieModel.isEmpty()) {
            for (int i = 0; i < servieModel.size(); i++) {
                if (CommonData.strServiceType.equalsIgnoreCase(servieModel.get(i).getType())) {
                    CommonData.ServiceID = servieModel.get(i).getId();


                }
            }
        }*/
    }

    public void CallFareDetailFragment() {
        /*try {
            callRequest = (CallRequest) getActivity();
            callRequest.FareDetailFragment(servieModel);
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }*/
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void Onmessage(RequestStatus event) {
        try {
            String status = event.getMessage();
            requestBtn.setText(status);
            Log.d("Tag", "Test status" + status);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
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

    @OnClick(R.id.payment_type_txt)
    public void onPaymentTypeTxtClicked() {
        Intent intent = new Intent(context, PaymentActivity.class);
        startActivity(intent);
    }

    @OnClick(R.id.promocode_txt)
    public void onPromocodeTxtClicked() {
        /*PromocodeDialog dialogClass = new PromocodeDialog(activity);
        dialogClass.setCancelable(true);
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
        try {
            final View decorView = dialogClass.getWindow().getDecorView();
            StartAnimation(decorView);
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialogClass.show();*/
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Event(FLowRealtimeChanges event) {
        try {
            if (CommonData.strPaymentType.equalsIgnoreCase("cash")) {
                paymentTypeTxt.setText("cash");
                paymentTypeTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(getResources().getDrawable(R.drawable.ic_money), null, null, null);

            } else {
                paymentTypeTxt.setText("Card");
                paymentTypeTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(getResources().getDrawable(R.drawable.ic_stripe), null, null, null);

            }
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }

        EventBus.getDefault().removeStickyEvent(FLowRealtimeChanges.class); // don't forget to remove the sticky event if youre done with it
    }


    /*@Override
    public void SelectService() {
        CallFareDetailFragment();
    }*/


    public String returnString(String message) {
        String strMessage = "";
        try {
            JSONObject jsonObject = new JSONObject(message);
            strMessage = String.valueOf(jsonObject.optJSONObject("data").optJSONObject("cityLimitCalculation"));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return strMessage;
    }
}