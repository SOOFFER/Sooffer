package com.bismillah.driver.FlowInterface;

import com.bismillah.driver.Model.TripFlowModel;

import retrofit2.Response;

public interface RequestInterface {
    void TripFragment();

    void summaryFragment();

    void ClearFragment();

    void CallCancelFragment();

    void ClearAllFragment();

    void FlowDetails(Response<TripFlowModel> Response);
}
