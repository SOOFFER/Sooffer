package com.bismillah.app.Presenter;

import android.app.Activity;
import android.content.Context;


import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.ChangePasswordModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.ChangePasswordView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ChangePasswordPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public ChangePasswordView changePasswordView;

    public ChangePasswordPresenter(ChangePasswordView changePasswordView) {
        this.changePasswordView = changePasswordView;

    }

    public void ChangePasswor(HashMap<String, String> data, final Activity activity, Context context) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ChangePasswordModel> call = service.ChangePassword(SharedHelper.getKey(context, "token"), data);
                call.enqueue(new Callback<ChangePasswordModel>() {
                    @Override
                    public void onResponse(Call<ChangePasswordModel> call, Response<ChangePasswordModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            changePasswordView.OnSuccessfully(response);

                        } else {
                            changePasswordView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<ChangePasswordModel> call, Throwable t) {
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
