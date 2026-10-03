package com.soofer.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.view.Window;
import android.widget.Button;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.BaseClass.BasePresenter;
import com.soofer.app.CommonClass.Customizeview.CustomEditText;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Presenter.InvoiceEmailPresenter;
import com.soofer.app.R;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.disposables.CompositeDisposable;
import okhttp3.ResponseBody;

import static com.soofer.app.CommonClass.Utiles.getErrorBody;

/**
 * Created by com on 18-Sep-18.
 */

public class InvoiceEmailDialog extends Dialog {

    public Activity activity;
    @BindView(R.id.email_edt)
    CustomEditText emailEdt;
    @BindView(R.id.cancel_btn)
    Button cancelBtn;
    @BindView(R.id.send_btn)
    Button sendBtn;

    private Unbinder unbinder;

    private InvoiceEmailPresenter invoiceEmailPresenter;
    private CompositeDisposable disposable;
    private String request_id;


    public InvoiceEmailDialog(@NonNull Activity activity, String request_id) {
        super(activity);
        this.activity = activity;
        this.request_id = request_id;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.invoice_layout);
        unbinder = ButterKnife.bind(this);
        disposable = new CompositeDisposable();
        emailEdt.setText(SharedHelper.getKey(activity,"emailid"));
        invoiceEmailPresenter = new InvoiceEmailPresenter(disposable, new BasePresenter.CommonInterFace() {
            @Override
            public void onSuccess(Object object) {
                if (object instanceof ResponseBody) {
                    try {
                        JSONObject jsonObject = new JSONObject(((ResponseBody) object).string());
                        if(jsonObject.has("message")){
                            Utiles.CommonToast(activity,jsonObject.optString("message"));
                        }
                        dismiss();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

            }

            @Override
            public void onFailure(Throwable throwable) {
                getErrorBody(throwable, activity);
            }

            @Override
            public void showLoader() {
                Utiles.ShowLoader(activity);

            }

            @Override
            public void hideLoader() {
                Utiles.DismissLoader();

            }
        }, activity);

    }

    @OnClick({R.id.cancel_btn, R.id.send_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cancel_btn:
                dismiss();
                break;
            case R.id.send_btn:
                if(!isValidEmail(Objects.requireNonNull(emailEdt.getText()).toString())){
                    emailEdt.setError(activity.getResources().getString(R.string.enter_valid_email_id));
                    return;
                }
                HashMap<String,String> map = new HashMap<>();
                map.put("email",emailEdt.getText().toString());
                map.put("tripId",request_id);
                invoiceEmailPresenter.getInvoiceEmailAddress(map);
                break;
        }
    }

    public  boolean isValidEmail(CharSequence target) {
        return (!TextUtils.isEmpty(target) && Patterns.EMAIL_ADDRESS.matcher(target).matches());
    }

}
