package com.soofer.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;


import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.CancelTripModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.CancelView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class CancelTripPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public CancelView cancelView = null;

    public CancelTripPresenter(CancelView cancelView) {
        this.cancelView = cancelView;
    }

    public void CancelTrip(String Tripid, final Activity activity,String reason) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<CancelTripModel> call = service.CancelTrip(SharedHelper.getKey(activity.getApplicationContext(), "token"), Tripid, reason);
                call.enqueue(new Callback<CancelTripModel>() {
                    @Override
                    public void onResponse(@NonNull Call<CancelTripModel> call, @NonNull Response<CancelTripModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            cancelView.OnSuccessfullyy(response);

                        } else {
                            cancelView.OnFailuree(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<CancelTripModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the cancel request error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
