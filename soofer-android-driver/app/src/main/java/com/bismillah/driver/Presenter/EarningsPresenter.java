package com.bismillah.driver.Presenter;

import android.app.Activity;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.EarningsModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.EarningsView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EarningsPresenter {

    private RetrofitGenerator retrofitGenerator = null;
    public EarningsView earningsView;

    public EarningsPresenter(EarningsView earningsView) {
        this.earningsView = earningsView;
    }

    public void getRating(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<EarningsModel> call = service.getEarings(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<EarningsModel>() {
                    @Override
                    public void onResponse(Call<EarningsModel> call, Response<EarningsModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            earningsView.onSuccess(response);
                        } else {
                            earningsView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<EarningsModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the rating error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

}
