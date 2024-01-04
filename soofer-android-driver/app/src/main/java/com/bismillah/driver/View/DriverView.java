package com.bismillah.driver.View;

import com.bismillah.driver.Model.AttendanceModel;
import com.bismillah.driver.Model.ListVehicleModel;
import com.bismillah.driver.Model.OnlineOflline;

import java.util.List;

import retrofit2.Response;

public interface DriverView {
    void OnlineSuccess(retrofit2.Response<OnlineOflline> Response, String status);

    void OnlineFailed(retrofit2.Response<OnlineOflline> Response, String status);

    void VehicleListsuccessFully(Response<List<ListVehicleModel>> response);

    void VehicleListFailure(Response<List<ListVehicleModel>> response);

    void AttendanceSuccess(Response<AttendanceModel> response);

    void AttendanceFailed(Response<AttendanceModel> response);
}

