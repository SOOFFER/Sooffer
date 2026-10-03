package com.soofer.app.Activity;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;

import androidx.appcompat.app.AppCompatActivity;

import android.util.DisplayMetrics;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.airbnb.lottie.LottieAnimationView;
import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.model.ActivityResult;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.gson.Gson;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.ProfileModel;
import com.soofer.app.Presenter.ProfilePresenter;
import com.soofer.app.R;
import com.soofer.app.View.ProfileView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.CommonFirebaseListoner;
import com.soofer.app.CommonClass.Constants;

import butterknife.BindView;
import butterknife.ButterKnife;
import retrofit2.Response;

import static com.soofer.app.CommonClass.Constants.FlowStatus;

@SuppressWarnings("ALL")
@SuppressLint("ALL")
public class SplashActivity extends BaseActivity implements ProfileView {

    // Splash screen timer
    private static int SPLASH_TIME_OUT = 3000;
    private static final int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 5;
    Context context = SplashActivity.this;
    Activity activity = SplashActivity.this;
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;

    private static final int UPDATE_REQUEST_CODE = 100;
    private AppUpdateManager appUpdateManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        ButterKnife.bind(this);
        checkForAppUpdate();


        String isFirst = SharedHelper.getToken(this, "isFirst");
        Constants.CheckRiderStatus  = "0";
        CommonFirebaseListoner.Previous = "0";
        FlowStatus  ="0";
        CommonData.strVehicleCode = "";
        firebasetoken();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            checkMultiplePermissions();
        } else {
            GO();
        }
        setLocale(SharedHelper.getToken(activity, "lang"));
    }

    public void setLocale(String lang) {

        Locale myLocale = new Locale(lang);
        Resources res = getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        onConfigurationChanged(conf);
    }

    private void checkForAppUpdate() {
        appUpdateManager = AppUpdateManagerFactory.create(this);
        // Returns an intent object that you use to check for an update.
        Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
        // Checks that the platform will allow the specified type of update.
        appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
            System.out.println("AVAILABLEIYUYYIU:::" + appUpdateInfo.updateAvailability());
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                    && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                try {
                    appUpdateManager.startUpdateFlowForResult(
                            appUpdateInfo,
                            AppUpdateType.IMMEDIATE,
                            this,
                            UPDATE_REQUEST_CODE
                    );
                } catch (IntentSender.SendIntentException e) {
                    e.printStackTrace();
                }
            }
        });

    }



    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == UPDATE_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                System.out.println("Update accepted and in progress.");
            } else if (resultCode == Activity.RESULT_CANCELED) {
                System.out.println("Update canceled by the user.");
                checkForAppUpdate();
            } else if (resultCode == ActivityResult.RESULT_IN_APP_UPDATE_FAILED) {
                System.out.println("Update failed.");
                checkForAppUpdate();
            }
        }
    }

    public void GO() {
        new Handler().postDelayed(() -> {
            String userid = SharedHelper.getKey(getApplicationContext(), "userid");
            if (userid != null && !userid.isEmpty()) {
                CommonFirebaseListoner.FirebaseTripFlow();
                ResenterCall();
            } else {
                WelcomeActivity();
            }
        }, SPLASH_TIME_OUT);

    }

    public void WelcomeActivity() {
        Intent i = new Intent(context, WelcomeActivity.class);
        startActivity(i);
        finish();
    }

    public void ResenterCall() {
        showLoader();
        ProfilePresenter profilePresenter = new ProfilePresenter(this);
        profilePresenter.getProfile(activity, false);
    }

    public void showLoader() {
        animationView.setVisibility(View.VISIBLE);
    }

    public void dismissiLoader() {
        animationView.setVisibility(View.VISIBLE);
    }

    private void checkMultiplePermissions() {
        if (Build.VERSION.SDK_INT >= 23) {
            List<String> permissionsNeeded = new ArrayList<String>();
            List<String> permissionsList = new ArrayList<String>();


            if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION)) {
                permissionsNeeded.add("Access the Current Location");
            }

            if (!addPermission(permissionsList, Manifest.permission.ACCESS_COARSE_LOCATION)) {
                permissionsNeeded.add("Access Fine Location");
            }
            if (!addPermission(permissionsList, Manifest.permission.RECORD_AUDIO)) {
                permissionsNeeded.add("Access the Audio");
            }
            if (!addPermission(permissionsList, Manifest.permission.READ_PHONE_STATE)) {
                permissionsNeeded.add("Access the Phone State");
            }
            if (!addPermission(permissionsList, Manifest.permission.POST_NOTIFICATIONS)) {
                permissionsNeeded.add("Access the Phone State");
            }
            if (permissionsList.size() > 0) {
                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                        REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            } else {
                GO();
            }
        }
    }

    private boolean addPermission(List<String> permissionsList, String permission) {
        if (Build.VERSION.SDK_INT >= 23)

            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsList.add(permission);

                // Check for Rationale Option
                if (!shouldShowRequestPermissionRationale(permission))
                    return false;
            }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS: {

                Map<String, Integer> perms = new HashMap<String, Integer>();
                // Initial
                //perms.put(android.Manifest.permission.CAMERA, PackageManager.PERMISSION_GRANTED);
                //  perms.put(android.Manifest.permission.READ_EXTERNAL_STORAGE, PackageManager.PERMISSION_GRANTED);
                perms.put(Manifest.permission.ACCESS_FINE_LOCATION, PackageManager.PERMISSION_GRANTED);
                perms.put(Manifest.permission.ACCESS_COARSE_LOCATION, PackageManager.PERMISSION_GRANTED);
                // perms.put(android.Manifest.permission.CALL_PHONE,PackageManager.PERMISSION_GRANTED);

                // Fill with results
                for (int i = 0; i < permissions.length; i++)
                    perms.put(permissions[i], grantResults[i]);
                if (perms.get(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    // All Permissions Granted

                    GO();

                    return;
                } else {
                    // Permission Denied
                    if (Build.VERSION.SDK_INT >= 23) {
                        Toast.makeText(getApplicationContext(), "Please permit all the permissions", Toast.LENGTH_LONG).show();
                        finish();
                    }
                }
            }
            break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    @Override
    public void OnSuccessfully(Response<List<ProfileModel>> Response) {
        dismissiLoader();
        try {
            if (Response.body().isEmpty()) {
                WelcomeActivity();
            } else {
                SharedHelper.putKey(context, "fname", Response.body().get(0).getFname());
                SharedHelper.putKey(context, "referal_code", Response.body().get(0).getReferal());
                SharedHelper.putKey(context, "lname", Response.body().get(0).getLname());
                SharedHelper.putKey(context, "gender", Response.body().get(0).getGender());
                SharedHelper.putKey(context, "emailid", Response.body().get(0).getEmail());
                SharedHelper.putKey(context, "cc", Response.body().get(0).getPhcode());
                SharedHelper.putKey(context, "mobile", Response.body().get(0).getPhone());
                SharedHelper.putKey(context, "language", Response.body().get(0).getLang());
                SharedHelper.putKey(context, "card_number", Response.body().get(0).getCard().getLast4());
                SharedHelper.putKey(context, "currency", Response.body().get(0).getCur());
                SharedHelper.putKey(context, "profile", Response.body().get(1).getProfileurl());
                SharedHelper.putKey(context, "support_num", Response.body().get(3).getConfigData().getSupportNo());
                SharedHelper.putKey(context,"favorite",new Gson().toJson(Response.body().get(0).getAddress()));
                SharedHelper.putKey(context,"outstationflow",Response.body().get(3).getConfigData().getNeededOutstationFlow());
                SharedHelper.putKey(context,"rentalflow",Response.body().get(3).getConfigData().getNeedRentalFlow());
                SharedHelper.putKey(context,"twoDriverFlow",Response.body().get(3).getConfigData().getNeedTwoDriverFlow());

                Intent i = new Intent(context, HomeActivity.class);
                startActivity(i);
                finish();
                if(Response.body().get(0).getEmgContact()!=null && !Response.body().get(0).getEmgContact().isEmpty()){
                    SharedHelper.putStatus(context, "isEmergency", true);
                }else {
                    SharedHelper.putStatus(context, "isEmergency", false);
                }



            }

        } catch (Exception e) {
            e.printStackTrace();
            WelcomeActivity();
        }


    }

    @Override
    public void OnFailure(Response<List<ProfileModel>> Response) {
        Utiles.displayMessage(getCurrentFocus(), context, "Something Went Wrong");
        Intent i = new Intent(context, WelcomeActivity.class);
        startActivity(i);
        finish();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Toast.makeText(activity, "Notification clicked", Toast.LENGTH_SHORT).show();
    }



    private void redirectStore(String updateUrl) {
        final Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(updateUrl));
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
    }
    public void firebasetoken(){
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        return;
                    }
                    // Get new Instance ID token
                    String token = Objects.requireNonNull(task.getResult());
                    SharedHelper.putToken(getApplicationContext(),"device_token",token);
                });

    }
}
