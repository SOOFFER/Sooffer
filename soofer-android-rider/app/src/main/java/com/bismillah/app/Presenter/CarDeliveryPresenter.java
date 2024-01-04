package com.bismillah.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.CardDeliveryModel;
import com.bismillah.app.Model.EstimationModel;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.CarDeliveryView;
import com.bismillah.app.View.EstimationView;

import java.util.HashMap;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class CarDeliveryPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public CarDeliveryView carDeliveryView;

    public CarDeliveryPresenter(CarDeliveryView carDeliveryView) {
        this.carDeliveryView = carDeliveryView;

    }

    public void submitCarDelivery(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<CardDeliveryModel> call = service.submitCarDelivery(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);

                call.enqueue(new Callback<CardDeliveryModel>() {
                    @Override
                    public void onResponse(@NonNull Call<CardDeliveryModel> call, @NonNull Response<CardDeliveryModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            carDeliveryView.OnSuccess(response);
                        } else {
                            carDeliveryView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<CardDeliveryModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
