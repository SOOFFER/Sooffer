package com.soofer.app.FlowInterface;

import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Model.TripFlowModel;

import java.util.List;

import retrofit2.Response;

public interface CallRequest {
    void callReuest();

    void ClearServiceFragment();

    void CallsummaryFragment();

    void CallEstimationfare();

    void FareDetailFragment(List<ServiceModel> serviceModels);

    void FlowDetails(Response<TripFlowModel> Response);

    void SelectedCategory(ServiceModel.VehicleCategory ServiceType);

    void availablestatus(String availablestatus);

}
