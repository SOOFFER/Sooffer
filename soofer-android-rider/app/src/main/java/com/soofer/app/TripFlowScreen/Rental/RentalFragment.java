package com.soofer.app.TripFlowScreen.Rental;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Html;
import android.text.TextUtils;
import android.transition.Fade;
import android.transition.Transition;
import android.transition.TransitionManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.soofer.app.Adapter.CabListAdapter;
import com.soofer.app.Adapter.PackageAdapter;
import com.soofer.app.CommonClass.BaseClass.BasePresenter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.PromocodeDialog;
import com.soofer.app.EventBus.FLowRealtimeChanges;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Fragment.PaymentFragmentNew;
import com.soofer.app.Model.CabListModel;
import com.soofer.app.Model.PackageListModel;
import com.soofer.app.Model.RequestModel;
import com.soofer.app.Presenter.PackageListPresenter;
import com.soofer.app.Presenter.RequestFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.TripFlowScreen.bottomSheetDialogFragment.PaymentMethodBottomFragment;
import com.soofer.app.View.SetrequestView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import io.reactivex.disposables.CompositeDisposable;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strDate;
import static com.soofer.app.CommonClass.CommonData.strEstimationResponse;
import static com.soofer.app.CommonClass.CommonData.strTimes;
import static com.soofer.app.CommonClass.Utiles.StartAnimation;
import static com.soofer.app.CommonClass.Utiles.getErrorBody;
import static com.soofer.app.CommonClass.Utiles.returnString;


