package com.soofer.driver.Presenter;

import android.app.Activity;
import android.util.Log;

import com.google.gson.Gson;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.DeleteVehicle;
import com.soofer.driver.Model.ListVehicleModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.VehicleManageView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ManageVehicelPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public VehicleManageView vehicleManageView;

    public ManageVehicelPresenter(VehicleManageView vehicleManageView) {
        this.vehicleManageView = vehicleManageView;

    }

    public void getVehcleList(String driver_id, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<ListVehicleModel>> call = service.getVehicleList( SharedHelper.getKey(activity.getApplicationContext(), "token"), driver_id);
                call.enqueue(new Callback<List<ListVehicleModel>>() {
                    @Override
                    public void onResponse(@NotNull Call<List<ListVehicleModel>> call, @NotNull Response<List<ListVehicleModel>> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator =null;
                        Log.e("url_getvehile",""+call.request().url());
                        Log.e("TAG", "response:vehicle "+new Gson().toJson(response.body()) );
                        if (response.isSuccessful() && response.body() != null) {
                            vehicleManageView.OnsuccessFully(response);
                        } else {
                            vehicleManageView.OnFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NotNull Call<List<ListVehicleModel>> call, @NotNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
    public void getDeleteVehicleList(HashMap<String,String> map ,final Activity activity){
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<DeleteVehicle> call = service.DeleteVhicle( SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<DeleteVehicle>() {
                    @Override
                    public void onResponse(Call<DeleteVehicle> call, Response<DeleteVehicle> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Log.e("TAG", "response:vehicledelete "+new Gson().toJson(response.body()) );

                        if (response.isSuccessful() && response.body() != null) {
                            vehicleManageView.DeletesuccessFully(response);
                        } else {
                            vehicleManageView.DeleteFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(Call<DeleteVehicle> call, Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        Utiles.DismissLoader();
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }


}
