package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.EstimationModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.EstimationView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.Utiles.CommonToast;

public class EstimationFarePresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public EstimationView estimationView;

    public EstimationFarePresenter(EstimationView estimationView) {
        this.estimationView = estimationView;

    }

    public void getEstimationFare(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Log.e("parameteres", String.valueOf(data));
                Call<EstimationModel> call = service.getEstimateFare(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<EstimationModel>() {
                    @Override
                    public void onResponse(@NonNull Call<EstimationModel> call, @NonNull Response<EstimationModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            estimationView.OnSuccessEstimate(response);
                        } else {
                            estimationView.OnFailureEstimate(response);
                        }

                    }
                    @Override
                    public void onFailure(@NonNull Call<EstimationModel> call,@NonNull Throwable t) {
                        Utiles.DismissLoader();
                        CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}