public class RentalFragment extends BaseFragment implements BasePresenter.CommonInterFace, CommonInterFace, SetrequestView {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.selct_package_txt)
    TextView selctPackageTxt;
    @BindView(R.id.km_txt)
    TextView kmTxt;
    @BindView(R.id.km_down_img)
    ImageView kmDownImg;
    @BindView(R.id.view_km)
    View viewKm;
    @BindView(R.id.PackageType_recycleview)
    RecyclerView PackageTypeRecycleview;
    @BindView(R.id.selct_car_txt)
    TextView selctCarTxt;
    @BindView(R.id.cab_down_img)
    ImageView cabDownImg;
    @BindView(R.id.selectCab_recycleview)
    RecyclerView selectCabRecycleview;
    @BindView(R.id.car_type_txt)
    TextView carTypeTxt;
    @BindView(R.id.car_imge)
    ImageView carImge;
    @BindView(R.id.fare_type_txt)
    TextView fareTypeTxt;
    @BindView(R.id.car_select_linear)
    LinearLayout carSelectLinear;
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
    @BindView(R.id.request_now)
    Button requestNow;
    @BindView(R.id.request_layout)
    LinearLayout requestLayout;
    Unbinder unbinder;
    @BindView(R.id.fragment_ments)
    FrameLayout fragmentMents;
    @BindView(R.id.pickup_address_txt)
    TextView pickupAddressTxt;
    @BindView(R.id.select_layout)
    RelativeLayout selectLayout;
    @BindView(R.id.cab_select_layout)
    RelativeLayout cabSelectLayout;
    @BindView(R.id.description_txt)
    TextView descriptionTxt;
    @BindView(R.id.apply_coupon_layout)
    LinearLayout applyCouponLayout;
    private FragmentManager fragmentManager;
    private Activity activity;
    private Context context;
    private List<PackageListModel.PackageDetail> packageDetail;
    private CabListAdapter cabListAdapter;
    private PackageListPresenter packageListPresenter;
    private CompositeDisposable disposable;
    private String strTotal = "";
    private String strServiceId = "";
    private String strVehicleId = "";
    private String strPackageId = "";

    private CallRequest callRequest;

    public RentalFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_rental, container, false);
        unbinder = ButterKnife.bind(this, view);
        fragmentManager = getFragmentManager();
        activity = getActivity();
        context = getContext();
        disposable = new CompositeDisposable();
        packageDetail = new ArrayList<>();
        pickupAddressTxt.setText(Utiles.NullPointer(CommonData.strPickupAddress));
        packageListPresenter = new PackageListPresenter(disposable, this, activity);
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        packageListPresenter.getPackageList(map);

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            unbinder.unbind();
            if (disposable != null && disposable.isDisposed()) {
                disposable.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Optional
    @OnClick({R.id.back_img, R.id.request_now, R.id.select_layout, R.id.apply_coupon_layout, R.id.cab_select_layout,R.id.change_payment_Layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.request_now:
                if (SharedHelper.getKey(context, "card_number") != null && !SharedHelper.getKey(context, "card_number").isEmpty()) {
                    setRerequest();
                } else {
                    Alertdialog();
                }
                break;
            case R.id.select_layout:
                selctPackageTxt.setText("Select Package");
                if (kmTxt.getVisibility() == View.VISIBLE) {
                    kmTxt.setVisibility(View.GONE);
                }
                Checkvisiblity(viewKm, false);
                Checkvisiblity(kmDownImg, false);
                Checkvisiblity(PackageTypeRecycleview, true);
                Checkvisiblity(selctCarTxt, false);
                Checkvisiblity(selectCabRecycleview, false);
                Checkvisiblity(cabDownImg, false);
                Checkvisiblity(carSelectLinear, false);
                Checkvisiblity(requestLayout, false);
                Checkvisiblity(selctCarTxt, false);
                break;
            case R.id.apply_coupon_layout:
                PromocodeDialog dialogClass = new PromocodeDialog(activity, strTotal, value -> totalAmountTxt.setText("$ " + value));
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
            case R.id.cab_select_layout:
                selctCarTxt.setText("Select Cab");
                Checkvisiblity(selectCabRecycleview, true);
                Checkvisiblity(cabDownImg, false);
                Checkvisiblity(carSelectLinear, false);
                break;

            case R.id.change_payment_Layout:
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
                    Fragment fragment = new PaymentFragmentNew();
                    FragmentCalling(fragment);
                });
        AlertDialog cardAlert = builder1.create();
        cardAlert.show();
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.containter, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commitAllowingStateLoss();
    }

    @Override
    public void onSuccess(Object object) {
        if (object instanceof PackageListModel) {
            packageDetail.addAll(((PackageListModel) object).getPackageDetail());
            PackageAdapter packageAdapter = new PackageAdapter(activity, packageDetail, this);
            PackageTypeRecycleview.setAdapter(packageAdapter);
            strServiceId = TextUtils.join(",", ((PackageListModel) object).getServiceDetail());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                descriptionTxt.setText(Html.fromHtml(((PackageListModel) object).getDescription(), Html.FROM_HTML_MODE_COMPACT));
            } else {
                descriptionTxt.setText(Html.fromHtml(((PackageListModel) object).getDescription()));
            }
        } else if (object instanceof CabListModel) {
            Checkvisiblity(selctCarTxt, true);
            Checkvisiblity(selectCabRecycleview, true);
            selctCarTxt.setText("Select Cab");
            cabListAdapter = new CabListAdapter(activity, ((CabListModel) object).getData(), this);
            selectCabRecycleview.setAdapter(cabListAdapter);
        }

    }

    @Override
    public void onFailure(Throwable throwable) {
        getErrorBody(throwable, activity);
    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);
    }

    @Override
    public void hideLoader() {
        Utiles.DismissLoader();
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void callBack(Object object) {
        if (object instanceof PackageListModel.PackageDetail) {
            Checkvisiblity(PackageTypeRecycleview, false);
            selctPackageTxt.setText("Package");
            kmTxt.setText(Utiles.NullPointer(((PackageListModel.PackageDetail) object).getName()));
            Checkvisiblity(kmTxt, true);
            Checkvisiblity(viewKm, true);
            Checkvisiblity(kmDownImg, true);
            HashMap<String, String> map = new HashMap<>();
            strPackageId = ((PackageListModel.PackageDetail) object).getId();
            map.put("packageId", ((PackageListModel.PackageDetail) object).getId());
            map.put("tripTypeCode", "rental");
            map.put("serviceId", strServiceId);
            if(strDate.isEmpty()){
                map.put("bookingType", "rideNow");
            }else {
                map.put("bookingType", "rideLater");
            }
            map.put("tripDate", strDate);
            map.put("tripTime", strTimes);
            map.put("encodePath", CommonData.strEncodePolyline);

            packageListPresenter.getEstimateCablist(map);
        } else if (object instanceof CabListModel.Datum) {
            selctCarTxt.setText("Cab");
            CommonData.strServiceType = ((CabListModel.Datum) object).getType();
            strVehicleId = ((CabListModel.Datum) object).getId();
            Utiles.Documentimg(((CabListModel.Datum) object).getFile(), carImge, activity);
            Utiles.Documentimg(((CabListModel.Datum) object).getFile(), carTypeImge, activity);
            carTypeTxt.setText(Utiles.NullPointer(((CabListModel.Datum) object).getType()));
            carCategoryTypeTxt.setText(Utiles.NullPointer(((CabListModel.Datum) object).getType()));
            fareTypeTxt.setText("$ " + Utiles.NullPointer(((CabListModel.Datum) object).getFare()));
            totalAmountTxt.setText("$ " + Utiles.NullPointer(((CabListModel.Datum) object).getFare()));
            strTotal = Utiles.NullPointer(((CabListModel.Datum) object).getFare());
            Checkvisiblity(selectCabRecycleview, false);
            Checkvisiblity(cabDownImg, true);
            Checkvisiblity(carSelectLinear, true);
            Checkvisiblity(requestLayout, true);

        }

    }

    private void Checkvisiblity(View view, boolean ischeck) {
        Transition transition = new Fade();
        transition.setDuration(600);
        transition.addTarget(view);

        TransitionManager.beginDelayedTransition(fragmentMents, transition);
        if (ischeck) {
            if (view.getVisibility() == View.GONE)
                view.setVisibility(View.VISIBLE);
        } else {
            if (view.getVisibility() == View.VISIBLE)
                view.setVisibility(View.GONE);
        }


    }

    @Override
    public void onResume() {
        super.onResume();

        if (getView() == null) {
            return;
        }

        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener((v, keyCode, event) -> {

            if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                // handle back button's click listener
                fragmentManager.popBackStackImmediate();
                return true;
            }
            return false;
        });
    }

    private void setRerequest() {
        TimeZone tz = TimeZone.getDefault();
        System.out.println("TimeZone time  " + tz.getDisplayName(false, TimeZone.SHORT) + " Timezon id :: " + tz.getID());
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", "");
        map.put("dropLng", "");
        map.put("serviceid", CommonData.ServiceID);
        map.put("pickupAddress", CommonData.strPickupAddress);
        map.put("dropAddress", "");
        map.put("serviceType", CommonData.strServiceType);
        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
        map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
        map.put("distanceDetails", returnString(strEstimationResponse, true));
        map.put("paymentMode", CommonData.strPaymentType);
        map.put("timeFare", CommonData.strTimeFare);
        map.put("promo", CommonData.strpromocode);
        map.put("pickupCity", CommonData.strPickupCity);
        if (CommonData.strDate.isEmpty()) {
            map.put("bookingType", "rideNow");
        } else {
            map.put("bookingType", "rideLater");
        }
        map.put("requestFrom", "app");
        map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
        map.put("utc", tz.getDisplayName(false, TimeZone.SHORT));
        map.put("tripDate", CommonData.strDate);
        map.put("tripTime", CommonData.strTimes);
        map.put("tripType", "rental");
        map.put("vehicleTypeId", strVehicleId);
        map.put("packageId", strPackageId);
        RequestFlowPresenter requestFlowPresenter = new RequestFlowPresenter(this);
        requestFlowPresenter.setRequesApi(map, activity, "rental");
    }

    @Override
    public void OnSuccessfully(Response<RequestModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            try {
                Utiles.CommonToast(activity,Response.body().getMessage());
                if (CommonData.strDate.isEmpty()) {
                    callRequest = (CallRequest) getActivity();
                    callRequest.callReuest();
                    CommonData.strpromocode = "";
                    //CheckRiderStatus = "Processing";
                    CommonData.strRequestId = Response.body().getRequestDetails();
                } else {
                    CommonData.strpromocode = "";
                    fragmentManager.popBackStackImmediate();
                }

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
            if (CommonData.strPaymentType.equalsIgnoreCase("card")) {
                paymentType.setText("Card");
            } else if(CommonData.strPaymentType.equalsIgnoreCase("Others")){
                paymentType.setText("Others");
            }
        } catch (Resources.NotFoundException e) {
            e.printStackTrace();
        }

        EventBus.getDefault().removeStickyEvent(FLowRealtimeChanges.class); // don't forget to remove the sticky event if youre done with it
    }
}
