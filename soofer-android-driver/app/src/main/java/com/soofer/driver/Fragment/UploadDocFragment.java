package com.soofer.driver.Fragment;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.PermissionManager;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.DocumentData;
import com.soofer.driver.EventBus.DocumentUpload;
import com.soofer.driver.EventBus.VehicleDocumentUpload;
import com.soofer.driver.FlowInterface.VehicleDocument;
import com.soofer.driver.Model.AddVehicleDocModel;
import com.soofer.driver.Model.DriverDocumentModel;
import com.soofer.driver.Presenter.DocumentPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.DocumentView;
import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import com.soofer.driver.CommonClass.CommonData;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;

public class UploadDocFragment extends BaseFragment implements DatePickerDialog.OnDateSetListener, DocumentView {
    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.select_doc_img)
    ImageView selectDocImg;
    @BindView(R.id.expt_date_edt)
    MaterialEditText exptDateEdt;
    @BindView(R.id.submit_btn)
    Button submitBtn;
    Unbinder unbinder;
    String page = "", makeid = "", vehicle = "";
    static String TAG = "TAG";
    DatePickerDialog dpd;
    Uri uri = null;
    public static int deviceHeight;
    public static int deviceWidth;
    Boolean isPermissionGivenAlready = false;
    String imagePath = "";
    VehicleDocument vehicleDocument;
    Activity activity;

    Context context;

    private static final int SELECT_PHOTO = 1;
    @BindView(R.id.document_upload)
    FrameLayout documentUpload;
    boolean CameraOrGalary = false;
    DocumentPresenter presenter;
    PermissionManager permissionManager;
    File photoFile;

    @SuppressLint("InflateParams")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_upload_doc, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        Bundle bundle = this.getArguments();
        if (bundle != null) {
            page = bundle.getString("page");
            makeid = bundle.getString("makeid");
            vehicle = bundle.getString("vehicle");
        }
        DocumentUploadcheck();
        permissionManager = new PermissionManager();
        if (page.equals("licence") || page.equals("insuranceBackImg") || page.equals("passingBackImg") || page.equalsIgnoreCase("insurance") || page.equalsIgnoreCase("taxi") || page.equals("licenceBackImg")|| page.equalsIgnoreCase("vehi_reg") ) {
            exptDateEdt.setVisibility(View.GONE);
        } else {
            exptDateEdt.setVisibility(View.VISIBLE);
        }


        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));

        Calendar now = Calendar.getInstance();
        dpd = DatePickerDialog.newInstance(
                this,
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)
        );
        presenter = new DocumentPresenter(this);
        return view;
    }

    public void DocumentUploadcheck() {
        switch (CommonData.Documenttype) {
            case "licence":
                if (SharedHelper.getKey(context, "licence") != null && !SharedHelper.getKey(context, "licence").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "licence_date"));

                }
            case "insuranceBackImg":

                if (SharedHelper.getKey(context, "insuranceBackImg") != null && !SharedHelper.getKey(context, "insuranceBackImg").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "insuranceBackImg_date"));

                }
            case "passingBackImg":

                if (SharedHelper.getKey(context, "passingBackImg") != null && !SharedHelper.getKey(context, "passingBackImg").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "passingBackImg_date"));

                }
            case "licenceBackImg":

                if (SharedHelper.getKey(context, "licenceBackImg") != null && !SharedHelper.getKey(context, "licenceBackImg").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "licenceBackImg_date"));

                }

                break;
            case "insurance":

                if (SharedHelper.getKey(context, "insurance") != null && !SharedHelper.getKey(context, "insurance").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "insurance_date"));
                }
             case "registrationBack":

                if (SharedHelper.getKey(context, "registrationBack") != null && !SharedHelper.getKey(context, "registrationBack").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "registrationexpdate"));
                }


                break;
            case "passing":

                if (SharedHelper.getKey(context, "passing") != null && !SharedHelper.getKey(context, "passing").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "passing_date"));
                }
                break;
            case "vehi_insurance":

                if (SharedHelper.getKey(context, "vehi_insurance") != null && !SharedHelper.getKey(context, "vehi_insurance").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "vehi_insurance_date"));
                }
                break;
            case "vehi_premit":

                if (SharedHelper.getKey(context, "vehi_premit") != null && !SharedHelper.getKey(context, "vehi_premit").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "vehi_premit_date"));
                }
                break;
            case "vehi_reg":

                if (SharedHelper.getKey(context, "vehi_reg") != null && !SharedHelper.getKey(context, "vehi_reg").isEmpty()) {
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    exptDateEdt.setText(SharedHelper.getKey(context, "vehi_reg_date"));
                }
                break;

        }

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.select_doc_img, R.id.expt_date_edt, R.id.submit_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.select_doc_img:
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (checkStoragePermission()) {
                        requestPermissions(new String[]{Manifest.permission.CAMERA,
                                Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 100);
                    } else {
                        goToImageIntent();
                    }
                } else {
                    goToImageIntent();
                }
                break;
            case R.id.expt_date_edt:
                if (dpd != null && !dpd.isAdded()) {
                    Calendar minDate = Calendar.getInstance();
                    minDate.add(Calendar.DATE, 0);
                    dpd.setMinDate(minDate);
                    //dpd.show(activity.getFragmentManager(), "datePicker");
                    if(getActivity() != null)
                        dpd.show(getActivity().getSupportFragmentManager(), "datePicker");
                }

                break;
            case R.id.submit_btn:

                if (exptDateEdt.getVisibility() == View.VISIBLE) {
                    if (exptDateEdt.getText().toString() == null || exptDateEdt.getText().toString().isEmpty()) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.select_the_expire_date));
                    } else if (uri == null) {
                        Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.select_the_dcoment));
                    } else {
                        if (vehicle != null && vehicle.equals("addvehicle")) {
                            VehicleDocumentUpload();
                        } else {
                            DocumentUpload();
                        }
                    }

                } else {
                    if (uri == null) {
                        Utiles.displayMessage(getView(), context, getString(R.string.select_the_document));
                    } else {
                        if (vehicle != null && vehicle.equals("addvehicle")) {
                            VehicleDocumentUpload();
                        } else {
                            DocumentUpload();
                        }
                    }
                }
                break;
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    private boolean checkStoragePermission() {
        return ContextCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 100) {
            for (int grantResult : grantResults) {
                if (grantResult == PackageManager.PERMISSION_GRANTED) {
                    if (!isPermissionGivenAlready) {
                        goToImageIntent();
                    }
                }
            }
        }
    }

    public void goToImageIntent() {
        isPermissionGivenAlready = true;
        ChooseUserProfile();
    }

    @Override
    public void onDateSet(DatePickerDialog view, int year, int monthOfYear, int dayOfMonth) {
        System.out.println("monthofyear=" + monthOfYear);
        String month = "", day = "";
        if (dayOfMonth < 10) {
            day = "0" + dayOfMonth;
            System.out.println("day=" + day);
        } else {
            day = String.valueOf(dayOfMonth);
        }
        if (monthOfYear < 9) {
            month = "0" + (++monthOfYear);
            System.out.println("month=" + month);
        } else {
            month = String.valueOf(++monthOfYear);
        }
        String date = day + "-" + month + "-" + year;
        System.out.println("new date of settext==" + date);
        exptDateEdt.setText(date);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 4:
                if (resultCode == Activity.RESULT_OK) {
                    //String imagepath = data.getStringExtra("image_path");
                    //      uri = Uri.parse(imagepath);
                    CameraOrGalary = true;
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                }
                break;
            case 5:
                if (resultCode == Activity.RESULT_OK && data != null) {
                    uri = data.getData();
                    selectDocImg.setImageResource(R.drawable.ic_document_uploaded);
                    CameraOrGalary = false;

                }
                break;
        }
    }

    @Override
    public void onResume() {
        super.onResume();
    }


    public void DocumentUpload() {
        File file;
        MultipartBody.Part filePart = null;
        if (CameraOrGalary) {
            file = new File(uri.getPath());
            file = Utiles.saveBitmapToFile(file, "camera");
        } else {
            file = new File(Utiles.getRealPathFromURI(uri, activity));
            file = Utiles.saveBitmapToFile(file, "gallery");
        }
        HashMap<String, RequestBody> map = new HashMap<>();
        if (CommonData.Documenttype.equalsIgnoreCase("aadhar")) {
            map.put("filefor", RequestBody.create(MediaType.parse("multipart/form-data"), CommonData.Documenttype));
        } else {
            map.put("filefor", RequestBody.create(MediaType.parse("multipart/form-data"), CommonData.Documenttype));
        }


        map.put("licenceexp", RequestBody.create(MediaType.parse("multipart/form-data"), exptDateEdt.getText().toString()));
        map.put("driverid", RequestBody.create(MediaType.parse("multipart/form-data"), SharedHelper.getKey(context, "userid")));
        try {
            if (CameraOrGalary) {
                assert file != null;
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(file.toString())), file));

            } else {
                assert file != null;
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(Utiles.getRealPathFromURI(uri, context))), file));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        presenter.UploadDocuments(map, filePart, activity, context);
    }

    public void VehicleDocumentUpload() {
        String filefor = "";
        MultipartBody.Part filePart = null;
        if (page.equals("vehi_insurance")) {
            filefor = "Insurance";
        } else if (page.equals("vehi_premit")) {
            filefor = "permit";
        } else if (page.equals("vehi_reg")) {
            filefor = "registration";
        }else {
            filefor = page;
        }
        File file;
        if (CameraOrGalary) {
            file = new File(uri.getPath());
            file = Utiles.saveBitmapToFile(file, "camera");
        } else {
            file = new File(Utiles.getRealPathFromURI(uri, activity));
            file = Utiles.saveBitmapToFile(file, "gallery");
        }
        HashMap<String, RequestBody> map = new HashMap<>();
        map.put("filefor", RequestBody.create(MediaType.parse("multipart/form-data"), filefor));
        map.put("driverid", RequestBody.create(MediaType.parse("multipart/form-data"), SharedHelper.getKey(context, "userid")));
        map.put("makeid", RequestBody.create(MediaType.parse("multipart/form-data"), makeid));
        map.put("expDate", RequestBody.create(MediaType.parse("multipart/form-data"), exptDateEdt.getText().toString()));
        try {
            if (CameraOrGalary) {
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(file.toString())), file));

            } else {
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(Utiles.getRealPathFromURI(uri, context))), file));

            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        presenter.UploadVehicleDocuments(map, filePart, activity, context);
    }

    @Override
    public void DocumentSuccess(Response<DriverDocumentModel> Response) {
        Log.e("tag", "Successto upload" + new Gson().toJson(Response.body()));
        Alertdialog("Your Document Upload Successfully.", true);
        assert Response.body() != null;
        EventBus.getDefault().postSticky(new DocumentUpload(page, Response.body().getFileurl(), exptDateEdt.getText().toString()));
    }

    @Override
    public void Errorlogview(Response<DriverDocumentModel> Response) {
        Alertdialog("Your Document Upload Failed.", false);
    }

    @Override
    public void VehicleDocSuccess(Response<AddVehicleDocModel> Response) {
        Log.e("tag", "Successto upload" + new Gson().toJson(Response.body()));
        Alertdialog("Your Document Upload Successfully.", true);
        assert Response.body() != null;
        EventBus.getDefault().postSticky(new VehicleDocumentUpload(page, Response.body().getFileurl(), exptDateEdt.getText().toString()));

    }

    @Override
    public void VehicleDoFailed(Response<AddVehicleDocModel> Response) {
        Alertdialog("Your Document Upload Failed.", false);
    }

    public void Alertdialog(String Message, final Boolean status) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setMessage(Message);
        builder1.setCancelable(false);
        builder1.setPositiveButton(
                "ok",
                (dialog, id) -> {
                    try {
                        if (submitBtn != null) {
                            submitBtn.setClickable(true);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if (status) {
                        dialog.cancel();
                        try {
                            if (!isRemoving()) {
                                getFragmentManager().popBackStackImmediate();
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        dialog.cancel();
                    }
                });

        AlertDialog alert11 = builder1.create();
        try {
            alert11.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String path;

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

    @Subscribe(threadMode = ThreadMode.MAIN_ORDERED, sticky = true)
    public void Onmesssage(DocumentData event) {
        page = event.getPage();
        makeid = event.getMakeid();
        vehicle = event.getVehiclestatus();
        EventBus.getDefault().removeStickyEvent(DocumentData.class); // don't forget to remove the sticky event if youre done with it
    }

    public void ChooseUserProfile() {
        final Dialog dialog = new Dialog(activity);
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
        dialog.setContentView(R.layout.cameraorgalary);
        Button camera_btn = dialog.findViewById(R.id.camera_btn);
        Button gallary_btn = dialog.findViewById(R.id.gallary_btn);
        TextView title_txt = dialog.findViewById(R.id.title_txt);
        title_txt.setText(R.string.documets_pickture);
        View.OnClickListener clickListener = view -> {
            switch (view.getId()) {
                case R.id.camera_btn:
                    dialog.dismiss();
                    takePhotoFromCamera();
                    break;
                case R.id.gallary_btn:
                    dialog.dismiss();
                    if (permissionManager.userHasPermission(getActivity())) {
                        Intent i = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        startActivityForResult(i, 5);
                    } else {
                        permissionManager.requestPermission(getActivity());

                    }
                    break;
            }
        };
        camera_btn.setOnClickListener(clickListener);
        gallary_btn.setOnClickListener(clickListener);
        activity.runOnUiThread(() -> {
            try {
                if (!isRemoving() && !isDetached()) {
                    dialog.show();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    private void takePhotoFromCamera() {
        if (permissionManager.userHasPermission(activity)) {
            takePicture();
        } else {
            permissionManager.requestPermission(activity);
        }
    }

    private void takePicture() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getActivity().getPackageManager()) != null) {
            Uri photoURI = null;
            try {
                photoFile = createImageFileWith();
                path = photoFile.getAbsolutePath();
                uri = Uri.parse(path);
                photoURI = FileProvider.getUriForFile(getActivity(), getString(R.string.file_provider_authority), photoFile);
                Log.e("response", "" + path + "////" + photoURI);

            } catch (IOException ex) {
                Log.e("TakePicture", ex.getMessage());
            }
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.LOLLIPOP) {
                takePictureIntent.setClipData(ClipData.newRawUri("", photoURI));
                takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            }
            startActivityForResult(takePictureIntent, 4);
        }
    }


    public File createImageFileWith() throws IOException {
        final String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        final String imageFileName = "JPEG_" + timestamp;
        File storageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "pics");
        storageDir.mkdirs();
        return File.createTempFile(imageFileName, ".jpg", storageDir);
    }

}
