package com.bismillah.driver.View;

import com.bismillah.driver.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.driver.GooglePlace.GooglePlcaeModel.Prediction;
import com.bismillah.driver.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Response;

public interface GoogleAutoPlaceView {

    void GooglePlacee(List<Prediction> prediction);
    void GooglePlaceError(Response<PlacesResults> resultsResponse);
    void GoogleReverseGoecoder(Response<ReverseGeocoderModel> response);
    void OnSuccessfully(Response<ResponseBody> response );
    void OnFailure(Response<ResponseBody> response);
}
