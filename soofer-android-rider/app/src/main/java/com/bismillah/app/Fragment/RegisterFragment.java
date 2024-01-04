package com.bismillah.app.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import android.telephony.TelephonyManager;
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
import android.widget.Toast;

import com.bismillah.app.Activity.HomeActivity;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.credentials.Credential;
import com.google.android.gms.auth.api.credentials.HintRequest;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.tasks.Task;
import com.google.gson.Gson;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Email;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.bismillah.app.Appcontroller.MySMSBroadcastReceiver;
import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CustomizeDialog.OTPDialog;
import com.bismillah.app.EventBus.OTPEvent;
import com.bismillah.app.EventBus.SocialEvent;
import com.bismillah.app.EventBus.SocialResponseEvent;
import com.bismillah.app.Model.OTPModel;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.JWTUtils;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.ProfileModel;
import com.bismillah.app.Model.RegisterModel;
import com.bismillah.app.Presenter.ProfilePresenter;
import com.bismillah.app.Presenter.RegisterPresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.ProfileView;
import com.bismillah.app.View.RegisterView;
import com.ybs.countrypicker.Country;
import com.ybs.countrypicker.CountryPicker;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.bismillah.app.CommonClass.CommonData;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.ghyeok.stickyswitch.widget.StickySwitch;
import retrofit2.Response;


public class RegisterFragment extends BaseFragment implements RegisterView, Validator.ValidationListener, ProfileView, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, MySMSBroadcastReceiver.OTPReceiveListener {

    @BindView(R.id.back_img)
    ImageButton backImg;


    @NotEmpty(message = "")
  //  @Length(min = 4, message = getString(R.string.enter_minum_maximum))
    @Length(min = 4, message = "Enter 4 Minimum to 12 Character")
    @BindView(R.id.fname_edit)
    MaterialEditText fnameEdit;

