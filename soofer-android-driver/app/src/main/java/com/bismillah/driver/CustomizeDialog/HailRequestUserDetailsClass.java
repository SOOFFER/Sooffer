package com.bismillah.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.bismillah.driver.Model.LocalModel.HailModel;
import com.bismillah.driver.R;
import com.rengwuxian.materialedittext.MaterialEditText;

import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class HailRequestUserDetailsClass extends Dialog implements Validator.ValidationListener {

    public Activity c;
    public Context context;
    public Dialog d;
 //   @NotEmpty(message = c.getString(R.string.enter_first_name))
   // @NotEmpty(message = "Enter First Name")
    @BindView(R.id.fname_edit)
    MaterialEditText fnameEdit;
   // @NotEmpty(message = c.getString(R.string.enter_last_name))
 //  @NotEmpty(message = "Enter Last Name")
   @BindView(R.id.lname_edt)
    MaterialEditText lnameEdt;
   // @NotEmpty(message = c.getString(R.string.enter_Email_id))
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;
    //@NotEmpty(message = c.getString(R.string.enter_mobile_number))
    @Length(min = 10 ,message = "Enter your 10 digit mobile number")
   // @NotEmpty(message = "Enter Mobile Number")
    @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.submit_txt)
    TextView submitTxt;
    @BindView(R.id.cancel_txt)
    TextView cancelTxt;


    private HailRequestValidation hailRequestValidation;
    private Validator validator;


    public HailRequestUserDetailsClass(@NonNull Activity a, HailRequestValidation hailRequestValidation) {
        super(a);
        this.c = a;
        this.hailRequestValidation = hailRequestValidation;

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.hail_user_details);
        context = c.getApplicationContext();
        ButterKnife.bind(this);
        validator = new Validator(this);
        validator.setValidationListener(this);
    }


    private boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
    }

    @OnClick({R.id.submit_txt,R.id.cancel_txt})
    public void onViewClicked(View view)
    {
        switch (view.getId()){
            case R.id.cancel_txt:
                dismiss();
                break;
            case R.id.submit_txt:
                validator.validate();
                break;
        }

    }

    @Override
    public void onValidationSucceeded() {
        hailRequestValidation.onCallback(new HailModel(Objects.requireNonNull(fnameEdit.getText()).toString(), Objects.requireNonNull(lnameEdt.getText()).toString(), emailEdt.getText().toString(), Objects.requireNonNull(ccEdt.getText()).toString(), Objects.requireNonNull(mobileEdt.getText()).toString()));
        dismiss();
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(c);
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
            } else {
                Toast.makeText(c, message, Toast.LENGTH_LONG).show();
            }
        }
    }

    public interface HailRequestValidation {
        void onCallback(HailModel hailModel);
    }

}
