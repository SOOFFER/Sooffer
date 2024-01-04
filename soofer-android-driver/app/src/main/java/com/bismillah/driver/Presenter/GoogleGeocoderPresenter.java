package com.bismillah.driver.Presenter;


import android.content.Context;

import com.google.android.gms.maps.model.LatLng;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;


import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;


/**
 * Created by com on 18-May-18.
 */

public class GoogleGeocoderPresenter {
    public RetrofitGenerator retrofitGenerator = null;

    private CompositeDisposable disposable;
    private GoogleGeoCoderView googleGeoCoderView;

    public GoogleGeocoderPresenter(GoogleGeoCoderView googleGeoCoderView, CompositeDisposable disposable) {
        this.googleGeoCoderView = googleGeoCoderView;
        this.disposable = disposable;
    }

    public void getAddressFromLocation(LatLng latLng, Context context) {

        if (retrofitGenerator == null) {
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRx2JavaRetrofit().create(ApiInterface.class);
            disposable.add(service.getAddressFromLocation(String.valueOf(latLng.latitude) + "," + String.valueOf(latLng.longitude), SharedHelper.getKey(context,"google_key"))
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread()).subscribe(this::OnsucessFull, this::OnError));

        }
    }

    private void OnsucessFull(GeocoderModel geocoderModel) {
        retrofitGenerator = null;
        googleGeoCoderView.geocoderOnSucessful(geocoderModel);
    }

    private void OnError(Throwable throwable) {
        retrofitGenerator = null;
        googleGeoCoderView.geocoderOnFailure(throwable);
    }

    public interface GoogleGeoCoderView {

        void geocoderOnSucessful(GeocoderModel geocoderModel);

        void geocoderOnFailure(Throwable throwable);


    }
}
