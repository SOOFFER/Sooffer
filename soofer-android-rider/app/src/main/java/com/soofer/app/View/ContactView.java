package com.soofer.app.View;

import com.soofer.app.Model.AddContactModel;
import com.soofer.app.Model.ContactlistModel;
import com.soofer.app.Model.DeleteContactModel;

import java.util.List;

import retrofit2.Response;

public interface ContactView {

    void OnSuccessfully(Response<List<ContactlistModel>> Response);

    void OnFailure(Response<List<ContactlistModel>> Response);

    void DeleteSuccessfully(Response<DeleteContactModel> response, int postion);

    void DeleteFailure(Response<DeleteContactModel> response);

    void AddSuccessfully(Response<AddContactModel> response);

    void AddFailure(Response<AddContactModel> response);
}
