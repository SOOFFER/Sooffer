package com.soofer.driver.Presenter;

import static com.soofer.driver.CommonClass.Utiles.CommonToast;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.TwoDriverModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.TwodriverView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TwoDriverPresenter {


    public RetrofitGenerator retrofitGenerator = null;
    public TwodriverView twodriverView;

    public TwoDriverPresenter(TwodriverView twodriverView) {
        this.twodriverView = twodriverView;

    }

    public void getTwoDriver(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<TwoDriverModel> call = service.getTwodriver(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<TwoDriverModel>() {
                    @Override
                    public void onResponse(@NonNull Call<TwoDriverModel> call, @NonNull Response<TwoDriverModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            twodriverView.OnSuccess(response);
                        } else {
                            twodriverView.OnFailure(response);
                        }

                    }
                    @Override
                    public void onFailure(@NonNull Call<TwoDriverModel> call,@NonNull Throwable t) {
                        Utiles.DismissLoader();
                        CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

}
