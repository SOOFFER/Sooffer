package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.FeedbackModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FeedBackPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public FeedBackPresenter() {

    }

    public void getFeedBack(final Activity activity, HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<FeedbackModel> call = service.FeedBack(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<FeedbackModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FeedbackModel> call, @NonNull Response<FeedbackModel> response) {
                        try {
                            if (response.isSuccessful() && response.body() != null) {
                                Utiles.CommonToast(activity, response.body().getMessage());

                            } else {
                                Utiles.CommonToast(activity, "Something Went Wrong");
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<FeedbackModel> call,@NonNull Throwable t) {
                        try {
                            Utiles.CommonToast(activity, "Something Went Wrong");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
