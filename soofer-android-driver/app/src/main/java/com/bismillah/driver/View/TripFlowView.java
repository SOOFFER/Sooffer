package com.bismillah.driver.View;


import com.bismillah.driver.Model.ImageUploadModel;
import com.bismillah.driver.Model.TripFlowModel;
import retrofit2.Response;

public interface TripFlowView {

    void OnSuccessfullys(Response<TripFlowModel> Response);

    void OnFailures(Response<TripFlowModel> Response);

    void OnSuccessfullyUpload(Response<ImageUploadModel> Response);

    void OnFailureUpload(Response<ImageUploadModel> Response);
}
