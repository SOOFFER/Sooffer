package com.soofer.app.Fragment;

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

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.soofer.app.Activity.HomeActivity;
import com.google.gson.Gson;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonFirebaseListoner;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.JWTUtils;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.SocialEvent;
import com.soofer.app.EventBus.SocialResponseEvent;
import com.soofer.app.Model.LoginModel;
import com.soofer.app.Model.ProfileModel;
import com.soofer.app.Presenter.LoginPresenter;
import com.soofer.app.Presenter.ProfilePresenter;

import com.soofer.app.R;
import com.soofer.app.View.Loginview;
import com.soofer.app.View.ProfileView;
import com.ybs.countrypicker.CountryPicker;
import com.ybs.countrypicker.CountryPickerListener;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class LoginFragment extends BaseFragment implements Loginview, Validator.ValidationListener, ProfileView {

    //@NotEmpty(message = getString(R.string.enter_the_email_or_mobile))
    @NotEmpty(message = "Enter the Valid Email or Mobile")
    @BindView(R.id.email_edt)
    EditText emailEdt;
  //  @NotEmpty(message = getString(R.string.enter_the_password))
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
    Validator validator;
    CountryPicker picker;
    private String strCountryCountry = "", strEmailorMobile = "", strType = "normal", strid = "";

    FirebaseAuth mAuth;
    String customToken;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);

        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();

        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        validator = new Validator(this);
        validator.setValidationListener(this);

        picker = CountryPicker.newInstance("Select Country");  // dialog title
        picker.setListener(new CountryPickerListener() {
            @Override
            public void onSelectCountry(String name, String code, String dialCode, int flagDrawableResID) {
                strCountryCountry = dialCode;
                picker.dismiss();
                getLogin();
                // Implement your code here
            }
        });
       /* new Thread(() -> {

                System.out.println("emter the new token"+ FirebaseInstanceId.getInstance().getToken());

        }).start();*/

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
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }

    }


    @OnClick({R.id.login_btn, R.id.fpassword_txt,R.id.gmail_img,R.id.fb_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                Utiles.hideKeyboard(activity);
                validator.validate();
                break;
            case R.id.fpassword_txt:
                Fragment fragment = new ForgotPasswordFragment();
                FragmentManager fragmentManager = getFragmentManager();
                FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                fragmentTransaction.replace(R.id.login_fragment, fragment);
                fragmentTransaction.addToBackStack("ForgetPassword");
                fragmentTransaction.commitAllowingStateLoss();
                break;
            case R.id.gmail_img:
                EventBus.getDefault().post(new SocialEvent("gmail", "login"));
                break;
            case R.id.fb_img:
                EventBus.getDefault().post(new SocialEvent("facebook", "login"));
                break;
        }
    }

    @Override
    public void LoginVIew(Response<LoginModel> Response) {
        try {
            SharedHelper.putKey(context, "token", Response.body().getToken());
            SharedHelper.putKey(context, "FbCusToken", Response.body().getFbCusToken());
            customToken = SharedHelper.getKey(context, "FbCusToken");
            new JWTUtils(null, this);
            JWTUtils.decoded(Response.body().getToken(), "login");
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
            String email = obj.getString("email");
            String name = obj.getString("name");
            String id = obj.getString("id");
            Log.e("response", email + "==" + name + "==" + id);

            SharedHelper.putKey(getContext(), "userid", id);
            SharedHelper.putKey(getContext(), "email", email);
            DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
            mAuth = FirebaseAuth.getInstance();
            mAuth.signOut();
            mAuth.signInWithCustomToken(customToken).addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    System.out.println("User is authenticated with Firebase" + id);
                    CommonFirebaseListoner.FirebaseTripFlow();
                    ref.child("riders_data").child(id).child("FCM_id").setValue(SharedHelper.getToken(context, "device_token"));
                    ProfilePresenter profilePresenter = new ProfilePresenter(this);
                    profilePresenter.getProfile(activity, true);
                } else {
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
    public void onValidationSucceeded() {
        if (checkForEmail(emailEdt.getText().toString())) {
            if (checkForMobile(emailEdt.getText().toString())) {
                strCountryCountry = "+91";
                //picker.show(getFragmentManager(), "COUNTRY_PICKER");
                strEmailorMobile = emailEdt.getText().toString();
                getLogin();
            } else {
                Utiles.displayMessage(getView(), context, getString(R.string.entervalidemailornumber));
            }
        } else {
            strEmailorMobile = emailEdt.getText().toString();
            getLogin();
        }

    }

    public void getLogin() {
        Utiles.hideKeyboard(activity);
        HashMap<String, String> map = new HashMap<>();
        map.put("username", strEmailorMobile);
        map.put("password", passwordEdt.getText().toString());
        map.put("phcode", strCountryCountry);
        map.put("loginType", strType);
        map.put("loginId", strid);
        map.put("fcmId", SharedHelper.getToken(context, "device_token"));
        Log.e("tage", "Login tag" + map);
        LoginPresenter loginPresenter = new LoginPresenter(this);
        loginPresenter.getLogin(map, activity);
    }

    public boolean checkForEmail(String mStrEmail) {
        Context c;


        if (android.util.Patterns.EMAIL_ADDRESS.matcher(mStrEmail).matches()) {
            return false;
        }
        return true;
    }


    public boolean checkForMobile(String mStrMobile) {
        if (android.util.Patterns.PHONE.matcher(mStrMobile).matches()) {
            return true;
        }

        return false;
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
    public void OnSuccessfully(Response<List<ProfileModel>> Response) {
        Utiles.hideKeyboard(activity);
        try {
            SharedHelper.putKey(context, "fname", Response.body().get(0).getFname());
            SharedHelper.putKey(context, "lname", Response.body().get(0).getLname());
            SharedHelper.putKey(context, "referal_code", Response.body().get(0).getReferal());
            SharedHelper.putKey(context, "gender", Response.body().get(0).getGender());

            SharedHelper.putKey(context, "emailid", Response.body().get(0).getEmail());
            SharedHelper.putKey(context, "cc", Response.body().get(0).getPhcode());
            SharedHelper.putKey(context, "mobile", Response.body().get(0).getPhone());
            SharedHelper.putKey(context, "language", Response.body().get(0).getLang());
            SharedHelper.putKey(context, "currency", Response.body().get(0).getCur());
            SharedHelper.putKey(context, "card_number", Response.body().get(0).getCard().getLast4());
            SharedHelper.putKey(context, "profile", Response.body().get(1).getProfileurl());
            SharedHelper.putKey(context,"favorite",new Gson().toJson(Response.body().get(0).getAddress()));
            SharedHelper.putKey(context, "support_num", Response.body().get(3).getConfigData().getSupportNo());
            SharedHelper.putKey(context,"outstationflow",Response.body().get(3).getConfigData().getNeededOutstationFlow());
            SharedHelper.putKey(context,"twoDriverFlow",Response.body().get(3).getConfigData().getNeedTwoDriverFlow());
            SharedHelper.putKey(context,"rentalflow",Response.body().get(3).getConfigData().getNeedRentalFlow());

            if(Response.body().get(0).getEmgContact()!=null &&Response.body().get(0).getEmgContact().isEmpty()){
                SharedHelper.putStatus(context, "isEmergency", false);
            }else {
                SharedHelper.putStatus(context, "isEmergency", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Intent i = new Intent(context, HomeActivity.class);
        startActivity(i);
        activity.finishAffinity();
    }

    @Override
    public void OnFailure(Response<List<ProfileModel>> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");

    }
    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Event(SocialResponseEvent event) {
        if (event.getNsocialModel().getTopage().equalsIgnoreCase("login")) {
            strEmailorMobile = event.getNsocialModel().getEmail();
            strid = event.getNsocialModel().getId();
            strType = event.getNsocialModel().getType();
            getLogin();

        }
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

}
