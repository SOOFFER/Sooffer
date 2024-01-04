package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.FeedbackModel;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SentEmegencyPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public SentEmegencyPresenter() {

    }

    public void getsentEmercency(final Activity activity, String map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<FeedbackModel> call = service.getsentEmergency(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<FeedbackModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FeedbackModel> call, @NonNull Response<FeedbackModel> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            Utiles.CommonToast(activity, response.body().getMessage());

                        } else {
                            try {
                                assert response.errorBody() != null;
                                Utiles.displayMessage(activity.getCurrentFocus(), activity, response.errorBody().string());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Utiles.CommonToast(activity, activity.getString(R.string.poor_network));
                            }
                        }

                    }
                    @Override
                    public void onFailure(@NonNull Call<FeedbackModel> call, @NonNull Throwable t) {
                        Utiles.CommonToast(activity, activity.getString(R.string.poor_network));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
