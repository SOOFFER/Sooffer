package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.R;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.EstimationView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


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
                Call<EstimationModel> call = service.getEstimationFare(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);

                call.enqueue(new Callback<EstimationModel>() {
                    @Override
                    public void onResponse(@NonNull Call<EstimationModel> call, @NonNull Response<EstimationModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            estimationView.OnSuccess(response);
                        } else {
                            estimationView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<EstimationModel> call, @NonNull Throwable t) {
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
