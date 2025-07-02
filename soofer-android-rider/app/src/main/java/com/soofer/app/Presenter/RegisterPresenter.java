package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.OTPModel;
import com.soofer.app.Model.RegisterModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.RegisterView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public RegisterView registerView;

    public RegisterPresenter(RegisterView registerView) {
        this.registerView = registerView;
    }

    public void getRegisterApi(HashMap<String, String> data,final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<RegisterModel> call = service.getRegister( data);
                call.enqueue(new Callback<RegisterModel>() {
                    @Override
                    public void onResponse(@NonNull Call<RegisterModel> call, @NonNull Response<RegisterModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.RegisterView(response);
                            retrofitGenerator = null;
                        } else {
                            if(response.errorBody()!=null){
                                registerView.Errorlogview(response);
                                retrofitGenerator = null;
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<RegisterModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getOTP(String data,String email ,String phcode,String otp,final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<OTPModel> call = service.getOpt(data,email,phcode,otp, SharedHelper.getToken(activity,"hash_token"));
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
                    public void onFailure(@NonNull Call<OTPModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

}
