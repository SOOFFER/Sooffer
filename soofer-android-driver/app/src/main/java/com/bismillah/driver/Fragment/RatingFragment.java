package com.bismillah.driver.Fragment;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;
import androidx.drawerlayout.widget.DrawerLayout;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.MainActivity;
import com.bismillah.driver.Model.RatingModel;
import com.bismillah.driver.Presenter.RatingPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.RatingView;

import java.io.IOException;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

public class RatingFragment extends BaseFragment implements RatingView {

    @BindView(R.id.back_img)
    ImageView backImg;
    Unbinder unbinder;
    @BindView(R.id.feedback_lyt)
    RelativeLayout feedbackLyt;

    Fragment fragment;
    @BindView(R.id.ovrall_rating_txt)
    TextView ovrallRatingTxt;
    @BindView(R.id.lifetime_count_txt)
    TextView lifetimeCountTxt;
    @BindView(R.id.lifetime_txt)
    TextView lifetimeTxt;
    @BindView(R.id.rated_count_txt)
    TextView ratedCountTxt;
    @BindView(R.id.rated_txt)
    TextView ratedTxt;
    @BindView(R.id.star_count_txt)
    TextView starCountTxt;
    @BindView(R.id.star_txt)
    TextView starTxt;
    Context context;
    Activity activity;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_rating, null, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(getActivity().getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        RatingPresenter ratingPresenter = new RatingPresenter(this);
        ratingPresenter.getRating(activity);
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.feedback_lyt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.feedback_lyt:
                fragment = new FeedbackFragment();
                moveToFragment(fragment);
                break;
        }
    }

    private void moveToFragment(Fragment fragment) {
        getActivity().getSupportFragmentManager().beginTransaction()
                .replace(R.id.rating_container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
//        MainActivity.mDrawerLayout.closeDrawer(GravityCompat.START);
//        MainActivity.mDrawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onSuccess(Response<List<RatingModel>> Response) {
        assert Response.body() != null;
        ovrallRatingTxt.setText(Response.body().get(0).getRating().toString());
        lifetimeCountTxt.setText(Response.body().get(0).getTottrip().toString());
        ratedCountTxt.setText(Response.body().get(0).getNos().toString());
        starCountTxt.setText(Response.body().get(0).getStar().toString());

    }

    @Override
    public void onFailure(Response<List<RatingModel>> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,activity,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context,activity.getResources().getString(R.string.something_went_wrong));
        }
    }
}
