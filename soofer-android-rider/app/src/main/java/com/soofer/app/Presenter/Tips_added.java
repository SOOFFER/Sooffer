package com.soofer.app.Presenter;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.R;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Tips_added {

    public RetrofitGenerator retrofitGenerator = null;

    public Tips_added() {

    }

    public void addTips(Activity activity, HashMap<String, String> map) {

        if (retrofitGenerator == null) {
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<ResponseBody> call = service.getaddTips(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                    retrofitGenerator = null;
                    System.out.println("enter the header" + response.code());
                    if(response.isSuccessful() && response.body()!=null){
                        try {
                            assert response.body() != null;
                            System.out.println("Rrespppppp--->" + response.body().string());
                            Log.e("response", "response------------------>" + response.body().string());
                            JSONObject profileFileUploadResponse = new JSONObject(String.valueOf(response.body()));
                            Log.e("retro", "retroFileResp------------------>" + profileFileUploadResponse);
                        } catch (IOException | JSONException e) {
                            e.printStackTrace();
                        }
                    }else {
                        try {
                            System.out.println("Rrespppppp error--->" + response.errorBody().string());
                            Log.e("response", "response error------------------>" + response.errorBody().string());
                            String message =response.errorBody().string();
                            JSONObject profileFileUploadResponse = new JSONObject(message);
                            if(profileFileUploadResponse.has("message")){
                                Utiles.CommonToast(activity,profileFileUploadResponse.optString("message"));
                            }else {
                                Utiles.CommonToast(activity,activity.getString(R.string.poor_network));
                            }
                        } catch (IOException | JSONException e) {
                            e.printStackTrace();
                            Utiles.CommonToast(activity,activity.getString(R.string.poor_network));
                        }
                    }

                }

                @Override
                public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                    retrofitGenerator = null;
                }
            });

        }
    }
}
