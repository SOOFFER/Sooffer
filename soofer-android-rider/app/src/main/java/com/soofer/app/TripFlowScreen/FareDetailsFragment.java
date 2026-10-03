package com.soofer.app.TripFlowScreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.Model.ServiceModel;


import java.util.List;

import com.soofer.app.R;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

import static com.soofer.app.CommonClass.Utiles.clearInstance;
import static com.soofer.app.MainActivity.fragmentslist;


public class FareDetailsFragment extends BaseFragment {


    @BindView(R.id.service_type_image)
    ImageView serviceTypeImage;
    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.distance_fare_txt)
    TextView distanceFareTxt;
    @BindView(R.id.Time_fare_txt)
    TextView TimeFareTxt;
    @BindView(R.id.txt_car_type_name)
    TextView TxtCarTypeName;
    @BindView(R.id.schude_trip)
    Button schudeTrip;
    Unbinder unbinder;
    List<ServiceModel> servieModel;

    public FareDetailsFragment() {
        // Required empty public constructor
    }

    Activity activity;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_fare_details, container, false);

        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();

        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));

        Bundle bundle = getArguments();
        servieModel = (List<ServiceModel>) bundle.getSerializable("serviceModel");

      /*  if (servieModel != null)
        {
            for (int i = 0; i < servieModel.size(); i++)
            {
                if (CommonData.strServiceType.equalsIgnoreCase(servieModel.get(i).getType()))
                {
                    try {
                        baseFareTxt.setText("$" + servieModel.get(i).getBfare());
                        distanceFareTxt.setText("$" + servieModel.get(i).getPpm());
                        TimeFareTxt.setText("$" + servieModel.get(i).getPpmin());
                        TxtCarTypeName.setText(servieModel.get(i).getType());
                        Glide.with(activity).load(imagepath+servieModel.get(i).getImage()).diskCacheStrategy(DiskCacheStrategy.NONE)
                                .skipMemoryCache(true)
                                .override(50,50)
                                .into(serviceTypeImage);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }*/
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.schude_trip)
    public void onViewClicked()    {
        if (!fragmentslist.isEmpty())
        {
            fragmentslist.remove(fragmentslist.get(fragmentslist.size() - 1));
        }
        getFragmentManager().popBackStackImmediate();
    }
}
