package com.soofer.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;


import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.ForgetPasswordModel;
import com.soofer.driver.Model.OTPVerificationModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.ForgetPasswordView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Created by com on 26-May-18.
 */

public class ForgetPasswordPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public ForgetPasswordView forgetPasswordView;
    Activity activity;

    public ForgetPasswordPresenter(Activity activity, ForgetPasswordView forgetPasswordView) {
        this.activity = activity;
        this.forgetPasswordView = forgetPasswordView;
    }

    public void SendEamilTOGenerateOPT(String email) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ForgetPasswordModel> call = service.getSendOPTChangesPaassword(SharedHelper.getKey(activity.getApplicationContext(), "token"), email);
                call.enqueue(new Callback<ForgetPasswordModel>() {
                    @Override
                    public void onResponse(Call<ForgetPasswordModel> call, Response<ForgetPasswordModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            forgetPasswordView.OnSuccessfully(response);
                        } else {
                            forgetPasswordView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<ForgetPasswordModel> call, Throwable t) {
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

    public void OTPVerification(HashMap<String, String> email) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<OTPVerificationModel> call = service.getChangePassword(SharedHelper.getKey(activity.getApplicationContext(), "token"), email);
                call.enqueue(new Callback<OTPVerificationModel>() {
                    @Override
                    public void onResponse(@NonNull Call<OTPVerificationModel> call, @NonNull Response<OTPVerificationModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            forgetPasswordView.OnOtpSuccessfully(response);
                        } else {
                            forgetPasswordView.OnOtpFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<OTPVerificationModel> call, Throwable t) {
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
