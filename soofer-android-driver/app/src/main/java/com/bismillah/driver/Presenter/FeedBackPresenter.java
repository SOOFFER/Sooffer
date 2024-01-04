package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.content.Context;
import androidx.annotation.NonNull;
import android.util.Log;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.FeedbackModel;
import com.bismillah.driver.Model.UpdateLocationModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;

import java.util.HashMap;

import okhttp3.ResponseBody;
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
                        if (response.isSuccessful() && response.body() != null) {
                            Utiles.CommonToast(activity, response.body().getMessage());

                        } else {
                            Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<FeedbackModel> call,@NonNull  Throwable t) {
                        //  CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public void UpdateLocation(HashMap<String, String> map, Context context) {
        if (retrofitGenerator == null) {
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<UpdateLocationModel> call = service.UpdateLocation(SharedHelper.getKey(context, "token"), map);
            call.enqueue(new Callback<UpdateLocationModel>() {
                @Override
                public void onResponse(@NonNull Call<UpdateLocationModel> call, @NonNull Response<UpdateLocationModel> response) {
                    retrofitGenerator = null;
                    if (response.isSuccessful()) {
                        assert response.body() != null;
                        if(response.body().getAttendance()!=null){
                            SharedHelper.putKey(context, "attendance",response.body().getAttendance().toString());
                        }
//
                        Log.e("tag", "Succcess update location");
                    } else {
                        Log.e("tag", "Succcess failed to location");
                    }

                }

                @Override
                public void onFailure(@NonNull Call<UpdateLocationModel> call, @NonNull Throwable t) {
                    Log.e("tag", "Succcess Failure location");
                    retrofitGenerator = null;
                }
            });
        }


    }
}
