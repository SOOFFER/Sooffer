package com.soofer.driver.View;


import com.soofer.driver.Model.TripHistoryModel;

import java.util.List;

import retrofit2.Response;

public interface TripDetailsView {
    void Onsuccess(Response<List<TripHistoryModel>> Response);

    void onFailure(Response<List<TripHistoryModel>> Response);
}
