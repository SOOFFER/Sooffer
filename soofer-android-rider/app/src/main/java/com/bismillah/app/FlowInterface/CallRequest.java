package com.bismillah.app.FlowInterface;

import com.bismillah.app.Model.ServiceModel;
import com.bismillah.app.Model.TripFlowModel;

import java.util.List;

import retrofit2.Response;

public interface CallRequest {
    void callReuest();

    void ClearServiceFragment();

    void CallsummaryFragment();

    void CallEstimationfare();

    void Ridelater();

    void FareDetailFragment(List<ServiceModel> serviceModels);

    void FlowDetails(Response<TripFlowModel> Response);

    void SelectedCategory(ServiceModel.VehicleCategory ServiceType);

    void availablestatus(String availablestatus);

}
