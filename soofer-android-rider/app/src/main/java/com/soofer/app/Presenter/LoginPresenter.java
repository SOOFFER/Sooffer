package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.LoginModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.Loginview;

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

    public void getLogin(HashMap<String, String> data,final Activity activity) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<LoginModel> call = service.getLogin( data);
                call.enqueue(new Callback<LoginModel>() {
                    @Override
                    public void onResponse(@NonNull Call<LoginModel> call, @NonNull Response<LoginModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            loginview.LoginVIew(response);

                        } else {
                            if (response.errorBody() != null) {
                                System.out.println("zzz "+response);
                                loginview.Errorlogview(response);

                            }

                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<LoginModel> call, @NonNull Throwable t) {
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
