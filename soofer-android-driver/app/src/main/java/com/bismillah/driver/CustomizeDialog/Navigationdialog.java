package com.bismillah.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import android.view.View;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.Model.TripFlowModel;
import com.bismillah.driver.R;

import butterknife.BindView;
import retrofit2.Response;


public class Navigationdialog extends Dialog implements View.OnClickListener {

    public Activity c;
    @BindView(R.id.googlenavi_layout)
    LinearLayout googlenaviLayout;
    @BindView(R.id.wazenavi_layout)
    LinearLayout wazenaviLayout;
    @BindView(R.id.common_layout)
    LinearLayout commonLayout;
    Location mcurrentLocation;
    Response<TripFlowModel> response;
    Double routeLat, routeLng;
    @BindView(R.id.googl_map_img)
    ImageButton googlMapImg;
    @BindView(R.id.waze_map_img)
    ImageButton wazeMapImg;

    public Navigationdialog(@NonNull Activity a, Location mcurrentLocation, Response<TripFlowModel> response) {
        super(a);
        this.c = a;
        this.mcurrentLocation = mcurrentLocation;
        this.response = response;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        setContentView(R.layout.navigation_dialog);
        googlenaviLayout = findViewById(R.id.googlenavi_layout);
        wazenaviLayout = findViewById(R.id.wazenavi_layout);
        googlMapImg = findViewById(R.id.googl_map_img);
        wazeMapImg = findViewById(R.id.waze_map_img);
        googlenaviLayout.setOnClickListener(this);
        wazenaviLayout.setOnClickListener(this);
        wazeMapImg.setOnClickListener(this);
        googlMapImg.setOnClickListener(this);

        if (Constants.Previousstatus.equalsIgnoreCase("3")) {
            if (response != null) {
                routeLat = Double.valueOf(response.body().getPickupdetails().getEndcoords().get(1));
                routeLng = Double.valueOf(response.body().getPickupdetails().getEndcoords().get(0));

            }
        } else {
            if (response != null) {
                routeLat = Double.valueOf(response.body().getPickupdetails().getStartcoords().get(1));
                routeLng = Double.valueOf(response.body().getPickupdetails().getStartcoords().get(0));

            }
        }

    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.wazenavi_layout:
                WazeNavigation();
                break;
            case R.id.waze_map_img:
                WazeNavigation();
                break;
            case R.id.googl_map_img:
                GoogleNavigation();
                break;
            case R.id.googlenavi_layout:
                GoogleNavigation();
                break;
        }

    }

    public void GoogleNavigation() {
        if (!routeLat.isNaN() && !routeLng.isNaN()) {

            Uri gmmIntentUri = Uri.parse("google.navigation:q=" + routeLat + "," + routeLng);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            c.startActivity(mapIntent);
            dismiss();
        }
    }

    public void WazeNavigation() {
        try {

            String uri = "waze://?ll=" + routeLat + ", " + routeLng + "=yes";
            Intent waze = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
            waze.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
            waze.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(waze);
            dismiss();
        } catch (ActivityNotFoundException e) {
            AlertDialog.Builder builder =
                    new AlertDialog.Builder(c, R.style.AppCompatAlertDialogStyle);
            builder.setTitle(R.string.app_not);
            builder.setMessage(R.string.for_navigate);
            // builder.setCancelable(false);
            builder.setPositiveButton(R.string.go_to_playstore,
                    new OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                            Intent intent =
                                    new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.waze"));
                            c.startActivity(intent);
                        }
                    });
            builder.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
