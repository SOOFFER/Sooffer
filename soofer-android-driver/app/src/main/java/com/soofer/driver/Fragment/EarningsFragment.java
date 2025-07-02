package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.EarningsModel;
import com.soofer.driver.Presenter.EarningsPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.EarningsView;

import java.io.IOException;
import java.text.DecimalFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static java.lang.String.valueOf;

public class EarningsFragment extends BaseFragment implements EarningsView {
    @BindView(R.id.back_img)
    ImageView backImg;
    Unbinder unbinder;
    @BindView(R.id.total_earning_txt)
    TextView totalEarningTxt;
    @BindView(R.id.detaily_earning_txt)
    TextView detailyEarningTxt;
    @BindView(R.id.weekly_earning_txt)
    TextView weeklyEarningTxt;
    @BindView(R.id.monthly_earning_txt)
    TextView monthlyEarningTxt;
    @BindView(R.id.year_earnings_txt)
    TextView yearEarningsTxt;
    Activity activity;
    Context context;

    @RequiresApi(api = Build.VERSION_CODES.O)

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        @SuppressLint("InflateParams")
        View view = inflater.inflate(R.layout.fragment_earnings, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(getActivity().getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));
       AsyncTask.execute(() -> {
           EarningsPresenter earningsPresenter = new EarningsPresenter(EarningsFragment.this);
           earningsPresenter.getRating(activity);
       });
        getCurrentDate();
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
        assert getFragmentManager() != null;
        getFragmentManager().popBackStackImmediate();
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onSuccess(Response<EarningsModel> Response) {
        Log.e("TAG", "response 33: " + new Gson().toJson(Response.body()));
        assert Response.body() != null;
        totalEarningTxt.setText("$" + dotLimitation(Response.body().getTotal()));
        detailyEarningTxt.setText("$" + dotLimitation(Response.body().getDaily()));
        weeklyEarningTxt.setText("$" + dotLimitation(Response.body().getWeekly()));
        monthlyEarningTxt.setText("$" + dotLimitation(Response.body().getMonthly()));
        yearEarningsTxt.setText("$" + dotLimitation(Response.body().getTotal()));


    }

    @Override
    public void onFailure(Response<EarningsModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,activity,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }
    public String dotLimitation(double values){
        return new DecimalFormat("##.##").format(values);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void getCurrentDate(){
        LocalDate today = LocalDate.now();

        // Go backward to get Monday
        LocalDate monday = today;
        while (monday.getDayOfWeek() != DayOfWeek.MONDAY)
        {
            monday = monday.minusDays(1);
        }

        // Go forward to get Sunday
        LocalDate sunday = today;
        while (sunday.getDayOfWeek() != DayOfWeek.SUNDAY)
        {
            sunday = sunday.plusDays(1);
        }

        System.out.println("Today: " + today);
        System.out.println("Monday of the Week: " + monday);
        System.out.println("Sunday of the Week: " + sunday);
    }
}
