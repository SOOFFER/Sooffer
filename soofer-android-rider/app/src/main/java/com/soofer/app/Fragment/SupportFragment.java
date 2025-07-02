package com.soofer.app.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;


import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.R;

import com.soofer.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class SupportFragment extends BaseFragment {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.about_us_linear)
    LinearLayout aboutUsLinear;
    @BindView(R.id.privacy_policy_linear)
    LinearLayout privacyPolicyLinear;
    @BindView(R.id.terms_codition_linear)
    LinearLayout termsCoditionLinear;
    @BindView(R.id.contact_us_linear)
    LinearLayout contactUsLinear;
    @BindView(R.id.faq_linear)
    LinearLayout faqLinear;
    Unbinder unbinder;

    Context context;
    Fragment fragment;

    public SupportFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }
    Activity activity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_support, container, false);
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

    @OnClick({R.id.back_img, R.id.about_us_linear, R.id.privacy_policy_linear, R.id.terms_codition_linear, R.id.contact_us_linear, R.id.faq_linear})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.about_us_linear:
                CommonData.strTitle = context.getResources().getString(R.string.about_us);
                fragment = new CommonwebviewFragment();
                FragmentCalling(fragment);
                break;
            case R.id.privacy_policy_linear:
                CommonData.strTitle = context.getResources().getString(R.string.privacy_policy);
                fragment = new CommonwebviewFragment();
                FragmentCalling(fragment);
                break;
            case R.id.terms_codition_linear:
                CommonData.strTitle = context.getResources().getString(R.string.terms_amp_condition);
                fragment = new CommonwebviewFragment();
                FragmentCalling(fragment);
                break;
            case R.id.contact_us_linear:
                CommonData.strTitle = context.getResources().getString(R.string.contact_us);
                fragment = new ContactUsFragment();
                FragmentCalling(fragment);
                break;
            case R.id.faq_linear:
                CommonData.strTitle = context.getResources().getString(R.string.faq);
                fragment = new FaqFragment();
                FragmentCalling(fragment);
                break;
        }
    }

    public void FragmentCalling(Fragment fragment) {
        try {
            FragmentManager fragmentManager = getFragmentManager();
            assert fragmentManager != null;
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.replace(R.id.containter_support, fragment);
            fragmentTransaction.addToBackStack(null);
            fragmentTransaction.commitAllowingStateLoss();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
