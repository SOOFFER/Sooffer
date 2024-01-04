package com.bismillah.driver.View;


import com.bismillah.driver.Model.ScheduleCancelModel;
import com.bismillah.driver.Model.scheduleTripListModel;

import java.util.List;

import retrofit2.Response;

public interface ScheduleListView {

    void Onsuccess(Response<List<scheduleTripListModel>> Response);

    void onFailure(Response<List<scheduleTripListModel>> Response);

    void OnCancelScheduleSuccess(Response<ScheduleCancelModel> Response, int position);

    void onCancelScheduleFailure(Response<ScheduleCancelModel> Response);
}
