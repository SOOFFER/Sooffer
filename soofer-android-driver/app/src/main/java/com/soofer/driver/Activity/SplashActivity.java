package com.soofer.driver.Activity;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.airbnb.lottie.LottieAnimationView;
import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.model.ActivityResult;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.firebase.FirebaseApp;
import com.google.firebase.crashlytics.FirebaseCrashlytics;
import com.google.firebase.messaging.FirebaseMessaging;
import com.soofer.driver.BuildConfig;
import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.Receiver.NetworkChangeReceiver;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.CustomizeDialog.UserAlertDialog;
import com.soofer.driver.Fragment.AddVehicleFragment;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Presenter.DriverProfilePresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.ProfileView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;


import butterknife.BindView;
import butterknife.ButterKnife;
import retrofit2.Response;

@SuppressLint("ALL")
@SuppressWarnings("ALL")
public class SplashActivity extends BaseActivity implements ProfileView{
    // Splash screen timer
    private static int SPLASH_TIME_OUT = 3000;
    private static final int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 5;
    Context context = SplashActivity.this;
    Activity activity = SplashActivity.this;

    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    private NetworkChangeReceiver networkChangeReceiver;
    private UserAlertDialog userAlertDialog;

    private static final int UPDATE_REQUEST_CODE = 100;
    private AppUpdateManager appUpdateManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        ButterKnife.bind(this);
        checkForAppUpdate();


        Constants.Previousstatus = "0";
        CommonFirebaseListoner.Previous = "0";
        CommonData.RequestBoolean = false;
        CommonData.PreviousCarType = "";
        CommonData.isFistTime = true;

