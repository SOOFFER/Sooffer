package com.soofer.app.Fragment;


import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.soofer.app.Adapter.OffersAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.Model.OfferModel;
import com.soofer.app.Presenter.OffersPresenter;
import com.soofer.app.R;

import java.util.HashMap;
import java.util.List;

import com.soofer.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class OffersFragment extends BaseFragment implements OffersPresenter.offersView {


    @BindView(R.id.recy_offers)
    RecyclerView recyOffers;
    Unbinder unbinder;
    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.offers_txt)
    TextView offersTxt;

    public OffersFragment() {
        // Required empty public constructor
    }

    Activity activity;
    Context context;
    private FragmentManager fragmentManager;
    private OffersPresenter offersPresenter;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_offers, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        fragmentManager = getFragmentManager();
        offersPresenter = new OffersPresenter(this, activity);
        try {
            HashMap<String, Double> map = new HashMap<>();
            map.put("currentLat", CommonData.CurrentLocation.getLatitude());
            map.put("currentLng", CommonData.CurrentLocation.getLongitude());
            offersPresenter.getOffers(map);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        fragmentManager.popBackStackImmediate();
    }

    @Override
    public void onSuccess(Response<List<OfferModel>> Response) {
        try {
            setAdapter(Response.body());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onFailure(Response<List<OfferModel>> Response) {
        Utiles.showErrorMessage(new Gson().toJson(Response.errorBody()), activity, getView());
        offersTxt.setVisibility(View.VISIBLE);
    }

    public void setAdapter(List<OfferModel> offerModels) {
        if (offerModels != null && !offerModels.isEmpty()) {
            LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
            recyOffers.setLayoutManager(linearLayoutManager);

            OffersAdapter offersAdapter = new OffersAdapter(activity, offerModels);
            recyOffers.setAdapter(offersAdapter);
            offersTxt.setVisibility(View.GONE);
            recyOffers.setVisibility(View.VISIBLE);
        } else {
            offersTxt.setVisibility(View.VISIBLE);
            recyOffers.setVisibility(View.GONE);
        }

    }
}
