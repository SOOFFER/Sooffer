package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import android.content.Context;
import android.util.Log;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.app.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.GoogleAutoPlaceView;

import com.bismillah.app.CommonClass.Constants;

import com.bismillah.app.CommonClass.CommonData;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class GooglePlcaePresenter {
    static String BASE_URL = "https://maps.googleapis.com";
    public GoogleAutoPlaceView googleAutoPlaceView;

    RetrofitGenerator retrofitGenerator;

    public GooglePlcaePresenter(GoogleAutoPlaceView googleAutoPlaceView) {
        this.googleAutoPlaceView = googleAutoPlaceView;

    }


    public void getAutoCompletionresult(String input, String Loction, String Key,String random) {

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(RetrofitGenerator.getUnsafeOkHttpClient().build())
                .build();

        ApiInterface service = retrofit.create(ApiInterface.class);
        ArrayList<String> value = new ArrayList<>();
        value.add("place_id");
        value.add("name");
        value.add("structured_formatting");
        Call<PlacesResults> call = service.getCityResults(input, Loction,"500", Key,"country:"+ CommonData.strCountryCode,random,value);
        call.enqueue(new Callback<PlacesResults>() {
            @Override
            public void onResponse(@NonNull Call<PlacesResults> call, @NonNull Response<PlacesResults> response) {
                if (response.isSuccessful() && response.body() != null) {
                    googleAutoPlaceView.GooglePlacee(response.body().getPredictions());
                } else {
                    googleAutoPlaceView.GooglePlaceError(response);
                }

            }

            @Override
            public void onFailure(@NonNull Call<PlacesResults> call, @NonNull Throwable t) {
                Log.e("tag", "google Place error response" + t.getMessage());

            }
        });
    }

    public void getReverseGeocoder(final String Address, Context context) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Constants.GoogleGeocoderAPI)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        ApiInterface service = retrofit.create(ApiInterface.class);
        Call<ReverseGeocoderModel> call = service.getReverserGecoder(Address, SharedHelper.getKey(context,"google_key"));
        call.enqueue(new Callback<ReverseGeocoderModel>() {
            @Override
            public void onResponse(@NotNull Call<ReverseGeocoderModel> call, @NotNull Response<ReverseGeocoderModel> response) {
                if (response.isSuccessful() && response.body() != null) {
                    if (response.body().getStatus().equalsIgnoreCase("OK")) {
                        googleAutoPlaceView.GoogleReverseGoecoder(response);
                    } else {
                        getReverseGeocoder(Address,context);
                    }


                } else {
                    getReverseGeocoder(Address,context);
                }

            }

            @Override
            public void onFailure(Call<ReverseGeocoderModel> call, Throwable t) {

            }
        });
    }

    public void getDeteleteAddress(final Activity activity, String data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ResponseBody> call = service.getDeleteFavorite(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            googleAutoPlaceView.OnSuccessfully(response);
                        } else {
                            googleAutoPlaceView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
}

