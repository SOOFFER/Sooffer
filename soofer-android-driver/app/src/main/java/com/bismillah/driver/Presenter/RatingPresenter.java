package com.bismillah.driver.Presenter;

import android.app.Activity;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.RatingModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.RatingView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RatingPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public RatingView ratingView;

    public RatingPresenter(RatingView ratingView) {
        this.ratingView = ratingView;
    }

    public void getRating(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<RatingModel>> call = service.getRating(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<List<RatingModel>>() {
                    @Override
                    public void onResponse(Call<List<RatingModel>> call, Response<List<RatingModel>> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            ratingView.onSuccess(response);
                        } else {
                            ratingView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<List<RatingModel>> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the rating error"+t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

}
