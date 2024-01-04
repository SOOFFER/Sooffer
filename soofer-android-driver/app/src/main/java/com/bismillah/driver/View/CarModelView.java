package com.bismillah.driver.View;

import com.bismillah.driver.Model.AddVehicleModel;
import com.bismillah.driver.Model.CarModel;
import com.bismillah.driver.Model.ServiceModel;

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
