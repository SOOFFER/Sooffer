package com.bismillah.app.Fragment;


import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.bismillah.app.CommonClass.BaseFragment;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.Presenter.ContactAdminPresenter;


import java.util.HashMap;
import java.util.List;

import com.bismillah.app.R;

import com.bismillah.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class ContactUsFragment extends BaseFragment implements Validator.ValidationListener {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @NotEmpty(message = "Require")
    @BindView(R.id.subject_edt)
    MaterialEditText subjectEdt;
    @NotEmpty(message = "Require")
    @BindView(R.id.query_edt)
    MaterialEditText queryEdt;
    @BindView(R.id.send_query_btn)
    Button sendQueryBtn;
    Unbinder unbinder;
    Activity activity;
    Validator validator;
    @BindView(R.id.container)
    FrameLayout container;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_contact_us, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        validator = new Validator(this);
        validator.setValidationListener(this);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.send_query_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.send_query_btn:
                validator.validate();
                break;
        }
    }

    @Override
    public void onValidationSucceeded() {
        HashMap<String, String> map = new HashMap<>();
        map.put("subject", subjectEdt.getText().toString());
        map.put("message", queryEdt.getText().toString());
        ContactAdminPresenter contactAdminPresenter = new ContactAdminPresenter();
        contactAdminPresenter.getAddminContact(activity, map);
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

    @OnClick(R.id.container)
    public void onViewClicked() {
    }
}
