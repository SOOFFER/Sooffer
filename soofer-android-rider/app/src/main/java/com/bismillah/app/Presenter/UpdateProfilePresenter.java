package com.bismillah.app.Presenter;

import android.app.Activity;
import android.content.Context;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.EditProfileModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.UpdateProfileView;

import java.util.HashMap;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class UpdateProfilePresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public UpdateProfileView updateProfileView;

    public UpdateProfilePresenter(UpdateProfileView updateProfileView) {
        this.updateProfileView = updateProfileView;

    }

    public void UpdateProfile(HashMap<String, RequestBody> data, MultipartBody.Part multipartBody, final Activity activity, Context context) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<EditProfileModel> call = service.getUpdateProfile( SharedHelper.getKey(context, "token"), data,multipartBody);
                call.enqueue(new Callback<EditProfileModel>() {
                    @Override
                    public void onResponse(Call<EditProfileModel> call, Response<EditProfileModel> response) {
                        Utiles.DismissLoader();
                        System.out.println("enter the error code"+response.code());
                        if (response.isSuccessful() && response.body() != null) {
                            retrofitGenerator = null;
                            updateProfileView.OnSuccessfully(response);

                        } else {
                            updateProfileView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<EditProfileModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the error code"+t.getMessage());
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
