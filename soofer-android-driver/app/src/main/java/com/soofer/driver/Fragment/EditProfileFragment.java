package com.soofer.driver.Fragment;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
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
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.gson.Gson;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Email;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.driver.CommonClass.BaseFragment;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.ybs.countrypicker.CountryPicker;
import com.ybs.countrypicker.CountryPickerListener;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.soofer.driver.Activity.ProfileActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.PermissionManager;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.CustomizeDialog.CustomDialogClass;
import com.soofer.driver.Model.LanguageCurrencyModel;
import com.soofer.driver.Model.UpdatProfileModel;
import com.soofer.driver.Presenter.DriverProfileUpdatePresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.CurrencyLanguageView;
import com.soofer.driver.View.EditProfileView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import de.hdodenhof.circleimageview.CircleImageView;
import io.ghyeok.stickyswitch.widget.StickySwitch;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;


public class EditProfileFragment extends BaseFragment implements CurrencyLanguageView, Validator.ValidationListener, EditProfileView {

    @BindView(R.id.rider_profile_image)
    CircleImageView riderProfileImage;
    //@NotEmpty(message = getString(R.string.enter_the_first_name))
    @NotEmpty(message = "Enter the First Name")
    @BindView(R.id.fname_edit)
    MaterialEditText fnameEdit;
    //@NotEmpty(message = getString(R.string.enter_the_last_name))
    @BindView(R.id.lname_edt)
    MaterialEditText lnameEdt;
 //   @Email(message = getString(R.string.enter_valid_email_id))
    @Email(message = "Enter Valid Email id")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;
    @BindView(R.id.mobile_edt)
  //  @NotEmpty(message = getString(R.string.enter_the_mobile_number))
    @NotEmpty(message = "Enter the Mobile Number")
    MaterialEditText mobileEdt;
    @BindView(R.id.language_spinner)
    Spinner languageSpinner;
    @BindView(R.id.currency_spinner)
    Spinner currencySpinner;
    @BindView(R.id.update_information_btn)
    Button updateInformationBtn;
    Unbinder unbinder;
    List<String> language = new ArrayList<String>();
    ;
    List<String> currency = new ArrayList<String>();
    String lang, cur;
    Validator validator;
    public static int deviceWidth;
    Boolean isPermissionGivenAlready = false;
    String imagePath = "";
    Uri uri = null;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.password_edt)
    MaterialEditText passwordEdt;
    CustomDialogClass dialogClass;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @SuppressLint("StaticFieldLeak")
    private Activity activity;
    private Context context;
    private static final int SELECT_PHOTO = 1;
    private CountryPicker picker;
    private boolean CameraOrGalary = false;
    private PermissionManager permissionManager;
    public String path;

    private File photoFile;


    @BindView(R.id.stickySwitch)
    StickySwitch stickySwitch;

    private String strGendeType ="Male";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_edit_profile, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getActivity();
        validator = new Validator(this);
        validator.setValidationListener(this);

        picker = CountryPicker.newInstance(activity.getResources().getString(R.string.select_count));
        picker.setListener(new CountryPickerListener() {
            @Override
            public void onSelectCountry(String name, String code, String digtal_code, int i) {
                ccEdt.setText(digtal_code);
                picker.dismiss();
            }
        });
        permissionManager = new PermissionManager();
        //  CurrencyLanguagePresenter currencyLanguagePresenter = new CurrencyLanguagePresenter(this);
        // currencyLanguagePresenter.getCurrencyLanguage(activity);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        setdata();

        if(!SharedHelper.getKey(activity,"gender").isEmpty()){
            strGendeType = SharedHelper.getKey(activity,"gender");
        }

        if(strGendeType.equalsIgnoreCase("male")){
            stickySwitch.setDirection(StickySwitch.Direction.LEFT);
        }else {
            stickySwitch.setDirection(StickySwitch.Direction.RIGHT);
        }
        stickySwitch.setOnSelectedChangeListener((direction, s) -> strGendeType = s);
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            Utiles.clearInstance();
            unbinder.unbind();
            if(dialogClass!=null && dialogClass.isShowing()){
                dialogClass.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @OnClick({R.id.update_information_btn, R.id.rider_profile_image, R.id.cc_edt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.update_information_btn:
                validator.validate();
                break;

            case R.id.rider_profile_image:
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
            case R.id.cc_edt:
                picker.show(getFragmentManager(), "country_picker");
                break;
        }
    }

    @Override
    public void countriesReady(List<LanguageCurrencyModel> LanguageCurrencyModel) {
        for (int i = 0; LanguageCurrencyModel.size() > i; i++) {
        /*    if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("1")) {
                Currencyspinner(LanguageCurrencyModel.get(i).getDatas());
            } else if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("2")) {
                LanguageSpinner(LanguageCurrencyModel.get(i).getDatas());
            }*/
        }
        spnrData();
    }

    private void LanguageSpinner(List<LanguageCurrencyModel.Data> datas) {

      /*  for (int i = 0; i < datas.size(); i++) {
            language.add(datas.get(i).getName());
            if (SharedHelper.getKey(getActivity(), "lang").equalsIgnoreCase(datas.get(i).getId())) {
                lang = datas.get(i).getName();
            }
        }*/

        ArrayAdapter<String> currencyAdapter = new ArrayAdapter<String>(getActivity(),
                R.layout.spinnertext_editprofile, language);
        currencyAdapter.setDropDownViewResource(R.layout.dropdown);
        languageSpinner.setAdapter(currencyAdapter);
        languageSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                CommonData.strLanguage = parent.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    private void Currencyspinner(List<LanguageCurrencyModel.Data> datas) {
        /*for (int i = 0; i < datas.size(); i++) {
            currency.add(datas.get(i).getName());
        }*/

        ArrayAdapter<String> currencyAdapter = new ArrayAdapter<String>(getActivity(),
                R.layout.spinnertext_editprofile, currency);
        currencyAdapter.setDropDownViewResource(R.layout.dropdown);
        currencySpinner.setAdapter(currencyAdapter);
        currencySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                CommonData.strCurrency = parent.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    public void spnrData() {
        for (int i = 0; i < currency.size(); i++) {
            if (cur.equalsIgnoreCase(currency.get(i))) {
                currencySpinner.setSelection(i);
            }
        }
        for (int i = 0; i < language.size(); i++) {
            if (lang.equalsIgnoreCase(language.get(i))) {
                languageSpinner.setSelection(i);
            }
        }
    }

    public void setdata() {
        fnameEdit.setText(SharedHelper.getKey(getActivity(), "fname"));
        lnameEdt.setText(SharedHelper.getKey(getActivity(), "lname"));
        emailEdt.setText(SharedHelper.getKey(getActivity(), "email"));
        ccEdt.setText(SharedHelper.getKey(getActivity(), "phcode"));
        mobileEdt.setText(SharedHelper.getKey(getActivity(), "phone"));
        cur = SharedHelper.getKey(getActivity(), "cur");
        lang = SharedHelper.getKey(getActivity(), "lang");
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), riderProfileImage, activity);
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        File file = null;
        MultipartBody.Part filePart = null;
        if (uri != null) {
            if (CameraOrGalary) {
                file = new File(uri.getPath());
            //    file = Utiles.saveBitmapToFile(file, "camera");
            } else {
                file = new File(Utiles.getRealPathFromURI(uri, context));
        //        file = Utiles.saveBitmapToFile(file, "gallery");
            }

        }

        HashMap<String, RequestBody> update = new HashMap<>();
        update.put("fname", RequestBody.create(MediaType.parse("text/plain"), fnameEdit.getText().toString()));
        update.put("lname", RequestBody.create(MediaType.parse("text/plain"), lnameEdt.getText().toString()));
        update.put("email", RequestBody.create(MediaType.parse("text/plain"), emailEdt.getText().toString()));
        update.put("phcode", RequestBody.create(MediaType.parse("text/plain"), ccEdt.getText().toString()));
        update.put("gender", RequestBody.create(MediaType.parse("text/plain"), strGendeType));
        update.put("phone", RequestBody.create(MediaType.parse("text/plain"), mobileEdt.getText().toString()));
        update.put("lang", RequestBody.create(MediaType.parse("text/plain"), CommonData.strLanguage));
        update.put("cur", RequestBody.create(MediaType.parse("text/plain"), CommonData.strCurrency));
        try {
            if (uri != null) {
                if (CameraOrGalary) {
                    assert file != null;
                    filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(file.toString())), file));
                    DriverProfileUpdatePresenter updatePresenter = new DriverProfileUpdatePresenter(this);
                    updatePresenter.updateProfile(update, filePart, activity);
                } else {
                    assert file != null;
                    filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(Utiles.getMimeType(Utiles.getRealPathFromURI(uri, context))), file));
                    DriverProfileUpdatePresenter updatePresenter = new DriverProfileUpdatePresenter(this);
                    updatePresenter.updateProfile(update, filePart, activity);
                }
            } else {
                DriverProfileUpdatePresenter updatePresenter = new DriverProfileUpdatePresenter(this);
                updatePresenter.updateProfile(update, null, activity);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


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
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 4:
                if (resultCode == Activity.RESULT_OK) {
                    Utiles.LocalImage(path, riderProfileImage, activity);
                    Log.e("responsesssssss", "" + path);
                    CameraOrGalary = true;
                }
                break;
            case 5:
                if (resultCode == Activity.RESULT_OK && data != null) {
                    uri = data.getData();
                    Utiles.LocalImage(Utiles.getRealPathFromURI(uri, context), riderProfileImage, activity);
                    CameraOrGalary = false;

                }
                break;
        }
    }


    @Override
    public void OnSuccessfully(Response<UpdatProfileModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            SharedHelper.putKey(context, "fname", Response.body().getRequest().getFname());
            SharedHelper.putKey(context, "lname", Response.body().getRequest().getLname());
            SharedHelper.putKey(context, "email", Response.body().getRequest().getEmail());
            SharedHelper.putKey(context, "phcode", Response.body().getRequest().getPhcode());
            SharedHelper.putKey(context, "phone", Response.body().getRequest().getPhone());
            SharedHelper.putKey(context, "lang", Response.body().getRequest().getLang());
            SharedHelper.putKey(context, "cur", Response.body().getRequest().getCur());
            SharedHelper.putKey(context, "profile", Response.body().getFileurl());
            SharedHelper.putKey(activity,"gender",strGendeType);
            Intent intent = new Intent(context, ProfileActivity.class);
            startActivity(intent);
            activity.finish();
        }
    }

    @Override
    public void OnFailure(Response<UpdatProfileModel> Response) {
        Log.e("TAG", "update profile response " + new Gson().toJson(Response.errorBody()));
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    public void ChooseUserProfile() {
        final Dialog dialog = new Dialog(activity);
        dialog.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
        dialog.setContentView(R.layout.cameraorgalary);
        Button camera_btn = dialog.findViewById(R.id.camera_btn);
        Button gallary_btn = dialog.findViewById(R.id.gallary_btn);
        final View decorView = dialog.getWindow().getDecorView();
        Utiles.StartAnimation(decorView);
        View.OnClickListener clickListener = view -> {
            switch (view.getId()) {
                case R.id.camera_btn:
                    Utiles.DismissiAnimation(decorView, dialog);
                    takePhotoFromCamera();
                    break;
                case R.id.gallary_btn:
                    Utiles.DismissiAnimation(decorView, dialog);

                        Intent i = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        startActivityForResult(i, 5);

                    break;
            }
        };
        camera_btn.setOnClickListener(clickListener);
        gallary_btn.setOnClickListener(clickListener);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!isRemoving() && !isDetached()) {
                    dialog.show();
                }
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
                Log.e("responserrrr", "" + path + "////" + photoURI);

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

    @OnClick({R.id.back_img, R.id.password_edt})
    public void onViewClickeds(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.password_edt:
                if(dialogClass!=null && dialogClass.isShowing()){
                    dialogClass.dismiss();
                }
                 dialogClass = new CustomDialogClass(activity);
                dialogClass.setCancelable(false);
                dialogClass.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
                try {
                    final View decorView = dialogClass.getWindow().getDecorView();
                    Utiles.StartAnimation(decorView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                dialogClass.show();
                break;
        }
    }


}
