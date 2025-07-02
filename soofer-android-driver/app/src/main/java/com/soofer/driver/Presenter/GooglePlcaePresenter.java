package com.soofer.driver.Presenter;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.soofer.driver.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.GoogleAutoPlaceView;

import org.jetbrains.annotations.NotNull;

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
                .build();

        ApiInterface service = retrofit.create(ApiInterface.class);
        Call<PlacesResults> call = service.getCityResults(input, Loction,"500", Key,"country:"+ CommonData.strCountryCode,random);
        System.out.println("enter the json response"+call.request());
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
            public void onFailure(@NotNull Call<ReverseGeocoderModel> call, @NotNull Throwable t) {

            }
        });
    }
}
