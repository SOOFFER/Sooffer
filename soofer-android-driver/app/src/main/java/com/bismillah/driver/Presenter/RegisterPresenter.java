package com.bismillah.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;


import com.google.gson.Gson;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.OTPModel;
import com.bismillah.driver.Model.RegisterModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.RegisterView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public RegisterView registerView;

    public RegisterPresenter(RegisterView registerView) {
        this.registerView = registerView;
    }

    public void getRegisterApi(HashMap<String, String> data, Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<RegisterModel> call = service.getRegister(data);
                call.enqueue(new Callback<RegisterModel>() {
                    @Override
                    public void onResponse(Call<RegisterModel> call, Response<RegisterModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Log.e("url_register", "" + call.request().url() + "\n" + new Gson().toJson(response.body()));
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.RegisterView(response);

                        } else {
                            if (response.errorBody() != null) {
                                registerView.Errorlogview(response);
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<RegisterModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        System.out.printf("enter the error response " + t.getMessage());


                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getOTP(String data, String email_id, String cc,String otp, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<OTPModel> call = service.getOpt(data, email_id, cc,otp, SharedHelper.getToken(activity,"hash_token"));
                call.enqueue(new Callback<OTPModel>() {
                    @Override
                    public void onResponse(@NonNull Call<OTPModel> call, @NonNull Response<OTPModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.onSuccessOTP(response);
                            retrofitGenerator = null;

                        } else {
                            if (response.errorBody() != null) {
                                registerView.onFailureOTP(response);
                                retrofitGenerator = null;
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<OTPModel> call, @NotNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

}
