package com.soofer.app.Presenter;

import android.app.Activity;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.CancelRequestModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.RequestView;
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
