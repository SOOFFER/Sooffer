package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import org.json.JSONObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LogoutPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public LogoutPresenter() {

    }

    public void LogoutData(Activity activity) {

        if (retrofitGenerator == null) {

            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<ResponseBody> call = service.getLogout(SharedHelper.getKey(activity.getApplicationContext(), "token"));
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                    retrofitGenerator = null;
                    System.out.println("enter the header" + response.code());
                }

                @Override
                public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {

                }
            });

        }
    }
}
