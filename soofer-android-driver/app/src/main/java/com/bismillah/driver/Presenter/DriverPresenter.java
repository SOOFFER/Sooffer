package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.content.Context;
import androidx.annotation.NonNull;
import android.util.Log;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.AttendanceModel;
import com.bismillah.driver.Model.ListVehicleModel;
import com.bismillah.driver.Model.OnlineOflline;
import com.bismillah.driver.Model.UpdateLocationModel;
import com.bismillah.driver.Model.UpdateVehicleModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.DriverView;


import java.util.HashMap;
import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DriverPresenter {
    private RetrofitGenerator retrofitGenerator = null,retrofitGeneratorvehicle=null,OnlineOffline =null;
    private DriverView driverView;

    public DriverPresenter(DriverView driverView) {
        this.driverView = driverView;

    }

    public void getVehcleList(String driver_id, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGeneratorvehicle == null) {
                Utiles.ShowLoader(activity);
                retrofitGeneratorvehicle = new RetrofitGenerator();
                ApiInterface service = retrofitGeneratorvehicle.getRetrofitUrl().create(ApiInterface.class);
                Call<List<ListVehicleModel>> call = service.getVehicleList( SharedHelper.getKey(activity.getApplicationContext(), "token"), driver_id);
                call.enqueue(new Callback<List<ListVehicleModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<ListVehicleModel>> call, @NonNull Response<List<ListVehicleModel>> response) {
                        Utiles.DismissLoader();
                        retrofitGeneratorvehicle = null;
                        if(driverView!=null){
                            if (response.isSuccessful() && response.body() != null) {
                                driverView.VehicleListsuccessFully(response);
                            } else {
                                driverView.VehicleListFailure(response);
                            }
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<ListVehicleModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGeneratorvehicle = null;
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public void getOnlineOffline(final String status, final Activity activity, Context context,Boolean isfrom) {
        if (Utiles.isNetworkAvailable(context)) {
            if (OnlineOffline == null) {
                if(isfrom){
                    Utiles.ShowLoader(activity);
                }

                OnlineOffline = new RetrofitGenerator();
                ApiInterface service = OnlineOffline.getRetrofitUrl().create(ApiInterface.class);
                Call<OnlineOflline> call = service.Onlineoffline( SharedHelper.getKey(context, "token"), status);
                call.enqueue(new Callback<OnlineOflline>() {
                    @Override
                    public void onResponse(@NonNull Call<OnlineOflline> call, @NonNull Response<OnlineOflline> response) {
                        Utiles.DismissLoader();
                        OnlineOffline = null;
                        if(driverView!=null){
                            if (response.isSuccessful() && response.body() != null) {
                                driverView.OnlineSuccess(response, status);

                            } else {
                                driverView.OnlineFailed(response, status);
                            }
                        }


                    }

                    @Override
                    public void onFailure(@NonNull Call<OnlineOflline> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        OnlineOffline = null;
                    }
                });
            }

        } else {
            if(isfrom){
                Utiles.showNoNetwork(activity);
            }

        }



    }

    public void UpdateVicle(HashMap<String, String> map, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<UpdateVehicleModel> call = service.UpdateVehicle( SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<UpdateVehicleModel>() {
                    @Override
                    public void onResponse(@NonNull Call<UpdateVehicleModel> call, @NonNull Response<UpdateVehicleModel> response) {
                        retrofitGenerator = null;
                        if (response.isSuccessful()) {
                            assert response.body() != null;
                            Utiles.CommonToast(activity, response.body().getMessage());
                        } else {
                            Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<UpdateVehicleModel> call, @NonNull Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
            retrofitGenerator = null;
        }

    }

    public void UpdateLocation(HashMap<String, String> map, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<UpdateLocationModel> call = service.UpdateLocation( SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<UpdateLocationModel>() {
                    @Override
                    public void onResponse(@NonNull Call<UpdateLocationModel> call, @NonNull Response<UpdateLocationModel> response) {
                        retrofitGenerator = null;
                        if (response.isSuccessful()) {
                            assert response.body() != null;
                             if(response.body().getAttendance()!=null){
                            SharedHelper.putKey(activity, "attendance",response.body().getAttendance().toString());
                        }
                            Log.e("tag", "Succcess update location");
                        } else {
                            Log.e("tag", "Succcess failed to location");
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<UpdateLocationModel> call, @NonNull Throwable t) {
                        Log.e("tag", "Succcess Failure location");
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void callAttendance(MultipartBody.Part filePart, Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if(retrofitGenerator!=null){
                retrofitGenerator = null;
            }
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AttendanceModel> call = service.callAttendance( SharedHelper.getKey(activity.getApplicationContext(), "token"), filePart);
                call.enqueue(new Callback<AttendanceModel>() {
                    @Override
                    public void onResponse(@NonNull Call<AttendanceModel> call, @NonNull Response<AttendanceModel> response) {
                        retrofitGenerator = null;
                        if(driverView!=null){
                            driverView.AttendanceSuccess(response);
                            if (response.isSuccessful() && response.body() != null) {
                                Utiles.DismissLoader();


                            } else {
                                driverView.AttendanceFailed(response);
                                Utiles.DismissLoader();
                            }
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<AttendanceModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        OnlineOffline = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
}
