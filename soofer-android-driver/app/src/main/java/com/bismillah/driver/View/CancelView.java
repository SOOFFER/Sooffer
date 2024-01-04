package com.bismillah.driver.View;

import com.bismillah.driver.Model.CancelTripModel;
import retrofit2.Response;

public interface CancelView {
    void OnSuccessfullyy(Response<CancelTripModel> Response);

    void OnFailuree(Response<CancelTripModel> Response);
}
