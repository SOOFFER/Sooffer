package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;


import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.ProfileModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.ProfileView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ProfilePresenter {

    public RetrofitGenerator retrofitGenerator = null;

    public ProfileView profileView;

    public ProfilePresenter(ProfileView profileView) {
        this.profileView = profileView;

    }

    public void getProfile(final Activity activity,Boolean status) {
        if(status){
            Utiles.ShowLoader(activity);
        }
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<ProfileModel>> call = service.getProfile( SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<List<ProfileModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<ProfileModel>> call, @NonNull Response<List<ProfileModel>> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            profileView.OnSuccessfully(response);

                        } else {
                            profileView.OnFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<List<ProfileModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the profile api"+t.getMessage());
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }


}
