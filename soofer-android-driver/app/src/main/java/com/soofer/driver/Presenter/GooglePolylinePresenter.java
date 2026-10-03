package com.soofer.driver.Presenter;

import static com.soofer.driver.MainActivity.Sha1;
import static com.soofer.driver.MainActivity.random;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.maps.model.LatLng;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.Model.RoutesModel;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.GooglePolylineView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class GooglePolylinePresenter {
    static String BASE_URL = "https://maps.googleapis.com";
    public GooglePolylineView googlePolylineView;

    public GooglePolylinePresenter(GooglePolylineView googlePolylineView) {
        this.googlePolylineView = googlePolylineView;
    }


    public void getDrawPolyline(LatLng pickupLocation, LatLng dropLocation, List<LatLng> waypointList) {
        StringBuilder waypointBuilder = new StringBuilder();
        if (waypointList != null && !waypointList.isEmpty()) {
            waypointBuilder.append("optimize:true");
            for (LatLng point : waypointList) {
                waypointBuilder.append("|").append(point.latitude).append(",").append(point.longitude);
            }
        }
        String waypoints = waypointBuilder.toString();
        String pickupString = pickupLocation.latitude + "," + pickupLocation.longitude;
        String dropString = dropLocation.latitude + "," + dropLocation.longitude;

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(RetrofitGenerator.getUnsafeOkHttpClient().build())
                .build();

        ApiInterface service = retrofit.create(ApiInterface.class);
        Call<RoutesModel> call = service.drawPolyline(pickupString, dropString, Constants.GoogleDirectionApi,waypoints,"country:"+ CommonData.strCountryCode,random,"com.soofer.driver",Sha1);
        call.enqueue(new Callback<RoutesModel>() {
            @Override
            public void onResponse(@NonNull Call<RoutesModel> call, @NonNull Response<RoutesModel> response) {
                if (response.isSuccessful() && response.body() != null) {
                    System.out.println("RESPONSE:::"+response.body().getStatus());
                    if(response.body().getStatus().equalsIgnoreCase("OK")) {
                        googlePolylineView.googlePolylineSuccess(response);
                    }
                } else {
                    googlePolylineView.googlePolylineFailure(response);
                }
            }

            @Override
            public void onFailure(@NonNull Call<RoutesModel> call, @NonNull Throwable t) {
                Log.e("tag", "google Place error response" + t.getMessage());
            }
        });
    }
    
}

