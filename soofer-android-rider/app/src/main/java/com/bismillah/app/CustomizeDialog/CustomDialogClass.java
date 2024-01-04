package com.bismillah.app.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import androidx.annotation.NonNull;

import android.text.method.PasswordTransformationMethod;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.ChangePasswordModel;
import com.bismillah.app.Presenter.ChangePasswordPresenter;

import com.bismillah.app.R;
import com.bismillah.app.View.ChangePasswordView;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import retrofit2.Response;

import static com.bismillah.app.CommonClass.Utiles.DismissiAnimation;

public class CustomDialogClass extends Dialog implements Validator.ValidationListener, View.OnClickListener, ChangePasswordView, View.OnTouchListener {

    public Activity c;
    public Dialog d;
   // @NotEmpty(message = c.getString(R.string.required))
    @NotEmpty(message = "Require")
    private
    MaterialEditText oldPasswordTxt;
    @NotEmpty(message = "Require")
    private
    MaterialEditText newPasswordTxt;
    @NotEmpty(message = "Require")
    private
    MaterialEditText passwordAgainTxt;

    TextView cancelTxt;
    TextView okTxt;

    Validator validator;

    public CustomDialogClass(@NonNull Activity a) {
        super(a);
        this.c = a;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        setContentView(R.layout.changepassword);
        validator = new Validator(this);
        validator.setValidationListener(this);
        FindviewbyID();
    }

    View decorView;

    @SuppressLint("ClickableViewAccessibility")
    public void FindviewbyID() {
        okTxt = findViewById(R.id.ok_txt);
        cancelTxt = findViewById(R.id.cancel_txt);
        decorView = this.getWindow().getDecorView();
        oldPasswordTxt = findViewById(R.id.old_password_txt);
        newPasswordTxt = findViewById(R.id.new_password_txt);
        passwordAgainTxt = findViewById(R.id.password_again_txt);
        newPasswordTxt.setOnTouchListener(this);
        passwordAgainTxt.setOnTouchListener(this);
        oldPasswordTxt.setOnTouchListener(this);
        okTxt.setOnClickListener(this);
        cancelTxt.setOnClickListener(this);
    }


    @Override
    public void onValidationSucceeded() {
        if (oldPasswordTxt.getText().toString().equalsIgnoreCase(newPasswordTxt.getText().toString())) {
            Utiles.displayMessage(getCurrentFocus(), c.getApplicationContext(), "Old Password and New Password same");
        } else if (!newPasswordTxt.getText().toString().equalsIgnoreCase(newPasswordTxt.getText().toString())) {
            Utiles.displayMessage(getCurrentFocus(), c.getApplicationContext(), "Confirm Password Wrong");
        }else
        {
            HashMap<String, String> map = new HashMap<>();
            map.put("oldpassword", oldPasswordTxt.getText().toString());
            map.put("newpassword", newPasswordTxt.getText().toString());
            map.put("confirmpassword", passwordAgainTxt.getText().toString());
            ChangePasswordPresenter changePasswordPresenter = new ChangePasswordPresenter(this);
            changePasswordPresenter.ChangePasswor(map, c, c.getApplicationContext());

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
        assert Response.body() != null;
        Utiles.displayMessage(c.getCurrentFocus(), c.getApplicationContext(), Response.body().getMessage());
        DismissiAnimation(decorView, this);
    }

    @Override
    public void OnFailure(Response<ChangePasswordModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, c, getCurrentFocus());
        } catch (IOException e) {
            Utiles.displayMessage(getCurrentFocus(), c, c.getResources().getString(R.string.something_went_wrong));
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        final int DRAWABLE_RIGHT = 2;
        switch (v.getId()) {
            case R.id.old_password_txt:
                if(event.getAction() == MotionEvent.ACTION_UP) {
                    if(event.getRawX() >= (oldPasswordTxt.getRight() - oldPasswordTxt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                        // your action here
                        if(oldPasswordTxt.getTag()==null){
                            oldPasswordTxt.setTag(true);
                            oldPasswordTxt.setTransformationMethod(null);
                            Utiles.iconChange(oldPasswordTxt,true,c);
                            return true;
                        }
                        if((boolean) oldPasswordTxt.getTag()){

                            oldPasswordTxt.setTransformationMethod(new PasswordTransformationMethod());
                        }else {
                            oldPasswordTxt.setTransformationMethod(null);

                        }
                        oldPasswordTxt.setTag(!(boolean) oldPasswordTxt.getTag());
                        Utiles.iconChange(oldPasswordTxt,(boolean) oldPasswordTxt.getTag(),c);
                        return true;
                    }
                }
                break;
            case R.id.password_again_txt:
                if(event.getAction() == MotionEvent.ACTION_UP) {
                    if(event.getRawX() >= (passwordAgainTxt.getRight() - passwordAgainTxt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                        // your action here
                        if(passwordAgainTxt.getTag()==null){
                            passwordAgainTxt.setTag(true);
                            passwordAgainTxt.setTransformationMethod(null);
                            Utiles.iconChange(passwordAgainTxt,true,c);
                            return true;
                        }
                        if((boolean) passwordAgainTxt.getTag()){

                            passwordAgainTxt.setTransformationMethod(new PasswordTransformationMethod());
                        }else {
                            passwordAgainTxt.setTransformationMethod(null);

                        }
                        passwordAgainTxt.setTag(!(boolean) passwordAgainTxt.getTag());
                        Utiles.iconChange(passwordAgainTxt,(boolean) passwordAgainTxt.getTag(),c);
                        return true;
                    }
                }
                break;
                case R.id.new_password_txt:
                if(event.getAction() == MotionEvent.ACTION_UP) {
                    if(event.getRawX() >= (newPasswordTxt.getRight() - newPasswordTxt.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
                        // your action here
                        if(newPasswordTxt.getTag()==null){
                            newPasswordTxt.setTag(true);
                            newPasswordTxt.setTransformationMethod(null);
                            Utiles.iconChange(newPasswordTxt,true,c);
                            return true;
                        }
                        if((boolean) newPasswordTxt.getTag()){

                            newPasswordTxt.setTransformationMethod(new PasswordTransformationMethod());
                        }else {
                            newPasswordTxt.setTransformationMethod(null);

                        }
                        newPasswordTxt.setTag(!(boolean) newPasswordTxt.getTag());
                        Utiles.iconChange(newPasswordTxt,(boolean) newPasswordTxt.getTag(),c);
                        return true;
                    }
                }
                break;
        }
        return false;
    }
}