    @BindView(R.id.lname_edt)
    MaterialEditText lnameEdt;
    @NotEmpty(message = "")
    @Email(message = "Enter Valid Email id")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @NotEmpty(message = "")
  //  @Length(min = 6, message = getString(R.string.enter_password_minimum_maximum))
//    @Length(min = 6, message = "Enter the Minimum 6 to 12 Character")
    @BindView(R.id.password_edt)
    MaterialEditText passwordEdt;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;
    @NotEmpty(message = "")
  //  @Length(min = 6,max = 15 ,message = getString(R.string.enter_mobile_number_minmum_maximum))
    @Length(min = 6,max = 10 , message = "Enter the Minimum 6 to 10 Character")
    @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.referral_edt)
    MaterialEditText referralEdt;
    @BindView(R.id.terms_condition_txt)
    CheckBox termsConditionTxt;
    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.stickySwitch)
    StickySwitch stickySwitch;
    private Unbinder unbinder;
    private Context context;

    private CountryPicker picker;

    public RegisterFragment() {
    }

   private Validator validator;
    Activity activity;
    private  RegisterPresenter registerPresenter;
    private GoogleApiClient client;
    private  MySMSBroadcastReceiver smsBroadcast;
    private int RC_HINT = 2;
    private   FragmentActivity fragmentActivity;

    private String strGendeType ="Male";
    private String strFirstname, strLastname, strEmail, strCoutryCode, strMobile, strId = "", strType = "normal";
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_register, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        validator = new Validator(this);
        validator.setValidationListener(this);
        registerPresenter = new RegisterPresenter(this);
        if (Build.VERSION.SDK_INT >= 23) {
            String[] PERMISSIONS = {android.Manifest.permission.READ_PHONE_STATE};
            if (!hasPermissions(context, PERMISSIONS)) {
                ActivityCompat.requestPermissions((Activity) context, PERMISSIONS, 1);
            } else {
                SimCardStatusChecked();
            }
        } else {
            SimCardStatusChecked();
        }
        stickySwitch.setOnSelectedChangeListener((direction, s) -> strGendeType = s);
        fragmentActivity = getActivity();
        picker = CountryPicker.newInstance("Select Country");  // dialog title
        picker.setListener((name, code, dialCode, flagDrawableResID) -> {
            ccEdt.setText(dialCode);
            picker.dismiss();
            // Implement your code here
        });

        try {
            if (client == null) {
                client = new GoogleApiClient.Builder(activity)
                        .addConnectionCallbacks(this)
                        .enableAutoManage(fragmentActivity, this)
                        .addApi(Auth.CREDENTIALS_API)
                        .build();
                client.connect();
                requestHint();
            }
        } catch (IllegalStateException e) {
            e.printStackTrace();
        }

        startSMSListener();
        smsBroadcast = new MySMSBroadcastReceiver();
        smsBroadcast.initOTPListener(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(SmsRetriever.SMS_RETRIEVED_ACTION);
        activity.registerReceiver(smsBroadcast, intentFilter);

        passwordEdt.setOnTouchListener((v, event) -> {
            final int DRAWABLE_RIGHT = 2;
            if(event.getAction() == MotionEvent.ACTION_UP) {
                if(event.getRawX() >= (passwordEdt.getRight() - passwordEdt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                    // your action here
                    if(passwordEdt.getTag()==null){
                        passwordEdt.setTag(true);
                        passwordEdt.setTransformationMethod(null);
                        Utiles.iconChange(passwordEdt,true,activity);
                        return true;
                    }
                    if((boolean) passwordEdt.getTag()){

                        passwordEdt.setTransformationMethod(new PasswordTransformationMethod());
                    }else {
                        passwordEdt.setTransformationMethod(null);

                    }
                    passwordEdt.setTag(!(boolean) passwordEdt.getTag());
                    Utiles.iconChange(passwordEdt,(boolean) passwordEdt.getTag(),activity);
                    return true;
                }
            }
            return false;
        });


        return view;

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
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.submit, R.id.cc_edt,R.id.terms_contionlink,R.id.gmail_img,R.id.fb_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                assert getFragmentManager() != null;
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.submit:
                Utiles.hideKeyboard(activity);
                validator.validate();
                break;
            case R.id.cc_edt:
                assert getFragmentManager() != null;
                picker.show(getFragmentManager(), "COUNTRY_PICKER");
                break;
            case R.id.terms_contionlink:
                moveToFragment(new SupportFragment());
                break;
            case R.id.gmail_img:
                EventBus.getDefault().post(new SocialEvent("gmail", "register"));
                break;
            case R.id.fb_img:
                EventBus.getDefault().post(new SocialEvent("facebook", "register"));
                break;
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

    private void requestHint() {
        HintRequest hintRequest = new HintRequest.Builder()
                .setPhoneNumberIdentifierSupported(true)
                .build();
        try {
            PendingIntent intent = Auth.CredentialsApi.getHintPickerIntent(
                    client, hintRequest);
            activity.startIntentSenderForResult(intent.getIntentSender(), RC_HINT, null, 0, 0, 0);
        } catch (IntentSender.SendIntentException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void RegisterView(Response<RegisterModel> Response) {
        Log.e("tage", "token in " + Response.body().getToken());
        try {
            SharedHelper.putKey(activity, "token", Response.body().getToken());
            new JWTUtils(this, null).decoded(Response.body().getToken(), "reg");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void Errorlogview(Response<RegisterModel> Response) {
        try {
            assert Response.errorBody() != null;
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, "Something went Wrong");
        }
    }

    @Override
    public void JsonResponse(String object) {
        try {
            JSONObject obj = new JSONObject(object);
            String email = obj.getString("email");
            String name = obj.getString("name");
            String id = obj.getString("id");
            Log.e("response", "" + email + "==" + name + "==" + id);

            SharedHelper.putKey(Objects.requireNonNull(getContext()), "userid", id);
            SharedHelper.putKey(getContext(), "email", email);

            ProfilePresenter profilePresenter = new ProfilePresenter(this);
            profilePresenter.getProfile(activity, true);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccessOTP(Response<OTPModel> Response) {
        assert Response.body() != null;
        System.out.println("Enter OTP code" + Response.body().getCode());
        JSONObject jsonObject = new JSONObject();
        try {

            jsonObject.put("mobile", Objects.requireNonNull(mobileEdt.getText()).toString());
            jsonObject.put("cc", Objects.requireNonNull(ccEdt.getText()).toString());
            jsonObject.put("email", Objects.requireNonNull(emailEdt.getText()).toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        OTPDialog dialogClass = new OTPDialog(activity, Response.body().getCode(),this,jsonObject);
        Objects.requireNonNull(dialogClass.getWindow()).getAttributes().windowAnimations = R.style.DialogTheme;
        try {
            dialogClass.setCancelable(false);
            dialogClass.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
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
            Utiles.displayMessage(getView(), context, "Something went Wrong");
        }

    }

    @Override
    public void OTPVerification() {
        Utiles.hideKeyboard(activity);
        strFirstname = Objects.requireNonNull(fnameEdit.getText()).toString();
        strLastname = Objects.requireNonNull(lnameEdt.getText()).toString();
        strEmail = Objects.requireNonNull(emailEdt.getText()).toString();
        strCoutryCode = Objects.requireNonNull(ccEdt.getText()).toString();
        strMobile = Objects.requireNonNull(mobileEdt.getText()).toString();
        strType = "normal";
        RegisterationModel();
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        if(!termsConditionTxt.isChecked()){
            Utiles.CommonToast(context,"Please accept Terms and condition");
            return;
        }
        if ((passwordEdt.length() < 6)) {
            passwordEdt.setError("Enter Minimum 6 Character");
        } else if (!isValidPassword(passwordEdt.getText().toString())){
            passwordEdt.setError("Use mix of Letters, Numbers, Capital Letters, Punctuations for Strong Password");
        } else {
        registerPresenter.getOTP(Objects.requireNonNull(mobileEdt.getText()).toString(), Objects.requireNonNull(emailEdt.getText()).toString(), Objects.requireNonNull(ccEdt.getText()).toString(),"", activity);
        }
    }

    private void RegisterationModel() {
        HashMap<String, String> map = new HashMap<>();
        map.put("fname", strFirstname);
        map.put("lname", strLastname);
        map.put("email", strEmail);
        map.put("phone", strMobile);
        map.put("password", Objects.requireNonNull(passwordEdt.getText()).toString());
        map.put("phcode", strCoutryCode);
        map.put("gender", strGendeType);
        map.put("cnty", "");
        map.put("loginType", strType);
        map.put("loginId", strId);
        map.put("fcmId", SharedHelper.getToken(context, "device_token"));
        map.put("cntyname", "");
        map.put("referal", Objects.requireNonNull(referralEdt.getText()).toString());
        map.put("lang", CommonData.strLanguage);
        map.put("cur", CommonData.strCurrency);
        registerPresenter.getRegisterApi(map, activity);
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

    @Override
    public void OnSuccessfully(Response<List<ProfileModel>> Response) {
        try {
            assert Response.body() != null;
            SharedHelper.putKey(context, "fname", Response.body().get(0).getFname());
            SharedHelper.putKey(context, "lname", Response.body().get(0).getLname());
            SharedHelper.putKey(context, "emailid", Response.body().get(0).getEmail());
            SharedHelper.putKey(context, "gender", Response.body().get(0).getGender());
            SharedHelper.putKey(context, "referal_code", Response.body().get(0).getReferal());
            SharedHelper.putKey(context, "cc", Response.body().get(0).getPhcode());
            SharedHelper.putKey(context, "mobile", Response.body().get(0).getPhone());
            SharedHelper.putKey(context, "language", Response.body().get(0).getLang());
            SharedHelper.putKey(context, "currency", Response.body().get(0).getCur());
            SharedHelper.putKey(context, "support_num", Response.body().get(3).getConfigData().getSupportNo());
            SharedHelper.putKey(context, "google_key", Response.body().get(3).getConfigData().getGoogleApi());
            SharedHelper.putKey(context, "google_autocomplete", Response.body().get(3).getConfigData().getGoogleApiAutoComplete());
            SharedHelper.putKey(context, "profile", Response.body().get(1).getProfileurl());
            SharedHelper.putKey(context,"favorite",new Gson().toJson(Response.body().get(0).getAddress()));
            SharedHelper.putKey(context,"outstationflow",Response.body().get(3).getConfigData().getNeededOutstationFlow());
            SharedHelper.putKey(context,"rentalflow",Response.body().get(3).getConfigData().getNeedRentalFlow());


        } catch (Exception e) {
            e.printStackTrace();
        }

        Intent i = new Intent(context, HomeActivity.class);
        startActivity(i);
        Utiles.UpDateRiders(SharedHelper.getKey(context, "userid"), context);
        activity.finishAffinity();
    }

    @Override
    public void OnFailure(Response<List<ProfileModel>> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 1: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    SimCardStatusChecked();
                    //Do here
                } else {
                    Utiles.CommonToast(activity, "Required Permission");
                }
            }
        }
    }

    private static boolean hasPermissions(Context context, String... permissions) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    private void SimCardStatusChecked() {
        TelephonyManager telMgr = (TelephonyManager) activity.getSystemService(Context.TELEPHONY_SERVICE);
        assert telMgr != null;
        int simState = telMgr.getSimState();
        switch (simState) {
            case TelephonyManager.SIM_STATE_ABSENT:
                Utiles.CommonToast(activity, "Please Check Sim Card");
                break;
            case TelephonyManager.SIM_STATE_NETWORK_LOCKED:
                Utiles.CommonToast(activity, "Please Check NetWork");

                // do something
                break;
            case TelephonyManager.SIM_STATE_PIN_REQUIRED:
                Utiles.CommonToast(activity, "Please Check Pin");
                // do something
                break;
            case TelephonyManager.SIM_STATE_PUK_REQUIRED:
                Utiles.CommonToast(activity, "Please Check PUK");
                // do something
                break;
            case TelephonyManager.SIM_STATE_READY:
                Countrycoder();
                break;
            case TelephonyManager.SIM_STATE_UNKNOWN:
                Utiles.CommonToast(activity, "Please Check Sim Card");
                // do something
                break;
        }
    }

    private void Countrycoder() {
        Country country = Country.getCountryFromSIM(context); //Get user country based on SIM card
        ccEdt.setText(country.getDialCode());
    }


    private void startSMSListener() {
        SmsRetrieverClient client = SmsRetriever.getClient(activity /* context */);
        Task<Void> task = client.startSmsRetriever();
        task.addOnSuccessListener(aVoid -> {
            // Utiles.CommonToast(activity, "start");
        });

        task.addOnFailureListener(e -> {
            // Failed to start retriever, inspect Exception for more details
            // ...
            //Utiles.CommonToast(activity, "Failed");
        });


    }

    private void mobileNumberParse(String number) {
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
    public void onConnected(@Nullable Bundle bundle) {

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }
    private void moveToFragment(Fragment fragment) {
        assert getFragmentManager() != null;
        getFragmentManager().beginTransaction()
                .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();

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

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Event(SocialResponseEvent event) {
        if (event.getNsocialModel().getTopage().equalsIgnoreCase("register")) {
            strFirstname = event.getNsocialModel().getFname();
            strLastname = event.getNsocialModel().getLname();
            strEmail = event.getNsocialModel().getEmail();
            strType = event.getNsocialModel().getType();
            strId = event.getNsocialModel().getId();
            strMobile = event.getMobile();
            strCoutryCode = event.getCode();
            strGendeType = event.getGender();
            RegisterationModel();
        }
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }
}
