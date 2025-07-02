package com.soofer.driver.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;

import java.util.HashMap;


import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;


public class SubscriptionPresenter {


    //  private Activity activity;
    private CompositeDisposable disposable;
    private CommonView commonView;
    private ApiInterface apiInterface;
    private Activity activity;

    public SubscriptionPresenter(@NonNull Activity activity, @NonNull CompositeDisposable disposable, @NonNull CommonView commonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.commonView = commonView;
    }

    public void getPackageList() {
        if (apiInterface == null) {
            apiInterface = RetrofitGenerator.getRetrofitInstance();
            commonView.showLoader();
            disposable.add(apiInterface.getPackageList(SharedHelper.getKey(activity, "token"))
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribeOn(Schedulers.io())
                    .subscribe(serviceModel -> {
                        apiInterface = null;
                        commonView.dismissLoader();
                        commonView.onSuccess(serviceModel, "from package list");
                    }, throwable -> {
                        commonView.dismissLoader();
                        apiInterface = null;
                        commonView.onFailure(throwable);
                    }));
        }
    }

    public void getCreateOrder(HashMap<String, String> map) {
        if (apiInterface == null) {
            apiInterface = RetrofitGenerator.getRetrofitInstance();
            commonView.showLoader();
            disposable.add(apiInterface.CreateOrderIDApi(SharedHelper.getKey(activity, "token"), map)
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribeOn(Schedulers.io())
                    .subscribe(serviceModel -> {
                        apiInterface = null;
                        commonView.dismissLoader();
                        commonView.onSuccess(serviceModel, "from package list");
                    }, throwable -> {
                        commonView.dismissLoader();
                        apiInterface = null;
                        commonView.onFailure(throwable);
                    }));
        }
    }

    public void getConfirmPayment(HashMap<String, String> map) {
        if (apiInterface == null) {
            apiInterface = RetrofitGenerator.getRetrofitInstance();
            commonView.showLoader();
            disposable.add(apiInterface.getConfirmPaymentApi(SharedHelper.getKey(activity, "token"), map)
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribeOn(Schedulers.io())
                    .subscribe(serviceModel -> {
                        apiInterface = null;
                        commonView.dismissLoader();
                        commonView.onSuccess(serviceModel, "from package list");
                    }, throwable -> {
                        commonView.dismissLoader();
                        apiInterface = null;
                        commonView.onFailure(throwable);
                    }));
        }
    }

    public void getDriverPayoutApi(HashMap<String, String> map) {
        if (apiInterface == null) {
            apiInterface = RetrofitGenerator.getRetrofitInstance();
            commonView.showLoader();
            disposable.add(apiInterface.getDriverPayoutApi(SharedHelper.getKey(activity, "token"), map)
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribeOn(Schedulers.io())
                    .subscribe(serviceModel -> {
                        apiInterface = null;
                        commonView.dismissLoader();
                        commonView.onSuccess(serviceModel, "from payout list");
                    }, throwable -> {
                        commonView.dismissLoader();
                        apiInterface = null;
                        commonView.onFailure(throwable);
                    }));
        }
    }

    public void tripisReceivedApi(HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.tripisReceivedApi(SharedHelper.getKey(activity, "token"), map)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            apiInterface = null;
                        }, error -> {
                            apiInterface = null;
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public void getDriverDocumentListApi() {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getDriverDocumentListApi(SharedHelper.getKey(activity, "token"))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            commonView.dismissLoader();
                            commonView.onSuccess(objecs, "from payout list");
                            apiInterface = null;
                        }, error -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(error);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }public void getVehicleDocumentListApi() {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getVehicleDocumentListApi(SharedHelper.getKey(activity, "token"),Constants.strVehicleID)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            commonView.dismissLoader();
                            commonView.onSuccess(objecs, "from payout list");
                            apiInterface = null;
                        }, error -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(error);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public void getUploadDocumentApi(HashMap<String, RequestBody> data, MultipartBody.Part fileFront, MultipartBody.Part fileBack) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getUploadDocumentApi(SharedHelper.getKey(activity, "token"),data,fileFront,fileBack)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            commonView.dismissLoader();
                            commonView.onSuccess(objecs, "from payout list");
                            apiInterface = null;
                        }, error -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(error);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
    public void getVehicleUploadDocumentApi(HashMap<String, RequestBody> data, MultipartBody.Part fileFront, MultipartBody.Part fileBack) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getVehicleUploadDocumentApi(SharedHelper.getKey(activity, "token"),data,fileFront,fileBack)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            commonView.dismissLoader();
                            commonView.onSuccess(objecs, "from payout list");
                            apiInterface = null;
                        }, error -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(error);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
    public void getCountryListApi() {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getCountryListApi(SharedHelper.getKey(activity, "token"))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(serviceModel -> {
                            apiInterface = null;
                            commonView.dismissLoader();
                            commonView.onSuccess(serviceModel, "country");
                        }, throwable -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(throwable);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public void getStateListApi(String id) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getStateListApi(SharedHelper.getKey(activity, "token"), id)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(serviceModel -> {
                            apiInterface = null;
                            commonView.dismissLoader();
                            commonView.onSuccess(serviceModel, "state");
                        }, throwable -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(throwable);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public void getCityListApi(String id) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (apiInterface == null) {
                commonView.showLoader();
                apiInterface = RetrofitGenerator.getRetrofitInstance();
                disposable.add(apiInterface.getCityListApi(SharedHelper.getKey(activity, "token"), id)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(serviceModel -> {
                            apiInterface = null;
                            commonView.dismissLoader();
                            commonView.onSuccess(serviceModel, "city");
                        }, throwable -> {
                            commonView.dismissLoader();
                            apiInterface = null;
                            commonView.onFailure(throwable);
                        }));
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public interface CommonView {
        void onSuccess(Object object, String fromApi);

        void onFailure(Throwable throwable);

        void showLoader();

        void dismissLoader();
    }

}