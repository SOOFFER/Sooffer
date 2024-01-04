package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.FeedbackModel;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PaypalPresenter {

    public RetrofitGenerator retrofitGenerator = null;

    private Activity activity;

    private paymentView paymentView;

    public PaypalPresenter(Activity activity, paymentView paymentView) {
        this.activity = activity;
        this.paymentView = paymentView;

    }

    public void getpayment(HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<FeedbackModel> call = service.getPaypalBuy(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<FeedbackModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FeedbackModel> call, @NonNull Response<FeedbackModel> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            paymentView.onSuccesPayment(response);
                        } else {
                            paymentView.onSuccesPayment(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<FeedbackModel> call, @NonNull Throwable t) {
                        Utiles.CommonToast(activity, activity.getString(R.string.poor_network));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public interface paymentView {

        void onSuccesPayment(Response<FeedbackModel> response);

        void OnFailurePayment(Response<FeedbackModel> response);
    }
}
