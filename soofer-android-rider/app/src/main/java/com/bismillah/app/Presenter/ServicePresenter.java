package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.ServiceModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.ServiceView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ServicePresenter {
    public RetrofitGenerator retrofitGenerator = null;
    private ServiceView serviceView;

    public ServicePresenter(ServiceView serviceView) {
        this.serviceView = serviceView;

    }

    public void getServiceFare(final Activity activity, HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
             //   Utiles.ShowLoader(activity);
                serviceView.show();
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ServiceModel> call = service.getServiceList( SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<ServiceModel>() {
                    @Override
                    public void onResponse(@NonNull Call<ServiceModel> call, @NonNull Response<ServiceModel> response) {
                      //  Utiles.DismissLoader();
                        retrofitGenerator =null;
                        serviceView.hide();
                      //  SharedHelper.putKey(activity,"drivergender","");
                        System.out.println("enter tyhe"+call.request().url());
                        if (response.isSuccessful() && response.body() != null) {
                            serviceView.OnSuccess(response);
                        } else {
                            serviceView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<ServiceModel> call, @NonNull Throwable t) {
                    //    SharedHelper.putKey(activity,"drivergender","");
                        System.out.println("thro "+t);
                     //   Utiles.DismissLoader();
                        serviceView.hide();
                        retrofitGenerator =null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

}
