package com.soofer.driver.Presenter;

import android.app.Activity;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import android.util.Log;

import com.google.gson.Gson;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.ProfileView;

import org.jetbrains.annotations.NotNull;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class DriverProfilePresenter {
    public RetrofitGenerator retrofitGenerator = null;

    public ProfileView profileView;

    public DriverProfilePresenter(ProfileView profileView) {
        this.profileView = profileView;

    }

    public void getProfile(final Activity activity, boolean status) {

        if (Utiles.isNetworkAvailable(activity)) {
            if(status){
                Utiles.ShowLoader(activity);
            }
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<DriverProfileModel>> call = service.getProfile( SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<List<DriverProfileModel>>() {
                    @RequiresApi(api = Build.VERSION_CODES.N)
                    @Override
                    public void onResponse(@NotNull Call<List<DriverProfileModel>> call, @NotNull Response<List<DriverProfileModel>> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            Log.e("resuestrul",""+call.request().url());
                            profileView.OnSuccessfully(response);
                            Log.e("TAG", "response 33: "+new Gson().toJson(response.body()) );


                        } else {
                            profileView.OnFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<List<DriverProfileModel>> call, @NonNull Throwable t) {
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
