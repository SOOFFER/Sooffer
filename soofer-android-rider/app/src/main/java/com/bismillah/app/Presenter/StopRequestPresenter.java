package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StopRequestPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public StopRequestPresenter() {

    }

    public void stopProcessRequest(Activity activity, String request_id) {

        if (retrofitGenerator == null) {

            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<ResponseBody> call = service.getStopProcessRequest(SharedHelper.getKey(activity.getApplicationContext(), "token"), request_id);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                    retrofitGenerator = null;
                    System.out.println("enter the header" + response.code());
                    try {
                        System.out.println("Rrespppppp--->" + response.body().string());
                        Log.e("response", "response------------------>" + response.body().string());
                        JSONObject profileFileUploadResponse = new JSONObject(String.valueOf(response.body()));
                        Log.e("retro", "retroFileResp------------------>" + profileFileUploadResponse);
                    } catch (IOException | JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {

                }
            });

        }
    }
}
