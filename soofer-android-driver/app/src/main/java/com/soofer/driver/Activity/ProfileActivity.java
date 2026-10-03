package com.soofer.driver.Activity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.appcompat.widget.PopupMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Fragment.EditProfileFragment;
import com.soofer.driver.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class ProfileActivity extends BaseActivity {

    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.menu_img)
    ImageView menuImg;

    static Fragment fragment;

    Context context = ProfileActivity.this;
    Activity activity = ProfileActivity.this;

    @BindView(R.id.header)
    RelativeLayout header;
    Menu menu;
    PopupMenu popup;
    @BindView(R.id.rider_profile_image)
    ImageView profileImage;
    @BindView(R.id.fname_txt)
    TextView fnameTxt;
    @BindView(R.id.lname_txt)
    TextView lnameTxt;
    @BindView(R.id.email_txt)
    TextView emailTxt;
    @BindView(R.id.mobile_txt)
    TextView mobileTxt;
    @BindView(R.id.genderTxt)
    TextView genderTxt;
    @BindView(R.id.language_txt)
    TextView languageTxt;
    @BindView(R.id.currency_txt)
    TextView currencyTxt;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.animate_layout)
    CardView animateLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);
        ButterKnife.bind(this);


        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));
        try {
            languageTxt.setText(SharedHelper.getKey(context, "lang"));
            currencyTxt.setText(SharedHelper.getKey(context, "cur"));
            fnameTxt.setText(SharedHelper.getKey(context, "fname"));
            lnameTxt.setText(SharedHelper.getKey(context, "lname"));
            emailTxt.setText(SharedHelper.getKey(context, "email"));
            genderTxt.setText(SharedHelper.getKey(context, "gender"));
            mobileTxt.setText(SharedHelper.getKey(context, "phcode") + SharedHelper.getKey(context, "phone"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        Utiles.CircleImageView(SharedHelper.getKey(context, "profile"), profileImage, activity);
        CommonData.AnotherActivity = true;

        Animation slideUp = AnimationUtils.loadAnimation(this, R.anim.slide_up);

        if (animateLayout.getVisibility() == View.GONE) {
            animateLayout.setVisibility(View.VISIBLE);
            animateLayout.startAnimation(slideUp);
        }

    }


    @OnClick({R.id.back_img, R.id.menu_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:

                onBackPressed();
                break;
            case R.id.menu_img:
                /*popup = new PopupMenu(context, view);
                MenuInflater inflate = popup.getMenuInflater();
                inflate.inflate(R.menu.menu_profile, popup.getMenu());
                popup.show();
                this.menu = popup.getMenu();
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.edit_profile:
                                if (fragment == null) {
                                    fragment = new EditProfileFragment();
                                    moveToFragment(fragment);
                                    updateMenuTitles();
                                } else {
                                    if (fragment.isAdded()) {
                                        getSupportFragmentManager().beginTransaction().remove(fragment).commit();
                                        updateMenuTitles();
                                    } else {
                                        fragment = new EditProfileFragment();
                                        moveToFragment(fragment);
                                        updateMenuTitles();
                                    }

                                }

                                break;
                            case R.id.chnge_password:
                                CustomDialogClass dialogClass = new CustomDialogClass(ProfileActivity.this);
                                dialogClass.setCancelable(false);
                                dialogClass.getWindow().getAttributes().windowAnimations = R.style.DialogTheme;
                                dialogClass.show();
                                break;
                        }
                        return false;
                    }
                });
*/
                fragment = new EditProfileFragment();
                moveToFragment(fragment);
                break;
        }

    }

    private void moveToFragment(Fragment fragment) {
        if (fragment != null)
            getSupportFragmentManager().beginTransaction().remove(fragment).commit();
        getSupportFragmentManager().beginTransaction().setCustomAnimations(R.anim.fade_in, R.anim.fade_out,
                R.anim.fade_in, R.anim.fade_out)
                .replace(R.id.frame_layout, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }

    public void RemoveFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager().beginTransaction().remove(fragment).commit();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
    }

    private void updateMenuTitles() {
        MenuItem bedMenuItem = popup.getMenu().findItem(R.id.edit_profile);
        if (fragment.isAdded()) {
            bedMenuItem.setTitle("Edit Profile");
            titleTxt.setText("Profile");
        } else {
            bedMenuItem.setTitle("View Profile");
            titleTxt.setText("Edit Profile");
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        for (Fragment fragment : getSupportFragmentManager().getFragments()) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }

    }

}
