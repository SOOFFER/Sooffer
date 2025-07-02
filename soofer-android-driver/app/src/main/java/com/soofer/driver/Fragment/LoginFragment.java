package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.JWTUtils;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Fragment.document.DocumentUploadListFragment;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Model.LoginModel;
import com.soofer.driver.Presenter.DriverProfilePresenter;
import com.soofer.driver.Presenter.LoginPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.Loginview;
import com.soofer.driver.View.ProfileView;
import com.ybs.countrypicker.CountryPicker;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import com.soofer.driver.CommonClass.CommonData;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class LoginFragment extends BaseFragment implements Loginview, Validator.ValidationListener, ProfileView {

   // @NotEmpty(message = getString(R.string.enter_the_driver_Code_mobile_number))
    @NotEmpty(message = "Enter the Driver code or Mobile Number")
    @BindView(R.id.email_edt)
    EditText emailEdt;

    //@NotEmpty(message = getString(R.string.enter_password))
    @NotEmpty(message = "Enter the Password")
    @BindView(R.id.password_edt)
    EditText passwordEdt;
    @BindView(R.id.login_btn)
    Button loginBtn;
    @BindView(R.id.fpassword_txt)
    TextView fpasswordTxt;
    Unbinder unbinder;

    public LoginFragment() {
        // Required empty public constructor
    }

    Context context;
    Activity activity;
    private Validator validator;
    private CountryPicker picker;
    private String strCountryCountry = "";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);

        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        CommonData.walletBalance = "0";
        validator = new Validator(this);
        validator.setValidationListener(this);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        picker = CountryPicker.newInstance("Select Country");  // dialog title
        picker.setListener((name, code, dialCode, flagDrawableResID) -> {
            strCountryCountry = dialCode;
            picker.dismiss();
            LoginApiCall();
            // Implement your code here
        });
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
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();

    }


    @OnClick({R.id.login_btn, R.id.fpassword_txt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                //startActivity(new Intent(context, MainActivity.class));
                validator.validate();
                break;
            case R.id.fpassword_txt:
                Fragment fragment = new ForgotPasswordFragment();
                FragmentManager fragmentManager = getFragmentManager();
                FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                fragmentTransaction.replace(R.id.login_fragment, fragment);
                fragmentTransaction.addToBackStack("ForgetPassword");
                fragmentTransaction.commit();
                break;
        }
    }

    @Override
    public void LoginVIew(Response<LoginModel> Response) {
        try {
            SharedHelper.putKey(context, "token", Response.body().getToken());
            new JWTUtils(null, this).decoded(Response.body().getToken(), context, "login");
            Log.e("tokentoken", "" + Response.body().getToken());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void Errorlogview(Response<LoginModel> Response) {
        try {
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")){
                if (jsonObject.optString("message").equalsIgnoreCase("INVALID_PASSWORD")){
                    Utiles.displayMessage(getView(), context, getString(R.string.invalidpass));
                }else {
                    Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
                }


            }

        } catch (IOException| JSONException e) {
            Utiles.displayMessage(getView(), context, "Something went Wrong");
        }
    }

    @Override
    public void JsonResponse(String object) {
        try {
            JSONObject obj = new JSONObject(object);
            String email = obj.optString("email");
            String name = obj.optString("name");
            String id = obj.optString("id");

            Log.e("response", "" + email + "==" + name + "==" + id);
            SharedHelper.putKey(context, "login_status", "true");
            SharedHelper.putKey(context, "userid", id);
            SharedHelper.putKey(context, "email", email);
            SharedHelper.putKey(context, "appflow", "login");
            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
            ref.child("drivers_data").child(id).child("FCM_id").setValue(SharedHelper.getToken(context, "device_token"));
            ProfilePresenter();
          //  Utiles.ClearFirebase(activity);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void ProfilePresenter() {
        DriverProfilePresenter driverProfilePresenter = new DriverProfilePresenter(this);
        driverProfilePresenter.getProfile(activity, true);
    }

    @Override
    public void onValidationSucceeded() {
        if (checkForMobile(emailEdt.getText().length())) {
            strCountryCountry = "+91";
            LoginApiCall();
        } else {
            LoginApiCall();
        }
        //  startActivity(new Intent(context, MainActivity.class));
    }

    private boolean checkForMobile(int NumberProto) {
        if (NumberProto >= 10) {
            return true;
        } else {
            return false;
        }
    }

    private void LoginApiCall() {
        Utiles.hideKeyboard(activity);
        HashMap<String, String> map = new HashMap<>();
        map.put("username", emailEdt.getText().toString());
        map.put("password", passwordEdt.getText().toString());
        map.put("phcode", strCountryCountry);
        map.put("mobileDetails", Utiles.createBrandInfo());
        map.put("fcmId", SharedHelper.getToken(context, "device_token"));
        Log.e("tage", "Login url" + map);
        LoginPresenter loginPresenter = new LoginPresenter(this);
        loginPresenter.getLogin(map, activity);
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(activity);
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
            } else {
                Toast.makeText(activity, message, Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void OnSuccessfully(Response<List<DriverProfileModel>> Response) {
        List<DriverProfileModel> driverProfileModels = Response.body();
        assert driverProfileModels != null;
        SharedHelper.putKey(context, "fname", driverProfileModels.get(0).getFname());
        SharedHelper.putKey(context, "drivercode", driverProfileModels.get(0).getCode());
        SharedHelper.putKey(context, "gender", Response.body().get(0).getGender());
        SharedHelper.putKey(context, "attendance", driverProfileModels.get(0).getAttendance().toString());
        SharedHelper.putKey(context, "lname", driverProfileModels.get(0).getLname());
        SharedHelper.putKey(context, "email", driverProfileModels.get(0).getEmail());
        SharedHelper.putKey(context, "phcode", driverProfileModels.get(0).getPhcode());
        SharedHelper.putKey(context, "phone", driverProfileModels.get(0).getPhone());
        SharedHelper.putKey(context, "lang", driverProfileModels.get(0).getLang());
        SharedHelper.putKey(context, "cur", driverProfileModels.get(0).getCur());
        SharedHelper.putKey(context, "code", driverProfileModels.get(0).getCode());
        SharedHelper.putKey(context, "filepath", driverProfileModels.get(0).getBaseurl());
        SharedHelper.putKey(context, "card_number", Response.body().get(0).getCard().getLast4());
        SharedHelper.putOnline(activity, "isconnect", driverProfileModels.get(0).getIsConnected());
        if (Utiles.IsNull(driverProfileModels.get(0).getLicence())) {
            SharedHelper.putKey(context, "licence", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicence());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getInsurance())) {
            SharedHelper.putKey(context, "insurance", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsurance());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getPassing())) {
            SharedHelper.putKey(context, "passing", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassing());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getInsuranceBackImg())) {
            SharedHelper.putKey(context, "insuranceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsuranceBackImg());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getPassingBackImg())) {
            SharedHelper.putKey(context, "passingBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassingBackImg());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getLicenceBackImg())) {
            SharedHelper.putKey(context, "licenceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicenceBackImg());

        }
        SharedHelper.putKey(context, "licence_date", driverProfileModels.get(0).getLicenceexp());
       //  SharedHelper.putKey(context, "insurance_date", driverProfileModels.get(0).getAadharexp());
       //  SharedHelper.putKey(context, "passing_date", driverProfileModels.get(0).getPassingexp());
        Constants.WalletAlertEnable = driverProfileModels.get(3).getIsDriverCreditModuleEnabledForUseAfterLogin();

        SharedHelper.putKey(context, "profile", driverProfileModels.get(1).getProfileurl());

        SharedHelper.putKey(context,"driver_earned",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());
        SharedHelper.putKey(context,"driver_admin",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getAdminCommision());
        SharedHelper.putKey(context,"driver_tax",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTax());
        SharedHelper.putKey(context,"GatewayCharge",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getGateway());
        SharedHelper.putKey(context,"driver_cash",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getCashCollected());
        SharedHelper.putKey(context,"driver_ridefare",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getRideFare());
        SharedHelper.putKey(context,"date",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getDate());
        SharedHelper.putKey(context,"km",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotalDistance());
        SharedHelper.putKey(context,"rides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotTrips());

        SharedHelper.putKey(context, "support_num", Response.body().get(5).getConfigData().getSupportNo());
        SharedHelper.putKey(context, "google_key", Response.body().get(5).getConfigData().getGoogleApi());
        SharedHelper.putKey(context, "google_autocomplete", Response.body().get(5).getConfigData().getGoogleApiAutoComplete());
        if (driverProfileModels.get(2).getCurrentActiveTaxi() != null) {

            SharedHelper.putKey(context, "vehicleId", driverProfileModels.get(2).getCurrentActiveTaxi().getId());
            SharedHelper.putKey(context, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
            SharedHelper.putKey(context, "vmake", driverProfileModels.get(2).getCurrentActiveTaxi().getMakename());
            SharedHelper.putKey(context, "vmodel", driverProfileModels.get(2).getCurrentActiveTaxi().getModel());
            SharedHelper.putKey(context, "numplate", driverProfileModels.get(2).getCurrentActiveTaxi().getLicence());
            SharedHelper.putKey(context, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());

            Intent i = new Intent(context, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(i);
            activity.finishAffinity();
        } else {

            if(driverProfileModels.get(0).getDocument().isEmpty()){

                Alertdialogs();
            }else{
                Alertdialog();
            }


        }
    }

    @Override
    public void OnFailure(Response<List<DriverProfileModel>> Response) {
        try {
            assert Response.errorBody() != null;
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    private void Alertdialog() {
        android.app.AlertDialog.Builder builder1 = new android.app.AlertDialog.Builder(context);
        builder1.setMessage(R.string.please_added_vehicle);
        builder1.setCancelable(false);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.ok),
                (dialog, id) -> {
                    SharedHelper.putKey(Objects.requireNonNull(getContext()), "appflow", "registration");
                    Fragment fragment = new AddVehicleFragment();
                    moveToFragment(fragment);
                    dialog.cancel();

                });
        android.app.AlertDialog alert11 = builder1.create();
        alert11.show();
    }

    private void Alertdialogs() {
        android.app.AlertDialog.Builder builder1 = new android.app.AlertDialog.Builder(context);
        builder1.setMessage(R.string.please_added_driver);
        builder1.setCancelable(false);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.ok),
                (dialog, id) -> {
                    SharedHelper.putKey(Objects.requireNonNull(getContext()), "appflow", "registration");
                    Fragment fragment = new DocumentUploadListFragment("driver", true);
                    moveToFragment(fragment);
                    dialog.cancel();

                });
        android.app.AlertDialog alert11 = builder1.create();
        alert11.show();
    }

    private void moveToFragment(Fragment fragment) {
        assert getFragmentManager() != null;
        getFragmentManager().beginTransaction()
                .replace(R.id.login_fragment, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

    }
}