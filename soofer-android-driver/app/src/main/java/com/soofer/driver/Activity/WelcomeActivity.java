package com.soofer.driver.Activity;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.firebase.iid.FirebaseInstanceId;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Fragment.LoginFragment;
import com.soofer.driver.Fragment.RegisterFragment;
import com.soofer.driver.Model.LanguageCurrencyModel;
import com.soofer.driver.R;
import com.soofer.driver.View.CurrencyLanguageView;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class WelcomeActivity extends AppCompatActivity implements CurrencyLanguageView, RadioGroup.OnCheckedChangeListener {
    @BindView(R.id.language_spn)
    Spinner languageSpn;
    @BindView(R.id.currency_spn)
    Spinner currencySpn;
    @BindView(R.id.login_btn)
    Button loginBtn;
    @BindView(R.id.register_btn)
    Button registerBtn;
    Fragment fragment = null;
    Activity activity = WelcomeActivity.this;
    @BindView(R.id.radioMale)
    RadioButton radioMale;
    @BindView(R.id.radioFemale)
    RadioButton radioFemale;
    @BindView(R.id.languageRadioGroup)
    RadioGroup languageRadioGroup;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        ButterKnife.bind(this);

        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));
        CommonFirebaseListoner.setActivity(activity);
        CommonData.PreviousCarType = "";
        firebasetoken();
        if (SharedHelper.getToken(this, "lang").equalsIgnoreCase("es")) {
            radioFemale.setChecked(true);
        } else {
            radioMale.setChecked(true);
        }

        languageRadioGroup.setOnCheckedChangeListener(this);
    }

    @OnClick({R.id.login_btn, R.id.register_btn,R.id.radioFemale,R.id.radioMale})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                fragment = new LoginFragment();
                moveToFragment(fragment);
                break;
            case R.id.register_btn:
                fragment = new RegisterFragment();
                moveToFragment(fragment);
                break;
            case R.id.radioFemale:
                setLocale("es");
                break;
            case R.id.radioMale:
                setLocale("en");

                break;
        }
    }


    private void moveToFragment(Fragment fragment) {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.containter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

    }

    @Override
    public void countriesReady(List<LanguageCurrencyModel> LanguageCurrencyModel) {

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        for (Fragment fragment : getSupportFragmentManager().getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
    }

    public void firebasetoken() {
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        return;
                    }
                    // Get new Instance ID token
                    String token = Objects.requireNonNull(task.getResult()).getToken();
                    SharedHelper.putToken(getApplicationContext(), "device_token", token);
                });

    }

    public void setLocale(String lang) {
        SharedHelper.putToken(this, "lang", lang);
        Locale myLocale = new Locale(lang);
        Resources res = getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        onConfigurationChanged(conf);
        SettextChange();
    }

    public void SettextChange() {
        loginBtn.setText(activity.getResources().getString(R.string.login));
        registerBtn.setText(activity.getResources().getString(R.string.register));

    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (checkedId) {
            case R.id.radioMale:
                setLocale("en");
                break;

            case R.id.radioFemale:
                setLocale("es");
                break;
        }
    }

}
