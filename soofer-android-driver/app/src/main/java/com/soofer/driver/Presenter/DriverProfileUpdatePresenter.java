package com.soofer.driver.Presenter;

import android.app.Activity;
import android.os.Build;
import androidx.annotation.RequiresApi;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.UpdatProfileModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.EditProfileView;

import java.util.HashMap;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class DriverProfileUpdatePresenter {
    public RetrofitGenerator retrofitGenerator = null;

    public EditProfileView editProfileView;

    public DriverProfileUpdatePresenter(EditProfileView editProfileView) {
        this.editProfileView = editProfileView;


    }

    public void updateProfile(HashMap<String, RequestBody> data, MultipartBody.Part multipartBody, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<UpdatProfileModel> call = service.updateProfile(SharedHelper.getKey(activity, "token"), data, multipartBody);
                call.enqueue(new Callback<UpdatProfileModel>() {
                    @RequiresApi(api = Build.VERSION_CODES.N)
                    @Override
                    public void onResponse(Call<UpdatProfileModel> call, Response<UpdatProfileModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            retrofitGenerator = null;
                            editProfileView.OnSuccessfully(response);
                        } else {
                            editProfileView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<UpdatProfileModel> call, Throwable t) {
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
