package com.soofer.app.Presenter;

import android.app.Activity;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.ScheduleTripModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.ScheduleRequestView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ScheduleRequestPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public ScheduleRequestView setrequestView;

    public ScheduleRequestPresenter(ScheduleRequestView setrequestView) {
        this.setrequestView = setrequestView;

    }

    public void setScheduleRequest(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ScheduleTripModel> call = service.setScheduleRequestapi(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<ScheduleTripModel>() {
                    @Override
                    public void onResponse(Call<ScheduleTripModel> call, Response<ScheduleTripModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            setrequestView.OnSuccessfully(response);

                        } else {
                            setrequestView.OnRequestFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<ScheduleTripModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("Enter error response" + t.getMessage());
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
