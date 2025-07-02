package com.soofer.driver.View;

import com.soofer.driver.Model.AddVehicleModel;
import com.soofer.driver.Model.CarModel;
import com.soofer.driver.Model.ServiceModel;

import retrofit2.Response;

public interface CarModelView {

     void OnSuccessfullsy(Response<CarModel> Response);

    void OnFailurse(Response<CarModel> Response);

    void AddvehicleSucessfully(Response<AddVehicleModel> response);

    void AddvehicleFailure(Response<AddVehicleModel> response);

    void editVehicleSuccessfull();

    void editVehicleFauiler();

    void onSuccessServiceList(ServiceModel serviceModels);

    void onFailureService(Throwable throwable);
}
