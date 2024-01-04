package com.bismillah.app.Presenter;

import android.app.Activity;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.CancelRequestModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.RequestView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class CancelRequestPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public RequestView requestView;

    public CancelRequestPresenter(RequestView requestView) {
        this.requestView = requestView;

    }

    public void cancelRequestApi(String data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<CancelRequestModel> call = service.CancelRequest( SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<CancelRequestModel>() {
                    @Override
                    public void onResponse(Call<CancelRequestModel> call, Response<CancelRequestModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            requestView.onSuccess(response);

                        } else {
                            requestView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<CancelRequestModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
