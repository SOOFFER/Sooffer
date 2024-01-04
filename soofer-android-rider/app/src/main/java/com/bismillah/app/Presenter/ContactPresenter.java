package com.bismillah.app.Presenter;

import android.app.Activity;
import android.content.Context;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.AddContactModel;
import com.bismillah.app.Model.ContactlistModel;
import com.bismillah.app.Model.DeleteContactModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.ContactView;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ContactPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public ContactView contactView;

    public ContactPresenter(ContactView contactView) {
        this.contactView = contactView;

    }

    public void getContactList(final Activity activity, Context context) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<ContactlistModel>> call = service.getContactList(SharedHelper.getKey(context, "token"));
                call.enqueue(new Callback<List<ContactlistModel>>() {
                    @Override
                    public void onResponse(Call<List<ContactlistModel>> call, Response<List<ContactlistModel>> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            contactView.OnSuccessfully(response);

                        } else {
                            contactView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<List<ContactlistModel>> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void DeleteContact(HashMap<String, String> map, final Activity activity, final int position) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<DeleteContactModel> call = service.getDeleteContact(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<DeleteContactModel>() {
                    @Override
                    public void onResponse(Call<DeleteContactModel> call, Response<DeleteContactModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            contactView.DeleteSuccessfully(response, position);

                        } else {
                            contactView.DeleteFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<DeleteContactModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public void AddContactModel(HashMap<String, String> map, final Activity activity) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddContactModel> call = service.getAddContact(SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<AddContactModel>() {
                    @Override
                    public void onResponse(Call<AddContactModel> call, Response<AddContactModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            contactView.AddSuccessfully(response);
                        } else {
                            contactView.AddFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<AddContactModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }
}
