package com.soofer.app.CommonClass;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Point;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.soofer.app.R;

import java.util.ArrayList;
import java.util.List;


public class PolyUtils {

    private List<LatLng> polyz = new ArrayList<>();
    private GoogleMap googleMap;
    private Context context;
    private Marker sourceMarker, destinationMarker;
    private MyAddress sourceAddress, destinationAddress;

    public PolyUtils(Context context, GoogleMap googleMap, List<LatLng> encodedPolyPoints) {
        this.context = context;
        this.googleMap = googleMap;
        polyz = encodedPolyPoints;
    }

    public  void setSourceAddress(MyAddress sourceAddress) {
        this.sourceAddress = sourceAddress;
    }

    public  void setDestinationAddress(MyAddress destinationAddress) {
        this.destinationAddress = destinationAddress;
    }
    public void clrearAll(){
        try {
            googleMap.clear();
            destinationMarker.remove();
            sourceMarker.remove();
            MapAnimator.getInstance().stopAnim();
            if(destinationMarker.isVisible()){
                destinationMarker.setVisible(false);
            }
            if(sourceMarker.isVisible()){
                destinationMarker.setVisible(false);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void start() {

        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        for (LatLng latLng : polyz) {
            builder.include(latLng);
        }
        final LatLngBounds bounds = builder.build();


        final LatLng origin = polyz.get(0);
        final LatLng destination = polyz.get(polyz.size() - 1);

        googleMap.setOnMapLoadedCallback(() -> {

            if (sourceAddress != null) {
                View marker_view = ((LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.custom_marker, null);
                TextView addressSrc = marker_view.findViewById(R.id.addressTxt);
                TextView etaTxt = marker_view.findViewById(R.id.etaTxt);

                addressSrc.setText(sourceAddress.getAddress());
              /*  if(sourceAddress.getEta() != null){
                    etaTxt.setText(sourceAddress.getEta());
                    etaTxt.setVisibility(View.VISIBLE);
                }else {
                    etaTxt.setVisibility(View.GONE);
                }
*/
                if(sourceMarker!=null){
                    sourceMarker.remove();
                }

                MarkerOptions marker_opt_source = new MarkerOptions().position(origin);
                marker_opt_source.icon(BitmapDescriptorFactory.fromBitmap(createDrawableFromView(context, marker_view))).anchor(0.00f, 0.20f);
                sourceMarker = googleMap.addMarker(marker_opt_source);
                sourceMarker.setTag("pickup");
            }

            if (destinationAddress != null) {
                View marker_view2 = ((LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(R.layout.custom_marker, null);
                TextView addressDes = (TextView) marker_view2.findViewById(R.id.addressTxt);
                TextView etaTxt = (TextView) marker_view2.findViewById(R.id.etaTxt);
                addressDes.setText(destinationAddress.getAddress());
/*

                if(destinationAddress.getEta() != null){
                    etaTxt.setText(destinationAddress.getEta());
                    etaTxt.setVisibility(View.VISIBLE);
                }else {
                    etaTxt.setVisibility(View.GONE);
                }*/

                if(destinationMarker!=null){
                    destinationMarker.remove();
                }
                MarkerOptions marker_opt_des = new MarkerOptions().position(destination);
                marker_opt_des.icon(BitmapDescriptorFactory.fromBitmap(createDrawableFromView(context, marker_view2))).anchor(0.00f, 0.20f);
                destinationMarker = googleMap.addMarker(marker_opt_des);
                destinationMarker.setTag("drop");
            }


            googleMap.addMarker(new MarkerOptions().icon(BitmapDescriptorFactory.fromResource(R.drawable.dot)).position(origin));
            googleMap.addMarker(new MarkerOptions().icon(BitmapDescriptorFactory.fromResource(R.drawable.squre)).position(destination));
            //googleMap.addPolyline(polylineOptions);
            MapAnimator.getInstance().animateRoute(context,googleMap, polyz);

            try {
                googleMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 150),1000, null);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        googleMap.setOnCameraIdleListener(() -> {
            if (sourceMarker != null) {
                Point PickupPoint = googleMap.getProjection().toScreenLocation(origin);
                sourceMarker.setAnchor(PickupPoint.x < dpToPx(context, 200) ? 0.00f : 1.00f, PickupPoint.y < dpToPx(context, 100) ? 0.20f : 1.20f);

            }
            if (destinationMarker != null) {
                Point PickupPoint = googleMap.getProjection().toScreenLocation(destination);
                destinationMarker.setAnchor(PickupPoint.x < dpToPx(context, 200) ? 0.00f : 1.00f, PickupPoint.y < dpToPx(context, 100) ? 0.20f : 1.20f);

            }
        });

    }



    private Bitmap createDrawableFromView(Context context, View view) {
        DisplayMetrics displayMetrics = new DisplayMetrics();
        ((Activity) context).getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        view.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT));
        view.measure(displayMetrics.widthPixels, displayMetrics.heightPixels);
        view.layout(0, 0, displayMetrics.widthPixels, displayMetrics.heightPixels);
        view.buildDrawingCache();
        Bitmap bitmap = Bitmap.createBitmap(view.getMeasuredWidth(), view.getMeasuredHeight(), Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);

        return bitmap;
    }

    private int dpToPx(Context context, float dpValue) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        return Math.round(dpValue * (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT));
    }


}