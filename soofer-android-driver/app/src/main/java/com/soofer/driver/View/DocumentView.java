package com.soofer.driver.View;

import com.soofer.driver.Model.AddVehicleDocModel;
import com.soofer.driver.Model.DriverDocumentModel;

public interface DocumentView {
    void DocumentSuccess(retrofit2.Response<DriverDocumentModel> Response);

    void Errorlogview(retrofit2.Response<DriverDocumentModel> Response);

    void VehicleDocSuccess(retrofit2.Response<AddVehicleDocModel> Response);

    void VehicleDoFailed(retrofit2.Response<AddVehicleDocModel> Response);
}
