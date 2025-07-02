package com.soofer.driver.View;

import com.soofer.driver.Model.DeleteVehicle;
import com.soofer.driver.Model.ListVehicleModel;

import java.util.List;

import retrofit2.Response;

public interface VehicleManageView {
    void OnsuccessFully(Response<List<ListVehicleModel>> Response);

    void OnFailure(Response<List<ListVehicleModel>> Response);

    void DeletesuccessFully(Response<DeleteVehicle> Response);

    void DeleteFailure(Response<DeleteVehicle> Response);
}
