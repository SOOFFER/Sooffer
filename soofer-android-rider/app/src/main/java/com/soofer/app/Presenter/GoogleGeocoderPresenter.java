package com.soofer.app.Presenter;



import static com.soofer.app.MainActivity.Sha1;
import static com.soofer.app.MainActivity.random;

import android.content.Context;

import com.google.android.gms.maps.model.LatLng;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.GoogleGeoCoderView;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

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
            ApiInterface service = retrofitGenerator.getRxJavaRetrofit().create(ApiInterface.class);
            disposable.add(service.getAddressFromLocation(String.valueOf(latLng.latitude) + "," + String.valueOf(latLng.longitude), Constants.GoogleDirectionkey,"country:"+ CommonData.strCountryCode,random,"com.soofer.app",Sha1)
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
}
