package com.soofer.app.View;



import com.soofer.app.Model.TripHistoryModel;

import java.util.List;

import retrofit2.Response;

public interface TripDetailsView {
    void Onsuccess(Response<List<TripHistoryModel>> Response);

    void onFailure(Response<List<TripHistoryModel>> Response);
}
