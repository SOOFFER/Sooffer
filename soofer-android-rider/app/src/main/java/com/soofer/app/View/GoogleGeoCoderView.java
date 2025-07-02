package com.soofer.app.View;

import com.soofer.app.GooglePlace.GooglePlcaeModel.GeocoderModel;

/**
 * Created by com on 18-May-18.
 */

public interface GoogleGeoCoderView {

    void geocoderOnSucessful(GeocoderModel geocoderModel);

    void geocoderOnFailure(Throwable throwable);


}
