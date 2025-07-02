package com.soofer.driver.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;

import retrofit2.Call;
import retrofit2.Response;

public class StripConnectPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public Callback driverView;

    public StripConnectPresenter(Callback driverView) {
        this.driverView = driverView;

    }

    public void getStripeLogin(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<OTPModel> call = service.getStripedata( SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new retrofit2.Callback<OTPModel>() {
                    @Override
                    public void onResponse(@NonNull Call<OTPModel> call, @NonNull Response<OTPModel> response) {
                        retrofitGenerator=null;
                        Utiles.DismissLoader();
                        if(response.isSuccessful() && response.body()!=null){
                            driverView.onSuccess(response);
                        }else {
                            driverView.onFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<OTPModel> call,@NonNull Throwable t) {
                        retrofitGenerator=null;
                        Utiles.DismissLoader();
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public interface Callback{
        void onSuccess(Response<OTPModel> response);

        void onFailure(Response<OTPModel> response);
    }


}