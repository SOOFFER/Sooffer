package com.bismillah.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.EventBus.DocumentUpload;
import com.bismillah.driver.R;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

public class ManagedocFragment extends BaseFragment {
    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.waring_img)
    ImageView waringImg;
    @BindView(R.id.img_expn)
    ImageView imgExpn;
    @BindView(R.id.missing_txt)
    TextView missingTxt;
    @BindView(R.id.driving_lyt)
    RelativeLayout drivingLyt;
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
    Unbinder unbinder;
    Activity activity;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.driving_txt)
    TextView drivingTxt;
    @BindView(R.id.ins_waring_img)
    ImageView insWaringImg;
    @BindView(R.id.ins_img_expn)
    ImageView insImgExpn;
    @BindView(R.id.ins_missing_txt)
    TextView insMissingTxt;
    @BindView(R.id.insurance_lyt)
    RelativeLayout insuranceLyt;
    @BindView(R.id.ins_view)
    View insView;
    @BindView(R.id.ins_upload_btn)
    Button insUploadBtn;
    @BindView(R.id.ins_download_img)
    ImageView insDownloadImg;
    @BindView(R.id.ins_manage_btn)
    Button insManageBtn;
    @BindView(R.id.ins_manag_lyt)
    LinearLayout insManagLyt;
    @BindView(R.id.ins_upload_rlyt)
    RelativeLayout insUploadRlyt;
    @BindView(R.id.taxi_txt)
    TextView taxiTxt;
    @BindView(R.id.taxi_waring_img)
    ImageView taxiWaringImg;
    @BindView(R.id.taxi_img_expn)
    ImageView taxiImgExpn;
    @BindView(R.id.taxi_missing_txt)
    TextView taxiMissingTxt;
    @BindView(R.id.taxi_lyt)
    RelativeLayout taxiLyt;
    @BindView(R.id.taxi_view)
    View taxiView;
    @BindView(R.id.taxi_upload_btn)
    Button taxiUploadBtn;
    @BindView(R.id.taxi_download_img)
    ImageView taxiDownloadImg;
    @BindView(R.id.taxi_manage_btn)
    Button taxiManageBtn;
    @BindView(R.id.taxi_manag_lyt)
    LinearLayout taxiManagLyt;
    @BindView(R.id.taxi_upload_rlyt)
    RelativeLayout taxiUploadRlyt;

    Fragment fragment;
    @BindView(R.id.next_btn)
    Button nextBtn;

    String flow = "";
    Context context;
    @BindView(R.id.driverlic_txt)
    TextView driverlicTxt;
    @BindView(R.id.driverlic_waring_img)
    ImageView driverlicWaringImg;
    @BindView(R.id.driverlic_img_expn)
    ImageView driverlicImgExpn;
    @BindView(R.id.driverlic_missing_txt)
    TextView driverlicMissingTxt;
    @BindView(R.id.driverlic_lyt)
    RelativeLayout driverlicLyt;
    @BindView(R.id.driverlic_view)
    View driverlicView;
    @BindView(R.id.driverlic_upload_btn)
    Button driverlicUploadBtn;
    @BindView(R.id.driverlic_download_img)
    ImageView driverlicDownloadImg;
    @BindView(R.id.driverlic_manage_btn)
    Button driverlicManageBtn;
    @BindView(R.id.driverlic_manag_lyt)
    LinearLayout driverlicManagLyt;
    @BindView(R.id.driverlic_upload_rlyt)
    RelativeLayout driverlicUploadRlyt;
    @BindView(R.id.insurance_txt)
    TextView insuranceTxt;
    @BindView(R.id.ownerback_txt)
    TextView ownerbackTxt;
    @BindView(R.id.ownerback_waring_img)
    ImageView ownerbackWaringImg;
    @BindView(R.id.ownerback_img_expn)
    ImageView ownerbackImgExpn;
    @BindView(R.id.ownerback_missing_txt)
    TextView ownerbackMissingTxt;
    @BindView(R.id.ownerback_lyt)
    RelativeLayout ownerbackLyt;
    @BindView(R.id.ownerback_view)
    View ownerbackView;
    @BindView(R.id.ownerback_upload_btn)
    Button ownerbackUploadBtn;
    @BindView(R.id.ownerback_download_img)
    ImageView ownerbackDownloadImg;
    @BindView(R.id.ownerback_manage_btn)
    Button ownerbackManageBtn;
    @BindView(R.id.ownerback_manag_lyt)
    LinearLayout ownerbackManagLyt;
    @BindView(R.id.ownerback_upload_rlyt)
    RelativeLayout ownerbackUploadRlyt;
    @BindView(R.id.driveraddress_txt)
    TextView driveraddressTxt;
    @BindView(R.id.driveraddress_waring_img)
    ImageView driveraddressWaringImg;
    @BindView(R.id.driveraddress_img_expn)
    ImageView driveraddressImgExpn;
    @BindView(R.id.driveraddress_missing_txt)
    TextView driveraddressMissingTxt;
    @BindView(R.id.driveraddress_lyt)
    RelativeLayout driveraddressLyt;
    @BindView(R.id.driveraddress_view)
    View driveraddressView;
    @BindView(R.id.driveraddress_upload_btn)
    Button driveraddressUploadBtn;
    @BindView(R.id.driveraddress_download_img)
    ImageView driveraddressDownloadImg;
    @BindView(R.id.driveraddress_manage_btn)
    Button driveraddressManageBtn;
    @BindView(R.id.driveraddress_manag_lyt)
    LinearLayout driveraddressManagLyt;
    @BindView(R.id.driveraddress_upload_rlyt)
    RelativeLayout driveraddressUploadRlyt;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_manage_doc, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();

        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(Objects.requireNonNull(getActivity()).getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));

        SharedHelper.putKey(getContext(), "docStatus", "3");

        flow = SharedHelper.getKey(getContext(), "appflow");

        if (flow.equalsIgnoreCase("registration")) {
            nextBtn.setVisibility(View.VISIBLE);
        } else {
            nextBtn.setVisibility(View.GONE);
        }
        CheckdocumentUpload();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();

    }

    @OnClick({R.id.back_img, R.id.driving_lyt, R.id.upload_btn, R.id.download_img, R.id.manage_btn, R.id.insurance_lyt, R.id.ins_upload_btn, R.id.ins_download_img, R.id.ins_manage_btn,
            R.id.taxi_lyt, R.id.taxi_upload_btn, R.id.taxi_download_img, R.id.taxi_manage_btn,
            R.id.driverlic_lyt, R.id.driverlic_upload_btn, R.id.driverlic_download_img, R.id.driverlic_manage_btn,
            R.id.ownerback_lyt, R.id.ownerback_upload_btn, R.id.ownerback_download_img, R.id.ownerback_manage_btn,
            R.id.driveraddress_lyt, R.id.driveraddress_upload_btn, R.id.driveraddress_download_img, R.id.driveraddress_manage_btn,
            R.id.next_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                assert getFragmentManager() != null;
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.driving_lyt:
                licenceVisiblity();
                break;
            case R.id.upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "licence");
                    CommonData.Documenttype = "licence";
                    SharedHelper.putKey(activity, "docStatus", "1");
                }

                break;
            case R.id.download_img:

                break;
            case R.id.manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    CommonData.Documenttype = "licence";
                    moveToFragment(fragment, "licence");
                } else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "licence")), "");
                }

                break;

            case R.id.insurance_lyt:
                insuranceVisiblity();
                break;
            case R.id.ins_upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "insurance");
                    CommonData.Documenttype = "insurance";
                    SharedHelper.putKey(activity, "docStatus", "2");
                }

                break;
            case R.id.ins_download_img:

                break;
            case R.id.ins_manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "insurance");
                    CommonData.Documenttype = "insurance";
                } else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "insurance")), "");
                }
                break;
            case R.id.driveraddress_lyt:
                driveraddressVisiblity();
                break;
            case R.id.driveraddress_upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "insuranceBackImg");
                    CommonData.Documenttype = "insuranceBackImg";
                    SharedHelper.putKey(activity, "docStatus", "2");
                }

                break;
            case R.id.driveraddress_download_img:

                break;
            case R.id.driveraddress_manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "insuranceBackImg");
                    CommonData.Documenttype = "insuranceBackImg";
                } else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "insuranceBackImg")), "");
                }

                break;
            case R.id.driverlic_lyt:
                driverlicVisiblity();
                break;
            case R.id.driverlic_upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "licenceBackImg");
                    CommonData.Documenttype = "licenceBackImg";
                    SharedHelper.putKey(activity, "docStatus", "2");
                }

                break;
            case R.id.driverlic_download_img:

                break;
            case R.id.driverlic_manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "licenceBackImg");
                    CommonData.Documenttype = "licenceBackImg";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "licenceBackImg")), "");
                }

                break;
            case R.id.taxi_lyt:
                taxiVisiblity();
                break;
            case R.id.taxi_upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "taxi");
                    CommonData.Documenttype = "passing";
                    SharedHelper.putKey(activity, "docStatus", "3");
                }

                break;
            case R.id.taxi_download_img:

                break;
            case R.id.taxi_manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "taxi");
                    CommonData.Documenttype = "passing";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "passing")), "");
                }

                break;
            case R.id.ownerback_lyt:
                ownerbackVisiblity();
                break;
            case R.id.ownerback_upload_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "passingBackImg");
                    CommonData.Documenttype = "passingBackImg";
                    SharedHelper.putKey(activity, "docStatus", "3");
                }

                break;
            case R.id.ownerback_download_img:

                break;
            case R.id.ownerback_manage_btn:
                if (!SharedHelper.getOnlineStatus(context, "proof")) {
                    fragment = new UploadDocFragment();
                    moveToFragment(fragment, "passingBackImg");
                    CommonData.Documenttype = "passingBackImg";
                }else {
                    moveToFragment(new ZoomImageFragment(SharedHelper.getKey(context, "passingBackImg")), "");
                }

                break;
            case R.id.next_btn:
                if (!SharedHelper.getKey(activity, "docStatus").equalsIgnoreCase("3")) {
                    Utiles.CommonToast(getActivity(), getString(R.string.oops_some_document_has_pending_please_upload_all_document));
                } else {
                    fragment = new AddVehicleFragment();
                    moveToFragment(fragment, "addVehicle");
                }
                break;
        }
    }

    private void licenceVisiblity() {
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

    private void insuranceVisiblity() {
        if (insUploadRlyt.getVisibility() == View.VISIBLE) {
            insView.setVisibility(View.GONE);
            insUploadRlyt.setVisibility(View.GONE);
            insImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            insView.setVisibility(View.VISIBLE);
            insUploadRlyt.setVisibility(View.VISIBLE);
            insImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            //  insMissingTxt.setVisibility(View.GONE);
            if (insMissingTxt.getVisibility() == View.VISIBLE) {
                insUploadBtn.setVisibility(View.VISIBLE);
                insManagLyt.setVisibility(View.GONE);
                insWaringImg.setVisibility(View.VISIBLE);
            } else {
                insUploadBtn.setVisibility(View.GONE);
                insManagLyt.setVisibility(View.VISIBLE);
                insWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void taxiVisiblity() {
        if (taxiUploadRlyt.getVisibility() == View.VISIBLE) {
            taxiView.setVisibility(View.GONE);
            taxiUploadRlyt.setVisibility(View.GONE);
            taxiImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            taxiView.setVisibility(View.VISIBLE);
            taxiUploadRlyt.setVisibility(View.VISIBLE);
            taxiImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (taxiMissingTxt.getVisibility() == View.VISIBLE) {
                taxiUploadBtn.setVisibility(View.VISIBLE);
                taxiManagLyt.setVisibility(View.GONE);
                taxiWaringImg.setVisibility(View.VISIBLE);
            } else {
                taxiUploadBtn.setVisibility(View.GONE);
                taxiManagLyt.setVisibility(View.VISIBLE);
                taxiWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void driverlicVisiblity() {
        if (driverlicUploadRlyt.getVisibility() == View.VISIBLE) {
            driverlicView.setVisibility(View.GONE);
            driverlicUploadRlyt.setVisibility(View.GONE);
            driverlicImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            driverlicView.setVisibility(View.VISIBLE);
            driverlicUploadRlyt.setVisibility(View.VISIBLE);
            driverlicImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (driverlicMissingTxt.getVisibility() == View.VISIBLE) {
                driverlicUploadBtn.setVisibility(View.VISIBLE);
                driverlicManagLyt.setVisibility(View.GONE);
                driverlicWaringImg.setVisibility(View.VISIBLE);
            } else {
                driverlicUploadBtn.setVisibility(View.GONE);
                driverlicManagLyt.setVisibility(View.VISIBLE);
                driverlicWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void ownerbackVisiblity() {
        if (ownerbackUploadRlyt.getVisibility() == View.VISIBLE) {
            driverlicView.setVisibility(View.GONE);
            ownerbackUploadRlyt.setVisibility(View.GONE);
            ownerbackImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            ownerbackView.setVisibility(View.VISIBLE);
            ownerbackUploadRlyt.setVisibility(View.VISIBLE);
            driverlicImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (ownerbackMissingTxt.getVisibility() == View.VISIBLE) {
                ownerbackUploadBtn.setVisibility(View.VISIBLE);
                ownerbackManagLyt.setVisibility(View.GONE);
                ownerbackWaringImg.setVisibility(View.VISIBLE);
            } else {
                ownerbackUploadBtn.setVisibility(View.GONE);
                ownerbackManagLyt.setVisibility(View.VISIBLE);
                ownerbackWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void driveraddressVisiblity() {
        if (driveraddressUploadRlyt.getVisibility() == View.VISIBLE) {
            driveraddressView.setVisibility(View.GONE);
            driveraddressUploadRlyt.setVisibility(View.GONE);
            driveraddressImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand));
        } else {
            driveraddressView.setVisibility(View.VISIBLE);
            driveraddressUploadRlyt.setVisibility(View.VISIBLE);
            driveraddressImgExpn.setImageDrawable(getResources().getDrawable(R.drawable.ic_expand_less));
            if (driveraddressMissingTxt.getVisibility() == View.VISIBLE) {
                driveraddressUploadBtn.setVisibility(View.VISIBLE);
                driveraddressManagLyt.setVisibility(View.GONE);
                driveraddressWaringImg.setVisibility(View.VISIBLE);
            } else {
                driveraddressUploadBtn.setVisibility(View.GONE);
                driveraddressManagLyt.setVisibility(View.VISIBLE);
                driveraddressWaringImg.setVisibility(View.GONE);
            }
        }
    }

    private void moveToFragment(Fragment fragment, String page) {

        if (flow.equalsIgnoreCase("registration")) {
            if (!page.equalsIgnoreCase("addVehicle")) {
                Bundle bundle = new Bundle();
                bundle.putString("page", page);
                fragment.setArguments(bundle);
            }
            Objects.requireNonNull(getActivity()).getSupportFragmentManager().beginTransaction()
                    .replace(R.id.containter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();

        } else {
            Bundle bundle = new Bundle();
            bundle.putString("page", page);
            fragment.setArguments(bundle);
            Objects.requireNonNull(getActivity()).getSupportFragmentManager().beginTransaction()
                    .replace(R.id.drawer_layout, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();

        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(DocumentUpload event) {
        DocumentUpload(event);
        EventBus.getDefault().removeStickyEvent(DocumentUpload.class); // don't forget to remove the sticky event if youre done with it
    }

    public void DocumentUpload(DocumentUpload Document) {
        switch (CommonData.Documenttype) {
            case "licence":
                SharedHelper.putKey(context, "licence", Document.getImageurl());
                SharedHelper.putKey(context, "licence_date", Document.getStrdate());
                missingTxt.setVisibility(View.GONE);
                break;
            case "insurance":
                SharedHelper.putKey(context, "insurance", Document.getImageurl());
                SharedHelper.putKey(context, "insurance_date", Document.getStrdate());
                insMissingTxt.setVisibility(View.GONE);
                break;
            case "passing":
                SharedHelper.putKey(context, "passing", Document.getImageurl());
                SharedHelper.putKey(context, "passing_date", Document.getStrdate());
                taxiMissingTxt.setVisibility(View.GONE);
                break;
            case "licenceBackImg":
                SharedHelper.putKey(context, "licenceBackImg", Document.getImageurl());
                SharedHelper.putKey(context, "licenceBackImg_date", Document.getStrdate());
                driverlicMissingTxt.setVisibility(View.GONE);
                break;

            case "passingBackImg":
                SharedHelper.putKey(context, "passingBackImg", Document.getImageurl());
                SharedHelper.putKey(context, "passingBackImg_date", Document.getStrdate());
                ownerbackMissingTxt.setVisibility(View.GONE);
                break;
            case "insuranceBackImg":
                SharedHelper.putKey(context, "insuranceBackImg", Document.getImageurl());
                SharedHelper.putKey(context, "insuranceBackImg_date", Document.getStrdate());
                driveraddressMissingTxt.setVisibility(View.GONE);
                break;

        }
        CheckdocumentUpload();
    }

    private void CheckdocumentUpload() {
        if (SharedHelper.getKey(context, "licence") != null && !SharedHelper.getKey(context, "licence").isEmpty()) {
            missingTxt.setVisibility(View.GONE);
            waringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "licence"), downloadImg, activity);
        }
        if (SharedHelper.getKey(context, "insurance") != null && !SharedHelper.getKey(context, "insurance").isEmpty()) {
            insMissingTxt.setVisibility(View.GONE);
            insWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "insurance"), insDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "passing") != null && !SharedHelper.getKey(context, "passing").isEmpty()) {
            taxiMissingTxt.setVisibility(View.GONE);
            taxiWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "passing"), taxiDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "licenceBackImg") != null && !SharedHelper.getKey(context, "licenceBackImg").isEmpty()) {
            driverlicMissingTxt.setVisibility(View.GONE);
            driverlicWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "licenceBackImg"), driverlicDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "passingBackImg") != null && !SharedHelper.getKey(context, "passingBackImg").isEmpty()) {
            ownerbackMissingTxt.setVisibility(View.GONE);
            ownerbackWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "passingBackImg"), ownerbackDownloadImg, activity);
        }
        if (SharedHelper.getKey(context, "insuranceBackImg") != null && !SharedHelper.getKey(context, "insuranceBackImg").isEmpty()) {
            driveraddressMissingTxt.setVisibility(View.GONE);
            driveraddressWaringImg.setVisibility(View.GONE);
            Utiles.Documentimg(SharedHelper.getKey(context, "insuranceBackImg"), driveraddressDownloadImg, activity);
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
}