package com.soofer.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;

import androidx.fragment.app.FragmentManager;

import com.soofer.app.EventBus.SocialResponseEvent;
import com.soofer.app.EventBus.socialModel;
import com.soofer.app.R;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.ybs.countrypicker.CountryPicker;

import org.greenrobot.eventbus.EventBus;


import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.ghyeok.stickyswitch.widget.StickySwitch;

public class MobileNumberDialog extends Dialog {

    public Activity activity;
    public Dialog dialog;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;
    @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.submit)
    Button submit;
    private socialModel nsocialModel;
    private CountryPicker picker;
    private FragmentManager fragmentManager;
    private String strGendeType ="Male";
    @BindView(R.id.stickySwitch)
    StickySwitch stickySwitch;
    public MobileNumberDialog(Activity activity, socialModel nsocialModel, FragmentManager fragmentManager) {
        super(activity);
        this.activity = activity;
        this.nsocialModel = nsocialModel;
        this.fragmentManager =fragmentManager;
    }

    Unbinder unbinder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.mobilenumberdialog);
        unbinder = ButterKnife.bind(this);
        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        picker = CountryPicker.newInstance("Select Country");  // dialog title
        picker.setListener((name, code, dialCode, flagDrawableResID) -> {
            ccEdt.setText(dialCode);
            picker.dismiss();
            // Implement your code here
        });
        stickySwitch.setOnSelectedChangeListener((direction, s) -> strGendeType = s);
    }


    @OnClick({R.id.cc_edt, R.id.submit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cc_edt:
                picker.show(fragmentManager, "COUNTRY_PICKER");
                break;
            case R.id.submit:
                if (mobileEdt.getText().toString().isEmpty()) {
                    mobileEdt.setError("Enter your mobile Number");
                } else {

                    EventBus.getDefault().postSticky(new SocialResponseEvent(nsocialModel, mobileEdt.getText().toString(),ccEdt.getText().toString(),strGendeType));
                    dismiss();
                }
                break;
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
