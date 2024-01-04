package com.bismillah.app.Presenter;

import android.app.Activity;
import android.util.Log;

import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class fcMPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public fcMPresenter() {

    }

    public void getFeedBack(Activity activity, MultipartBody.Part multipartBody) {

        if (retrofitGenerator == null) {
            Utiles.ShowLoader(activity);
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<ResponseBody> call = service.getFCM();
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    retrofitGenerator = null;
                    Utiles.DismissLoader();
                    System.out.println("enter the header"+response.code());
                    try {
                        System.out.println("Rrespppppp--->"+response.body().string());
                        Log.e("response", "response------------------>" + response.body().string());
                        JSONObject profileFileUploadResponse = new JSONObject(String.valueOf(response.body()));
                        Log.e("retro", "retroFileResp------------------>" + profileFileUploadResponse);
                    } catch (IOException e) {
                        e.printStackTrace();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Utiles.DismissLoader();
                }
            });

        }
    }
}
