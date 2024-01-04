package com.bismillah.app.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.cardview.widget.CardView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.FontChangeCrawler;


import com.bismillah.app.R;

import com.bismillah.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class FaqFragment extends BaseFragment {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.how_to_card)
    CardView howToCard;
    @BindView(R.id.faeture_card)
    CardView faetureCard;
    @BindView(R.id.general_card)
    CardView generalCard;
    @BindView(R.id.rider_card)
    CardView riderCard;
    @BindView(R.id.driver_card)
    CardView driverCard;
    Unbinder unbinder;
    Fragment fragment;


    public FaqFragment() {
        // Required empty public constructor
    }

    Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_faq, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.how_to_card, R.id.faeture_card, R.id.general_card, R.id.rider_card, R.id.driver_card})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.how_to_card:
                CommonData.strHeaderTitle = getString(R.string.book_cancel);
                CommonData.strdiscription = getString(R.string.simply_tab);
                CommonData.strTitle = context.getResources().getString(R.string.how_to);
                fragment = new CommonFaqFragment();
                FragmentCalling(fragment);
                break;
            case R.id.faeture_card:
                break;
            case R.id.general_card:
                CommonData.strHeaderTitle = getString(R.string.how_workings);
                CommonData.strdiscription = getString(R.string.login_to_the_rider);
                CommonData.strTitle = context.getResources().getString(R.string.general);
                fragment = new CommonFaqFragment();
                FragmentCalling(fragment);
                break;
            case R.id.rider_card:
                CommonData.strHeaderTitle = getString(R.string.signups_as);
                CommonData.strdiscription = getString(R.string.appstore);
                CommonData.strTitle = context.getResources().getString(R.string.rider);
                fragment = new CommonFaqFragment();
                FragmentCalling(fragment);
                break;
            case R.id.driver_card:
                CommonData.strHeaderTitle = getString(R.string.how_driver_signup);
                CommonData.strdiscription = getString(R.string.driver_signup);
                CommonData.strTitle = context.getResources().getString(R.string.driver);
                fragment = new CommonFaqFragment();
                FragmentCalling(fragment);
                break;
        }
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.containter_faq, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }



}
