package com.soofer.app.TripFlowScreen.OutStation;

import android.annotation.SuppressLint;
import android.app.Activity;

import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.soofer.app.Adapter.SeviceTypeAdapter;
import com.soofer.app.CommonClass.BaseClass.BasePresenter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.LocalModel.OutstationLocalModel;
import com.soofer.app.Model.OutStationModel;
import com.soofer.app.Presenter.OutstationPresenter;
import com.soofer.app.R;
import com.github.florent37.singledateandtimepicker.dialog.SingleDateAndTimePickerDialog;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import io.reactivex.disposables.CompositeDisposable;

import static com.soofer.app.CommonClass.Utiles.getErrorBody;
import static com.soofer.app.CommonClass.Utiles.returnDate;


public class OutStationFragment extends BaseFragment implements CommonInterFace, BasePresenter.CommonInterFace {

    private static final String TAG = OutStationFragment.class.getName();
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.pickup_txt)
    TextView pickupTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.radioonway)
    RadioButton radioonway;
    @BindView(R.id.radioRoundtrip)
    RadioButton radioRoundtrip;
    @BindView(R.id.radiotrip)
    RadioGroup radiotrip;
    @BindView(R.id.leave_on_date_txt)
    TextView leaveOnDateTxt;
    @BindView(R.id.view_return_above)
    View viewReturnAbove;
    @BindView(R.id.return_by_date_txt)
    TextView returnByDateTxt;
    @BindView(R.id.service_recycleview)
    RecyclerView serviceRecycleview;
    private Unbinder unbinder;

    private Activity activity;
    private Context context;
    private FragmentManager fragmentManager;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.return_layout)
    LinearLayout returnLayout;
    @BindView(R.id.round_view)
    View roundView;
    @BindView(R.id.submit_txt)
    Button submitTxt;
    private SingleDateAndTimePickerDialog.Builder singleBuilder;
    private Date strStarDate, strEndDate, strselectstarDate;
    private Calendar calendarMin;
    private OutstationPresenter outstationPresenter;
    private CompositeDisposable disposable;
    private String strTripType = "oneway";
    private String strDistanceLable = "";
    private String NumberOfDays = "8";
    private SeviceTypeAdapter serviceAdapter;
    private OutStationModel.VehicleList vehicleList;
    private List<OutStationModel.VehicleList> vehicleLists;

    private AlertDialog alertDialog;
    private int previousSelection = 0;


    public OutStationFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_out_station, container, false);
        unbinder = ButterKnife.bind(this, view);
        calendarMin = Calendar.getInstance();
        String displayName = calendarMin.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.ENGLISH);
        calendarMin.add(Calendar.HOUR, 2);
        activity = getActivity();
        context = getContext();

        disposable = new CompositeDisposable();
        fragmentManager = getFragmentManager();
        strStarDate = calendarMin.getTime();
        vehicleLists = new ArrayList<>();
        strselectstarDate = strStarDate;
        leaveOnDateTxt.setText(returnDate(strStarDate));
        outstationPresenter = new OutstationPresenter(disposable, this, activity);
        pickupTxt.setText(Utiles.NullPointer(CommonData.strPickupAddress));
        dropAddressTxt.setText(Utiles.NullPointer(CommonData.strDropAddresss));
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        outStationEstimationApi();
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            unbinder.unbind();
            if (singleBuilder != null) {
                singleBuilder.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        fragmentManager.popBackStackImmediate();
    }

    public void setadapter(List<OutStationModel.VehicleList> vehicleList) {
        if (vehicleList != null && !vehicleList.isEmpty()) {
            @SuppressLint("WrongConstant") LinearLayoutManager linearLayoutManager = new LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false);
            serviceRecycleview.setLayoutManager(linearLayoutManager);
            serviceRecycleview.setItemAnimator(new DefaultItemAnimator());
            serviceRecycleview.setHasFixedSize(true);
            if (vehicleLists != null && !vehicleLists.isEmpty()) {
                vehicleLists.clear();
            }
            assert vehicleLists != null;
            vehicleLists.addAll(vehicleList);
            if (serviceAdapter == null) {
                serviceAdapter = new SeviceTypeAdapter(activity, this, vehicleLists, strTripType);
                serviceRecycleview.setAdapter(serviceAdapter);
            } else {
                serviceAdapter.notifyDataSetChanged();
            }
        }

    }

    @SuppressLint("SetTextI18n")
    @Optional
    @OnClick({R.id.leave_on_date_txt, R.id.return_by_date_txt, R.id.submit_txt, R.id.radioonway, R.id.radioRoundtrip})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.leave_on_date_txt:
                CallDatePicker("Leave on");
                break;
            case R.id.return_by_date_txt:
                CallDatePicker("Round trip");
                break;
            case R.id.submit_txt:
                if (vehicleLists == null || vehicleLists.isEmpty()) {
                    returnTimeAler(getString(R.string.your_are_not_eligible_for_outstation_request));
                    return;
                }
                vehicleList = vehicleLists.get(previousSelection);
                if (strTripType.equalsIgnoreCase("oneway")) {
                    alertdialog();
                } else {
                    if (strEndDate == null) {
                        returnTimeAler(getString(R.string.please_select_the_return_by_time));
                        return;
                    } else {
                        fragmentCalling(new ConfimYourBookFragment(new OutstationLocalModel(strTripType, vehicleList, strselectstarDate, strEndDate, strDistanceLable)));
                    }

                }
                break;
            case R.id.radioRoundtrip:
                changeVisibilitySate(viewReturnAbove, false);
                changeVisibilitySate(returnLayout, false);
                strTripType = "round";
                if (serviceAdapter != null) {
                    serviceAdapter.checkoneWayorRoundTrip(strTripType);
                }
                break;
            case R.id.radioonway:
                changeVisibilitySate(viewReturnAbove, true);
                changeVisibilitySate(returnLayout, true);
                if(strTripType.equalsIgnoreCase("round")){
                    strEndDate = null;
                    returnByDateTxt.setText(R.string.select);
                    strTripType = "oneway";
                    outStationEstimationApi();
                }

                if (serviceAdapter != null) {
                    serviceAdapter.checkoneWayorRoundTrip(strTripType);
                }

                break;
        }
    }

    private void CallDatePicker(String strName) {

        final Date now = new Date();

        final Calendar calendarMax = Calendar.getInstance();
        calendarMax.setTime(new Date(now.getTime() + TimeUnit.DAYS.toMillis(14))); // Set max now + 150 days

        final Date maxDate = calendarMax.getTime();


        singleBuilder = new SingleDateAndTimePickerDialog.Builder(context)
                .customLocale(Locale.ENGLISH)
                .bottomSheet()
                .mainColor(activity.getResources().getColor(R.color.colorPrimary))
                .titleTextColor(activity.getResources().getColor(R.color.colorPrimary))
                .minutesStep(15)
                .maxDateRange(maxDate)
                .title(strName)
                .listener(date -> {
                    if (strName.equalsIgnoreCase("Leave on")) {
                        strselectstarDate = date;
                        leaveOnDateTxt.setText(returnDate(strselectstarDate));
                        if (strEndDate != null) {
                            outStationEstimationApi();
                        }
                    } else {
                        strEndDate = date;
                        returnByDateTxt.setText(returnDate(strEndDate));
                        outStationEstimationApi();
                    }

                });
        if (strName.equalsIgnoreCase("Leave on")) {
            singleBuilder.defaultDate(strStarDate);
            singleBuilder.minDateRange(strStarDate);
        } else {
            if (strEndDate == null) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(strselectstarDate);
                if (NumberOfDays != null) {
                    calendar.add(Calendar.HOUR, 8);
                } else {
                    try {
                        calendar.add(Calendar.HOUR, Integer.parseInt(NumberOfDays));
                    } catch (Exception e) {
                        e.printStackTrace();
                        calendar.add(Calendar.HOUR, 8);
                    }
                }
                Date futureDate = calendar.getTime();
                System.out.println("enter the data android" + futureDate);
                singleBuilder.defaultDate(futureDate);
                singleBuilder.minDateRange(futureDate);
            } else {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(strselectstarDate);
                if (NumberOfDays != null) {
                    calendar.add(Calendar.HOUR, 8);
                } else {
                    try {
                        calendar.add(Calendar.HOUR, Integer.parseInt(NumberOfDays));
                    } catch (Exception e) {
                        e.printStackTrace();
                        calendar.add(Calendar.HOUR, 8);
                    }
                }
                Date futureDate = calendar.getTime();
                singleBuilder.minDateRange(futureDate);
                singleBuilder.defaultDate(futureDate);
            }

        }

        singleBuilder.display();

    }

    @Override
    public void callBack(Object object) {
        if (object instanceof Integer) {
            previousSelection = (int) object;
        }
    }


    private void changeVisibilitySate(View view, boolean ischeck) {
        if (ischeck) {
            if (view.getVisibility() == View.VISIBLE) {
                view.setVisibility(View.GONE);
            }
        } else {
            if (view.getVisibility() == View.GONE) {
                view.setVisibility(View.VISIBLE);
            }
        }
    }

    @Override
    public void onSuccess(Object object) {
        if (object instanceof OutStationModel) {
            NumberOfDays = ((OutStationModel) object).getReturnHours();
            strDistanceLable = ((OutStationModel) object).getTripDuration();
            setadapter(((OutStationModel) object).getVehicleList());
        }

    }

    @Override
    public void onFailure(Throwable throwable) {
        getErrorBody(throwable, activity);
    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);

    }

    @Override
    public void hideLoader() {
        Utiles.DismissLoader();
    }

    private void outStationEstimationApi() {
        HashMap<String, String> map = new HashMap<>();
        map.put("tripTypeCode", "outstation");
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("outstationType", strTripType);
        map.put("encodePath", CommonData.strEncodePolyline);
        map.put("startDay", returnDate(strselectstarDate));
        map.put("returnDay", returnDate(strEndDate));
        outstationPresenter.getOutstationEstimate(map);
    }

    private void alertdialog() {
       /* AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(R.string.info);
        builder1.setMessage(R.string.both_up_and_down_amount_will_be_applicable_for_one_way_trip);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                R.string.ok,
                (dialog, id) -> {
                    dialog.dismiss();
                });
        builder1.setNegativeButton(R.string.cancel, (dialog, which) -> dialog.dismiss());
        alertDialog = builder1.create();
        alertDialog.show();
*/
        fragmentCalling(new ConfimYourBookFragment(new OutstationLocalModel(strTripType, vehicleList, strselectstarDate, strEndDate, strDistanceLable)));

    }

    private void returnTimeAler(String message) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setMessage(message);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                R.string.okay,
                (dialog, id) -> {
                    dialog.dismiss();
                });
        alertDialog = builder1.create();
        alertDialog.show();


    }

    private void fragmentCalling(Fragment fragment) {
        try {
            FragmentManager fragmentManager = getFragmentManager();
            assert fragmentManager != null;
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.replace(R.id.containter, fragment);
            fragmentTransaction.addToBackStack(null);
            fragmentTransaction.commitAllowingStateLoss();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
