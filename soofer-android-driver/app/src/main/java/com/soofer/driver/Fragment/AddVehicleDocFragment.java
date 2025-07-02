package com.soofer.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.DocumentData;
import com.soofer.driver.EventBus.VehicleDocumentUpload;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Presenter.DriverProfilePresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.ProfileView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

public class AddVehicleDocFragment extends BaseFragment implements ProfileView {

    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.insurance_txt)
    TextView insuranceTxt;
    @BindView(R.id.waring_img)
    ImageView waringImg;
    @BindView(R.id.img_expn)
    ImageView imgExpn;
    @BindView(R.id.missing_txt)
    TextView missingTxt;
    @BindView(R.id.insurance_lyt)
    RelativeLayout insuranceLyt;
    @BindView(R.id.view)
    View view;
    @BindView(R.id.upload_btn)
    Button uploadBtn;
    @BindView(R.id.download_img)
    ImageView downloadImg;
    @BindView(R.id.manage_btn)
    Button manageBtn;
    @BindView(R.id.manag_lyt)
    LinearLayout managLyt;
    @BindView(R.id.upload_rlyt)
    RelativeLayout uploadRlyt;
    @BindView(R.id.permit_txt)
    TextView permitTxt;
    @BindView(R.id.permit_waring_img)
    ImageView permitWaringImg;
    @BindView(R.id.permit_img_expn)
    ImageView permitImgExpn;
    @BindView(R.id.permit_missing_txt)
    TextView permitMissingTxt;
    @BindView(R.id.permit_lyt)
    RelativeLayout permitLyt;
    @BindView(R.id.permit_view)
    View permitView;
    @BindView(R.id.permit_upload_btn)
    Button permitUploadBtn;
    @BindView(R.id.permit_download_img)
    ImageView permitDownloadImg;
    @BindView(R.id.permit_manage_btn)
    Button permitManageBtn;
    @BindView(R.id.permit_manag_lyt)
    LinearLayout permitManagLyt;
    @BindView(R.id.permit_upload_rlyt)
    RelativeLayout permitUploadRlyt;
    @BindView(R.id.regs_txt)
    TextView regsTxt;
    @BindView(R.id.regs_waring_img)
    ImageView regsWaringImg;
    @BindView(R.id.regs_img_expn)
    ImageView regsImgExpn;
    @BindView(R.id.regs_missing_txt)
    TextView regsMissingTxt;
    @BindView(R.id.regs_lyt)
    RelativeLayout regsLyt;
    @BindView(R.id.regs_view)
    View regsView;
    @BindView(R.id.regs_upload_btn)
    Button regsUploadBtn;
    @BindView(R.id.regs_download_img)
    ImageView regsDownloadImg;
    @BindView(R.id.taxi_manage_btn)
    Button taxiManageBtn;
    @BindView(R.id.regs_manag_lyt)
    LinearLayout regsManagLyt;
    @BindView(R.id.regs_upload_rlyt)
    RelativeLayout regsUploadRlyt;
    Unbinder unbinder;
    Fragment fragment;
    Activity activity;
    String makeid;
    @BindView(R.id.submit_btn)
    Button submitBtn;
    Context context;
    @BindView(R.id.fc_txt)
    TextView fcTxt;
    @BindView(R.id.fc_waring_img)
    ImageView fcWaringImg;
    @BindView(R.id.fc_img_expn)
    ImageView fcImgExpn;
    @BindView(R.id.fc_missing_txt)
    TextView fcMissingTxt;
    @BindView(R.id.fc_lyt)
    RelativeLayout fcLyt;
    @BindView(R.id.fc_view)
    View fcView;
    @BindView(R.id.fc_upload_btn)
    Button fcUploadBtn;
    @BindView(R.id.fc_download_img)
    ImageView fcDownloadImg;
    @BindView(R.id.fc_manage_btn)
    Button fcManageBtn;
    @BindView(R.id.fc_manag_lyt)
    LinearLayout fcManagLyt;
    @BindView(R.id.fc_upload_rlyt)
    RelativeLayout fcUploadRlyt;
    @BindView(R.id.add_vehicle_document)
    FrameLayout addVehicleDocument;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_add_doc, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        Bundle bundle = getArguments();
        if (bundle != null) {
            makeid = bundle.getString("makeid");
        }
        System.out.println("enter the make id" + makeid);
        if (SharedHelper.getKey(activity, "appflow").equalsIgnoreCase("login")) {
            submitBtn.setVisibility(View.GONE);
        } else {
            submitBtn.setVisibility(View.VISIBLE);
        }
        context = getActivity();
        CheckdocumentUpload();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.insurance_lyt, R.id.upload_btn, R.id.download_img, R.id.manage_btn, R.id.upload_rlyt, R.id.permit_lyt, R.id.permit_upload_btn, R.id.permit_download_img, R.id.permit_manage_btn, R.id.permit_upload_rlyt, R.id.fc_lyt, R.id.fc_upload_btn, R.id.fc_download_img, R.id.fc_manage_btn, R.id.fc_upload_rlyt, R.id.regs_lyt, R.id.regs_upload_btn, R.id.regs_download_img, R.id.taxi_manage_btn, R.id.submit_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                assert getFragmentManager() != null;
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.insurance_lyt:
                insuranceVisiblity();
                break;
            case R.id.upload_btn:
                fragment = new UploadDocFragment();
                moveToFragment(fragment, "vehi_insurance");
                CommonData.Documenttype = "vehi_insurance";
                break;
            case R.id.download_img:
                // Utiles.CommonToast(activity, "download");
                break;
            case R.id.manage_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "vehi_insurance");
                    CommonData.Documenttype = "vehi_insurance";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "vehi_insurance")), "");
                }

                break;
            case R.id.permit_lyt:
                premitVisiblity();
                break;
            case R.id.permit_upload_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "vehi_premit");
                    CommonData.Documenttype = "vehi_premit";
                }
                break;
            case R.id.permit_download_img:
                //  Utiles.CommonToast(activity, "download");
                break;
            case R.id.permit_manage_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "vehi_premit");
                    CommonData.Documenttype = "vehi_premit";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "vehi_premit")), "");
                }
                break;
            case R.id.permit_upload_rlyt:
                break;
            case R.id.fc_lyt:
                fcVisiblity();
                break;
            case R.id.fc_upload_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "registrationBack");
                    CommonData.Documenttype = "registrationBack";
                }
                break;
            case R.id.fc_download_img:
                //  Utiles.CommonToast(activity, "download");
                break;
            case R.id.fc_manage_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "registrationBack");
                    CommonData.Documenttype = "registrationBack";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "registrationBack")), "");
                }
                break;
            case R.id.fc_upload_rlyt:
                break;
            case R.id.regs_lyt:
                regstVisiblity();
                break;
            case R.id.regs_upload_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "vehi_reg");
                    CommonData.Documenttype = "vehi_reg";
                }

                break;
            case R.id.regs_download_img:
                // Utiles.CommonToast(activity, "download");
                break;
            case R.id.taxi_manage_btn:
                if (!SharedHelper.getKey(context, "vehicle_active").equalsIgnoreCase("1")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "vehi_reg");
                    CommonData.Documenttype = "vehi_reg";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "vehi_reg")), "");
                }
                break;
            case R.id.submit_btn:
                DriverProfilePresenter driverProfilePresenter = new DriverProfilePresenter(this);
                driverProfilePresenter.getProfile(activity, true);
                break;
        }
    }

    private void insuranceVisiblity() {
        if (uploadRlyt.getVisibility() == View.VISIBLE) {
            view.setVisibility(View.GONE);
            uploadRlyt.setVisibility(View.GONE);
            imgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            view.setVisibility(View.VISIBLE);
            uploadRlyt.setVisibility(View.VISIBLE);
            imgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (missingTxt.getVisibility() == View.VISIBLE) {
                uploadBtn.setVisibility(View.VISIBLE);
                managLyt.setVisibility(View.GONE);
                waringImg.setVisibility(View.VISIBLE);
            } else {
                uploadBtn.setVisibility(View.GONE);
                managLyt.setVisibility(View.VISIBLE);
                waringImg.setVisibility(View.GONE);
            }
        }
    }

    public void regstVisiblity() {
        if (regsUploadRlyt.getVisibility() == View.VISIBLE) {
            regsView.setVisibility(View.GONE);
            regsUploadRlyt.setVisibility(View.GONE);
            regsImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            regsView.setVisibility(View.VISIBLE);
            regsUploadRlyt.setVisibility(View.VISIBLE);
            regsImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (regsMissingTxt.getVisibility() == View.VISIBLE) {
                regsUploadBtn.setVisibility(View.VISIBLE);
                regsManagLyt.setVisibility(View.GONE);
                regsWaringImg.setVisibility(View.VISIBLE);
            } else {
                regsUploadBtn.setVisibility(View.GONE);
                regsManagLyt.setVisibility(View.VISIBLE);
                regsWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void premitVisiblity() {
        if (permitUploadRlyt.getVisibility() == View.VISIBLE) {
            permitView.setVisibility(View.GONE);
            permitUploadRlyt.setVisibility(View.GONE);
            permitUploadRlyt.setVisibility(View.GONE);
            permitImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            permitView.setVisibility(View.VISIBLE);
            permitUploadRlyt.setVisibility(View.VISIBLE);
            permitImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            permitLyt.setVisibility(View.VISIBLE);
            if (permitMissingTxt.getVisibility() == View.VISIBLE) {
                permitUploadBtn.setVisibility(View.VISIBLE);
                permitManagLyt.setVisibility(View.GONE);
                permitWaringImg.setVisibility(View.VISIBLE);
            } else {
                permitUploadBtn.setVisibility(View.GONE);
                permitManagLyt.setVisibility(View.VISIBLE);
                permitWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void fcVisiblity() {
        if (fcUploadRlyt.getVisibility() == View.VISIBLE) {
            fcView.setVisibility(View.GONE);
            fcUploadRlyt.setVisibility(View.GONE);
            fcUploadRlyt.setVisibility(View.GONE);
            fcImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            fcView.setVisibility(View.VISIBLE);
            fcUploadRlyt.setVisibility(View.VISIBLE);
            fcImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            fcLyt.setVisibility(View.VISIBLE);
            if (fcMissingTxt.getVisibility() == View.VISIBLE) {
                fcUploadBtn.setVisibility(View.VISIBLE);
                fcManagLyt.setVisibility(View.GONE);
                fcWaringImg.setVisibility(View.VISIBLE);
            } else {
                fcUploadBtn.setVisibility(View.GONE);
                fcManagLyt.setVisibility(View.VISIBLE);
                fcWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void moveToFragment(Fragment fragment, String page) {
        if (SharedHelper.getKey(activity, "appflow").equalsIgnoreCase("login")) {

            Bundle bundle = new Bundle();
            bundle.putString("page", page);
            bundle.putString("makeid", makeid);
            bundle.putString("vehicle", "addvehicle");
            fragment.setArguments(bundle);
            assert getFragmentManager() != null;
            getFragmentManager().beginTransaction()
                    .replace(R.id.add_vehicle_document, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
        } else {
            EventBus.getDefault().postSticky(new DocumentData(page, makeid, "addvehicle"));

            assert getFragmentManager() != null;
            getFragmentManager().beginTransaction()
                    .replace(R.id.add_vehicle_document, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
        }
    }


    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onEvent(VehicleDocumentUpload event) {
        System.out.println("enter the vehicle document in android" + event.getImageurl());
        DocumentUpload(event);
        EventBus.getDefault().removeStickyEvent(VehicleDocumentUpload.class); // don't forget to remove the sticky event if youre done with it
    }

    private void DocumentUpload(VehicleDocumentUpload Document) {
        switch (CommonData.Documenttype) {
            case "vehi_insurance":
                SharedHelper.putKey(context, "vehi_insurance", Document.getImageurl());
                SharedHelper.putKey(context, "vehi_insurance_date", Document.getStrdate());
                missingTxt.setVisibility(View.GONE);
                break;
            case "vehi_premit":
                SharedHelper.putKey(context, "vehi_premit", Document.getImageurl());
                SharedHelper.putKey(context, "vehi_premit_date", Document.getStrdate());
                permitMissingTxt.setVisibility(View.GONE);
                break;
            case "vehi_reg":
                SharedHelper.putKey(context, "vehi_reg", Document.getImageurl());
                SharedHelper.putKey(context, "vehi_reg_date", Document.getStrdate());
                regsMissingTxt.setVisibility(View.GONE);
                break;
            case "registrationBack":
                SharedHelper.putKey(context, "registrationBack", Document.getImageurl());
                SharedHelper.putKey(context, "registrationexpdate", Document.getStrdate());
               fcMissingTxt.setVisibility(View.GONE);
                break;

        }
        CheckdocumentUpload();
    }

    private void CheckdocumentUpload() {
        if (SharedHelper.getKey(context, "vehi_insurance") != null && !SharedHelper.getKey(context, "vehi_insurance").isEmpty()) {
            missingTxt.setVisibility(View.GONE);
            waringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "vehi_insurance"), downloadImg, activity);
        }
        if (SharedHelper.getKey(context, "vehi_reg") != null && !SharedHelper.getKey(context, "vehi_reg").isEmpty()) {
            regsMissingTxt.setVisibility(View.GONE);
            regsWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "vehi_reg"), regsDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "vehi_premit") != null && !SharedHelper.getKey(context, "vehi_premit").isEmpty()) {
            permitMissingTxt.setVisibility(View.GONE);
            permitWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "vehi_premit"), permitDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "registrationBack") != null && !SharedHelper.getKey(context, "registrationBack").isEmpty()) {
            fcMissingTxt.setVisibility(View.GONE);
            fcWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "registrationBack"),  fcDownloadImg, activity);
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

    @Override
    public void OnSuccessfully(Response<List<DriverProfileModel>> Response) {
        SharedHelper.getKey(getContext(), "appflow").equalsIgnoreCase("login");
        List<DriverProfileModel> driverProfileModels = Response.body();
        SharedHelper.putKey(context, "login_status", "true");
        SharedHelper.putKey(context, "fname", driverProfileModels.get(0).getFname());
        SharedHelper.putKey(context, "lname", driverProfileModels.get(0).getLname());
        SharedHelper.putKey(context, "email", driverProfileModels.get(0).getEmail());
        SharedHelper.putKey(context, "phcode", driverProfileModels.get(0).getPhcode());
        SharedHelper.putKey(context, "phone", driverProfileModels.get(0).getPhone());
        SharedHelper.putKey(context, "lang", driverProfileModels.get(0).getLang());
        SharedHelper.putKey(context, "cur", driverProfileModels.get(0).getCur());
        SharedHelper.putKey(context, "code", driverProfileModels.get(0).getCode());
        SharedHelper.putKey(context, "filepath", driverProfileModels.get(0).getBaseurl());
        if (Utiles.IsNull(driverProfileModels.get(0).getLicence())) {
            SharedHelper.putKey(context, "licence", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicence());

        }
        if (Utiles.IsNull(driverProfileModels.get(0).getInsurance())) {
            SharedHelper.putKey(context, "insurance", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsurance());

        }
       /* if (Utiles.IsNull(driverProfileModels.get(0).getPassing())) {
            SharedHelper.putKey(context, "passing", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassing());

        }*/
        SharedHelper.putKey(context, "licence_date", driverProfileModels.get(0).getLicenceexp());
        //SharedHelper.putKey(context, "insurance_date", driverProfileModels.get(0).getAadharexp());
        // SharedHelper.putKey(context, "passing_date", driverProfileModels.get(0).getPassingexp());
        Constants.WalletAlertEnable = driverProfileModels.get(3).getIsDriverCreditModuleEnabledForUseAfterLogin();

        SharedHelper.putKey(context, "profile", driverProfileModels.get(1).getProfileurl());
        SharedHelper.putKey(context, "vehicleId", driverProfileModels.get(2).getCurrentActiveTaxi().getId());
        SharedHelper.putKey(context, "vmake", driverProfileModels.get(2).getCurrentActiveTaxi().getMakename());
        SharedHelper.putKey(context, "vmodel", driverProfileModels.get(2).getCurrentActiveTaxi().getModel());
        SharedHelper.putKey(context, "numplate", driverProfileModels.get(2).getCurrentActiveTaxi().getLicence());

        SharedHelper.putKey(getContext(), "appflow", "login");
        Intent i = new Intent(context, MainActivity.class);
        startActivity(i);
        activity.finish();
    }

    @Override
    public void OnFailure(Response<List<DriverProfileModel>> Response) {
        Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
    }

    @Override
    public void onResume() {
        super.onResume();
        CheckdocumentUpload();
    }


}
