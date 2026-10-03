package com.soofer.driver.Presenter;

import android.app.Activity;
import android.content.Context;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.ChangePasswordModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.ChangePasswordView;

import org.jetbrains.annotations.NotNull;

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
    public void ChangePasswor(HashMap<String, String> data, final Activity activity, Context context){
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ChangePasswordModel> call = service.ChangePassword( SharedHelper.getKey(context,"token"),data);
                call.enqueue(new Callback<ChangePasswordModel>() {
                    @Override
                    public void onResponse(@NotNull Call<ChangePasswordModel> call, @NotNull Response<ChangePasswordModel> response) {
                        Utiles.DismissLoader();
                        if(response.isSuccessful() && response.body()!=null){
                            changePasswordView.OnSuccessfully(response);

                        }else {
                            changePasswordView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<ChangePasswordModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }



    }
}
