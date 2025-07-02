package com.soofer.app.TripFlowScreen.OutStation;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.transition.Fade;
import android.transition.Transition;
import android.transition.TransitionManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentManager;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.PromocodeDialog;
import com.soofer.app.EventBus.FLowRealtimeChanges;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.LocalModel.OutstationLocalModel;
import com.soofer.app.Model.RequestModel;
import com.soofer.app.Presenter.RequestFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.TripFlowScreen.bottomSheetDialogFragment.PaymentMethodBottomFragment;
import com.soofer.app.View.SetrequestView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.disposables.CompositeDisposable;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strEstimationResponse;
import static com.soofer.app.CommonClass.Utiles.StartAnimation;
import static com.soofer.app.CommonClass.Utiles.changeVisiblity;
import static com.soofer.app.CommonClass.Utiles.returnDate;
import static com.soofer.app.CommonClass.Utiles.returnString;

@SuppressLint("ValidFragment")
public class ConfimYourBookFragment extends BaseFragment implements SetrequestView {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.img_cartype)
    ImageView imgCartype;
    @BindView(R.id.txt_car_name)
    TextView txtCarName;
    @BindView(R.id.pickup_txt)
    TextView pickupTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.leave_on_date_txt)
    TextView leaveOnDateTxt;
    @BindView(R.id.return_by_date_txt)
    TextView returnByDateTxt;
    @BindView(R.id.return_date_layout)
    LinearLayout returnDateLayout;
    @BindView(R.id.km_label_distance)
    TextView kmLabelDistance;
    @BindView(R.id.total_est_amount_txt)
    TextView totalEstAmountTxt;
    @BindView(R.id.switch_fare)
    Switch switchFare;
    @BindView(R.id.base_km_fare_txt)
    TextView baseKmFareTxt;
    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.remain_fare_km_txt)
    TextView remainFareKmTxt;
    @BindView(R.id.remaining_fare_txt)
    TextView remainingFareTxt;
    @BindView(R.id.driver_allowance_txt)
    TextView driverAllowanceTxt;
    @BindView(R.id.sum_of_total_txt)
    TextView sumOfTotalTxt;
    @BindView(R.id.fare_details_layout)
    LinearLayout fareDetailsLayout;
    @BindView(R.id.car_type_imge)
    ImageView carTypeImge;
    @BindView(R.id.car_category_type_txt)
    TextView carCategoryTypeTxt;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
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
    @BindView(R.id.request_btn_layout)
    FrameLayout requestBtnLayout;
    @BindView(R.id.description_txt)
    TextView descriptionTxt;
    @BindView(R.id.remain_fare_hours_txt)
    TextView remainFareHoursTxt;
    @BindView(R.id.remaining_hours_fare_txt)
    TextView remainingHoursFareTxt;
    @BindView(R.id.day_mutli_txt)
    TextView dayMutliTxt;
    @BindView(R.id.day_fare_txt)
    TextView dayFareTxt;
    @BindView(R.id.night_mutli_txt)
    TextView nightMutliTxt;
    @BindView(R.id.night_fare_txt)
    TextView nightFareTxt;
    @BindView(R.id.change_payment_Layout)
    LinearLayout changePaymentLayout;
    @BindView(R.id.gst_label_txt)
    TextView gstLabelTxt;
    @BindView(R.id.gst_txt)
    TextView gstTxt;

    private OutstationLocalModel outstationLocalModel;
    private CompositeDisposable disposable;

    @SuppressLint("ValidFragment")
    public ConfimYourBookFragment(OutstationLocalModel outstationLocalModel) {
        // Required empty public constructor
        this.outstationLocalModel = outstationLocalModel;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    private Activity activity;
    private Context context;
    private FragmentManager fragmentManager;
    private CallRequest callRequest;

    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_confim_your_book, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        disposable = new CompositeDisposable();
        fragmentManager = getFragmentManager();
        switchFare.setOnCheckedChangeListener((compoundButton, b) -> {
            Checkvisiblity(fareDetailsLayout, b);
        });
        pickupTxt.setText(Utiles.NullPointer(CommonData.strPickupAddress));
        dropAddressTxt.setText(Utiles.NullPointer(CommonData.strDropAddresss));
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));

        try {
            pickupTxt.setText(Utiles.NullPointer(CommonData.strPickupAddress));
            dropAddressTxt.setText(Utiles.NullPointer(CommonData.strDropAddresss));
            if (outstationLocalModel.getTripeType().equalsIgnoreCase("oneway")) {
                changeVisiblity(returnDateLayout, false);
                leaveOnDateTxt.setText(returnDate(outstationLocalModel.getStartDate()));
                kmLabelDistance.setText(getString(R.string.one_way_trip_of_about) + " " + outstationLocalModel.getVehicleList().getDistanceLable() + " , " + outstationLocalModel.getDistancelable());
            } else {
                changeVisiblity(returnDateLayout, true);
                leaveOnDateTxt.setText(returnDate(outstationLocalModel.getStartDate()));
                returnByDateTxt.setText(returnDate(outstationLocalModel.getEndDate()));
                kmLabelDistance.setText(outstationLocalModel.getDistancelable() + getString(R.string.roud_trip_of_about) + outstationLocalModel.getVehicleList().getDistanceLable());

            }
            totalAmountTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getTotalFare());
            dayFareTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getDayFare());
            nightFareTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getNightFare());
            totalEstAmountTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getTotalFare());
            gstLabelTxt.setText("GST (" + outstationLocalModel.getVehicleList().getFareDetails().getTaxPercentage() +" % )");
            gstTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getTax() );
            sumOfTotalTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getTotalFare());
            txtCarName.setText(outstationLocalModel.getVehicleList().getVehicle());
            txtCarName.setText(outstationLocalModel.getVehicleList().getVehicle());
            carCategoryTypeTxt.setText(outstationLocalModel.getVehicleList().getVehicle());
            baseKmFareTxt.setText(outstationLocalModel.getVehicleList().getFareDetails().getBaseFareLabel());
            dayMutliTxt.setText(outstationLocalModel.getVehicleList().getFareDetails().getDayRate() + " * " + outstationLocalModel.getVehicleList().getFareDetails().getNoOfDays());
            nightMutliTxt.setText(outstationLocalModel.getVehicleList().getFareDetails().getNightRate() + " * " + outstationLocalModel.getVehicleList().getFareDetails().getNoOfNights());
            remainFareHoursTxt.setText(outstationLocalModel.getVehicleList().getFareDetails().getRemainingTimeFareLabel());
            baseFareTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getBaseFare());
            remainingHoursFareTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getExtraTimeFare());
            remainingFareTxt.setText("$ " + outstationLocalModel.getVehicleList().getFareDetails().getRemainingFare());
            remainFareKmTxt.setText(outstationLocalModel.getVehicleList().getFareDetails().getRemainingFareLabel());
            driverAllowanceTxt.setText("$ " + outstationLocalModel.getVehicleList().getConveyancePerKm());

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                descriptionTxt.setText(Html.fromHtml(outstationLocalModel.getVehicleList().getFareDetails().getDescription(), Html.FROM_HTML_MODE_COMPACT));
            } else {
                descriptionTxt.setText(Html.fromHtml(outstationLocalModel.getVehicleList().getFareDetails().getDescription()));
            }
            Utiles.Documentimg((outstationLocalModel.getVehicleList().getFile()), carTypeImge, activity);
            carTypeImge.setColorFilter(activity.getResources().getColor(R.color.colorPrimary));
            Utiles.Documentimg((RetrofitGenerator.imagepath + outstationLocalModel.getVehicleList().getFile()), imgCartype, activity);
            imgCartype.setColorFilter(activity.getResources().getColor(R.color.colorPrimary));

        } catch (Exception e) {
            e.printStackTrace();
        }
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.request_now, R.id.apply_coupon_layout, R.id.change_payment_Layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.request_now:
                setRerequest();
                break;
            case R.id.apply_coupon_layout:
                PromocodeDialog dialogClass = new PromocodeDialog(activity, outstationLocalModel.getVehicleList().getFareDetails().getTotalFare(), value -> {
                    totalEstAmountTxt.setText("$ " + value);
                    sumOfTotalTxt.setText("$ " + value);
                    totalAmountTxt.setText("$ " + value);
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
            case R.id.change_payment_Layout:
                if (dialogFragment != null) {
                    dialogFragment.dismiss();
                }
                dialogFragment = new PaymentMethodBottomFragment();
                dialogFragment.show(fragmentManager, "show_payment");
                break;
        }
    }

    private void Checkvisiblity(View view, boolean ischeck) {
        Transition transition = new Fade();
        transition.setDuration(600);
        transition.addTarget(view);

        TransitionManager.beginDelayedTransition(requestBtnLayout, transition);
        if (ischeck) {
            if (view.getVisibility() == View.GONE)
                view.setVisibility(View.VISIBLE);
        } else {
            if (view.getVisibility() == View.VISIBLE)
                view.setVisibility(View.GONE);
        }


    }

    private void setRerequest() {
        TimeZone tz = TimeZone.getDefault();
        System.out.println("TimeZone time  " + tz.getDisplayName(false, TimeZone.SHORT) + " Timezon id :: " + tz.getID());
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("serviceid", CommonData.ServiceID);
        map.put("pickupAddress", CommonData.strPickupAddress);
        map.put("dropAddress", CommonData.strDropAddresss);
        map.put("serviceType", outstationLocalModel.getVehicleList().getVehicle());
        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
        map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
        map.put("distanceDetails", returnString(strEstimationResponse, true));
        map.put("paymentMode", CommonData.strPaymentType);
        map.put("timeFare", CommonData.strTimeFare);
        map.put("promo", CommonData.strpromocode);
        map.put("pickupCity", CommonData.strPickupCity);
        map.put("bookingType", "rideLater");
        map.put("requestFrom", "app");
        map.put("vehicleTypeId", outstationLocalModel.getVehicleList().getId());
        map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
        map.put("utc", tz.getDisplayName(false, TimeZone.SHORT));
        map.put("tripDate", CommonData.strDate);
        map.put("tripTime", CommonData.strTimes);
        map.put("tripType", "outstation");
        map.put("startDay", returnDate(outstationLocalModel.getStartDate()));
        map.put("returnDay", returnDate(outstationLocalModel.getEndDate()));
        map.put("outstationType", outstationLocalModel.getTripeType());
//        map.put("vehicleId", Constants.Vehicle_id);
//        map.put("safeRide", String.valueOf(Constants.isDriver));
        System.out.println("enter the hash map  " + map);
        RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
        requestFlowPresenter.setRequesApi(map, activity, "outstation");
    }

    @Override
    public void OnSuccessfully(Response<RequestModel> Response) {
        try {
            Utiles.displayMessage(getView(), context, Response.body().getMessage());
            callRequest = (CallRequest) activity;
            callRequest.ClearServiceFragment();

        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
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

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Event(FLowRealtimeChanges event) {
        try {
            if (CommonData.strPaymentType.equalsIgnoreCase("cash")) {
                paymentType.setText("Cash");

            } else if (CommonData.strPaymentType.equalsIgnoreCase("Others")) {
                paymentType.setText("Others");

            } else {
                paymentType.setText("Online Payment");
            }
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }

        EventBus.getDefault().removeStickyEvent(FLowRealtimeChanges.class); // don't forget to remove the sticky event if youre done with it
    }
}
