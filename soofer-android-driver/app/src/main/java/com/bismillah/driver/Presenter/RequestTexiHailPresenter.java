package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.RequestTexiHail;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.RequestTexiHailView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RequestTexiHailPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public RequestTexiHailView requestTexiHailView;

    public RequestTexiHailPresenter(RequestTexiHailView requestTexiHailView) {
        this.requestTexiHailView = requestTexiHailView;

    }

    public void getRequestTexiHail(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Log.e("parameteres", String.valueOf(data));
                Call<RequestTexiHail> call = service.getRequestHailTaxi(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<RequestTexiHail>() {
                    @Override
                    public void onResponse(@NonNull Call<RequestTexiHail> call, @NonNull Response<RequestTexiHail> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            requestTexiHailView.OnSuccessRequestTexiHail(response);
                        } else {
                            requestTexiHailView.OnFailureRequestTexiHail(response);
                        }

                    }
                    @Override
                    public void onFailure(@NonNull Call<RequestTexiHail> call,@NonNull Throwable t) {
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
