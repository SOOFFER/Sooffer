package com.soofer.app.Fragment;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.app.Adapter.ContactAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.AddContactModel;
import com.soofer.app.Model.ContactModel;
import com.soofer.app.Model.ContactlistModel;
import com.soofer.app.Model.DeleteContactModel;
import com.soofer.app.Presenter.ContactPresenter;

import com.soofer.app.R;
import com.soofer.app.View.ContactView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class ContactFragment extends BaseFragment implements ContactView, ContactAdapter.RemoveContact {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.call_layout)
    LinearLayout callLayout;
    @BindView(R.id.contact_recyleview)
    RecyclerView contactRecyleview;
    @BindView(R.id.add_contact_btn)
    Button addContactBtn;
    Unbinder unbinder;
    Activity activity;
    Context context;
    List<ContactlistModel> contactModels = new ArrayList<>();
    ContactAdapter contactAdapter;
    ContactModel contactModel = new ContactModel();
    @BindView(R.id.five_txt)
    TextView fiveTxt;


    public ContactFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    private ContactPresenter contactPresenter;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_contact, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();

        contactPresenter = new ContactPresenter(this);
        contactPresenter.getContactList(activity, context);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        if (Build.VERSION.SDK_INT >= 23) {
            String[] PERMISSIONS = {Manifest.permission.READ_CONTACTS};
            if (!hasPermissions(context, PERMISSIONS)) {
                ActivityCompat.requestPermissions((Activity) context, PERMISSIONS, 1);
            } else {
                //SimCardStatusChecked();
            }
        } else {
            // SimCardStatusChecked();
        }
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 1: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    //Do here
                } else {
                    Utiles.CommonToast(activity, "Required Permission");
                }
            }
        }
    }

    private static boolean hasPermissions(Context context, String... permissions) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }

    @OnClick({R.id.back_img, R.id.add_contact_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                assert getFragmentManager() != null;
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.add_contact_btn:
                Uri uri = Uri.parse("content://contacts");
                Intent intent = new Intent(Intent.ACTION_PICK, uri);
                intent.setType(ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE);
                startActivityForResult(intent, 1);

                break;
        }
    }

    @Override
    public void onActivityResult(int reqCode, int resultCode, Intent data) {
        super.onActivityResult(reqCode, resultCode, data);
        Cursor phones = null;

        switch (reqCode) {
            case (1):
                if (resultCode == Activity.RESULT_OK) {

                    Uri uri = data.getData();
                    String[] projection = {ContactsContract.CommonDataKinds.Phone.NUMBER, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME};

                    assert uri != null;
                    @SuppressLint("Recycle") Cursor cursor = activity.getContentResolver().query(uri, projection,
                            null, null, null);
                    cursor.moveToFirst();

                    int numberColumnIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);
                    String number = cursor.getString(numberColumnIndex);

                    int nameColumnIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME);
                    String name = cursor.getString(nameColumnIndex);
                    HashMap<String, String> map = new HashMap<>();
                    map.put("number", number);
                    map.put("name", name);
                    if(IsAlreadyAdded(contactModels,number)){
                        contactPresenter.AddContactModel(map, activity);
                    }else {
                        Utiles.displayMessage(getView(), context, "Sorry this Mobile Number Already Added");
                    }

                    Log.d("tag", "ZZZ number : " + number + " , name : " + name);
                }
                break;
        }
    }

    @SuppressLint("WrongConstant")
    public void setAdapter() {
        if (contactModels != null && !contactModels.isEmpty()) {
            contactRecyleview.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
            contactRecyleview.setItemAnimator(new DefaultItemAnimator());
            contactRecyleview.setHasFixedSize(true);
            contactAdapter = new ContactAdapter(activity, contactModels, this);
            contactRecyleview.setAdapter(contactAdapter);
            callLayout.setVisibility(View.GONE);
            contactRecyleview.setVisibility(View.VISIBLE);
            removetheContactView();
            SharedHelper.putStatus(context, "isEmergency", true);
        } else {
            contactRecyleview.setVisibility(View.GONE);
            callLayout.setVisibility(View.VISIBLE);
            SharedHelper.putStatus(context, "isEmergency", false);
        }
    }

    public void removetheContactView() {
        if (contactModels.size() == 2) {
            addContactBtn.setVisibility(View.GONE);
            fiveTxt.setVisibility(View.GONE);
        } else {
            addContactBtn.setVisibility(View.VISIBLE);
            fiveTxt.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void OnSuccessfully(Response<List<ContactlistModel>> Response) {
        if (contactModels != null && !contactModels.isEmpty()) {
            contactModels.clear();
        }
        assert Response.body() != null;
        contactModels.addAll(Response.body());
        setAdapter();
    }

    @Override
    public void OnFailure(Response<List<ContactlistModel>> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");

    }

    @Override
    public void DeleteSuccessfully(Response<DeleteContactModel> response, int postion) {
        assert response.body() != null;
        Utiles.displayMessage(getView(), context, response.body().getMessage());
        contactModels.remove(postion);
        setAdapter();
    }

    @Override
    public void DeleteFailure(Response<DeleteContactModel> response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }

    @Override
    public void AddSuccessfully(Response<AddContactModel> response) {
        assert response.body() != null;
        Utiles.displayMessage(getView(), context, response.body().getMessage());
        contactPresenter.getContactList(activity, context);
    }

    @Override
    public void AddFailure(Response<AddContactModel> response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }

    @Override
    public void RemoveContact(String contactid, int position) {
        HashMap<String, String> map = new HashMap<>();
        map.put("emgContactId", contactid);
        contactPresenter.DeleteContact(map, activity, position);

    }
    boolean status = true;
    public Boolean IsAlreadyAdded(List<ContactlistModel> contactModels,String number){

        for (ContactlistModel contacts:contactModels) {
            if(contacts.getNumber().equalsIgnoreCase(number)){
                status = false;
                break;
            }else {
                status = true;
            }

        }
        return status;

    }
}
