package com.bismillah.app.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.TextView;

import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.RetrofitGenerator;

import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.Utiles;

import java.util.Locale;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class CommonwebviewFragment extends BaseFragment {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.webView1)
    WebView webView1;
    Unbinder unbinder;

    Context context;
    ProgressDialog progressDialog = null;

    public CommonwebviewFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }
    Activity activity;
    String Strurl ="";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_commonwebview, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        titleTxt.setText(CommonData.strTitle);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        if( CommonData.strTitle.equalsIgnoreCase(context.getResources().getString(R.string.about_us))){
            Strurl = RetrofitGenerator.BaseUrl+"aboutus";
            setLocale(activity, SharedHelper.getToken(activity, "lang"));
        }else if( CommonData.strTitle.equalsIgnoreCase(context.getResources().getString(R.string.privacy_policy))){
            Strurl = RetrofitGenerator.BaseUrl+"privacypolicy";
            setLocale(activity, SharedHelper.getToken(activity, "lang"));
        }else {
            Strurl = RetrofitGenerator.BaseUrl+"tnc";
            setLocale(activity, SharedHelper.getToken(activity, "lang"));
        }





        startWebView(Strurl);
        return view;
    }

    public static void setLocale(Activity activity, String lang) {
        SharedHelper.putKey(activity, "lang", lang);
        Locale myLocale = new Locale(lang);
        Resources res = activity.getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        activity.onConfigurationChanged(conf);
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.dismiss();
        }
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        getFragmentManager().popBackStackImmediate();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void startWebView(String url) {


        webView1.setWebViewClient( new WebViewClient());



        // Javascript inabled on webview
        webView1.getSettings().setJavaScriptEnabled(true);

        // Other webview options
        /*
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        webView.setScrollbarFadingEnabled(false);
        webView.getSettings().setBuiltInZoomControls(true);
        */

        /*
         String summary = "<html><body>You scored <b>192</b> points.</body></html>";
         webview.loadData(summary, "text/html", null);
         */

        //Load url in webview
        webView1.loadUrl(url);


    }
}
