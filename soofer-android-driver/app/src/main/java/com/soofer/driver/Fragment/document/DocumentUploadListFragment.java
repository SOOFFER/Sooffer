package com.soofer.driver.Fragment.document;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.Adapter.DocumentAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.DocumentUpload;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.DocumentModel;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Presenter.DriverProfilePresenter;
import com.soofer.driver.Presenter.SubscriptionPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.ProfileView;
import com.soofer.driver.Fragment.AddVehicleFragment;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.HttpException;
import retrofit2.Response;

public class DocumentUploadListFragment extends BaseFragment implements SubscriptionPresenter.CommonView, DocumentAdapter.CallbackLs ,ProfileView{

    private String type = "";
    private boolean isvisible = false;

    public DocumentUploadListFragment(String type, boolean isvisible) {
        // Required empty public constructor
        this.isvisible = isvisible;
        this.type = type;
    }

    public DocumentUploadListFragment() {
    }

    @BindView(R.id.login_btn)
    Button submitBtn;

    @BindView(R.id.title_txt)
    TextView titleTxt;

    RecyclerView documentRecycleView;

    @BindView(R.id.back_img)
    ImageView backImg;

    Unbinder unbinder;

    private Activity activity;
    private FragmentManager fragmentManager;

    private DocumentAdapter documentAdapter;
    private SubscriptionPresenter subscriptionPresenter;
    private CompositeDisposable disposable;
    View view;


    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this
        view = inflater.inflate(R.layout.fragment_document_upload_list, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        fragmentManager = requireActivity().getSupportFragmentManager();
        disposable = new CompositeDisposable();
        Bundle bundle = getArguments();
        if (bundle != null) {
            Constants.strVehicleID = bundle.getString("makeid");
        }
        System.out.println("VEHICLE ID:::" + Constants.strVehicleID);
        documentRecycleView = view.findViewById(R.id.document_recycle_view);
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);
        titleTxt.setText(R.string.upload_document);
        if (!type.isEmpty()) {
            SharedHelper.putKey(activity, "typeDoc", type);
        } else {
            type = SharedHelper.getKey(activity, "typeDoc");
        }
        if (type.equalsIgnoreCase("driver")) {
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        } else if (type.equalsIgnoreCase("drivers")) {
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        } else {
            titleTxt.setText(R.string.vehicle_documents);
            subscriptionPresenter.getVehicleDocumentListApi();
        }
        if (SharedHelper.getKey(activity, "appflow").equalsIgnoreCase("login")) {
            submitBtn.setVisibility(View.GONE);
            backImg.setVisibility(View.VISIBLE);
            view.setFocusableInTouchMode(true);
            view.requestFocus();
            view.setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_DOWN) {
                        if (keyCode == KeyEvent.KEYCODE_BACK) {
                            while (fragmentManager.getBackStackEntryCount() > 0) {
                                fragmentManager.popBackStackImmediate();
                            }
                            return true;
                        }
                    }
                    return false;
                }
            });
        } else {
            submitBtn.setVisibility(View.VISIBLE);
            backImg.setVisibility(View.GONE);
            view.setFocusableInTouchMode(true);
            view.requestFocus();
            view.setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_DOWN) {
                        if (keyCode == KeyEvent.KEYCODE_BACK) {
                            return true;
                        }
                    }
                    return false;
                }
            });
        }
        return view;
    }


    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void positionClick(DocumentModel.Document data) {
        fragmentManager.beginTransaction()
                .replace(android.R.id.content, new SingleDocumentsUploadFragment(data), "document_upload")
                .addToBackStack(null)
                .commitAllowingStateLoss();
    }


    @OnClick({R.id.login_btn, R.id.back_img})
    void onclickListioner(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                if (type.equalsIgnoreCase("driver")) {
                    Fragment fragment = new AddVehicleFragment();
                    moveToFragment(fragment);
                }  else if (type.equalsIgnoreCase("drivers")) {
                    Fragment fragment = new AddVehicleFragment();
                    moveToFragment(fragment);
                } else {
                    DriverProfilePresenter driverProfilePresenter = new DriverProfilePresenter(this);
                    driverProfilePresenter.getProfile(activity, true);
                }
                break;
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
        }
    }

    @Override
    public void OnSuccessfully(Response<List<DriverProfileModel>> Response) {
        SharedHelper.getKey(activity, "appflow").equalsIgnoreCase("login");
        List<DriverProfileModel> driverProfileModels = Response.body();
        SharedHelper.putKey(activity, "login_status", "true");
        SharedHelper.putKey(activity, "attendance", driverProfileModels.get(0).getAttendance().toString());
        SharedHelper.putKey(activity, "fname", driverProfileModels.get(0).getFname());
        SharedHelper.putKey(activity, "drivercode", driverProfileModels.get(0).getCode());
        SharedHelper.putKey(activity, "gender", Response.body().get(0).getGender());
        SharedHelper.putKey(activity, "gender", Response.body().get(0).getGender());
        SharedHelper.putKey(activity, "lname", driverProfileModels.get(0).getLname());
        SharedHelper.putKey(activity, "email", driverProfileModels.get(0).getEmail());
        SharedHelper.putKey(activity, "phcode", driverProfileModels.get(0).getPhcode());
        SharedHelper.putKey(activity, "phone", driverProfileModels.get(0).getPhone());
        SharedHelper.putKey(activity, "lang", driverProfileModels.get(0).getLang());
        SharedHelper.putKey(activity, "cur", driverProfileModels.get(0).getCur());
        SharedHelper.putKey(activity, "code", driverProfileModels.get(0).getCode());
        SharedHelper.putKey(activity, "filepath", driverProfileModels.get(0).getBaseurl());
        if (Utiles.IsNull(driverProfileModels.get(0).getLicence())) {
            SharedHelper.putKey(activity, "licence", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicence());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getInsurance())) {
            SharedHelper.putKey(activity, "insurance", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsurance());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getPassing())) {
            SharedHelper.putKey(activity, "passing", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassing());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getInsuranceBackImg())) {
            SharedHelper.putKey(activity, "insuranceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsuranceBackImg());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getPassingBackImg())) {
            SharedHelper.putKey(activity, "passingBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassingBackImg());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getLicenceBackImg())) {
            SharedHelper.putKey(activity, "licenceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicenceBackImg());

        }
        SharedHelper.putKey(activity, "licence_date", driverProfileModels.get(0).getLicenceexp());
        Constants.WalletAlertEnable = driverProfileModels.get(3).getIsDriverCreditModuleEnabledForUseAfterLogin();

        SharedHelper.putKey(activity, "profile", driverProfileModels.get(1).getProfileurl());
        SharedHelper.putKey(activity, "vehicleId", driverProfileModels.get(2).getCurrentActiveTaxi().getId());
        SharedHelper.putKey(activity, "vmake", driverProfileModels.get(2).getCurrentActiveTaxi().getMakename());
        SharedHelper.putKey(activity, "vmodel", driverProfileModels.get(2).getCurrentActiveTaxi().getModel());
        SharedHelper.putKey(activity, "numplate", driverProfileModels.get(2).getCurrentActiveTaxi().getLicence());
        SharedHelper.putKey(activity, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
        SharedHelper.putKey(activity, "appflow", "login");
        SharedHelper.putKey(activity, "support_num", Response.body().get(5).getConfigData().getSupportNo());
        SharedHelper.putKey(activity,"driver_earned",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());
        SharedHelper.putKey(activity,"wallet_credition",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getBankDeposit());
        SharedHelper.putKey(activity,"driver_tax",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTax());
        SharedHelper.putKey(activity,"GatewayCharge",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getGateway());
        SharedHelper.putKey(activity,"driver_cash",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getCashCollected());
        SharedHelper.putKey(activity,"driver_tips",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTips());
        SharedHelper.putKey(activity,"driver_ridefare",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getRideFare());
        SharedHelper.putKey(activity,"date",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getDate());
        SharedHelper.putKey(activity,"km",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotalDistance());
        SharedHelper.putKey(activity,"rides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotTrips());

        Intent i = new Intent(activity, MainActivity.class);
        activity.startActivity(i);
        activity.finishAffinity();
    }

    @Override
    public void OnFailure(Response<List<DriverProfileModel>> Response) {
        Utiles.displayMessage(getView(), activity, activity.getResources().getString(R.string.something_went_wrong));
    }


    private void moveToFragment(Fragment fragment) {
        assert fragmentManager != null;
        fragmentManager.beginTransaction()
                .replace(android.R.id.content, fragment,
                        fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

    }

    @Override
    public void onSuccess(Object object, String fromApi) {
        if (object instanceof DocumentModel) {

            documentAdapter = new DocumentAdapter(activity, this, ((DocumentModel) object).getDocuments());
            documentRecycleView = view.findViewById(R.id.document_recycle_view);
            documentRecycleView.setAdapter(documentAdapter);
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
        if (!activity.isDestroyed()) {
            Utiles.ShowLoader(activity);
        }
    }

    @Override
    public void dismissLoader() {
        if (!activity.isDestroyed()) {
            Utiles.DismissLoader();
        }
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
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);
        titleTxt.setText(R.string.upload_document);
        type = event.getStatus();
        SharedHelper.putKey(activity, "typeDoc",type);
        if (event.getStatus().equalsIgnoreCase("driver")) {
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        } else if (type.equalsIgnoreCase("drivers")) {
            titleTxt.setText(R.string.driver_documents);
            subscriptionPresenter.getDriverDocumentListApi();
        } else {
            titleTxt.setText(R.string.vehicle_documents);
            subscriptionPresenter.getVehicleDocumentListApi();
        }
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

}


