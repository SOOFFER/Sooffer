package com.bismillah.driver.Fragment.document;

import android.Manifest;
import android.app.Activity;
import android.app.Dialog;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.CommonClass.PermissionManager;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.EventBus.DocumentUpload;
import com.bismillah.driver.Model.DocumentModel;
import com.bismillah.driver.Model.DocumentUploadModel;
import com.bismillah.driver.Presenter.SubscriptionPresenter;
import com.bismillah.driver.R;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;

import org.greenrobot.eventbus.EventBus;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.HttpException;

import static com.bismillah.driver.Retrofit.RetrofitGenerator.ImageUrl;


public class SingleDocumentsUploadFragment extends Fragment implements DatePickerDialog.OnDateSetListener, SubscriptionPresenter.CommonView {
    private DocumentModel.Document data;

    public SingleDocumentsUploadFragment(DocumentModel.Document data) {
        // Required empty public constructor
        this.data = data;
    }

    Unbinder unbinder;
    @BindView(R.id.front_pic_img)
    ImageView frontPicImg;

    @BindView(R.id.login_btn)
    Button login;

    @BindView(R.id.back_pic_img)
    ImageView backPicImg;

    @BindView(R.id.date_picker_txt)
    MaterialEditText datePickerTxt;

    private Activity activity;
    private FragmentManager fragmentManager;
    DatePickerDialog dpd;
    Uri uri = null;
    PermissionManager permissionManager;
    File photoFile;
    public String path;
    private String strFront = "", strBack = "";
    private boolean isFrontorBack = false;
    Boolean isPermissionGivenAlready = false;
    private SubscriptionPresenter subscriptionPresenter;
    private CompositeDisposable disposable;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_single_documents_upload, null, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        disposable = new CompositeDisposable();
        fragmentManager = getFragmentManager();
        login.setVisibility(View.GONE);
        frontPicImg.setVisibility(data.getFront() ? View.VISIBLE : View.GONE);
        backPicImg.setVisibility(View.GONE);
        datePickerTxt.setVisibility(data.getExp() ? View.VISIBLE : View.GONE);
        Calendar now = Calendar.getInstance();
        dpd = DatePickerDialog.newInstance(
                this,
                now.get(Calendar.YEAR),
                now.get(Calendar.MONTH),
                now.get(Calendar.DAY_OF_MONTH)
        );
        try {
            strFront = data.getFrontImgUrl();
//            strBack = data.getBackImgUrl();
            Utiles.Documentimg(data.getFrontImgUrl(), frontPicImg, activity);
            Utiles.Documentimg(data.getBackImgUrl(), backPicImg, activity);
            datePickerTxt.setText(data.getDocExp());
        } catch (Exception e) {
            e.printStackTrace();
        }
        permissionManager = new PermissionManager();
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);

        return view;
    }

    @OnClick({R.id.login_btn, R.id.back_img, R.id.date_picker_txt, R.id.front_pic_img, R.id.back_pic_img})
    void isClickListioner(View view) {
        switch (view.getId()) {
            case R.id.login_btn:
                if (frontPicImg.getVisibility() == View.VISIBLE && strFront.isEmpty()) {
                    Utiles.CommonToast(activity, getString(R.string.please_select_front_image));
                    return;
                }
                if (backPicImg.getVisibility() == View.VISIBLE /*&& strBack.isEmpty()*/) {
                    Utiles.CommonToast(activity, getString(R.string.please_select_back_image));
                    return;
                }
                if (datePickerTxt.getVisibility() == View.VISIBLE && datePickerTxt.getText().toString().isEmpty()) {
                    Utiles.CommonToast(activity, getString(R.string.please_select_expiration_date));
                    return;
                }
                HashMap<String, RequestBody> map = new HashMap<>();
                map.put("filefor", RequestBody.create(MediaType.parse("multipart/form-data"), data.getFileFor()));
                map.put("expDate", RequestBody.create(MediaType.parse("multipart/form-data"), datePickerTxt.getText().toString()));
                MultipartBody.Part frontfilePart;
                if (!strFront.equals("")) {
                    frontfilePart = MultipartBody.Part.createFormData("fileFront", new File(strFront).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(new File(strFront).toString())), new File(strFront)));
                } else {
                    frontfilePart = MultipartBody.Part.createFormData("fileFront", "");
                }
                MultipartBody.Part backfilePart;
