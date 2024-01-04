package com.bismillah.driver.Activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.maps.model.LatLng;
import com.google.gson.Gson;
import com.bismillah.driver.Adapter.GooglePlaceAdapter;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.CustomizeDialog.HailRequestUserDetailsClass;
import com.bismillah.driver.EventBus.HailRequest;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.Prediction;
import com.bismillah.driver.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.bismillah.driver.Model.EstimationModel;
import com.bismillah.driver.Model.LocalModel.HailModel;
import com.bismillah.driver.Model.RequestTexiHail;
import com.bismillah.driver.Presenter.EstimationFarePresenter;
import com.bismillah.driver.Presenter.GoogleGeocoderPresenter;
import com.bismillah.driver.Presenter.GooglePlcaePresenter;
import com.bismillah.driver.Presenter.RequestTexiHailPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.EstimationView;
import com.bismillah.driver.View.GoogleAutoPlaceView;
import com.bismillah.driver.View.RequestTexiHailView;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import okhttp3.ResponseBody;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.CommonData.stopWatch;
import static com.bismillah.driver.CommonClass.CommonData.strEstimateId;
import static com.bismillah.driver.CommonClass.CommonData.strPaymentMode;
import static com.bismillah.driver.CommonClass.Utiles.clearInstance;
import static com.bismillah.driver.CommonClass.Utiles.compositeClreate;
import static com.bismillah.driver.MainActivity.getCurrentTime;

public class Texi_Hail_Activity extends AppCompatActivity implements GoogleAutoPlaceView, GoogleGeocoderPresenter.GoogleGeoCoderView, GooglePlaceAdapter.Callback, EstimationView, RequestTexiHailView {

    @BindView(R.id.search_et)
    EditText searchEt;
    @BindView(R.id.close_btn)
    ImageButton closeBtn;
    @BindView(R.id.tv_fav)
    TextView tvFav;

    @BindView(R.id.estimateframe)
    FrameLayout estimateFrameLayout;
    CompositeDisposable compositeDisposable = new CompositeDisposable();

    @BindView(R.id.place_recycleview)
    RecyclerView placeRecycleview;
    GooglePlaceAdapter googlePlaceAdapter;

