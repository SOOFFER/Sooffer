package com.soofer.app.Activity;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.appcompat.widget.PopupMenu;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.maps.model.LatLng;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Fragment.EditProfileFragment;
import com.soofer.app.Presenter.UpdateAddressPresenter;
import com.soofer.app.R;

import java.util.HashMap;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;


public class ProfileActivity extends BaseActivity {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.home_layout)
    RelativeLayout homeLayout;
    @BindView(R.id.menu_img)
    ImageButton menuImg;
    PopupMenu popupMenu;
    static Fragment fragment = null;

    @BindView(R.id.genderTxt)
    TextView genderTxt;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.rider_profile_image)
    ImageView riderProfileImage;
    @BindView(R.id.fname_txt)
    TextView fnameTxt;
    @BindView(R.id.lname)
    TextView lname;
    @BindView(R.id.email_txt)
    TextView emailTxt;
    @BindView(R.id.mobile_txt)
    TextView mobileTxt;
    @BindView(R.id.lng_txt)
    TextView lngTxt;
    @BindView(R.id.currency_txt)
    TextView currencyTxt;
    @BindView(R.id.work_img)
    ImageView workImg;
    @BindView(R.id.work_address_txt)
    TextView workAddressTxt;


    Context context = ProfileActivity.this;
    @BindView(R.id.home_img)
    ImageView homeImg;
    @BindView(R.id.home_address_txt)
    TextView homeAddressTxt;
    @BindView(R.id.home_address_put_txt)
    TextView homeAddressPutTxt;
    @BindView(R.id.edit_home)
    ImageView editHome;
    @BindView(R.id.worki_address_put_txt)
    TextView workiAddressPutTxt;
    @BindView(R.id.work_edit_img)
    ImageView workEditImg;
    @BindView(R.id.work_layout)
    RelativeLayout workLayout;
    Activity activity = ProfileActivity.this;
    @BindView(R.id.animate_layout)
    CardView animateLayout;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_profile);
        ButterKnife.bind(this);
        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));
        popupMenu = new PopupMenu(this, menuImg);
        popupMenu.inflate(R.menu.profile_popup_menu);

       /* popupMenu.setOnMenuItemClickListener(item -> {
            switch (item.getItemId()) {
                case R.id.profile_menu:
                    if (fragment == null) {
                        fragment = new EditProfileFragment();
                        MoveFragment(fragment);
                        updateMenuTitles();

                    } else {
                        if (fragment.isAdded()) {
                            RemoveFragment(fragment);
                            updateMenuTitles();

                        } else {
                            MoveFragment(fragment);
                            updateMenuTitles();
                        }

                    }
                    break;
                case R.id.change_password_menu:
                    CustomDialogClass dialogClass = new CustomDialogClass(ProfileActivity.this);
                    dialogClass.setCancelable(false);
                    dialogClass.getWindow().getAttributes().windowAnimations = R.style.fate_in_and_fate_out;
                    dialogClass.show();
                    break;
            }
            return true;
        });
*/
        Utiles.CircleImageView(Utiles.NullPointer(SharedHelper.getKey(context, "profile")), riderProfileImage, context);
        setText(fnameTxt, SharedHelper.getKey(context, "fname"));
        setText(lname, SharedHelper.getKey(context, "lname"));
        setText(emailTxt, SharedHelper.getKey(context, "emailid"));
        genderTxt.setText(SharedHelper.getKey(context, "gender"));
        setText(mobileTxt, Utiles.NullPointer(SharedHelper.getKey(context, "cc")) + Utiles.NullPointer(SharedHelper.getKey(context, "mobile")));
        setText(lngTxt, SharedHelper.getKey(context, "language"));
        setText(currencyTxt, SharedHelper.getKey(context, "currency"));
        setText(homeAddressPutTxt, SharedHelper.getKey(context, "homeaddress"));
        setText(workiAddressPutTxt, SharedHelper.getKey(context, "workaddress"));

        Animation slideUp = AnimationUtils.loadAnimation(this, R.anim.slide_up);

        if (animateLayout.getVisibility() == View.GONE) {
            animateLayout.setVisibility(View.VISIBLE);
            animateLayout.startAnimation(slideUp);
        }

    }


    @OnClick(R.id.back_img)
    public void onViewClicked() {
      /*  if (fragment != null && fragment.isAdded()) {
            RemoveFragment(fragment);
            updateMenuTitles();
        } else {


        }*/
        onBackPressed();
    }


    @OnClick(R.id.menu_img)
    public void onViewclick() {
        // popupMenu.show();
        fragment = new EditProfileFragment();
        MoveFragment(fragment);
    }

    @Override
    public void onBackPressed() {
      /*  if (fragment != null && fragment.isAdded()) {
            RemoveFragment(fragment);
            updateMenuTitles();
        } else {*/
        super.onBackPressed();

        /* }*/
    }

    public void MoveFragment(Fragment fragment) {
        getSupportFragmentManager().beginTransaction().setCustomAnimations(R.anim.fade_in, R.anim.fade_out,
                R.anim.fade_in, R.anim.fade_out)
                .replace(R.id.containter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();;

    }

    public void RemoveFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager().beginTransaction().remove(fragment).commitAllowingStateLoss();;
        }
    }

    private void updateMenuTitles() {
       /* MenuItem bedMenuItem = popupMenu.getMenu().findItem(R.id.profile_menu);
        if (fragment.isAdded()) {
            bedMenuItem.setTitle("Edit Profile");
            titleTxt.setText("Profile");
        } else {
            bedMenuItem.setTitle("View Profile");
            titleTxt.setText("Edit Profile");


        }*/

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        for (Fragment fragment : getSupportFragmentManager().getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
        switch (requestCode) {
            case 1:

                if (resultCode == Activity.RESULT_OK && data != null) {
                    SharedHelper.putKey(context, "homeaddress", data.getExtras().getString("address"));

                    Bundle bundle = data.getBundleExtra("bundle");
                    LatLng coordinates = bundle.getParcelable("maps_location");
                    SharedHelper.putKey(context, "homelat", String.valueOf(coordinates.latitude));
                    SharedHelper.putKey(context, "homelng", String.valueOf(coordinates.longitude));
                    UpdateLocationPresneter("home", data.getExtras().getString("address"), String.valueOf(coordinates.latitude), String.valueOf(coordinates.longitude));
                    setText(homeAddressPutTxt, data.getExtras().getString("address"));

                }
                break;
            case 2:
                if (resultCode == Activity.RESULT_OK && data != null) {
                    Bundle bundle = data.getBundleExtra("bundle");
                    LatLng coordinates = bundle.getParcelable("maps_location");
                    SharedHelper.putKey(context, "workaddress", data.getExtras().getString("address"));
                    SharedHelper.putKey(context, "worklat", String.valueOf(coordinates.latitude));
                    SharedHelper.putKey(context, "worklng", String.valueOf(coordinates.longitude));
                    UpdateLocationPresneter("work", data.getExtras().getString("address"), String.valueOf(coordinates.latitude), String.valueOf(coordinates.longitude));
                    setText(workiAddressPutTxt, data.getExtras().getString("address"));

                }
                break;
        }

    }

    public void UpdateLocationPresneter(String status, String Address, String lat, String lng) {
        HashMap<String, String> map = new HashMap<>();
        map.put("for", status);
        map.put("address", Address);
        map.put("lat", lat);
        map.put("lng", lng);
        UpdateAddressPresenter updateAddressPresenter = new UpdateAddressPresenter();
        updateAddressPresenter.getUpdateAddress(activity, map);
    }

    @OnClick(R.id.home_layout)
    public void onHomeLayoutClicked() {
        CommonData.HeaderTitle = "Add Home";
        startActivityForResult(new Intent(getApplicationContext(), SetPinLocationActivity.class), 1);

    }

    @OnClick(R.id.work_layout)
    public void onWorkLayoutClicked() {
        CommonData.HeaderTitle = "Add Work";
        startActivityForResult(new Intent(getApplicationContext(), SetPinLocationActivity.class), 2);
    }

    public void setText(View view, String value) {
        if (view instanceof TextView) {
            ((TextView) view).setText(Utiles.NullPointer(value));
        } else if (view instanceof EditText) {
            ((EditText) view).setText(Utiles.NullPointer(value));
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
    }
}
