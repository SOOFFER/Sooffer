package com.soofer.app.TripFlowScreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.Gson;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ScheduleTripModel;
import com.soofer.app.Presenter.ScheduleRequestPresenter;

import com.soofer.app.R;
import com.soofer.app.View.ScheduleRequestView;

import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;
import com.wdullaer.materialdatetimepicker.time.TimePickerDialog;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.TimeZone;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.CommonData.strEstimationResponse;
import static com.soofer.app.CommonClass.Utiles.returnString;
import static com.soofer.app.CommonClass.Utiles.showErrorMessage;


public class RiderLaterFragment extends BottomSheetDialogFragment implements DatePickerDialog.OnDateSetListener, TimePickerDialog.OnTimeSetListener, ScheduleRequestView {


    @BindView(R.id.date_txt)
    TextView dateTxt;
    @BindView(R.id.time_txt)
    TextView timeTxt;
    @BindView(R.id.schude_trip)
    Button schudeTrip;
    Unbinder unbinder;

    CallRequest callRequest;
    DatePickerDialog dpd;
    TimePickerDialog tpd;
    String strDate = "", strTime = "";

    int GOOGLESEARCHCODE = 0;
    public RiderLaterFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;
    Context context;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_rider_later, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));

        Calendar now = Calendar.getInstance();
        dpd = DatePickerDialog.newInstance(
                this,
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)


        );
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
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
        String date = day + "-" + month + "-" + year;
        System.out.println("new date of settext==" + date);
        dateTxt.setText(date);
        CommonData.strDate = date;
        strDate= date;
    }

    @Override
    public void onTimeSet(TimePickerDialog view, int hourOfDay, int minute, int second) {
        int hour = hourOfDay;
        int minutes = minute;
        int hours = hourOfDay;
        String timeSet = "";
        if (hours > 12) {
            hour -= 12;
            timeSet = "PM";
        } else if (hours == 0) {
            hour += 12;
            timeSet = "AM";
        } else if (hours == 12)
            timeSet = "PM";
        else
            timeSet = "AM";

        String min = "";
        if (minutes < 10)
            min = "0" + minutes;
        else
            min = String.valueOf(minutes);
        String hr = "";
        if (hour < 10)
            hr = "0" + hour;
        else
            hr = String.valueOf(hour);


        System.out.println("hour====" + hr);

        // Append in a StringBuilder
        String aTime = new StringBuilder().append(hr).append(':')
                .append(min).append(" ").append(timeSet).toString();
        //et1.setText(aTime);

        System.out.println("Current Country==>" + aTime);
        timeTxt.setText(aTime);
        CommonData.strTimes = aTime;
        strTime = aTime;
    }

    @OnClick({R.id.date_txt, R.id.time_txt, R.id.schude_trip})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.date_txt:
                Calendar minDate = Calendar.getInstance();
                //  DatePickerDialog datePickerDialog = DatePickerDialog.newInstance(RideLater.this, getcalendar.get(Calendar.YEAR), getcalendar.get(Calendar.MONTH), getcalendar.get(Calendar.DAY_OF_MONTH));
                if (dpd != null && !dpd.isAdded()) {
                    minDate.add(Calendar.DATE, 0);
                    dpd.setMinDate(minDate);
                    minDate.add(Calendar.DATE, 7);
                    dpd.setMaxDate(minDate);
                    dpd.show(getActivity().getSupportFragmentManager(), "datePicker");
                }
                break;
            case R.id.time_txt:
                if (dateTxt.getText().toString().equalsIgnoreCase("Set Date")) {
                    Utiles.displayMessage(getView(), context, "Please Select Date");
                } else {
                    TimePicker();
                }

                break;
            case R.id.schude_trip:
                if (strDate == null || strDate.isEmpty()) {
                    Utiles.displayMessage(getView(), context, "Please Select Date");

                } else if (strTime == null || strTime.isEmpty()) {
                    Utiles.displayMessage(getView(), context, "Please Select Time");

                } else {
                    //SentScheduleRide();
                    /*Intent intent = new Intent(context, GooglePlaceSearch.class);
                    startActivityForResult(intent, GOOGLESEARCHCODE);*/
                    dismiss();
                    callRequest = (CallRequest) getActivity();
                    callRequest.CallsummaryFragment();

                }
                break;
        }
    }

    public void SentScheduleRide() {
        TimeZone tz = TimeZone.getDefault();
        System.out.println("TimeZone time  " + tz.getDisplayName(false, TimeZone.SHORT) + " Timezon id :: " + tz.getID());
        HashMap<String, String> map = new HashMap<>();
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        map.put("dropLat", String.valueOf(CommonData.Droplat));
        map.put("dropLng", String.valueOf(CommonData.Droplng));
        map.put("serviceid", CommonData.ServiceID);
        map.put("pickupAddress", CommonData.strPickupAddress);
        map.put("dropAddress", CommonData.strDropAddresss);
        map.put("serviceType", CommonData.strServiceType);
        map.put("serviceTypeId", Utiles.NullPointer(CommonData.ServiceID));
        map.put("vehicleDetailsAndFare", returnString(strEstimationResponse, false));
        map.put("distanceDetails", returnString(strEstimationResponse, true));
        map.put("paymentMode", CommonData.strPaymentType);
        map.put("timeFare", CommonData.strTimeFare);
        map.put("promo", CommonData.strpromocode);
        map.put("pickupCity", CommonData.strPickupCity);
        map.put("requestFrom", "app");
        map.put("bookingType", "rideLater");
        map.put("vehicleTypeCode", Utiles.NullPointer(CommonData.strVehicleCode));
        map.put("utc", tz.getDisplayName(false, TimeZone.SHORT));
        map.put("tripDate", strDate);
        map.put("tripTime", strTime);
        map.put("tripType", "daily");
        ScheduleRequestPresenter scheduleRequestPresenter = new ScheduleRequestPresenter(this);
        scheduleRequestPresenter.setScheduleRequest(map, activity);
    }

    public void TimePicker() {
        Calendar c = Calendar.getInstance(TimeZone.getDefault());

        @SuppressLint("SimpleDateFormat")
        SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        String formattedDate = df.format(c.getTime());
        System.out.println("formattedDate date==" + formattedDate);

        tpd = TimePickerDialog.newInstance(
                this,
                c.get(Calendar.HOUR_OF_DAY),
                c.get(Calendar.MINUTE),
                false
        );
        if (dateTxt.getText().toString().trim().length() == 0) {
            Utiles.displayMessage(getView(), context, "Please Select date");
        } else {
            if (tpd != null && !tpd.isAdded()) {
                if (dateTxt.getText().toString().trim().equals(formattedDate)) {
                    c.add(Calendar.MINUTE, 30);
                    tpd.setMinTime(c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE),
                            c.get(Calendar.SECOND));
                    tpd.show(getActivity().getSupportFragmentManager(), "Timepickerdialog");
                } else {
                    tpd.setMinTime(0, 0,
                            0);
                    tpd.show(getActivity().getSupportFragmentManager(), "Timepickerdialog");
                }
            }
        }


    }

    @Override
    public void OnSuccessfully(Response<ScheduleTripModel> Response) {
        try {
            Utiles.displayMessage(getView(), context, Response.body().getMessage());
            callRequest = (CallRequest) getActivity();
            callRequest.ClearServiceFragment();

        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
    }

    @Override
    public void OnRequestFailure(Response<ScheduleTripModel> Response) {
        showErrorMessage(new Gson().toJson(Response.errorBody()), activity, getView());
    }

}
