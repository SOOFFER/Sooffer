package com.bismillah.app.Presenter;

import android.app.Activity;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.CancelTripModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.CancelView;

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
                Call<CancelTripModel> call = service.CancelTrip(SharedHelper.getKey(activity.getApplicationContext(), "token"), Tripid,reason);
                call.enqueue(new Callback<CancelTripModel>() {
                    @Override
                    public void onResponse(Call<CancelTripModel> call, Response<CancelTripModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            cancelView.OnSuccessfully(response);

                        } else {
                            cancelView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<CancelTripModel> call, Throwable t) {
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
