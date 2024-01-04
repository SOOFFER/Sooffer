package com.bismillah.app.Activity;

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
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.net.FetchPlaceRequest;
import com.google.android.libraries.places.api.net.PlacesClient;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.bismillah.app.Adapter.FavouriteAdapter;
import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Fragment.StopLocationFragment;
import com.bismillah.app.GooglePlace.GooglePlaceAdapter;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.Prediction;
import com.bismillah.app.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.bismillah.app.Model.LocalModel.LocalAddressStoreModel;
import com.bismillah.app.Model.ProfileModel;
import com.bismillah.app.Presenter.GoogleGeocoderPresenter;
import com.bismillah.app.Presenter.GooglePlcaePresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.GoogleAutoPlaceView;
import com.bismillah.app.View.GoogleGeoCoderView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.reactivex.disposables.CompositeDisposable;
import okhttp3.ResponseBody;
import retrofit2.Response;

import static com.bismillah.app.CommonClass.Constants.isMultipleStop;

public class GooglePlaceSearch extends AppCompatActivity implements GoogleAutoPlaceView, GooglePlaceAdapter.Callback, GoogleGeoCoderView, FavouriteAdapter.FavoriteLocation {

    @BindView(R.id.search_et)
    EditText searchEt;
    @BindView(R.id.close_btn)
    ImageButton closeBtn;

    CompositeDisposable compositeDisposable = new CompositeDisposable();

    @BindView(R.id.place_recycleview)
    RecyclerView placeRecycleview;
    GooglePlaceAdapter googlePlaceAdapter;

    List<Prediction> predictions = new ArrayList<>();
    ArrayList<LocalAddressStoreModel> localAddressStoreModel = new ArrayList<>();
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
    @BindView(R.id.add_btn)
    TextView addBtn;

    private Handler handler;
    private boolean blnAddress = true;

    GooglePlcaePresenter googlePlcaePresenter;
    GoogleGeocoderPresenter googleGeocoderPresenter;

    Context context = GooglePlaceSearch.this;
    Activity activity = GooglePlaceSearch.this;

    private String random;
    private PlacesClient placesClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_google_place_search);
        ButterKnife.bind(this);
        Intent intent = getIntent();
        strSetPin = intent.getStringExtra("setpin");
        CommonData.addressList.clear();
        String localAddress = SharedHelper.getKey(this,"recent");

        if(!localAddress.isEmpty()){
            Type type = new TypeToken<List<LocalAddressStoreModel>>(){}.getType();
            localAddressStoreModel= new Gson().fromJson(localAddress, type);

        }
        String favorite = SharedHelper.getKey(this,"favorite");
        if(!favorite.isEmpty()){
            Type type = new TypeToken<List<ProfileModel.Address>>(){}.getType();
            CommonData.addressList= new Gson().fromJson(favorite, type);
        }
        googlePlcaePresenter = new GooglePlcaePresenter(this);
        placesClient = Places.createClient(activity);
        random  = UUID.randomUUID().toString();
        if (strSetPin != null) {
            pickupRelative.setVisibility(View.GONE);
            addBtn.setVisibility(View.GONE);
        } else {
            pickupRelative.setVisibility(View.VISIBLE);
            pickupRelative.setVisibility(View.VISIBLE);
            addBtn.setVisibility(View.VISIBLE);
            isMultipleStop = false;
            if(CommonData.strVehicleCode.equalsIgnoreCase("Outstation")){
                addBtn.setVisibility(View.GONE);
            }
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
        setAdapter();
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
                setAdapter();

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
        if(inputtype.length()>=4){
            if (CommonData.CurrentLocation != null) {
                googlePlcaePresenter.getAutoCompletionresult(inputtype, CommonData.CurrentLocation.getLatitude() + "," + CommonData.CurrentLocation.getLongitude(), SharedHelper.getKey(context,"google_autocomplete"),random);
            } else {
                googlePlcaePresenter.getAutoCompletionresult(inputtype, "", SharedHelper.getKey(context,"google_autocomplete"),random);
            }
      /*  googlePlaceAdapter = new GooglePlaceAdapter(this, predictions, this);
        placeRecycleview.setAdapter(googlePlaceAdapter);*/
        }



    }

