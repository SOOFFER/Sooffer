package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;


import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.TripDetailsModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.TripDetailView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class TripDetailsPresenter {
    RetrofitGenerator retrofitGenerator;
    TripDetailView tripDetailView;

    public TripDetailsPresenter(TripDetailView tripDetailView) {
        this.tripDetailView = tripDetailView;
    }


    public void getTripDetails(final Activity activity, String trip_id) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<TripDetailsModel> call = service.getTripDetails(SharedHelper.getKey(activity.getApplicationContext(), "token"), trip_id);
                call.enqueue(new Callback<TripDetailsModel>() {
                    @Override
                    public void onResponse(@NonNull Call<TripDetailsModel> call, @NonNull Response<TripDetailsModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            tripDetailView.onSuccess(response);
                        } else {
                            tripDetailView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<TripDetailsModel> call, @NonNull Throwable t) {
                        Utiles.CommonToast(activity, "Something Went Wrong");
                        Utiles.DismissLoader();
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

}
