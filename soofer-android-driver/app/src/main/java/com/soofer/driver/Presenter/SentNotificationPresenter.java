package com.soofer.driver.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.FeedbackModel;
import com.soofer.driver.Model.FirebaseModel.NotificationModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SentNotificationPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public SentNotificationPresenter() {

    }

    public void sendNotificationFCM(final Activity activity, NotificationModel data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<FeedbackModel> call = service.sendNotificationFCM(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<FeedbackModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FeedbackModel> call, @NonNull Response<FeedbackModel> response) {
                        if (response.isSuccessful() && response.body() != null) {

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
