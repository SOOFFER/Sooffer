package com.soofer.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.FeedbackModel;
import com.soofer.app.Model.FirebaseModel.FCMPayloadModel;
import com.soofer.app.Model.FirebaseModel.NotificationModel;
import com.soofer.app.R;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

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
                System.out.println("OBJECT::::"+data);
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

    public void sendNotificationFCMCall(final Activity activity, FCMPayloadModel data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                System.out.println("OBJECT::::"+data);
                Call<FeedbackModel> call = service.sendNotificationFCMCall(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<FeedbackModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FeedbackModel> call, @NonNull Response<FeedbackModel> response) {
                        if (response.isSuccessful() && response.body() != null) {
                        } else {
                            try {
                                assert response.errorBody() != null;
                                Utiles.CommonToast(activity, response.errorBody().string());
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
