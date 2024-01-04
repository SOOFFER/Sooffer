package com.bismillah.app.Activity;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;

import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import com.facebook.GraphResponse;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.ApiException;
import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.helpers.FbConnectHelper;
import com.bismillah.app.CommonClass.helpers.GooglePlusSignInHelper;
import com.bismillah.app.CustomizeDialog.MobileNumberDialog;
import com.bismillah.app.EventBus.SocialEvent;
import com.bismillah.app.EventBus.SocialResponseEvent;
import com.bismillah.app.EventBus.socialModel;
import com.bismillah.app.Fragment.LoginFragment;
import com.bismillah.app.Fragment.RegisterFragment;
import com.bismillah.app.Model.LanguageCurrencyModel;
import com.bismillah.app.R;
import com.bismillah.app.View.CurrencyLanguageView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.bismillah.app.CommonClass.Utiles;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONObject;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

import static com.bismillah.app.CommonClass.Utiles.clearInstance;

public class WelcomeActivity extends AppCompatActivity implements CurrencyLanguageView, RadioGroup.OnCheckedChangeListener, FbConnectHelper.OnFbSignInListener, GooglePlusSignInHelper.OnGoogleSignInListener {

    @BindView(R.id.language_spn)
    Spinner languageSpn;
    @BindView(R.id.currency_spn)
    Spinner currencySpn;
    @BindView(R.id.login_btn)
    Button loginBtn;
    @BindView(R.id.register_btn)
    Button registerBtn;
    Fragment fragment = null;
    @BindView(R.id.radioMale)
    RadioButton radioMale;
    @BindView(R.id.radioFemale)
    RadioButton radioFemale;
    @BindView(R.id.languageRadioGroup)
    RadioGroup languageRadioGroup;

    private FbConnectHelper fbConnectHelper;
    private GooglePlusSignInHelper googlePlusSignInHelper;

    private Activity activity;
    private Context context;

    private MobileNumberDialog dialogClass;
    private FragmentManager fragmentManager;
    private String strFromPage = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        ButterKnife.bind(this);
        // CurrencyLanguagePresenter currencyLanguagePresenter = new CurrencyLanguagePresenter(this);
        // currencyLanguagePresenter.getCurrencyLanguage(this);
        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));

        if (SharedHelper.getToken(this, "lang").equalsIgnoreCase("es")) {
            radioFemale.setChecked(true);
        } else {
            radioMale.setChecked(true);
        }
        activity = this;
        context = this;
        fragmentManager = getSupportFragmentManager();
        fbConnectHelper = new FbConnectHelper(activity,this);
        googlePlusSignInHelper = GooglePlusSignInHelper.getInstance();
        googlePlusSignInHelper.initialize(this, this);
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

    public void LanguageSpinner(List<LanguageCurrencyModel.Data> Data) {
        List<String> langaugeList = new ArrayList<String>();
        for (int i = 0; Data.size() > i; i++) {
            langaugeList.add(Data.get(i).getName());
        }
        ArrayAdapter<String> languageAdapter = new ArrayAdapter<String>(this,
                R.layout.spinnertext, langaugeList);
        languageAdapter.setDropDownViewResource(R.layout.dropdown);
        languageSpn.setAdapter(languageAdapter);
        languageSpn.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                CommonData.strLanguage = adapterView.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
    }

    public void Currencyspinner(List<LanguageCurrencyModel.Data> Data) {

        List<String> currencyList = new ArrayList<String>();
        for (int i = 0; Data.size() > i; i++) {
            currencyList.add(Data.get(i).getName());

        }
        ArrayAdapter<String> currencyAdapter = new ArrayAdapter<String>(this,
                R.layout.spinnertext, currencyList);
        currencyAdapter.setDropDownViewResource(R.layout.dropdown);
        currencySpn.setAdapter(currencyAdapter);
        currencySpn.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                CommonData.strCurrency = adapterView.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
    }

    private void moveToFragment(Fragment fragment) {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.containter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();

    }

    @Override
    public void countriesReady(List<LanguageCurrencyModel> LanguageCurrencyModel) {

        for (int i = 0; LanguageCurrencyModel.size() > i; i++) {
            if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("1")) {
                Currencyspinner(LanguageCurrencyModel.get(i).getDatas());
            } else if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("2")) {
                LanguageSpinner(LanguageCurrencyModel.get(i).getDatas());
            }

        }


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
        loginBtn.setText(this.getResources().getString(R.string.login));
        registerBtn.setText(this.getResources().getString(R.string.register));

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

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        fbConnectHelper.onActivityResult(requestCode,resultCode,data);
        googlePlusSignInHelper.onActivityResult(requestCode,resultCode,data);
        for (Fragment fragment : getSupportFragmentManager().getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        clearInstance();
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    @Override
    public void OnFbSuccess(GraphResponse graphResponse) {
        JSONObject object = graphResponse.getJSONObject();
        if (strFromPage.equalsIgnoreCase("login")) {
            EventBus.getDefault().postSticky(new SocialResponseEvent(new socialModel(object.optString("first_name"),
                    object.optString("last_name")
                    , object.optString("email")
                    , "facebook"
                    , strFromPage, object.optString("id")), "", "",""));

        } else {
            MobileNumberDialog(new socialModel(object.optString("first_name"),
                    object.optString("last_name")
                    , object.optString("email")
                    , "facebook"
                    , strFromPage, object.optString("id")));
        }

    }

    @Override
    public void OnFbError(String errorMessage) {
        Utiles.CommonToast(activity,"Facebook login failed.");
    }

    @Override
    public void OnGSignSuccess(GoogleSignInAccount account) {
        if (strFromPage.equalsIgnoreCase("login")) {
            assert account != null;
            EventBus.getDefault().postSticky(new SocialResponseEvent(new socialModel(account.getGivenName(),
                    account.getFamilyName()
                    , account.getEmail()
                    , "google"
                    , strFromPage, account.getId()), "", "",""));

        } else {
            assert account != null;

            MobileNumberDialog(new socialModel(account.getGivenName(),
                    account.getFamilyName()
                    , account.getEmail()
                    , "google"
                    , strFromPage, account.getId()));
        }
    }

    @Override
    public void OnGSignError(ApiException errorMessage) {
        Utiles.CommonToast(activity,"Google login failed.");
    }

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED)
    public void Event(SocialEvent event) {
        switch (event.getSocialType()) {
            case "gmail":
                dialogClass =null;
                strFromPage = event.getFromPage();
                if(googlePlusSignInHelper.isConnected()){
                    googlePlusSignInHelper.signIn(activity);
                }else {
                    googlePlusSignInHelper.initialize(this,this);
                }
                break;
            case "facebook":
                dialogClass =null;
                fbConnectHelper.connect();
                strFromPage = event.getFromPage();
                break;
        }


        //   EventBus.getDefault().removeStickyEvent(FLowRealtimeChanges.class); // don't forget to remove the sticky event if youre done with it
    }
    public void MobileNumberDialog(socialModel nsocialModel) {
        if (dialogClass == null) {
            dialogClass = new MobileNumberDialog(activity, nsocialModel, fragmentManager);
            Window window = dialogClass.getWindow();
            assert window != null;
            window.setGravity(Gravity.TOP);
            dialogClass.setCancelable(false);
            dialogClass.getWindow().getAttributes().windowAnimations = R.style.MyCustomTheme;
            dialogClass.show();
        }

    }

    @Override
    protected void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }
}
