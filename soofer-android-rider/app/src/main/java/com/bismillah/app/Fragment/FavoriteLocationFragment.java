package com.bismillah.app.Fragment;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.bismillah.app.Activity.SetPinLocationActivity;
import com.bismillah.app.Adapter.FavouriteAdapter;
import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.EventBus.AddFavoriteEvent;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.bismillah.app.GooglePlace.GooglePlcaeModel.Prediction;
import com.bismillah.app.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.bismillah.app.Model.ProfileModel;
import com.bismillah.app.Presenter.GooglePlcaePresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.GoogleAutoPlaceView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import okhttp3.ResponseBody;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class FavoriteLocationFragment extends BaseFragment implements GoogleAutoPlaceView, FavouriteAdapter.FavoriteLocation {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.menu_img)
    ImageButton menuImg;
    @BindView(R.id.header)
    RelativeLayout header;
    Unbinder unbinder;
    @BindView(R.id.place_recycleview)
    RecyclerView placeRecycleview;
    private GooglePlcaePresenter googlePlcaePresenter;

    public Activity activity;
    public Context context;
    public FragmentManager fragmentManager;
    public FavoriteLocationFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_favorite_location, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        googlePlcaePresenter = new GooglePlcaePresenter(this);
        try {
            CommonData.addressList.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
        String favorite = SharedHelper.getKey(activity,"favorite");
        if(!favorite.isEmpty()){
            Type type = new TypeToken<List<ProfileModel.Address>>(){}.getType();
            CommonData.addressList= new Gson().fromJson(favorite, type);
        }
        fragmentManager = getFragmentManager();

        setAdapter();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
        if(EventBus.getDefault().isRegistered(this)){
            EventBus.getDefault().unregister(this);
        }
    }

    @Optional
    @OnClick({R.id.back_img, R.id.menu_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.menu_img:
                CommonData.HeaderTitle = "Add Favorite Location";
                Intent intents = new Intent(context, SetPinLocationActivity.class);
                startActivity(intents);
                break;
        }
    }

    @Override
    public void GooglePlacee(List<Prediction> prediction) {

    }

    @Override
    public void GooglePlaceError(Response<PlacesResults> resultsResponse) {

    }

    @Override
    public void GoogleReverseGoecoder(Response<ReverseGeocoderModel> response) {

    }

    @Override
    public void OnSuccessfully(Response<ResponseBody> response) {
        try {
            assert response.body() != null;
            String message = response.body().string();
            JSONObject jsonObject = new JSONObject(message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void OnFailure(Response<ResponseBody> response) {
        try {
            assert response.errorBody() != null;
            String Message = response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, activity.getString(R.string.something_went_wrong));
        }
    }

    public void setAdapter() {
        if (CommonData.addressList != null ) {
            placeRecycleview.setLayoutManager(new LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false));
            placeRecycleview.setItemAnimator(new DefaultItemAnimator());
            FavouriteAdapter favouriteAdapter = new FavouriteAdapter(activity, this);
            placeRecycleview.setAdapter(favouriteAdapter);
        }

    }

    @Override
    public void favoriteLocation(int position, boolean isadded) {
        if(!isadded){
            googlePlcaePresenter.getDeteleteAddress(activity, CommonData.addressList.get(position).getId());
        }

    }

    @Override
    public void onStart() {
        super.onStart();
        if(!EventBus.getDefault().isRegistered(this)){
            EventBus.getDefault().register(this);
        }
    }
    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(AddFavoriteEvent event) {
        setAdapter();
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }
}