//                if (!strBack.equals(null)&&!strBack.equals("")) {
//                    backfilePart = MultipartBody.Part.createFormData("fileBack", new File(strBack).getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(strBack)), new File(strBack)));
//                } else {
                    backfilePart = MultipartBody.Part.createFormData("fileBack", "");
//                }

                if (!Constants.strVehicleID.isEmpty()) {
                    map.put("driverId", RequestBody.create(MediaType.parse("multipart/form-data"), SharedHelper.getKey(activity, "userid")));
                    map.put("makeId", RequestBody.create(MediaType.parse("multipart/form-data"), Constants.strVehicleID));
                    subscriptionPresenter.getVehicleUploadDocumentApi(map, frontfilePart, backfilePart);
                } else {
                    subscriptionPresenter.getUploadDocumentApi(map, frontfilePart, backfilePart);
                }

                break;

            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;

            case R.id.date_picker_txt:
                if (dpd != null && !dpd.isAdded()) {
                    Calendar minDate = Calendar.getInstance();
                    minDate.add(Calendar.DATE, 0);
                    dpd.setMinDate(minDate);
                    //dpd.show(activity.getFragmentManager(), "datePicker");
                    if (getActivity() != null)
                        dpd.show(getActivity().getSupportFragmentManager(), "datePicker");
                }
                break;

            case R.id.front_pic_img:
                isFrontorBack = true;
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
            case R.id.back_pic_img:
                isFrontorBack = false;
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
    public void onDestroy() {
        super.onDestroy();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
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
        String date = month + "/" + day + "/" + year;
        System.out.println("new date of settext==" + date);
        datePickerTxt.setText(date);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        File file;
        switch (requestCode) {
            case 4:
                if (resultCode == Activity.RESULT_OK) {
                    //String imagepath = data.getStringExtra("image_path");
                    //      uri = Uri.parse(imagepath);
                    file = new File(uri.getPath());
                    file = Utiles.saveBitmapToFile(file, "camera");
                    if (isFrontorBack) {
                        strFront = String.valueOf(file);
                        Utiles.Documentimg(strFront, frontPicImg, activity);
                    }
                    login.setVisibility(View.VISIBLE);
//                    else {
//                        strBack = String.valueOf(file);
//                        Utiles.Documentimg(strBack, backPicImg, activity);
//                    }

                }
                break;
            case 5:
                if (resultCode == Activity.RESULT_OK && data != null) {
                    uri = data.getData();
                    file = new File(Utiles.getRealPathFromURI(uri, activity));
                    file = Utiles.saveBitmapToFile(file, "gallery");
                    if (isFrontorBack) {
                        strFront = String.valueOf(file);
                        Utiles.Documentimg(strFront, frontPicImg, activity);
                    } else {
                        strBack = String.valueOf(file);
                        Utiles.Documentimg(strBack, backPicImg, activity);

                    }
                }
                break;
        }
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

    @Override
    public void onSuccess(Object object, String fromApi) {
        if (object instanceof DocumentUploadModel) {
            data.setBackImgUrl(ImageUrl + ((DocumentUploadModel) object).getData().getDocBackImg());
            data.setFrontImgUrl(ImageUrl + ((DocumentUploadModel) object).getData().getDocFrontImg());
            data.setDocExp(((DocumentUploadModel) object).getData().getDocExp());
            data.setDocumentUploaded(true);
            EventBus.getDefault().postSticky(new DocumentUpload("", "", ""));
            fragmentManager.popBackStackImmediate();
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
                Utiles.displayMessage(getView(), activity, "Poor network connection");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), activity, "Poor network connection");
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
}