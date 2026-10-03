package com.soofer.app.Presenter;

import android.app.Activity;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import java.util.HashMap;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

public class NotificationPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    Activity activity;
    private CompositeDisposable disposable;
    private CommonInterface polyGonView;

    public NotificationPresenter(Activity activity, CompositeDisposable disposable, CommonInterface polyGonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.polyGonView = polyGonView;
    }

    public void getWalletTransactonHistory(HashMap<String,String> City) {

        if (retrofitGenerator == null) {
            polyGonView.showLoader();
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRxBaseService().create(ApiInterface.class);
            disposable.add(service.getNotification(SharedHelper.getKey(activity, "token"), City)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread()).subscribe(res -> {
                        polyGonView.onSuccess(res);
                        polyGonView.dismissLoader();
                        retrofitGenerator =null;
                    }, throwable -> {
                        polyGonView.onFailure(throwable);
                        polyGonView.dismissLoader();
                        retrofitGenerator =null;
                    }));

        }
    }




    public interface CommonInterface {

        void onSuccess(Object object);

        void onFailure(Throwable object);

        void showLoader();

        void dismissLoader();
    }

}
