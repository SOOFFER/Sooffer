package com.soofer.app.Fragment;



import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.ClipData;
import android.content.Context;
import android.content.CursorLoader;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.gson.Gson;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Email;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.app.CommonClass.BaseFragment;
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

import com.soofer.app.Activity.ProfileActivity;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.PermissionManager;
import com.soofer.app.CommonClass.RoundImageTransform;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.CustomDialogClass;
import com.soofer.app.Model.EditProfileModel;
import com.soofer.app.Model.LanguageCurrencyModel;
import com.soofer.app.Presenter.UpdateProfilePresenter;
import com.soofer.app.R;
import com.soofer.app.View.CurrencyLanguageView;
import com.soofer.app.View.UpdateProfileView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.ghyeok.stickyswitch.widget.StickySwitch;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;


public class EditProfileFragment extends BaseFragment implements Validator.ValidationListener, CurrencyLanguageView, UpdateProfileView {
    @BindView(R.id.rider_profile_image)
    ImageView riderProfileImage;
  //  @NotEmpty(message = getString(R.string.enter_your_first_name))
    @NotEmpty(message = "Enter Your First Name")
    @BindView(R.id.fname_edit)
    MaterialEditText fnameEdit;

    @BindView(R.id.lname_edt)
    MaterialEditText lnameEdt;
    @NotEmpty(message = "")
  //  @Email(message = getString(R.string.enter_valid_email_id))
    @Email(message = "Enter Valid Email ID")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
    @BindView(R.id.cc_edt)
    MaterialEditText ccEdt;
   // @NotEmpty(message = getString(R.string.enter_your_mobile_number))
   @NotEmpty(message = "Enter YOur Mobile Number")
   @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.language_spinner)
    Spinner languageSpinner;
    @BindView(R.id.currency_spinner)
    Spinner currencySpinner;
    @BindView(R.id.update_information_btn)
    Button updateInformationBtn;
    Unbinder unbinder;
    Validator validator;

    Uri uri = null;
    boolean CameraOrGalary = false;

    PermissionManager permissionManager;
    public String path;

    File photoFile;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.password_edt)
    MaterialEditText passwordEdt;

    @BindView(R.id.stickySwitch)
    StickySwitch stickySwitch;

    private String strGendeType ="Male";
    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final String[] REQUIRED_PERMISSIONS = {
            Manifest.permission.CAMERA,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    CountryPicker picker;
    Activity activity;
    Context context;
    View view;


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        if (view != null) {
            ViewGroup parent = (ViewGroup) view.getParent();
            if (parent != null) {
                parent.removeView(view);
            }
        }
        {


            // Inflate the layout for this fragment
            activity = getActivity();
            context = getContext();
            permissionManager = new PermissionManager();
            FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
            fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
            view = inflater.inflate(R.layout.fragment_edit_profile, container, false);
            unbinder = ButterKnife.bind(this, view);
            validator = new Validator(this);
            validator.setValidationListener(this);
            //CurrencyLanguagePresenter currencyLanguagePresenter = new CurrencyLanguagePresenter(this);
            // currencyLanguagePresenter.getCurrencyLanguage(activity);
            picker = CountryPicker.newInstance("Select Country");  // dialog title
            picker.setListener(new CountryPickerListener() {
                @Override
                public void onSelectCountry(String name, String code, String dialCode, int flagDrawableResID) {
                    ccEdt.setText(dialCode);
                    picker.dismiss();
                    // Implement your code here
                }
            });
            setData();
            if(!SharedHelper.getKey(activity,"gender").isEmpty()){
                strGendeType = SharedHelper.getKey(activity,"gender");
            }

            if(strGendeType.equalsIgnoreCase("male")){
                stickySwitch.setDirection(StickySwitch.Direction.LEFT);
            }else {
                stickySwitch.setDirection(StickySwitch.Direction.RIGHT);
            }
            stickySwitch.setOnSelectedChangeListener((direction, s) -> strGendeType = s);

            Utiles.CircleImageView(Utiles.NullPointer(SharedHelper.getKey(context, "profile")), riderProfileImage, context);
            return view;
        }


        //lngTxt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "language")));
        // currencyTxt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "currency")));


    }

    public void setData() {

        fnameEdit.setText(Utiles.NullPointer(SharedHelper.getKey(context, "fname")));
        lnameEdt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "lname")));
        emailEdt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "emailid")));
        mobileEdt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "mobile")));
        ccEdt.setText(Utiles.NullPointer(SharedHelper.getKey(context, "cc")));

        RemoveTheFocus();
    }

    public void RemoveTheFocus() {
        fnameEdit.setError(null);
        lnameEdt.setError(null);
        emailEdt.setError(null);
        mobileEdt.setError(null);
        ccEdt.setError(null);

    }

    @Override
    public void onResume() {
        super.onResume();
        setData();
    }

    @Override
    public void onDestroyView() {
        RemoveTheFocus();
        Utiles.clearInstance();
        super.onDestroyView();
        unbinder.unbind();
    }


    @Override
    public void onValidationSucceeded() {
        getUpdateProfile();
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

    public void LanguageSpinner(List<LanguageCurrencyModel.Data> Data) {
        List<String> langaugeList = new ArrayList<String>();
        for (int i = 0; Data.size() > i; i++) {
            langaugeList.add(Data.get(i).getName());
        }
        ArrayAdapter<String> languageAdapter = new ArrayAdapter<String>(activity,
                R.layout.dropdown, langaugeList);
        languageAdapter.setDropDownViewResource(R.layout.dropdown);
        languageSpinner.setAdapter(languageAdapter);
        int spinnerPosition = languageAdapter.getPosition(Utiles.NullPointer(SharedHelper.getKey(context, "language")));
        languageSpinner.setSelection(spinnerPosition);
        languageSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                CommonData.strLanguage = adapterView.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });

    }

    public void Currencyspinner(List<LanguageCurrencyModel.Data> Data) {

        List<String> currencyList = new ArrayList<String>();
        for (int i = 0; Data.size() > i; i++) {
            currencyList.add(Data.get(i).getName());

        }
        ArrayAdapter<String> currencyAdapter = new ArrayAdapter<String>(activity,
                R.layout.dropdown, currencyList);
        currencyAdapter.setDropDownViewResource(R.layout.dropdown);
        currencySpinner.setAdapter(currencyAdapter);
        int spinnerPosition = currencyAdapter.getPosition(Utiles.NullPointer(SharedHelper.getKey(context, "currency")));
        currencySpinner.setSelection(spinnerPosition);
        currencySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                CommonData.strCurrency = adapterView.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });

    }

    @Override
    public void countriesReady(List<LanguageCurrencyModel> LanguageCurrencyModel) {

        for (int i = 0; LanguageCurrencyModel.size() > i; i++) {
            if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("1")) {
                Currencyspinner(LanguageCurrencyModel.get(i).getDatas());
            } else if (LanguageCurrencyModel.get(i).getId().equalsIgnoreCase("2")) {
                LanguageSpinner(LanguageCurrencyModel.get(i).getDatas());
            }

        }

    }

    @OnClick({R.id.cc_edt, R.id.update_information_btn, R.id.rider_profile_image})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cc_edt:
             //   picker.show(getFragmentManager(), "COUNTRY_PICKER");
                break;
            case R.id.update_information_btn:
                Utiles.hideKeyboard(activity);
                validator.validate();
                break;
            case R.id.rider_profile_image:

                ChooseUserProfile();
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 4:
                if (resultCode == Activity.RESULT_OK) {
                    CameraOrGalary = true;
                    LocalImage(path, riderProfileImage, activity);
                }
                break;
            case 5:
                if (resultCode == Activity.RESULT_OK && data != null) {
                    uri = data.getData();
                    LocalImage(getRealPathFromURI(uri), riderProfileImage, activity);
                    CameraOrGalary = false;
                }
                break;
        }
    }

    public void LocalImage(String ImagePath, final ImageView imageView, final Activity activity) {
        System.out.println("enter the image view in android" + ImagePath);
        Glide.with(activity)
                .load(ImagePath)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(true)
                .transform(new RoundImageTransform(activity))
                .into(imageView);

    }

    @SuppressLint("LongLogTag")
    public void getUpdateProfile() {
        Utiles.hideKeyboard(activity);
        File file = null;
        if (uri != null) {
            if (CameraOrGalary) {
                file = new File(uri.getPath());
                ImageUpload(file);
            } else {
                file = new File(getRealPathFromURI(uri));
                ImageUpload(file);
            }
        }else {
            ImageUpload(file);
        }
    }

    public void ImageUpload(File file) {
        MultipartBody.Part filePart = null;
        HashMap<String, RequestBody> map = new HashMap<>();
        map.put("fname", RequestBody.create(MediaType.parse("text/plain"), fnameEdit.getText().toString()));
        map.put("lname", RequestBody.create(MediaType.parse("text/plain"), lnameEdt.getText().toString()));
        map.put("email", RequestBody.create(MediaType.parse("text/plain"), emailEdt.getText().toString()));
        map.put("phone", RequestBody.create(MediaType.parse("text/plain"), mobileEdt.getText().toString()));
        map.put("cnty", RequestBody.create(MediaType.parse("text/plain"), ""));
        map.put("gender", RequestBody.create(MediaType.parse("text/plain"), strGendeType));
        map.put("cntyname", RequestBody.create(MediaType.parse("text/plain"), ""));
        map.put("lang", RequestBody.create(MediaType.parse("text/plain"), CommonData.strLanguage));
        map.put("cur", RequestBody.create(MediaType.parse("text/plain"), CommonData.strCurrency));
        map.put("phcode", RequestBody.create(MediaType.parse("text/plain"), ccEdt.getText().toString()));
        if (uri != null) {
            if (CameraOrGalary) {
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(getMimeType(file.toString())), file));
                UpdateProfilePresenter updateProfilePresenter = new UpdateProfilePresenter(this);
                updateProfilePresenter.UpdateProfile(map, filePart, activity, context);
            } else {
                filePart = MultipartBody.Part.createFormData("file", file.getName(), RequestBody.create(MediaType.parse(getMimeType(getRealPathFromURI(uri))), file));
                UpdateProfilePresenter updateProfilePresenter = new UpdateProfilePresenter(this);
                updateProfilePresenter.UpdateProfile(map, filePart, activity, context);
            }

        } else {
            UpdateProfilePresenter updateProfilePresenter = new UpdateProfilePresenter(this);
            updateProfilePresenter.UpdateProfile(map, filePart, activity, context);
        }
    }

    @Override
    public void OnSuccessfully(Response<EditProfileModel> Response) {
        if (Response.body().getSuccess()) {
            SharedHelper.putKey(context, "fname", Response.body().getRequest().getFname());
            SharedHelper.putKey(context, "lname", Response.body().getRequest().getLname());
            SharedHelper.putKey(context, "emailid", Response.body().getRequest().getEmail());
            SharedHelper.putKey(context, "cc", Response.body().getRequest().getPhcode());
            SharedHelper.putKey(context, "mobile", Response.body().getRequest().getPhone());
            SharedHelper.putKey(context, "language", Response.body().getRequest().getLang());
            SharedHelper.putKey(context, "currency", Response.body().getRequest().getCur());
            SharedHelper.putKey(context, "profile", Response.body().getFileurl());
            SharedHelper.putKey(activity,"gender",strGendeType);
            Intent intent = new Intent(context, ProfileActivity.class);
            startActivity(intent);
            activity.finish();

        }
    }

    @Override
    public void OnFailure(Response<EditProfileModel> Response) {
        Log.e("TAG", "update profile response " + new Gson().toJson(Response.errorBody()));
        Utiles.displayMessage(getView(), context, "SomeThing Went Wrong");

    }

    private String getRealPathFromURI(Uri contentUri) {
        String[] proj = {MediaStore.Images.Media.DATA};
        CursorLoader loader = new CursorLoader(context, contentUri, proj, null, null, null);
        Cursor cursor = loader.loadInBackground();
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        String result = cursor.getString(column_index);
        cursor.close();
        return result;
    }

    public static String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    public void ChooseUserProfile() {
        final Dialog dialog = new Dialog(activity);
          dialog.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
        dialog.setContentView(R.layout.cameraorgalary);
        final View decorView = dialog.getWindow().getDecorView();
        Utiles.StartAnimation(decorView);
        Button camera_btn = dialog.findViewById(R.id.camera_btn);
        Button gallary_btn = dialog.findViewById(R.id.gallary_btn);
        gallary_btn.setVisibility(View.VISIBLE);

        View.OnClickListener clickListener = view -> {
            switch (view.getId()) {
                case R.id.camera_btn:
                    Utiles.DismissiAnimation(decorView, dialog);
                    takePhotoFromCamera();
                    break;
                case R.id.gallary_btn:
                    Utiles.DismissiAnimation(decorView, dialog);
                    if (permissionManager.userHasPermission(getActivity())) {
                        Intent i = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        activity.startActivityForResult(i, 5);
                    } else {
                        permissionManager.requestPermission(getActivity());
                    }
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
        if (activity == null || !isAdded()) return;
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(activity.getPackageManager()) != null) {
            Uri photoURI = null;
            try {
                photoFile = Utiles.createImageFileWith(activity);
                path = photoFile.getAbsolutePath();
                uri = Uri.parse(path);
                photoURI = FileProvider.getUriForFile(activity, getString(R.string.file_provider_authority), photoFile);
                Log.e("responserrrr", "" + path + "////" + photoURI);
            } catch (IOException ex) {
                Log.e("TakePicture", ex.getMessage());
            }
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            activity.startActivityForResult(takePictureIntent, 4);
        }
    }


    @OnClick({R.id.back_img, R.id.password_edt})
    public void onViewClickeds(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.password_edt:
                CustomDialogClass dialogClass = new CustomDialogClass(activity);
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
