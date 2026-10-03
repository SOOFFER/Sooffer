package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.credentials.Credential;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Email;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.driver.Adapter.DocAdapter;
import com.soofer.driver.ApplicationController.MySMSBroadcastReceiver;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CustomizeDialog.OTPCustomerDialog;
import com.soofer.driver.EventBus.OTPEvent;
import com.soofer.driver.Fragment.document.DocumentUploadListFragment;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.Presenter.SubscriptionPresenter;
import com.soofer.driver.TripflowFragment.BottomSheetDialogFragment.SelectionBottomSheetFragment;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.JWTUtils;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.RegisterModel;
import com.soofer.driver.Presenter.RegisterPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.RegisterView;
import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;
import com.ybs.countrypicker.CountryPicker;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.soofer.driver.CommonClass.CommonData;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.ghyeok.stickyswitch.widget.StickySwitch;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.HttpException;
import retrofit2.Response;

import static com.soofer.driver.CommonClass.Constants.strVehicleID;


@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class RegisterFragment extends BaseFragment implements RegisterView, Validator.ValidationListener, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, MySMSBroadcastReceiver.OTPReceiveListener, SubscriptionPresenter.CommonView, DatePickerDialog.OnDateSetListener {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @NotEmpty(message = "")
    //  @Length(min = 4, message = getString(R.string.minimum_four))
    @Length(min = 4, message = "Enter  Minimum 4 character")
    @BindView(R.id.fname_edit)
    MaterialEditText fnameEdit;
    @BindView(R.id.lname_edt)
    MaterialEditText lnameEdt;
    @NotEmpty(message = "")
    // @Email(message = getString(R.string.enter_valid_emai_id))
    @Email(message = "Enter Valid Email id")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @NotEmpty(message = "Enter Your Password")
    //@Length(min = 6, max = 12, message = getString(R.string.minimum))
    // @Length(min = 6, max = 12, message = "Enter the Minimum 6 to 12 Character")
    @BindView(R.id.password_edt)
    MaterialEditText passwordEdt;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;

    @BindView(R.id.code_edt)
    MaterialEditText countrycode;
    @NotEmpty(message = "")
    // @Length(min = 10, message = getString(R.string.enter_the_10_digit))
    //@Length(min = 6,max = 15 , message = getString(R.string.maximum_minimum_character))
    @Length(min = 6, max = 10, message = "Enter the Minimum 6 to 10 Character")
    @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.referral_edt)
    MaterialEditText referralEdt;
    @BindView(R.id.terms_condition_txt)
    CheckBox termsConditionTxt;
    @BindView(R.id.submit)
    Button submit;

    @NotEmpty(message = "Select your country")
    //  @Length(min = 4, message = getString(R.string.minimum_four))
    @BindView(R.id.country_edt)
    MaterialEditText countryEdt;

    @NotEmpty(message = "Select your State")
    //  @Length(min = 4, message = getString(R.string.minimum_four))
    @BindView(R.id.state_edt)
    MaterialEditText stateEdt;

    @NotEmpty(message = "Select your City")
    //  @Length(min = 4, message = getString(R.string.minimum_four))
    @BindView(R.id.city_edt)
    MaterialEditText cityEdt;

    @BindView(R.id.stickySwitch)
    StickySwitch stickySwitch;

    Unbinder unbinder;
    Context context;
    private String strGendeType = "Male", date = "";

    List<CountryModel> countries;
    List<StateModel> states;

    List<CityModel> cities;
    DocAdapter docAdapter;

    public RegisterFragment() {
    }
    FirebaseAuth mAuth;
    String customToken;
    Validator validator;
    Activity activity;
    CountryPicker picker;
    Fragment fragment;
    RegisterPresenter registerPresenter;
    private GoogleApiClient client;
    MySMSBroadcastReceiver smsBroadcast;
    private int RC_HINT = 2;
    FragmentActivity fragmentActivity;
    private SubscriptionPresenter subscriptionPresenter;
    private CompositeDisposable disposable;
    private BottomSheetDialogFragment bottomSheetDialogFragment;
    private String strCityid, strCountryid, strStateid;
    private ArrayList<CountryModel> countryList = new ArrayList<>();
    private ArrayList<StateModel> stateModellist = new ArrayList<>();
    private ArrayList<CityModel> cityModellist = new ArrayList<>();
    DatePickerDialog dpd;



    public static AlertDialog alert11;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_register, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        fragmentActivity = getActivity();
        disposable = new CompositeDisposable();
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);
        validator = new Validator(this);
        validator.setValidationListener(this);
        picker = CountryPicker.newInstance(activity.getResources().getString(R.string.select_count));
        picker.setListener((name, code, dialCode, flagDrawableResID) -> {
            ccEdt.setText(dialCode);
            countrycode.setText(code);
            picker.dismiss();
        });
        Calendar now = Calendar.getInstance();
        subscriptionPresenter.getCountryListApi();
        dpd = DatePickerDialog.newInstance(
                this,
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)

        );
        stickySwitch.setLeftText(getString(R.string.male));
        stickySwitch.setRightText(getString(R.string.female));
        stickySwitch.setOnSelectedChangeListener((direction, s) -> strGendeType = s);
        registerPresenter = new RegisterPresenter(this);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        strVehicleID = "";
        try {
            if (client == null) {
                client = new GoogleApiClient.Builder(activity)
                        .addConnectionCallbacks(this)
                        .enableAutoManage(fragmentActivity, this)
                        .addApi(Auth.CREDENTIALS_API)
                        .build();
                client.connect();
            }
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }

        /*
        startSMSListener();
        smsBroadcast = new MySMSBroadcastReceiver();
        smsBroadcast.initOTPListener(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(SmsRetriever.SMS_RETRIEVED_ACTION);
        activity.registerReceiver(smsBroadcast, intentFilter);*/

        passwordEdt.setOnTouchListener((v, event) -> {
            final int DRAWABLE_RIGHT = 2;
            if (event.getAction() == MotionEvent.ACTION_UP) {
                if (event.getRawX() >= (passwordEdt.getRight() - passwordEdt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                    // your action here
                    if (passwordEdt.getTag() == null) {
                        passwordEdt.setTag(true);
                        passwordEdt.setTransformationMethod(null);
                        Utiles.iconChange(passwordEdt, true, activity);
                        return true;
                    }
                    if ((boolean) passwordEdt.getTag()) {

                        passwordEdt.setTransformationMethod(new PasswordTransformationMethod());
                    } else {
                        passwordEdt.setTransformationMethod(null);

                    }
                    passwordEdt.setTag(!(boolean) passwordEdt.getTag());
                    Utiles.iconChange(passwordEdt, (boolean) passwordEdt.getTag(), activity);
                    return true;
                }
            }
            return false;
        });


        return view;
    }

    public void startSMSListener() {
        SmsRetrieverClient client = SmsRetriever.getClient(activity /* context */);
        Task<Void> task = client.startSmsRetriever();
        task.addOnSuccessListener(aVoid -> {
            //  Utiles.CommonToast(activity, "start");
        });

        task.addOnFailureListener(e -> {
            // Failed to start retriever, inspect Exception for more details
            // ...
            // Utiles.CommonToast(activity, "Failed");
        });

    }


    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        if (client != null && client.isConnected()) {
            client.stopAutoManage(fragmentActivity);
            client.disconnect();
        }
        if (smsBroadcast != null) {
            activity.unregisterReceiver(smsBroadcast);
            smsBroadcast = null;
        }
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.submit,
            R.id.cc_edt, R.id.terms_contionlink,
            R.id.city_edt, R.id.country_edt, R.id.state_edt, R.id.referral_edt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getParentFragmentManager().popBackStackImmediate();
                break;
            case R.id.submit:
                if (countryEdt.getText().toString().isEmpty()) {
                    countryEdt.setError("Enter Your Country");
                    stateEdt.setError(null);
                    cityEdt.setError(null);
            } else if (stateEdt.getText().toString().isEmpty()) {
                countryEdt.setError(null);
                stateEdt.setError("Enter Your State");
                cityEdt.setError(null);
            } else if (!countryEdt.getText().toString().isEmpty() && !stateEdt.getText().toString().isEmpty() && cityEdt.getText().toString().isEmpty()) {
                    countryEdt.setError(null);
                    stateEdt.setError(null);
                    cityEdt.setError("Enter Your City");
            } else if (!countryEdt.getText().toString().isEmpty() && !stateEdt.getText().toString().isEmpty() && !cityEdt.getText().toString().isEmpty()) {
                    countryEdt.setError(null);
                    stateEdt.setError(null);
                    cityEdt.setError(null);

                    validator.validate();
                }
                break;
            case R.id.referral_edt:
                initCalendar();
                break;
            case R.id.cc_edt:
                if (picker != null && picker.isAdded()) {
                    picker.dismiss();
                }
                picker.show(getParentFragmentManager(), "Country_picker");
                break;
            case R.id.terms_contionlink:
                moveToFragment(new SupportFragment());
                break;
            case R.id.city_edt:
                if (stateEdt.getText().toString().isEmpty()) {
                    Utiles.CommonToast(activity, "Selec your State");
                    return;
                }
                showDialog(cityModellist, "Select Your City");
                break;

            case R.id.country_edt:
                showDialog(countryList, "Select Your Country");
                break;

            case R.id.state_edt:
                if (countryEdt.getText().toString().isEmpty()) {
                    Utiles.CommonToast(activity, "Selec your Country");
                    return;
                }
                showDialog(stateModellist, "Select Your State");
                break;
        }
    }


    @Override
    public void RegisterView(Response<RegisterModel> Response) {
        try {
            assert Response.body() != null;
            SharedHelper.putKey(context, "FbCusToken", Response.body().getFbCusToken());
            customToken = SharedHelper.getKey(context, "FbCusToken");
            new JWTUtils(this, null).decoded(Response.body().getToken(), context, "reg");
            SharedHelper.putKey(activity, "token", Response.body().getToken());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void Errorlogview(Response<RegisterModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void JsonResponse(String s) {
        try {
            JSONObject obj = new JSONObject(s);
            String email = obj.getString("email");
            String name = obj.getString("name");
            String id = obj.getString("id");
            Log.e("response", "" + email + "==" + name + "==" + id);
            SharedHelper.putKey(context, "userid", id);
            SharedHelper.putKey(context, "email", email);
            SharedHelper.putKey(activity, "appflow", "registration");

            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
            mAuth = FirebaseAuth.getInstance();
            mAuth.signOut();
            mAuth.signInWithCustomToken(customToken).addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    Utiles.DismissLoader();
                    CommonFirebaseListoner.FirebaseTripFlow();
                    FirebaseUser user = task.getResult().getUser();
                    System.out.println("User is authenticated with Firebase" + user.toString());
                    ref.child("drivers_data").child(id).child("FCM_id").setValue(SharedHelper.getToken(context, "device_token"));
                    fragment = new DocumentUploadListFragment("driver", true);
                    moveToFragment(fragment);
                    Utiles.setDriversData(context);
                } else {
                    Utiles.DismissLoader();
                    Exception exception = task.getException();
                    if (exception != null) {
                        System.out.println("FbCusToken Exception" + exception.getMessage());
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccessOTP(Response<OTPModel> Response) {
        JSONObject jsonObject = new JSONObject();

        try {

            jsonObject.put("mobile", Objects.requireNonNull(mobileEdt.getText()).toString());
            jsonObject.put("cc", Objects.requireNonNull(ccEdt.getText()).toString());
            jsonObject.put("email", Objects.requireNonNull(emailEdt.getText()).toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        System.out.println("Enter OTP code" + Response.body().getCode());
        OTPCustomerDialog dialogClass = new OTPCustomerDialog(activity, Response.body().getCode(), this, jsonObject);
        dialogClass.setCancelable(false);
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
        dialogClass.show();
    }

    @Override
    public void onFailureOTP(Response<OTPModel> Response) {
        try {
            assert Response.errorBody() != null;
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void OTPVerification() {
        Utiles.ShowLoader(activity);
        Utiles.hideKeyboard(activity);
        date = referralEdt.getText().toString();
        getRegisterApi();
    }

    @Override
    public void countrysuccess(Response<List<CountryModel>> Response) {
        countries = Response.body();
    }

    @Override
    public void countryfailure(Response<List<CountryModel>> Response) {
        System.out.println("failed..");
    }

    @Override
    public void statesuccess(Response<List<StateModel>> Response) {
        assert Response.body() != null;
        states = Response.body();
        vehicleDoc("Select State", 2);

    }

    @Override
    public void statefailure(Response<List<StateModel>> Response) {
        System.out.println("failed1..");
    }

    @Override
    public void citysuccess(Response<List<CityModel>> Response) {
        assert Response.body() != null;
        cities = Response.body();
        vehicleDoc("Select City", 3);
    }

    @Override
    public void cityfailure(Response<List<CityModel>> Response) {
        System.out.println("failed2..");
    }

    private void vehicleDoc(String title, int status) {
        final LayoutInflater inflater = (LayoutInflater) activity.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        assert inflater != null;
        View layout = inflater.inflate(R.layout.alert_doc, null);
        RecyclerView rclr_datas = (RecyclerView) layout.findViewById(R.id.rclr_datas);
        TextView txtHeading = (TextView) layout.findViewById(R.id.txtHeading);
        @SuppressLint("WrongConstant") LinearLayoutManager layoutManagershops
                = new LinearLayoutManager(activity, LinearLayoutManager.VERTICAL, false);
        rclr_datas.setLayoutManager(layoutManagershops);
        txtHeading.setVisibility(View.VISIBLE);
        txtHeading.setText(title);
        System.out.println("status..."+status+"countries..."+countries+"states..."+states+"city..."+cities);
        docAdapter = new DocAdapter(activity, status, countries, states, cities);
        rclr_datas.setAdapter(docAdapter);

        AlertDialog.Builder alert = new AlertDialog.Builder(activity);
        alert.setView(layout);
        alert.setCancelable(true);
        alert11 = alert.create();
        alert11.show();
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        if (!termsConditionTxt.isChecked()) {
            Utiles.CommonToast(activity, getString(R.string.please_accepted_terms_android_condition));
            return;
        }
        if ((passwordEdt.length() < 6)) {
            passwordEdt.setError("Enter Minimum 6 Character");
        } else if (!isValidPassword(passwordEdt.getText().toString())){
            passwordEdt.setError("Mix of letters and numbers and at least one capital letter, and one punctuation mark");
        } else {

            registerPresenter.getOTP(Objects.requireNonNull(mobileEdt.getText()).toString(), Objects.requireNonNull(emailEdt.getText()).toString(), Objects.requireNonNull(ccEdt.getText()).toString(), "", activity);
        }
    }

    public static boolean isValidPassword(final String password) {

        Pattern pattern;
        Matcher matcher;
        final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{4,}$";
        pattern = Pattern.compile(PASSWORD_PATTERN);
        matcher = pattern.matcher(password);
        return matcher.matches();

    }

    private void getRegisterApi() {
        HashMap<String, String> map = new HashMap<>();
        map.put("fname", Objects.requireNonNull(fnameEdit.getText()).toString());
        map.put("lname", Objects.requireNonNull(lnameEdt.getText()).toString());
        map.put("email", Objects.requireNonNull(emailEdt.getText()).toString());
        map.put("phcode", Objects.requireNonNull(ccEdt.getText()).toString());
        map.put("countryCode", Objects.requireNonNull(countrycode.getText()).toString());
        map.put("phone", Objects.requireNonNull(mobileEdt.getText()).toString());
        map.put("password", Objects.requireNonNull(passwordEdt.getText()).toString());
        map.put("mobileDetails", Utiles.createBrandInfo());
        map.put("fcmId", SharedHelper.getToken(context, "device_token"));
        map.put("gender", strGendeType);
        map.put("cnty", strCountryid);
        map.put("cntyname", Objects.requireNonNull(countryEdt.getText()).toString());
        map.put("lang", CommonData.strLanguage);
        map.put("state", strStateid);
        map.put("statename", Objects.requireNonNull(stateEdt.getText()).toString());
        map.put("city", strCityid);
        map.put("cityname", Objects.requireNonNull(cityEdt.getText()).toString());
        map.put("cur", CommonData.strCurrency);
        map.put("actMail", "");
        map.put("DOB", date);
        map.put("actHolder", "");
        map.put("actNo", "");
        map.put("actBank", "");
        map.put("actLoc", "");
        map.put("actCode", "");

        registerPresenter.getRegisterApi(map, activity);

        SharedHelper.putKey(context, "licence", "");
        SharedHelper.putKey(context, "licence_date", "");
        SharedHelper.putKey(context, "insurance", "");
        SharedHelper.putKey(context, "insurance_date", "");
        SharedHelper.putKey(context, "passing", "");
        SharedHelper.putKey(context, "passing_date", "");
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(activity);
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
                passwordEdt.setError("Enter the password");
            } else {
                Toast.makeText(activity, message, Toast.LENGTH_LONG).show();
            }
        }
    }

    private void moveToFragment(Fragment fragment) {
        getActivity().getSupportFragmentManager().beginTransaction()
                .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();

    }


    @Override
    public void onConnected(@Nullable Bundle bundle) {

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    public void mobileNumberParse(String number) {
        try {
            PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
            Phonenumber.PhoneNumber numberProto = phoneUtil.parse(number, "");
            int countryCode = numberProto.getCountryCode();
            long nationalNumber = numberProto.getNationalNumber();
            mobileEdt.setText(String.valueOf(nationalNumber));

        } catch (NumberParseException e) {
            System.err.println("NumberParseException was thrown: " + e.toString());
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_HINT && resultCode == Activity.RESULT_OK) {

            Credential credential = data.getParcelableExtra(Credential.EXTRA_KEY);
            assert credential != null;
            System.out.println("enter the mobile number" + credential.getId());
            mobileNumberParse(credential.getId());

        }
    }

    @Override
    public void onOTPReceived(String otp) {
        if (smsBroadcast != null) {
            EventBus.getDefault().postSticky(new OTPEvent(otp));
            activity.unregisterReceiver(smsBroadcast);
            smsBroadcast = null;
        }
    }

    @Override
    public void onOTPTimeOut() {

    }

    private void showDialog(ArrayList<?> data, String title) {
        if (bottomSheetDialogFragment != null && bottomSheetDialogFragment.isAdded()) {
            bottomSheetDialogFragment.dismiss();
        }
        bottomSheetDialogFragment = new SelectionBottomSheetFragment(title, data, value -> {
            if (value instanceof CityModel) {
                strCityid = ((CityModel) value).getId();
                cityEdt.setText(((CityModel) value).getName());
                bottomSheetDialogFragment.dismiss();
            } else if (value instanceof CountryModel) {
                stateEdt.setText("");
                cityEdt.setText("");
                subscriptionPresenter.getStateListApi(((CountryModel) value).getId());
                strCountryid = ((CountryModel) value).getId();
                countryEdt.setText(((CountryModel) value).getName());
                bottomSheetDialogFragment.dismiss();
            } else if (value instanceof StateModel) {
                cityEdt.setText("");
                subscriptionPresenter.getCityListApi(((StateModel) value).getId());
                strStateid = ((StateModel) value).getId();
                stateEdt.setText(((StateModel) value).getName());
                bottomSheetDialogFragment.dismiss();
            }

        });
        bottomSheetDialogFragment.show(getFragmentManager(), "show_dialog");
    }

    @Override
    public void onSuccess(Object object, String fromApi) {
        switch (fromApi) {

            case "country":
                countryList = (ArrayList<CountryModel>) object;
                break;
            case "state":
                stateModellist = (ArrayList<StateModel>) object;
                break;
            case "city":
                cityModellist = (ArrayList<CityModel>) object;
                break;
        }

    }

    @Override
    public void onFailure(Throwable throwable) {
        try {
            if (throwable instanceof HttpException) {
                HttpException error = (HttpException) throwable;
                String errorBody = Objects.requireNonNull(error.response().errorBody()).string();
                Utiles.showErrorMessage(errorBody, context, getView());
            } else {
                Utiles.displayMessage(getView(), context, "Poor network connection");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), context, "Poor network connection");
        }

    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);

    }

    @Override
    public void dismissLoader() {
        Utiles.DismissLoader();
    }

    private void initCalendar() {
        if (dpd != null && dpd.isAdded()) {
            dpd.dismiss();
        }
        Calendar minDate = Calendar.getInstance();
        dpd.setYearRange(1950, Calendar.getInstance().get(Calendar.YEAR) - 20);
        minDate.add(Calendar.DATE, 0);
        //   dpd.setMaxDate(minDate);
        dpd.show(getParentFragmentManager(), "datePicker");
    }

    @Override
    public void onDateSet(DatePickerDialog view, int year, int monthOfYear, int dayOfMonth) {
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
        String date = month + "-" + day + "-" + year;
        referralEdt.setText(date);
    }
}
