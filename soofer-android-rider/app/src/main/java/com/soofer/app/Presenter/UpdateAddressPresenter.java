package com.soofer.app.Presenter;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import java.io.IOException;
import java.util.HashMap;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UpdateAddressPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public UpdateAddressPresenter() {

    }

    public void getUpdateAddress(final Activity activity, HashMap<String, String> data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ResponseBody> call = service.UpdateFavoriteLocation(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            try {
                                System.out.println("Rrespppppp--->" + response.body().string());
                                Log.e("response", "response------------------>" + response.body().string());


                                Utiles.CommonToast(activity, "Update successfully");

                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        } else {
                            Utiles.CommonToast(activity, "Something Went Wrong");
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