/*
    public void getAutoCompletionText(String inputtype) {

        AsyncTask.execute(() -> {
            List<AutocompletePrediction> list = getAutocomplete(placesClient, inputtype, token);
            activity.runOnUiThread(() -> {

                */
/*if ( !predictions.isEmpty()) {
                    if (favoritesLayout.getVisibility() == View.VISIBLE) {
                        favoritesLayout.setVisibility(View.GONE);
                    }

                }*//*


                predictions = list;
                //  googlePlaceAdapter.UpdateSearch(predictions);
                googlePlaceAdapter = new GooglePlaceAdapter(this, predictions, this);
                placeRecycleview.setAdapter(googlePlaceAdapter);

            });

        });

    }
*/
        @OnClick({R.id.close_btn, R.id.back_img, R.id.picku_close_btn, R.id.add_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.close_btn:
                searchEt.getText().clear();
                break;
            case R.id.back_img:
                finish();
                break;
            case R.id.picku_close_btn:
                pickupTxt.getText().clear();
                break;
            case R.id.add_btn:
                Utiles.hideKeyboard(activity);
                FragmentCalling(new StopLocationFragment(true));
                break;
        }
    }
    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(android.R.id.content, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
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

    public void setAdapter() {
        for(LocalAddressStoreModel d : localAddressStoreModel){
            ProfileModel.Address address = new ProfileModel.Address();
            address.setAddress(d.getStrAddress());
            address.setLable(d.getStrTitle());
            address.setIsvisible(true);
            ArrayList<String> latlng = new ArrayList<>();
            latlng.add(d.getStrLng());
            latlng.add(d.getStrLat());
            address.setCoords(latlng);
            CommonData.addressList.add(address);
        }
        if (CommonData.addressList != null ) {
            placeRecycleview.setLayoutManager(new LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false));
            placeRecycleview.setItemAnimator(new DefaultItemAnimator());
            FavouriteAdapter favouriteAdapter = new FavouriteAdapter(this, this);
            placeRecycleview.setAdapter(favouriteAdapter);
        }

    }


    @Override
    public void GooglePlaceError(Response<PlacesResults> resultsResponse) {
        Log.e("TAG", "google autocompletion error body " + new Gson().toJson(resultsResponse.errorBody()));

    }

    @Override
    public void GoogleReverseGoecoder(Response<ReverseGeocoderModel> responsebody) {
        if (strSetPin == null) {
            if (blnAddress) {
                CommonData.Droplat = responsebody.body().getResults().get(0).getGeometry().getLocation().getLat();
                CommonData.Droplng = responsebody.body().getResults().get(0).getGeometry().getLocation().getLng();
            } else {
                CommonData.Pickuplat = responsebody.body().getResults().get(0).getGeometry().getLocation().getLat();
                CommonData.Pickuplng = responsebody.body().getResults().get(0).getGeometry().getLocation().getLng();
            }
            if (!searchEt.getText().toString().isEmpty() && !pickupTxt.getText().toString().isEmpty()) {
                Intent intent = new Intent();
                Bundle b = new Bundle();
                CommonData.strPickupAddress = pickupTxt.getText().toString();
                CommonData.strDropAddresss = searchEt.getText().toString();
                b.putDouble("droplat", responsebody.body().getResults().get(0).getGeometry().getLocation().getLat());
                b.putDouble("droplng", responsebody.body().getResults().get(0).getGeometry().getLocation().getLng());
                b.putString("address", responsebody.body().getResults().get(0).getFormattedAddress());
                intent.putExtras(b);
                setResult(Activity.RESULT_OK, intent);
                finish();
            }
        } else {
            Intent intent = new Intent();
            Bundle b = new Bundle();
            b.putDouble("droplat", responsebody.body().getResults().get(0).getGeometry().getLocation().getLat());
            b.putDouble("droplng", responsebody.body().getResults().get(0).getGeometry().getLocation().getLng());
            b.putString("address", responsebody.body().getResults().get(0).getFormattedAddress());
            intent.putExtras(b);
            setResult(Activity.RESULT_OK, intent);
            finish();
        }


    }

    @Override
    public void OnSuccessfully(Response<ResponseBody> response) {
        try {
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

    @Override
    public void SelectedAddress(Prediction Address) {
        LocalAddressStoreModel datalist = new LocalAddressStoreModel();
        CommonData.strDropAddresss = Address.getDescription();
        datalist.setStrAddress(Address.getDescription());
        datalist.setStrAddressid(Address.getPlaceId());
        datalist.setStrTitle(Address.getStructuredFormatting().getMainText());
        List<Place.Field> placeFields = Arrays.asList(Place.Field.ADDRESS,
                Place.Field.ID,
                Place.Field.LAT_LNG);
        // Construct a request object, passing the place ID and fields array.
        FetchPlaceRequest request = FetchPlaceRequest.builder(Address.getPlaceId(), placeFields)
                .build();
        //   LatLng droplocation = getLocationFromAddress(context, Address.getDescription());
        if (strSetPin == null) {
            if (blnAddress) {
                searchEt.setText(Address.getDescription());
                SetendFocus(searchEt);
                CommonData.strDropAddresss = Address.getDescription();
            } else {
                pickupTxt.setText(Address.getDescription());
                SetendFocus(pickupTxt);
                CommonData.strPickupAddress = Address.getDescription();
            }


            placesClient.fetchPlace(request).addOnSuccessListener((response) -> {
                Place place = response.getPlace();
                LatLng queriedLocation = place.getLatLng();
                datalist.setStrLat(String.valueOf(queriedLocation.latitude));
                datalist.setStrLng(String.valueOf(queriedLocation.longitude));
                if(isVailable(Address.getPlaceId())){
                    if(this.localAddressStoreModel.isEmpty() | this.localAddressStoreModel.size() <=4){
                        this.localAddressStoreModel.add(datalist);
                    }else {
                        this.localAddressStoreModel.remove(this.localAddressStoreModel.size()-1);
                        this.localAddressStoreModel.add(datalist);
                    }
                    SharedHelper.setAddresslist(activity,"recent",this.localAddressStoreModel);
                }
                assert queriedLocation != null;
                if (blnAddress) {
                    CommonData.Droplat = queriedLocation.latitude;
                    CommonData.Droplng = queriedLocation.longitude;
                } else {
                    CommonData.Pickuplat = queriedLocation.latitude;
                    CommonData.Pickuplng = queriedLocation.longitude;
                }
                if (!searchEt.getText().toString().isEmpty() && !pickupTxt.getText().toString().isEmpty()) {
                    Utiles.hideKeyboard(activity);
                    CommonData.strPickupAddress = pickupTxt.getText().toString();
                    CommonData.strDropAddresss = searchEt.getText().toString();
                    Intent intent = new Intent();
                    Bundle b = new Bundle();
                    b.putDouble("droplat", queriedLocation.latitude);
                    b.putDouble("droplng", queriedLocation.longitude);
                    b.putString("address", Address.getDescription());
                    intent.putExtras(b);
                    setResult(Activity.RESULT_OK, intent);
                    finish();
                }
            }).addOnFailureListener((exception) -> {
                if (exception instanceof ApiException) {
                    // Handle error with given status code.
                    googlePlcaePresenter.getReverseGeocoder(Address.getDescription(),context);
                }
            });
        } else {
            CommonData.strSetpinAddress = Address.getDescription();
          /*  if (droplocation != null) {

            } else {
                googlePlcaePresenter.getReverseGeocoder(Address.getDescription());
            }*/
            placesClient.fetchPlace(request).addOnSuccessListener((response) -> {
                Place place = response.getPlace();
                LatLng queriedLocation = place.getLatLng();
                assert queriedLocation != null;
                datalist.setStrLat(String.valueOf(queriedLocation.latitude));
                datalist.setStrLng(String.valueOf(queriedLocation.longitude));
                if(isVailable(Address.getPlaceId())){
                    if(this.localAddressStoreModel.isEmpty() | this.localAddressStoreModel.size() <=4){
                        this.localAddressStoreModel.add(datalist);
                    }else {
                        this.localAddressStoreModel.remove(this.localAddressStoreModel.size()-1);
                        this.localAddressStoreModel.add(datalist);
                    }
                    SharedHelper.setAddresslist(activity,"recent",this.localAddressStoreModel);
                }
                Utiles.hideKeyboard(activity);

                Intent intent = new Intent();
                Bundle b = new Bundle();
                b.putDouble("droplat", queriedLocation.latitude);
                b.putDouble("droplng", queriedLocation.longitude);
                b.putString("address", Address.getDescription());
                intent.putExtras(b);
                setResult(Activity.RESULT_OK, intent);
                finish();
            }).addOnFailureListener((exception) -> {
                if (exception instanceof ApiException) {
                    // Handle error with given status code.
                    googlePlcaePresenter.getReverseGeocoder(Address.getDescription(),context);
                }
            });

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
    protected void onDestroy() {
        super.onDestroy();
        Utiles.compositeClreate(compositeDisposable);
        Utiles.clearInstance();
    }

    @Override
    public void favoriteLocation(int position, boolean isadded) {


            if (isadded) {
                if (blnAddress) {

                    CommonData.Droplat = Double.parseDouble(CommonData.addressList.get(position).getCoords().get(1));
                    CommonData.Droplng = Double.parseDouble(CommonData.addressList.get(position).getCoords().get(0));
                    CommonData.strDropAddresss = CommonData.addressList.get(position).getAddress();
                    searchEt.setText(CommonData.addressList.get(position).getAddress());
                    SetendFocus(searchEt);
                } else {
                    CommonData.Pickuplat = Double.parseDouble(CommonData.addressList.get(position).getCoords().get(1));
                    CommonData.Pickuplng = Double.parseDouble(CommonData.addressList.get(position).getCoords().get(0));
                    CommonData.strPickupAddress = CommonData.addressList.get(position).getAddress();
                    pickupTxt.setText(CommonData.addressList.get(position).getAddress());
                    SetendFocus(pickupTxt);
                }

                if (!searchEt.getText().toString().isEmpty() && !pickupTxt.getText().toString().isEmpty()) {
                    Utiles.hideKeyboard(activity);
                    CommonData.strPickupAddress = pickupTxt.getText().toString();
                    CommonData.strDropAddresss = searchEt.getText().toString();
                    Intent intent = new Intent();
                    Bundle b = new Bundle();
                    b.putDouble("droplat", CommonData.Droplat);
                    b.putDouble("droplng", CommonData.Droplng);
                    b.putString("address", CommonData.addressList.get(position).getAddress());
                    intent.putExtras(b);
                    setResult(Activity.RESULT_OK, intent);
                    finish();
                }
            } else {
                googlePlcaePresenter.getDeteleteAddress(activity, CommonData.addressList.get(position).getId());
            }



    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        for (Fragment fragment : getSupportFragmentManager().getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        setResult(Activity.RESULT_CANCELED, intent);
        finish();
    }
    private boolean isVailable(String id){
        for (LocalAddressStoreModel d : localAddressStoreModel){
            if(id.equalsIgnoreCase(d.getStrAddressid())){
                return false ;
            }
        }
        return true;
    }
}
