package com.soofer.driver.Presenter;

import android.app.Activity;
import android.util.Log;


import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.LoginModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.Loginview;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class LoginPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public Loginview loginview;

    public LoginPresenter(Loginview loginview) {
        this.loginview = loginview;
    }

    public void getLogin(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<LoginModel> call = service.getLogin( data);
                call.enqueue(new Callback<LoginModel>() {
                    @Override
                    public void onResponse(Call<LoginModel> call, Response<LoginModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            loginview.LoginVIew(response);

                        } else {
                            if (response.errorBody() != null) {
                                loginview.Errorlogview(response);
                            }

                        }
                    }

                    @Override
                    public void onFailure(Call<LoginModel> call, Throwable t) {
                        Log.d("LoginResposnse", "LoginResposnse: "+t.toString());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
