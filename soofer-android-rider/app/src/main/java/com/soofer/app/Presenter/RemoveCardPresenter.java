package com.soofer.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.RemoveCardModel;
import com.soofer.app.R;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.AddCardView;
import com.soofer.app.View.RemoveCardView;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RemoveCardPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    private RemoveCardView removeCardView;

    public RemoveCardPresenter(RemoveCardView removeCardView) {
        this.removeCardView = removeCardView;
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
                            removeCardView.OnRemoveSuccessfully(response);
                        } else {
                            removeCardView.OnRemoveFailure(response);
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
