package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.content.Context;
import androidx.annotation.NonNull;
import android.util.Log;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.AddVehicleDocModel;
import com.bismillah.driver.Model.DriverDocumentModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.DocumentView;

import java.util.HashMap;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DocumentPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    public DocumentView documentView;

    public DocumentPresenter(DocumentView documentView) {
        this.documentView = documentView;

    }

    public void UploadDocuments(HashMap<String, RequestBody> data, MultipartBody.Part multipartBody, final Activity activity, Context context) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<DriverDocumentModel> call = service.DocumentUpload(SharedHelper.getKey(context, "token"), data, multipartBody);
                call.enqueue(new Callback<DriverDocumentModel>() {
                    @Override
                    public void onResponse(@NonNull Call<DriverDocumentModel> call, @NonNull Response<DriverDocumentModel> response) {
                        Utiles.DismissLoader();
                        Log.e("url_docupload", "" + call.request().url());
                        if (response.isSuccessful() && response.body() != null) {
                            documentView.DocumentSuccess(response);
                            retrofitGenerator = null;

                        } else {
                            documentView.Errorlogview(response);
                            retrofitGenerator = null;
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<DriverDocumentModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);

        }


    }

    public void UploadVehicleDocuments(HashMap<String, RequestBody> data, MultipartBody.Part multipartBody, final Activity activity, Context context) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddVehicleDocModel> call = service.uploadVehicledoc(SharedHelper.getKey(context, "token"), data, multipartBody);
                call.enqueue(new Callback<AddVehicleDocModel>() {
                    @Override
                    public void onResponse(@NonNull Call<AddVehicleDocModel> call, @NonNull Response<AddVehicleDocModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            documentView.VehicleDocSuccess(response);
                            retrofitGenerator = null;

                        } else {
                            documentView.VehicleDoFailed(response);
                            retrofitGenerator = null;
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<AddVehicleDocModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