    List<Prediction> predictions = new ArrayList<>();
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.pickup_txt)
    EditText pickupTxt;
    @BindView(R.id.picku_close_btn)
    ImageButton pickuCloseBtn;
    String strSetPin = null, strAddress = null;
    @BindView(R.id.pickup_relative)
    RelativeLayout pickupRelative;
    @BindView(R.id.search_layout)
    LinearLayout searchLayout;
    @BindView(R.id.parent)
    LinearLayout parent;
    @BindView(R.id.timearrive_fare_txt)
    TextView timearriveFareTxt;
    @BindView(R.id.booking_fare_txt)
    TextView bookingFareTxt;
    @BindView(R.id.schude_trip)
    Button schudeTrip;

    private Handler handler;
    private boolean blnAddress = true;

    GooglePlcaePresenter googlePlcaePresenter;
    GoogleGeocoderPresenter googleGeocoderPresenter;

    Context context = Texi_Hail_Activity.this;
    Activity activity = Texi_Hail_Activity.this;

    //Estimate


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


    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;


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

    private String random;
    @BindView(R.id.start_trip)
    Button startTrip;
    private HailRequestUserDetailsClass hailRequestUserDetailsClass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_texi__hail_);
        ButterKnife.bind(this);
        Intent intent = getIntent();
        random  = UUID.randomUUID().toString();

        strSetPin = intent.getStringExtra("setpin");
        googlePlcaePresenter = new GooglePlcaePresenter(this);
        pickupRelative.setVisibility(View.VISIBLE);
        if (strSetPin != null) {
            pickupRelative.setVisibility(View.GONE);
        } else {
            pickupRelative.setVisibility(View.VISIBLE);
        }
        googleGeocoderPresenter = new GoogleGeocoderPresenter(this, compositeDisposable);
        if (!CommonData.strPickupAddress.isEmpty()) {
            pickupTxt.setText(CommonData.strPickupAddress);
            searchEt.requestFocus();
        } else {
            pickupTxt.requestFocus();
            if (CommonData.CurrentLocation != null && CommonData.strPickupAddress.isEmpty()) {
                strAddress = getCompleteAddressString(CommonData.Pickuplat, CommonData.Pickuplng);
                if (strAddress != null && !strAddress.isEmpty()) {
                    pickupTxt.setText(strAddress);
                    CommonData.strPickupAddress = strAddress;
                    searchEt.requestFocus();
                } else {
                    googleGeocoderPresenter.getAddressFromLocation(new LatLng(CommonData.CurrentLocation.getLatitude(), CommonData.CurrentLocation.getLongitude()),context);

                }
            }

        }

        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));

        searchEt.addTextChangedListener(watcher);
        pickupTxt.addTextChangedListener(watcher);
        searchEt.setOnFocusChangeListener(focusListener);
        pickupTxt.setOnFocusChangeListener(focusListener);
        /* setAdapter();*/
    }


    private View.OnFocusChangeListener focusListener = new View.OnFocusChangeListener() {
        public void onFocusChange(View v, boolean hasFocus) {
            switch (v.getId()) {
                case R.id.search_et:
                    blnAddress = true;
                    SetendFocus(searchEt);
                    break;
                case R.id.pickup_txt:
                    blnAddress = false;
                    SetendFocus(pickupTxt);
                    break;
            }

        }
    };
    TextWatcher watcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
        }

        @Override
        public void onTextChanged(final CharSequence charSequence, int i, int i1, int i2) {
            if (charSequence.hashCode() == searchEt.getText().hashCode()) {
                blnAddress = true;
            }

            if (charSequence.hashCode() == pickupTxt.getText().hashCode()) {
                blnAddress = false;
            }
            if (charSequence.toString().isEmpty()) {
                placeRecycleview.clearDisappearingChildren();
                /* setAdapter();*/

            } else {
                Runnable runnable = () -> getAutoCompletionText(String.valueOf(charSequence));
                if (handler != null) {
                    handler.removeCallbacksAndMessages(null);
                } else {
                    handler = new Handler();
                }
                handler.postDelayed(runnable, 100);
            }
        }

        @Override
        public void afterTextChanged(Editable editable) {
        }
    };

    public void SetendFocus(EditText editText) {
        editText.setSelection(editText.getText().length());
    }

    public void getAutoCompletionText(String inputtype) {

        if (CommonData.CurrentLocation != null) {
            googlePlcaePresenter.getAutoCompletionresult(inputtype, String.valueOf(CommonData.CurrentLocation.getLatitude()) + "," + String.valueOf(CommonData.CurrentLocation.getLongitude()), SharedHelper.getKey(context,"google_autocomplete"),random);
        } else {
            googlePlcaePresenter.getAutoCompletionresult(inputtype, "", SharedHelper.getKey(context,"google_autocomplete"),random);
        }
    }

    @OnClick({R.id.close_btn, R.id.back_img, R.id.picku_close_btn, R.id.start_trip})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.close_btn:
                searchEt.getText().clear();
                if(placeRecycleview.getVisibility() == View.GONE){
                    placeRecycleview.setVisibility(View.VISIBLE);
                }
                estimateFrameLayout.setVisibility(View.GONE);
                break;
            case R.id.back_img:
                finish();
                break;
            case R.id.picku_close_btn:
                pickupTxt.getText().clear();
                if(placeRecycleview.getVisibility() == View.GONE){
                    placeRecycleview.setVisibility(View.VISIBLE);
                }
                estimateFrameLayout.setVisibility(View.GONE);
                break;
            case R.id.start_trip:
                hailRequestUserDetailsClass = new HailRequestUserDetailsClass(activity, this::getRequestTexiHail);
                hailRequestUserDetailsClass.setCancelable(false);
                Objects.requireNonNull(hailRequestUserDetailsClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
                hailRequestUserDetailsClass.show();
                break;
        }
    }


    @Override
    public void SelectedAddress(String Address) {
        CommonData.strDropAddresss = Address;

        LatLng droplocation = getLocationFromAddress(context, Address);
        if (strSetPin == null) {
            if (blnAddress) {
                searchEt.setText(Address);
                SetendFocus(searchEt);
                CommonData.strDropAddresss = Address;
            } else {
                pickupTxt.setText(Address);
                SetendFocus(pickupTxt);
                CommonData.strPickupAddress = Address;
            }


            if (droplocation != null) {
                if (blnAddress) {
                    CommonData.Droplat = droplocation.latitude;
                    CommonData.Droplng = droplocation.longitude;
                } else {
                    CommonData.Pickuplat = droplocation.latitude;
                    CommonData.Pickuplng = droplocation.longitude;
                }
                if (!searchEt.getText().toString().isEmpty() && !pickupTxt.getText().toString().isEmpty()) {
                    Utiles.hideKeyboard(activity);
                    CommonData.strPickupAddress = pickupTxt.getText().toString();
                    CommonData.strDropAddresss = searchEt.getText().toString();
                    predictions.clear();
                    placeRecycleview.setVisibility(View.GONE);
                    tvFav.setText("");
                    getEstimateFare();
                    estimateFrameLayout.setVisibility(View.VISIBLE);
                    /*Intent intent = new Intent();
                    Bundle b = new Bundle();
                    b.putDouble("droplat", droplocation.latitude);
                    b.putDouble("droplng", droplocation.longitude);
                    intent.putExtras(b);
                    setResult(Activity.RESULT_OK, intent);
                    finish();*/
                }
            } else {
                googlePlcaePresenter.getReverseGeocoder(Address,context);
            }


        } else {
            /*CommonData.strSetpinAddress = Address;
            if (droplocation != null) {
                Utiles.hideKeyboard(activity);

                Intent intent = new Intent();
                Bundle b = new Bundle();
                b.putDouble("droplat", droplocation.latitude);
                b.putDouble("droplng", droplocation.longitude);
                intent.putExtras(b);
                setResult(Activity.RESULT_OK, intent);
                finish();
            } else {
                googlePlcaePresenter.getReverseGeocoder(Address);
            }*/
        }


    }

    @Override
    public void geocoderOnSucessful(GeocoderModel geocoderModel) {
        try {
            if (geocoderModel.getStatus().equalsIgnoreCase("OK")) {
                CommonData.strPickupAddress = geocoderModel.getResults().get(0).getFormattedAddress();
                pickupTxt.setText(CommonData.strPickupAddress);
                searchEt.requestFocus();
            } else {
                googleGeocoderPresenter.getAddressFromLocation(new LatLng(CommonData.CurrentLocation.getLatitude(), CommonData.CurrentLocation.getLongitude()),context);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void geocoderOnFailure(Throwable throwable) {

    }

    @Override
    public void GooglePlacee(List<Prediction> prediction) {
        if (predictions != null && !predictions.isEmpty()) {
            predictions.clear();
        }
        assert predictions != null;
        predictions.addAll(prediction);
        placeRecycleview.setLayoutManager(new LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false));
        placeRecycleview.setItemAnimator(new DefaultItemAnimator());
        placeRecycleview.setHasFixedSize(true);

        googlePlaceAdapter = new GooglePlaceAdapter(this, predictions, this);
        placeRecycleview.setAdapter(googlePlaceAdapter);
    }

    @Override
    public void GooglePlaceError(Response<PlacesResults> resultsResponse) {
        Log.e("TAG", "google autocompletion error body " + new Gson().toJson(resultsResponse.errorBody()));
    }

    @Override
    public void GoogleReverseGoecoder(Response<ReverseGeocoderModel> responsebody) {
        if (strSetPin == null) {
            assert responsebody.body() != null;
            if (blnAddress) {
                CommonData.Droplat = responsebody.body().getResults().get(0).getGeometry().getLocation().getLat();
                CommonData.Droplng = responsebody.body().getResults().get(0).getGeometry().getLocation().getLng();
            } else {
                CommonData.Pickuplat = responsebody.body().getResults().get(0).getGeometry().getLocation().getLat();
                CommonData.Pickuplng = responsebody.body().getResults().get(0).getGeometry().getLocation().getLng();
            }
            if (!searchEt.getText().toString().isEmpty() && !pickupTxt.getText().toString().isEmpty()) {
               /* Intent intent = new Intent();
                Bundle b = new Bundle();*/
                CommonData.strPickupAddress = pickupTxt.getText().toString();
                CommonData.strDropAddresss = searchEt.getText().toString();
                predictions.clear();
                placeRecycleview.setVisibility(View.GONE);
                tvFav.setText("");
                getEstimateFare();
                estimateFrameLayout.setVisibility(View.VISIBLE);
               /* b.putDouble("droplat", responsebody.body().getResults().get(0).getGeometry().getLocation().getLat());
                b.putDouble("droplng", responsebody.body().getResults().get(0).getGeometry().getLocation().getLng());
                intent.putExtras(b);
                setResult(Activity.RESULT_OK, intent);
                finish();*/
            }
        } else {
           /* Intent intent = new Intent();
            Bundle b = new Bundle();
            b.putDouble("droplat", responsebody.body().getResults().get(0).getGeometry().getLocation().getLat());
            b.putDouble("droplng", responsebody.body().getResults().get(0).getGeometry().getLocation().getLng());
            intent.putExtras(b);
            setResult(Activity.RESULT_OK, intent);
            finish();*/
        }
    }

    @Override
    public void OnSuccessfully(Response<ResponseBody> response) {
        try {
            assert response.body() != null;
            String message = response.body().string();
            JSONObject jsonObject = new JSONObject(message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getCurrentFocus(), context, jsonObject.optString("message"));
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void OnFailure(Response<ResponseBody> response) {

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccessEstimate(Response<EstimationModel> response) {
        Log.e("Response", String.valueOf(response));
        CommonData.strEstimationResponse = new Gson().toJson(response.body());
        try {
            assert response.body() != null;
            if (response.body().getSuccess()) {

                Log.e("response", String.valueOf(response));
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
                    timearriveFareTxt.setText("$ " + response.body().getVehicleDetailsAndFare().getFareDetails().getTravelFare());
                    // distanceTxt.setText("Distance (" + response.body().getDistanceDetails().getDistanceLable() + ")");

                    strEstimateId = response.body().getEstimationId();
                    strPaymentMode = response.body().getVehicleDetailsAndFare().getFareDetails().getPaymentMode();
                    bookingFareTxt.setText("$ " + response.body().getVehicleDetailsAndFare().getFareDetails().getBaseFare());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                //  Utiles.displayMessage(get(), context, "SomeThing Went Wrong");
            }
        } catch (Exception e) {
            // Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");
            startTrip.setEnabled(false);
            e.printStackTrace();
        }    }

    @Override
    public void OnFailureEstimate(Response<EstimationModel> response) {
        try {
            String Message = response.errorBody().string();
            Utiles.ShowError(Message,this,getCurrentFocus());
        } catch (IOException e) {
            Utiles.displayMessage(getCurrentFocus(), context, this.getResources().getString(R.string.something_went_wrong));
        }
        startTrip.setEnabled(false);
    }

    @Override
    public void OnSuccessRequestTexiHail(Response<RequestTexiHail> response) {

        assert response.body() != null;
        SharedHelper.putKey(context, "trip_id", response.body().getTripno());
        Utiles.CreateFirebaseTripData(response.body().getTripno(),context, "3");
        SharedHelper.putKey(context, "trip_mode", "hail");
        CommonData.distance = 0;
        CommonData. strDistanceBegin = "distancebegin";
        CommonData.startTime = 0;
        CommonData. currentTime = 0;
        CommonData. LastPastTime = 0;
        CommonData. p = 0;
        stopWatch.start();
        SharedHelper.putKey(context, "ride_type", "hail");
        SharedHelper.putKey(context, "starttime", getCurrentTime());
        EventBus.getDefault().post(new HailRequest("1"));
        finish();
    }

    @Override
    public void OnFailureRequestTexiHail(Response<RequestTexiHail> response) {
        Log.e("onFailureResponse", "OnFailureRequestTexiHail" + String.valueOf(response));
    }

    @SuppressLint("LongLogTag")
    private String getCompleteAddressString(double LATITUDE, double LONGITUDE) {
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

    @Override
    protected void onDestroy() {
        super.onDestroy();
        compositeClreate(compositeDisposable);
        clearInstance();
        try {
            if(hailRequestUserDetailsClass!=null &&hailRequestUserDetailsClass.isShowing()){
                hailRequestUserDetailsClass.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public LatLng getLocationFromAddress(Context context, String strAddress) {

        Geocoder coder = new Geocoder(context);
        List<Address> address;
        LatLng p1 = null;

        try {
            // May throw an IOException
            address = coder.getFromLocationName(strAddress, 5);
            if (address == null) {
                return null;
            }
            if (address.isEmpty()) {
                return null;
            }
            Address location = address.get(0);
            p1 = new LatLng(location.getLatitude(), location.getLongitude());

        } catch (IOException ex) {

            ex.printStackTrace();
        }

        return p1;
    }
    private void getEstimateFare() {
        Log.e("Token", SharedHelper.getKey(activity.getApplicationContext(), "token"));

        EstimationFarePresenter estimationFarePresenter = new EstimationFarePresenter(this);
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("tripType", "daily");
        map.put("paymentMode", "Cash");
        map.put("time", "");
        map.put("pickupCity", "");
        estimationFarePresenter.getEstimationFare(map, activity);
    }

    private void getRequestTexiHail(HailModel hailModel) {
        RequestTexiHailPresenter requestTexiHailPresenter = new RequestTexiHailPresenter(this);
        HashMap<String, String> map = new HashMap<>();
        map.put("promo", "");
        map.put("promoAmt", "");
        map.put("paymentMode", strPaymentMode);
        map.put("bookingType", "hailRide");
        map.put("requestFrom", "app");
        map.put("serviceType", SharedHelper.getKey(context, "type"));
        map.put("estimationId", strEstimateId);
        map.put("tripTime", "");
        map.put("tripType", "daily");
        map.put("pickupCity", "");
        map.put("fname", hailModel.getStrfName());
        map.put("lname", hailModel.getStrlName());
        map.put("email", hailModel.getStrEmail());
        map.put("phone", hailModel.getStrPhone());
        map.put("phcode", hailModel.getStrCC());
        requestTexiHailPresenter.getRequestTexiHail(map, activity);
    }
}