        String versionString = Build.VERSION.RELEASE;
        if(versionString.contains(".")) {
            String[] parts = versionString.split("\\.");
            String numericalPart = parts[0] + "." + parts[1];
            double version = Double.parseDouble(numericalPart);
        }
        SharedHelper.putKey(this,"isInstalled","false");
        networkChangeReceiver = new NetworkChangeReceiver();
        networkChangeReceiver.setInterface(isconnect -> {
            if(isconnect){
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    checkMultiplePermissions();
                } else {
                    GO();
                }
            }
        });

        CommonFirebaseListoner.setActivity(activity);
        firebasetoken();

        setLocale(SharedHelper.getToken(activity, "lang"));



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


    public void GO() {
        new Handler().postDelayed(() -> {
            String login_status = SharedHelper.getKey(getApplicationContext(), "login_status");
            if (login_status != null && !login_status.isEmpty()) {
                CommonFirebaseListoner.FirebaseTripFlow();
                ProfilePresenter();
            } else {
                Intent i = new Intent(this, WelcomeActivity.class);
                startActivity(i);
                finish();
            }
        }, SPLASH_TIME_OUT);
    }

    public void ProfilePresenter() {
        showLoader();
        DriverProfilePresenter driverProfilePresenter = new DriverProfilePresenter(this);
        driverProfilePresenter.getProfile(activity, false);
    }

    @SuppressLint("CheckResult")
    private void checkMultiplePermissions() {
        System.out.println("enter the sdk"+Build.VERSION.SDK_INT);
        if (Build.VERSION.SDK_INT >= 23) {
            List<String> permissionsNeeded = new ArrayList<String>();
            List<String> permissionsList = new ArrayList<String>();


            if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION)) {
                permissionsNeeded.add("Access the Current Location");
            }
            if (!addPermission(permissionsList, Manifest.permission.ACCESS_COARSE_LOCATION)) {
                permissionsNeeded.add("Access Fine Location");
            }
            if (!addPermission(permissionsList, Manifest.permission.READ_EXTERNAL_STORAGE)) {
            }
                if (!addPermission(permissionsList, Manifest.permission.POST_NOTIFICATIONS)) {
                }

            if (permissionsList.size() > 1) {
                try {
                    if (userAlertDialog != null) {
                        userAlertDialog.dismiss();
                    }
                    SharedHelper.putKey(this,"isInstalled","true");

                    userAlertDialog = new UserAlertDialog(activity,
                            object -> requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                                    REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS));
                    userAlertDialog.setCancelable(false);
                    userAlertDialog.show();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                GO();
            }
        }
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
        else {
            for (Fragment fragment : getSupportFragmentManager().getFragments()) {
                fragment.onActivityResult(requestCode, resultCode, data);
            }
        }

    }


    @SuppressLint("SuspiciousIndentation")
    private boolean addPermission(List<String> permissionsList, String permission) {
        if (Build.VERSION.SDK_INT >= 23)

            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsList.add(permission);
                 if (!shouldShowRequestPermissionRationale(permission))
                        return false;
            }
        return true;
    }

    public void showLoader() {
        animationView.setVisibility(View.VISIBLE);
    }

    public void dismissiLoader() {
        animationView.setVisibility(View.VISIBLE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS: {

                Map<String, Integer> perms = new HashMap<String, Integer>();

                perms.put(Manifest.permission.ACCESS_FINE_LOCATION, PackageManager.PERMISSION_GRANTED);
                perms.put(Manifest.permission.ACCESS_COARSE_LOCATION, PackageManager.PERMISSION_GRANTED);
                for (int i = 0; i < permissions.length; i++)
                    perms.put(permissions[i], grantResults[i]);
                if (perms.get(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    if (Build.VERSION.SDK_INT >= 30) {
                        isbakcgroundPermission();
                    }else {
                        GO();
                    }
                    return;
                } else {
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
    public void OnSuccessfully(Response<List<DriverProfileModel>> Response) {
        dismissiLoader();
        if (Response.body() != null && !Response.body().isEmpty()) {
            List<DriverProfileModel> driverProfileModels = Response.body();
            SharedHelper.putKey(getApplicationContext(), "fname", driverProfileModels.get(0).getFname());
            SharedHelper.putKey(this, "drivercode", driverProfileModels.get(0).getCode());
            SharedHelper.putKey(this, "attendance", driverProfileModels.get(0).getAttendance().toString());
            SharedHelper.putKey(getApplicationContext(), "code", driverProfileModels.get(0).getCode());
            SharedHelper.putKey(this, "gender", Response.body().get(0).getGender());
            SharedHelper.putKey(getApplicationContext(), "lname", driverProfileModels.get(0).getLname());
            SharedHelper.putKey(getApplicationContext(), "email", driverProfileModels.get(0).getEmail());
            SharedHelper.putKey(getApplicationContext(), "phcode", driverProfileModels.get(0).getPhcode());
            SharedHelper.putKey(getApplicationContext(), "phone", driverProfileModels.get(0).getPhone());
            SharedHelper.putKey(getApplicationContext(), "lang", driverProfileModels.get(0).getLang());
            SharedHelper.putKey(getApplicationContext(), "cur", driverProfileModels.get(0).getCur());
            SharedHelper.putKey(getApplicationContext(), "filepath", driverProfileModels.get(0).getBaseurl());
            SharedHelper.putOnline(activity, "isconnect", driverProfileModels.get(0).getIsConnected());
            SharedHelper.putKey(this, "card_number", Response.body().get(0).getCard().getLast4());
            CommonData.twodriver = driverProfileModels.get(0).getTwoDriver();
            System.out.println("IsChecked Test" +CommonData.twodriver);

            for(String string1:Response.body().get(4).getDriverCancellationReasons()) {
                SharedHelper.putKey(this,"Cancelreson",string1);
            }

            if (Utiles.IsNull(driverProfileModels.get(0).getLicence())) {
                SharedHelper.putKey(getApplicationContext(), "licence", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicence());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getInsurance())) {
                SharedHelper.putKey(getApplicationContext(), "insurance", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsurance());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getPassing())) {
                SharedHelper.putKey(getApplicationContext(), "passing", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassing());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getInsuranceBackImg())) {
                SharedHelper.putKey(getApplicationContext(), "insuranceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getInsuranceBackImg());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getPassingBackImg())) {
                SharedHelper.putKey(getApplicationContext(), "passingBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getPassingBackImg());

            }
            if (Utiles.IsNull(driverProfileModels.get(0).getLicenceBackImg())) {
                SharedHelper.putKey(getApplicationContext(), "licenceBackImg", driverProfileModels.get(0).getBaseurl() + driverProfileModels.get(0).getLicenceBackImg());

            }
            SharedHelper.putKey(getApplicationContext(), "licence_date", driverProfileModels.get(0).getLicenceexp());
            //    SharedHelper.putKey(getApplicationContext(), "insurance_date", driverProfileModels.get(0).getInsuranceexp());
            // SharedHelper.putKey(getApplicationContext(), "passing_date", driverProfileModels.get(0).getPassingexp());

            SharedHelper.putKey(this, "profile", driverProfileModels.get(1).getProfileurl());
            try {
                Constants.WalletAlertEnable = driverProfileModels.get(3).getIsDriverCreditModuleEnabledForUseAfterLogin();
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (driverProfileModels.get(2).getCurrentActiveTaxi() != null) {
                SharedHelper.putKey(this, "vehicleId", driverProfileModels.get(2).getCurrentActiveTaxi().getId());
                SharedHelper.putKey(getApplicationContext(), "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
                SharedHelper.putKey(this, "vmake", driverProfileModels.get(2).getCurrentActiveTaxi().getMakename());
                SharedHelper.putKey(this, "vmodel", driverProfileModels.get(2).getCurrentActiveTaxi().getModel());
                SharedHelper.putKey(this, "numplate", driverProfileModels.get(2).getCurrentActiveTaxi().getLicence());
                SharedHelper.putKey(this, "vehicle_type", driverProfileModels.get(2).getCurrentActiveTaxi().getVehicletype());
                Intent i = new Intent(this, MainActivity.class);
                i.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                startActivity(i);
                finish();
            } else {
                Alertdialog();
            }
            SharedHelper.putKey(this, "support_num", Response.body().get(5).getConfigData().getSupportNo());
            SharedHelper.putKey(this,"driver_earned",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getEarned());
            SharedHelper.putKey(this,"wallet_credition",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getBankDeposit());
            SharedHelper.putKey(this,"driver_tax",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTax());
            SharedHelper.putKey(this,"GatewayCharge",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getGateway());
            SharedHelper.putKey(this,"driver_cash",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getCashCollected());
            SharedHelper.putKey(this,"driver_tips",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTips());
            SharedHelper.putKey(this,"driver_ridefare",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getRideFare());
            SharedHelper.putKey(this,"date",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getDate());
            SharedHelper.putKey(this,"perdayrides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getPerdayride());
            SharedHelper.putKey(this,"perdaykm",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getPerdaykm());
            SharedHelper.putKey(this,"km",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotalDistance());
            SharedHelper.putKey(this,"rides",driverProfileModels.get(6).getDriverPerDayStatus().get(0).getTotTrips());
        } else {
            Utiles.displayMessage(getCurrentFocus(), this, this.getResources().getString(R.string.something_went_wrong));
            Intent i = new Intent(this, WelcomeActivity.class);
            startActivity(i);
            finish();
        }
    }

    @Override
    public void OnFailure(Response<List<DriverProfileModel>> Response) {
        Utiles.displayMessage(getCurrentFocus(), this, this.getResources().getString(R.string.something_went_wrong));
    }

    public void Alertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(this);
        builder1.setMessage("Please add Your Vehicle");
        builder1.setCancelable(false);
        builder1.setPositiveButton(
                "OK",
                (dialog, id) -> {
                    SharedHelper.putKey(this, "appflow", "registration");
                    Fragment fragment = new AddVehicleFragment();
                    moveToFragment(fragment);
                    dialog.cancel();

                });
        AlertDialog alert11 = builder1.create();
        alert11.show();
    }

    private void moveToFragment(Fragment fragment) {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();

    }

    @Override
    protected void onPause() {
        super.onPause();
        try {
            unregisterReceiver(networkChangeReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(networkChangeReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
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
        try {
            Utiles.clearInstance();
            if (userAlertDialog != null && userAlertDialog.isShowing()) {
                userAlertDialog.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void firebasetoken() {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {

                    }else {
                        String token = Objects.requireNonNull(task.getResult());
                        System.out.println("enter the firebase token" + token);
                        SharedHelper.putToken(getApplicationContext(), "device_token", token);
                    }
                    // Get new Instance ID token
                });
    }


    public void setLocale(String lang) {
        SharedHelper.putToken(this, "lang", lang);
        Locale myLocale = new Locale(lang);
        Resources res = getResources();
        DisplayMetrics dm = res.getDisplayMetrics();
        Configuration conf = res.getConfiguration();
        conf.locale = myLocale;
        res.updateConfiguration(conf, dm);
        onConfigurationChanged(conf);
    }
    @RequiresApi(api = Build.VERSION_CODES.M)
    private void isbakcgroundPermission() {
        List<String> permissionsNeeded = new ArrayList<String>();
        List<String> permissionsList = new ArrayList<String>();
        if (!addPermission(permissionsList, Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
            permissionsNeeded.add("Access background Location");
        }
        if (permissionsList.size() > 0) {
            try {
                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                        REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            GO();
        }
    }

}
