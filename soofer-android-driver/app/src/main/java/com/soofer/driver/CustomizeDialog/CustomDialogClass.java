package com.soofer.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.ChangePasswordModel;
import com.soofer.driver.Presenter.ChangePasswordPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.ChangePasswordView;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import retrofit2.Response;

import static com.soofer.driver.CommonClass.Utiles.DismissiAnimation;

public class CustomDialogClass extends Dialog implements Validator.ValidationListener, View.OnClickListener, ChangePasswordView {

    public Activity c;
    public Context context;
    public Dialog d;
    //@NotEmpty(message = c.getString(R.string.enter_old_password))
    @NotEmpty(message = "Enter the Old Password")
    private
    MaterialEditText oldPasswordTxt;
    @NotEmpty(message = "")
    //  @Length(min = 6, max = 12, message = c.getString(R.string.enter_minimum))
    @Length(min = 6, max = 12, message = "Enter the Minimum 6 to 12 Character")
    private
    MaterialEditText newPasswordTxt;
    //  @Length(min = 6, max = 12, message = c.getString(R.string.enter_minimum))

    @NotEmpty(message = "")
    @Length(min = 6, max = 12, message = "Enter the Minimum 6 to 12 Character ")
    private
    MaterialEditText passwordAgainTxt;

    TextView cancelTxt;
    TextView okTxt;

    Validator validator;
    public View decorView;

    public CustomDialogClass(@NonNull Activity a) {
        super(a);
        this.c = a;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.changepassword);
        validator = new Validator(this);
        validator.setValidationListener(this);
        context = c.getApplicationContext();
        FindviewbyID();
       // requestWindowFeature(Window.FEATURE_NO_TITLE);
    }

    public void FindviewbyID() {
        okTxt = findViewById(R.id.ok_txt);
        cancelTxt = findViewById(R.id.cancel_txt);
        oldPasswordTxt = findViewById(R.id.old_password_txt);
        newPasswordTxt = findViewById(R.id.new_password_txt);
        passwordAgainTxt = findViewById(R.id.password_again_txt);
        okTxt.setOnClickListener(this);
        decorView = this.getWindow().getDecorView();
        cancelTxt.setOnClickListener(this);
    }


    @Override
    public void onValidationSucceeded() {
        if (oldPasswordTxt.getText().toString().equalsIgnoreCase(newPasswordTxt.getText().toString())) {
            Utiles.displayMessage(getCurrentFocus(), context, c.getString(R.string.old_password));
        } else if (!newPasswordTxt.getText().toString().equalsIgnoreCase(newPasswordTxt.getText().toString())) {
            Utiles.displayMessage(getCurrentFocus(), context, c.getString(R.string.confirm_password));
        }else
        {
            HashMap<String, String> map = new HashMap<>();
            map.put("oldpassword", oldPasswordTxt.getText().toString());
            map.put("newpassword", newPasswordTxt.getText().toString());
            map.put("confirmpassword", passwordAgainTxt.getText().toString());
            ChangePasswordPresenter changePasswordPresenter = new ChangePasswordPresenter(this);
            changePasswordPresenter.ChangePasswor(map, c, context);

        }
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

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.cancel_txt:
                DismissiAnimation(decorView, this);
                break;
            case R.id.ok_txt:
                validator.validate();
                break;
        }
    }

    @Override
    public void OnSuccessfully(Response<ChangePasswordModel> Response) {
        if (Response.body().getMessage().equalsIgnoreCase("Password Updated Successfully")) {

        } else {

        }
        Utiles.displayMessage(c.getCurrentFocus(), context, Response.body().getMessage());
        DismissiAnimation(decorView, this);

    }

    @Override
    public void OnFailure(Response<ChangePasswordModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,c,getCurrentFocus());
        } catch (IOException e) {
            Utiles.displayMessage(getCurrentFocus(), context, c.getResources().getString(R.string.something_went_wrong));
        }

    }
}
