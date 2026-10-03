package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


@SuppressLint("ValidFragment")
public class ParticularDateYourTripFragment extends BaseFragment {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    Unbinder unbinder;

    public String date = "";
    Activity activity;
    Context context;
    private FragmentManager fragmentManager;

    @SuppressLint("ValidFragment")
    public ParticularDateYourTripFragment(String date) {
        // Required empty public constructor
        this.date = date;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_particular_date_your_trip, container, false);
        unbinder = ButterKnife.bind(this, view);
        dateTimeTxt.setText(getString(R.string.trips_of)+" "+Utiles.Nullpointer(date));
        CommonData.Earningdate = Utiles.Nullpointer(date);
        activity = getActivity();
        context = getContext();
        fragmentManager = getFragmentManager();
        MovetoFragment(new PastripEarningsFragment());
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
    public void MovetoFragment(Fragment fragment){
        try {
            fragmentManager.beginTransaction().setCustomAnimations(R.anim.slide_in_left, R.anim.slide_out_right)
                    .replace(R.id.yourTrip_cantainer, fragment, fragment.getClass().getSimpleName()).commitAllowingStateLoss();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
