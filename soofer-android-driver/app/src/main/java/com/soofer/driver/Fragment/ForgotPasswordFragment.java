package com.soofer.driver.Fragment;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.ForgetPasswordModel;
import com.soofer.driver.Model.OTPVerificationModel;
import com.soofer.driver.Presenter.ForgetPasswordPresenter;
import com.soofer.driver.View.ForgetPasswordView;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.R;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class ForgotPasswordFragment extends BaseFragment implements ForgetPasswordView, Validator.ValidationListener, View.OnTouchListener {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @NotEmpty(message = "Enter the Mobile Number")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @BindView(R.id.submit_btn)
    Button submitBtn;
    Unbinder unbinder;
    @BindView(R.id.password_edt)
    MaterialEditText passwordEdt;
    @BindView(R.id.confirmpassword_edt)
    MaterialEditText confirmpasswordEdt;
    @BindView(R.id.otp_edt)
    MaterialEditText otpEdt;
    @BindView(R.id.change_password_Layout)
    LinearLayout changePasswordLayout;
    String strPassowrd = "submit";

    public ForgotPasswordFragment() {
    }

    public static String strOTP;

    ForgetPasswordPresenter forgetPasswordPresenter;

    Activity activity;
    Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    Validator validator;

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_forgot_password, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        validator = new Validator(this);
        validator.setValidationListener(this);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        forgetPasswordPresenter = new ForgetPasswordPresenter(activity, this);
        passwordEdt.setOnTouchListener(this);
        confirmpasswordEdt.setOnTouchListener(this);
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
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.submit_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.submit_btn:
                if (strPassowrd.equalsIgnoreCase("Change Password")) {
                    if (Utiles.PasswordValidation(passwordEdt, null, "password")) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.enter_your_passwords));
                    } else if (Utiles.PasswordValidation(confirmpasswordEdt, null, "password")) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.confirm_password_min));
                    } else if (Utiles.PasswordValidation(passwordEdt, confirmpasswordEdt, "match")) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.enter_valid_confim_password));
                    } else if (Utiles.PasswordValidation(otpEdt, null, "opt")) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.enter_otp));
                    } else if (!strOTP.equals(otpEdt.getText().toString())) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.enter_valid_otp));
                    } else {
                        HashMap<String, String> map = new HashMap<>();
                        map.put("password", passwordEdt.getText().toString());
                        map.put("confirmpassword", confirmpasswordEdt.getText().toString());
                        map.put("otp", strOTP);
                        map.put("email", emailEdt.getText().toString());
                        forgetPasswordPresenter.OTPVerification(map);
                    }

                } else {
                    validator.validate();
                }
                break;
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccessfully(Response<ForgetPasswordModel> Response) {
        strPassowrd = "Change Password";
        submitBtn.setText(activity.getResources().getString(R.string.change_password));
        strOTP = Response.body().getOTP();
        emailEdt.setVisibility(View.GONE);
        changePasswordLayout.setVisibility(View.VISIBLE);
        Utiles.displayMessage(getView(), context, Response.body().getMessage());
    }

    @Override
    public void OnFailure(Response<ForgetPasswordModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void OnOtpSuccessfully(Response<OTPVerificationModel> Response) {
        Utiles.displayMessage(getView(), context, Response.body().getMessage());
        getFragmentManager().popBackStackImmediate();
    }

    @Override
    public void OnOtpFailure(Response<OTPVerificationModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void onValidationSucceeded() {
        forgetPasswordPresenter.SendEamilTOGenerateOPT(emailEdt.getText().toString());
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

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        final int DRAWABLE_RIGHT = 2;
        switch (v.getId()) {
            case R.id.password_edt:
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
                break;
            case R.id.confirmpassword_edt:
                if(event.getAction() == MotionEvent.ACTION_UP) {
                    if(event.getRawX() >= (confirmpasswordEdt.getRight() - confirmpasswordEdt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                        // your action here
                        if(confirmpasswordEdt.getTag()==null){
                            confirmpasswordEdt.setTag(true);
                            confirmpasswordEdt.setTransformationMethod(null);
                            Utiles.iconChange(confirmpasswordEdt,true,activity);
                            return true;
                        }
                        if((boolean) confirmpasswordEdt.getTag()){

                            confirmpasswordEdt.setTransformationMethod(new PasswordTransformationMethod());
                        }else {
                            confirmpasswordEdt.setTransformationMethod(null);

                        }
                        confirmpasswordEdt.setTag(!(boolean) confirmpasswordEdt.getTag());
                        Utiles.iconChange(confirmpasswordEdt,(boolean) confirmpasswordEdt.getTag(),activity);
                        return true;
                    }
                }
                break;
        }
        return false;
    }
}