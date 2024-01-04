package com.bismillah.driver.Presenter;

import android.app.Activity;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.FeedBackView;

import org.jetbrains.annotations.NotNull;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FeedBAckListPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public FeedBackView feedBackView;

    public FeedBAckListPresenter(FeedBackView feedBackView) {
        this.feedBackView = feedBackView;
    }

    public void getFeedback(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ResponseBody> call = service.getFeedbackList(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(@NotNull Call<ResponseBody> call, @NotNull Response<ResponseBody> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            feedBackView.onSuccess(response);
                        } else {
                            feedBackView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NotNull Call<ResponseBody> call, @NotNull Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the expetion"+t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

}
