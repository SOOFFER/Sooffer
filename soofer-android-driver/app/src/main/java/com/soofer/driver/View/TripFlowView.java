package com.soofer.driver.View;


import com.soofer.driver.Model.ImageUploadModel;
import com.soofer.driver.Model.TripFlowModel;
import retrofit2.Response;

public interface TripFlowView {

    void OnSuccessfullys(Response<TripFlowModel> Response);

    void OnFailures(Response<TripFlowModel> Response);

    void OnSuccessfullyUpload(Response<ImageUploadModel> Response);

    void OnFailureUpload(Response<ImageUploadModel> Response);
}
