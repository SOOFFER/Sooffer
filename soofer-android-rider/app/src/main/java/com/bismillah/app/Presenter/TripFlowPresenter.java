package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.TripFlowModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.TripFlowView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TripFlowPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public TripFlowView tripFlowView = null;

    public TripFlowPresenter(TripFlowView tripFlowView) {
        this.tripFlowView = tripFlowView;
    }

    public void TripFlowApi(String Tripid, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<TripFlowModel> call = service.TripFlowApi(SharedHelper.getKey(activity.getApplicationContext(), "token"), Tripid);
                call.enqueue(new Callback<TripFlowModel>() {
                    @Override
                    public void onResponse(@NonNull Call<TripFlowModel> call, @NonNull Response<TripFlowModel> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            tripFlowView.OnTripSuccessfully(response);

                        } else {
                            tripFlowView.OnTripFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<TripFlowModel> call, Throwable t) {
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
