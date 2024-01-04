package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.RequestModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.SetrequestView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class RequestFlowPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public SetrequestView setrequestView;

    public RequestFlowPresenter(SetrequestView setrequestView) {
        this.setrequestView = setrequestView;

    }

    public void setRequesApi(HashMap<String, String> data, final Activity activity,String requestType) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<RequestModel> call =null;
                switch (requestType){
                    case "normal":
                        call = service.setRequestapi( SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                        break;
                    case "rental":
                        call = service.setRequestRental( SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                        break;
                        case "outstation":
                        call = service.setOutStationRequest( SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                        break;
                }

                assert call != null;
                call.enqueue(new Callback<RequestModel>() {
                    @Override
                    public void onResponse(@NonNull Call<RequestModel> call, @NonNull Response<RequestModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            setrequestView.OnSuccessfully(response);

                        } else {
                            setrequestView.OnRequestFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<RequestModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("Enter error response"+t.getMessage());
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }



    }
}
