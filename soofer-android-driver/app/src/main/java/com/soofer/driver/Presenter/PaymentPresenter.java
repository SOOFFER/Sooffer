package com.soofer.driver.Presenter;

import android.app.Activity;

import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.PaymentModel;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.PaymentView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PaymentPresenter  {
    private RetrofitGenerator retrofitGenerator = null;
    public PaymentView paymentView;

    public PaymentPresenter(PaymentView paymentView) {
        this.paymentView = paymentView;
    }

    public void submitpayment(HashMap<String,String> data , Activity activity){
        if (Utiles.isNetworkAvailable(activity)) {
            if(retrofitGenerator == null){
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<PaymentModel> call = service.submitPayment( data);
                call.enqueue(new Callback<PaymentModel>() {
                    @Override
                    public void onResponse(Call<PaymentModel> call, Response<PaymentModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            paymentView.PaymentView(response);
                        } else {
                            if (response.errorBody() != null) {
                                paymentView.Errorpaymentview(response);
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<PaymentModel> call, Throwable t) {

                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }


}
