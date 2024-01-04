package com.bismillah.driver.View;


import com.bismillah.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;

/**
 * Created by com on 18-May-18.
 */

public interface GoogleGeoCoderView {

    void geocoderOnSucessful(GeocoderModel geocoderModel);

    void geocoderOnFailure(Throwable throwable);


}
