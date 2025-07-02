package com.soofer.driver.Fragment.document;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.soofer.driver.Adapter.DocumentAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.DocumentUpload;
import com.soofer.driver.Fragment.AddVehicleFragment;
import com.soofer.driver.Model.DocumentModel;
import com.soofer.driver.Presenter.SubscriptionPresenter;
import com.soofer.driver.R;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.HttpException;


public class DocumentUploadListFragment extends BaseFragment implements SubscriptionPresenter.CommonView, DocumentAdapter.CallbackLs {

    private String type;
    private boolean isvisible;
    public DocumentUploadListFragment(String type ,boolean isvisible) {
        // Required empty public constructor
        this.isvisible = isvisible;
        this.type = type;
    }

    @BindView(R.id.login_btn)
    Button loginBtn;

    @BindView(R.id.title_txt)
    TextView titleTxt;

    @BindView(R.id.document_recycle_view)
    RecyclerView documentRecycleView;

    Unbinder unbinder;

    private Activity activity;
    private FragmentManager fragmentManager;

    private DocumentAdapter documentAdapter;
    private SubscriptionPresenter subscriptionPresenter;
    private CompositeDisposable disposable;

    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this
        @SuppressLint("InflateParams")
        View view = inflater.inflate(R.layout.fragment_document_upload_list, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        fragmentManager = getFragmentManager();
        disposable = new CompositeDisposable();
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);


        if(type.equalsIgnoreCase("driver")){
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        }else if (type.equalsIgnoreCase("drivers")){
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        }else {
            titleTxt.setText(R.string.vehicle_documents);
            subscriptionPresenter.getVehicleDocumentListApi();
        }
        loginBtn.setVisibility(View.GONE);
//        loginBtn.setVisibility(isvisible?View.VISIBLE :View.GONE);
        return view;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick({R.id.login_btn, R.id.back_img})
    void onclickListioner(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                moveToFragment(new AddVehicleFragment());
                break;
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
        }

    }

    @Override
    public void onSuccess(Object object, String fromApi) {
        if (object instanceof DocumentModel) {
            if (documentAdapter == null) {
                documentAdapter = new DocumentAdapter(activity, this, ((DocumentModel) object).getDocuments());
                documentRecycleView.setAdapter(documentAdapter);
            } else {
                documentAdapter.notifyDataSetChanged();
            }

        }

    }

    @Override
    public void onFailure(Throwable throwable) {
        try {
            if (throwable instanceof HttpException) {
                HttpException error = (HttpException) throwable;
                String errorBody = Objects.requireNonNull(error.response().errorBody()).string();
                Utiles.showErrorMessage(errorBody, activity, getView());
            } else {
                Utiles.displayMessage(getView(), getContext(), getContext().getString(R.string.poor_network));

            }
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), getContext(), getContext().getString(R.string.poor_network));

        }
    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);

    }

    @Override
    public void dismissLoader() {
        Utiles.DismissLoader();
    }

    @Override
    public void positionClick(DocumentModel.Document data) {
        fragmentManager.beginTransaction()
                .replace(android.R.id.content, new SingleDocumentsUploadFragment(data), "document_upload")
                .addToBackStack(null)
                .commitAllowingStateLoss();
    }
    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        EventBus.getDefault().unregister(this);
        super.onStop();
    }
    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(DocumentUpload event) {

        if(type.equalsIgnoreCase("driver")){
            loginBtn.setVisibility(View.VISIBLE);
        }else {
            loginBtn.setVisibility(View.GONE);
        }

            documentAdapter.notifyDataSetChanged();
            EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

    private void moveToFragment(Fragment fragment) {
        assert getFragmentManager() != null;
        getFragmentManager().beginTransaction()
                .replace(R.id.document_container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

    }
}