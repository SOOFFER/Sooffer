package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.RemoveCardModel;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.AddCardView;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddCardPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    private AddCardView addCardView;
    public AddCardPresenter(AddCardView addCardView) {
        this.addCardView = addCardView;

    }

    public void addCard(final Activity activity, String data,String lastNum) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ResponseBody> call = service.AddCard(SharedHelper.getKey(activity.getApplicationContext(), "token"), data,lastNum);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            addCardView.OnSuccessfully(response);
                        } else {
                            addCardView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
    public void removeCard(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<RemoveCardModel> call = service.removeCard(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<RemoveCardModel>() {
                    @Override
                    public void onResponse(@NonNull Call<RemoveCardModel> call, @NonNull Response<RemoveCardModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            addCardView.OnRemoveSuccessfully(response);
                        } else {
                            addCardView.OnRemoveFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<RemoveCardModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

}
