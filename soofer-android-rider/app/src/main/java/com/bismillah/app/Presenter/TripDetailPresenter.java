package com.bismillah.app.Presenter;

import android.app.Activity;
import android.util.Log;


import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.TripHistoryModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.TripDetailsView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class TripDetailPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    TripDetailsView tripDetailsView;

    public TripDetailPresenter(TripDetailsView tripDetailsView) {
        this.tripDetailsView = tripDetailsView;
    }

    public void getTripHistory(final Activity activity, HashMap<String,String > map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<TripHistoryModel>> call = service.getTripHistory(SharedHelper.getKey(activity.getApplicationContext(), "token"),map);
                call.enqueue(new Callback<List<TripHistoryModel>>() {
                    @Override
                    public void onResponse(@NotNull Call<List<TripHistoryModel>> call, @NotNull Response<List<TripHistoryModel>> response) {
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {

                            Utiles.DismissLoader();
                            tripDetailsView.Onsuccess(response);
                        } else {
                            tripDetailsView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NotNull Call<List<TripHistoryModel>> call, @NotNull Throwable t) {
                        Log.e("tag", "trip history api exception" + t.getMessage());
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

}
