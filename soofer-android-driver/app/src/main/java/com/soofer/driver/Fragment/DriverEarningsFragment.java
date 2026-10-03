package com.soofer.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.soofer.driver.Adapter.EarningsAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.Model.EarningModel;
import com.soofer.driver.Presenter.EarningPresenter;
import com.soofer.driver.R;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;

import com.soofer.driver.CommonClass.Utiles;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class DriverEarningsFragment extends BaseFragment implements EarningsAdapter.CallbackLs, EarningPresenter.EarningViews, DatePickerDialog.OnDateSetListener {


    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.earnings_recycleview)
    RecyclerView earningsRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    Activity activity;
    Context context;
    private FragmentManager fragmentManager;
    private EarningsAdapter earningsAdapter;
    private EarningPresenter earningPresenter;
    private List<EarningModel> earningModels;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.from_edt)
    MaterialEditText fromEdt;
    @BindView(R.id.to_edt)
    MaterialEditText toEdt;
    private boolean loading = true;
    private int Page = 1;
    private boolean IsFrom = false;
    private String strfrom = "", strTo = "", sttype = "", strfromMonth = "";
    private LinearLayoutManager LinearLayoutManagers;
    private DatePickerDialog dpd;

    public DriverEarningsFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_driver_earnings, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        fragmentManager = getFragmentManager();
        earningPresenter = new EarningPresenter(this, activity);
        earningModels = new ArrayList<>();
        Calendar now = Calendar.getInstance();
        dpd = DatePickerDialog.newInstance(
                this,
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)
        );

        ZoneId ist = ZoneId.of("Asia/Kolkata");
        LocalDate today = LocalDate.now(ist);
        LocalDate startOfYear = today.withDayOfMonth(1);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd",Locale.US);
        DateTimeFormatter fmt2 = DateTimeFormatter.ofPattern("MMM yyyy", Locale.US);
        strfrom = startOfYear.format(fmt);
        strTo = today.format(fmt);
        sttype = "Months";
        strfromMonth = today.format(fmt2).toUpperCase(Locale.US);
        fromEdt.setText(strfrom);
        toEdt.setText(strTo);

        getEarningList();
        LinearLayoutManagers = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false);
        earningsRecycleview.setLayoutManager(LinearLayoutManagers);
        earningsRecycleview.setItemAnimator(new DefaultItemAnimator());
        earningsRecycleview.setHasFixedSize(true);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
    }

    @OnClick({R.id.back_img, R.id.from_edt, R.id.to_edt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.from_edt:
                IsFrom = true;
                initCalendar();
                break;
            case R.id.to_edt:
                IsFrom = false;
                initCalendar();
                break;

        }

    }

    public void initCalendar() {
        if (dpd != null && dpd.isAdded()) {
            dpd.dismiss();
        }
        Calendar minDate = Calendar.getInstance();
        minDate.add(Calendar.DATE, 0);
        dpd.setMaxDate(minDate);
        dpd.show(getActivity().getSupportFragmentManager(), "datePicker");
    }

    @Override
    public void positionClick(int position) {
        if (earningModels.get(position).getType().equalsIgnoreCase("Days")) {
            MovetoFragment(new ParticularDateYourTripFragment(earningModels.get(position).getDate()));
        } else {
            Page = 1;
            sttype = earningModels.get(position).getType();
            strfromMonth = earningModels.get(position).getDate();
            earningModels.clear();
            getEarningList();
        }

    }

    public void setAdapter() {

        if (earningModels != null && !earningModels.isEmpty()) {
            earningsAdapter = new EarningsAdapter(activity, this, earningModels);
            earningsRecycleview.setAdapter(earningsAdapter);
            nodataTxt.setVisibility(View.GONE);
            earningsRecycleview.setVisibility(View.VISIBLE);
        } else {
            earningsRecycleview.setVisibility(View.GONE);
            nodataTxt.setVisibility(View.VISIBLE);
        }

    }

    @Override
    public void Onsuccess(Response<List<EarningModel>> Response) {
        System.out.println("enter the gson conversion in android" + new Gson().toJson(Response.body()));
        assert Response.body() != null;
        if (!Response.body().isEmpty()) {
            earningModels.addAll(Response.body());
            setAdapter();
        }

    }

    @Override
    public void onFailure(Response<List<EarningModel>> Response) {
        Utiles.showErrorMessage(new Gson().toJson(Response), activity, getView());
    }

    public void getEarningList() {
        TimeZone tz = TimeZone.getDefault();
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("_page", "" + Page);
        hashMap.put("from", strfrom);
        hashMap.put("to", strTo);
        hashMap.put("type", sttype);
        hashMap.put("fromMonth", strfromMonth);
        hashMap.put("utc", tz.getDisplayName(false, TimeZone.SHORT));
        earningPresenter.getEanings(hashMap);
    }

    public void MovetoFragment(Fragment fragment) {
        try {
            fragmentManager.beginTransaction().setCustomAnimations(R.anim.slide_in_left, R.anim.slide_out_right)
                    .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDateSet(DatePickerDialog view, int year, int monthOfYear, int dayOfMonth) {
        System.out.println("monthofyear=" + monthOfYear);
        String month = "", day = "";
        if (dayOfMonth < 10) {
            day = "0" + dayOfMonth;
            System.out.println("day=" + day);
        } else {
            day = String.valueOf(dayOfMonth);
        }
        if (monthOfYear < 9) {
            month = "0" + (++monthOfYear);
            System.out.println("month=" + month);
        } else {
            month = String.valueOf(++monthOfYear);
        }
        //    String date = dayOfMonth+"-"+(++monthOfYear)+"-"+year;
        String date = year + "-" + month + "-" + day;
        System.out.println("new date of settext==" + date);
        if (IsFrom) {
            fromEdt.setText(date);
        } else {
            toEdt.setText(date);
        }
        if (!Objects.requireNonNull(fromEdt.getText()).toString().isEmpty() && !Objects.requireNonNull(toEdt.getText()).toString().isEmpty()) {
            strfrom = fromEdt.getText().toString();
            strTo = toEdt.getText().toString();
            Page = 1;
            if (earningModels != null && !earningModels.isEmpty()) {
                earningModels.clear();
                earningsAdapter.notifyDataSetChanged();
            } else {
                Toast.makeText(activity, "No Earnings Found!!", Toast.LENGTH_SHORT).show();
            }
            sttype = "";
            strfromMonth = "";
            getEarningList();
        }
    }

}
