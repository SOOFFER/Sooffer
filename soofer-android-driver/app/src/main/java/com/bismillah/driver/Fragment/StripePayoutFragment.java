package com.bismillah.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;

import androidx.fragment.app.FragmentManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;

import com.bismillah.driver.BuildConfig;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.OTPModel;
import com.bismillah.driver.Presenter.StripConnectPresenter;
import com.bismillah.driver.R;

import java.io.IOException;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import retrofit2.Response;


public class StripePayoutFragment extends BaseFragment implements StripConnectPresenter.Callback {


    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.webview)
    WebView webview;
    Unbinder unbinder;

    private Activity activity;
    private FragmentManager fragmentManager;
    private String page_type="";

    private StripConnectPresenter stripConnectPresenter;


    public StripePayoutFragment(String page_type) {
        // Required empty public constructor
        this.page_type = page_type;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_stripe_payout, container, false);
        unbinder = ButterKnife.bind(this, view);
        stripConnectPresenter = new StripConnectPresenter(this);
        activity = getActivity();
        fragmentManager = getFragmentManager();
        WebSettings webSettings = webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webview.setWebViewClient(new MyWebViewClient());
        webview.addJavascriptInterface(new JavaScriptInterface(), "jsinterface");

        if(!page_type.equalsIgnoreCase("Login")){
            Utiles.ShowLoader(activity);
            webview.loadUrl(BuildConfig.StripeURL + BuildConfig.StripeKey+"&state="+ SharedHelper.getKey(activity,"userid"));
        }else {
            stripConnectPresenter.getStripeLogin(activity);
        }

        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }
    @Optional
    @OnClick(R.id.back_img)
    public void onViewClicked() {
        fragmentManager.popBackStackImmediate();
    }

    @Override
    public void onSuccess(Response<OTPModel> response) {
        Utiles.ShowLoader(activity);
        assert response.body() != null;
        webview.loadUrl(response.body().getMessage());
    }

    @Override
    public void onFailure(Response<OTPModel> response) {
        try {
            assert response.errorBody() != null;
            Utiles.showErrorMessage(response.errorBody().string(),activity,getView());
        } catch (IOException e) {
            e.printStackTrace();
            try {
                Utiles.displayMessage(getView(), getContext(), getContext().getString(R.string.poor_network));
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    private class MyWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            //  progressDialog.dismissProgress();
            if(url.endsWith("stripe-express-success.html")){
                SharedHelper.putOnline(Objects.requireNonNull(getContext()),"isconnect",true);
                fragmentManager.popBackStackImmediate();
            }

            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            //     progressDialog.dismissProgress();
            Utiles.DismissLoader();
        }
    }


    class JavaScriptInterface {
        @JavascriptInterface
        public void processHTML(String formData) {
            System.out.println("enter the data"+formData);
        }
    }


}
