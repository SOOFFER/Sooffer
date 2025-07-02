package com.soofer.driver.Fragment;

import android.app.Activity;
import android.os.Bundle;
import com.google.android.material.tabs.TabLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentStatePagerAdapter;
import androidx.viewpager.widget.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.RelativeLayout;


import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.R;

import java.util.ArrayList;
import java.util.List;

import com.soofer.driver.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class YourTripFragment extends BaseFragment {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.tabs)
    TabLayout tabs;
    @BindView(R.id.viewpager)
    ViewPager viewpager;
    Unbinder unbinder;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_your_trip, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        setupViewPager(viewpager);
        tabs.setupWithViewPager(viewpager);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return view;
    }

    private void setupViewPager(ViewPager viewPager) {
        ViewPagerYourTripAdapter adapter = new ViewPagerYourTripAdapter(getFragmentManager());
        adapter.addFragment(new PastripFragment(), getString(R.string.past_trip));
        adapter.addFragment(new UpcomingFragment(), getString(R.string.upcoming_trip));
        viewPager.setAdapter(adapter);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        getFragmentManager().popBackStackImmediate();
    }

    class ViewPagerYourTripAdapter extends FragmentStatePagerAdapter {
        private final List<Fragment> mFragmentList = new ArrayList<>();
        private final List<String> mFragmentTitleList = new ArrayList<>();


        public ViewPagerYourTripAdapter(FragmentManager fragmentManager) {
            super(fragmentManager);
        }

        @Override
        public Fragment getItem(int position) {
            return mFragmentList.get(position);
        }

        @Override
        public int getCount() {
            return mFragmentList.size();
        }

        public void addFragment(Fragment fragment, String title) {
            mFragmentList.add(fragment);
            mFragmentTitleList.add(title);
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return mFragmentTitleList.get(position);
        }
    }
}
