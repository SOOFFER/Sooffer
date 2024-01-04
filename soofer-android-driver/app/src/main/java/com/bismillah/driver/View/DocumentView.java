package com.bismillah.driver.View;

import com.bismillah.driver.Model.AddVehicleDocModel;
import com.bismillah.driver.Model.DriverDocumentModel;

public interface DocumentView {
    void DocumentSuccess(retrofit2.Response<DriverDocumentModel> Response);

    void Errorlogview(retrofit2.Response<DriverDocumentModel> Response);

    void VehicleDocSuccess(retrofit2.Response<AddVehicleDocModel> Response);

    void VehicleDoFailed(retrofit2.Response<AddVehicleDocModel> Response);
}
