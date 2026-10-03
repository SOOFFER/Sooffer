package com.soofer.app.Fragment;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import com.soofer.app.Activity.GooglePlaceSearch;
import com.soofer.app.Adapter.MultipleAddressAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.MutlipleDestination;
import com.soofer.app.Model.LocalModel.MultipleAddressModel;
import com.soofer.app.R;

import org.greenrobot.eventbus.EventBus;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.Observable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import static com.soofer.app.CommonClass.Constants.isMultipleStop;
import static com.soofer.app.CommonClass.Constants.multipleAddressModels;

/**
 * A simple {@link Fragment} subclass.
 */
public class StopLocationFragment extends BaseFragment implements MultipleAddressAdapter.CallBackListioner {


    Unbinder unbinder;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.multiple_recycleview)
    RecyclerView multipleRecycleview;
    @BindView(R.id.header)
    LinearLayout header;
    @BindView(R.id.done_btn)
    Button doneBtn;
    private FragmentManager fragmentManager;
    private Activity activity;
    private Context context;
    private boolean isFrom;
    private MultipleAddressAdapter multipleAddressAdapter;
    private CompositeDisposable disposable;

    @SuppressLint("ValidFragment")
    public StopLocationFragment(boolean isFrom) {
        // Required empty public constructor
        this.isFrom = isFrom;
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_stop_location, container, false);
        unbinder = ButterKnife.bind(this, view);
        fragmentManager = getFragmentManager();
        context = getContext();
        activity = getActivity();
        disposable = new CompositeDisposable();
        if (multipleAddressModels.isEmpty()) {
            multipleAddressModels.add(new MultipleAddressModel(CommonData.strPickupAddress, CommonData.Pickuplat, CommonData.Pickuplng));
            multipleAddressModels.add(new MultipleAddressModel("", 0.0, 0.0));
            multipleAddressModels.add(new MultipleAddressModel("", 0.0, 0.0));
            doneBtn.setEnabled(false);
            doneBtn.setAlpha(0.5f);
        } else {
            if (multipleAddressModels.size() < 4) {
                multipleAddressModels.add(new MultipleAddressModel("", 0.0, 0.0));
            }
        }
        multipleAddressAdapter = new MultipleAddressAdapter(multipleAddressModels, activity, this);
        multipleRecycleview.setAdapter(multipleAddressAdapter);
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.done_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                if (isFrom) {
                    activity.finish();
                } else {
                    fragmentManager.popBackStackImmediate();
                }
                break;
            case R.id.done_btn:
                for (int i = 0; i < multipleAddressModels.size(); i++) {
                    if (multipleAddressModels.get(i).getStrAddress().isEmpty()) {
                        multipleAddressModels.remove(i);
                    }
                }
                if (!isFrom) {
                    EventBus.getDefault().post(new MutlipleDestination(""));
                    fragmentManager.popBackStackImmediate();
                    return;
                }
                isMultipleStop = true;
                Intent intent = new Intent();
                activity.setResult(Activity.RESULT_OK, intent);
                activity.finish();
                break;
        }
    }

    @Override
    public void callAddress(boolean isAdd) {
        if (isAdd) {
            Intent intent = new Intent(activity, GooglePlaceSearch.class);
            intent.putExtra("setpin", "setpin");
            startActivityForResult(intent, 1200);
        } else {
            for (MultipleAddressModel multipleAddressModel : multipleAddressModels) {
                if (multipleAddressModel.getStrAddress().isEmpty()) {
                    doneBtn.setEnabled(false);
                    doneBtn.setAlpha(0.5f);
                }
            }
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1200 && resultCode == Activity.RESULT_OK) {
            Bundle b = data.getExtras();
            assert b != null;
            double lat = b.getDouble("droplat");
            double lng = b.getDouble("droplng");
            String address = b.getString("address", "");
            updateAPi(address, lat, lng);

        }

    }

    @Override
    public void onResume() {
        super.onResume();
        if (getView() == null) {
            return;
        }
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener((v, keyCode, event) -> {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                if (isFrom) {
                    activity.finish();
                } else {
                    fragmentManager.popBackStackImmediate();
                }
                return true;
            }
            return false;
        });

    }

    private void updateAPi(String address, double lat, double lng) {
        disposable.add(Observable.fromIterable(multipleAddressModels)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .filter(multipleAddressModel -> {
                    if (multipleAddressModel.isUpdatePosition()) {
                        multipleAddressModel.setStrAddress(address);
                        multipleAddressModel.setDoubleLat(lat);
                        multipleAddressModel.setDoubleLng(lng);
                        multipleAddressModel.setUpdatePosition(false);
                        return true;
                    }
                    return false;
                })
                .subscribe(multipleAddressMod -> {
                    boolean ischeck = false;
                    int count = 0;
                    if (multipleAddressModels.size() != 4) {
                        for (MultipleAddressModel multipleAddressModel : multipleAddressModels) {
                            if (multipleAddressModel.getStrAddress().isEmpty()) {
                                ischeck = true;
                            } else {
                                count++;
                            }
                        }
                        if (!ischeck) {
                            multipleAddressModels.add(new MultipleAddressModel("", 0.0, 0.0));
                        }
                        if (count != 1) {
                            doneBtn.setEnabled(true);
                            doneBtn.setAlpha(1.0f);
                        }

                    }
                    if (multipleAddressAdapter != null) {
                        multipleAddressAdapter.notifyDataSetChanged();
                    }
                }, throwable -> Utiles.CommonToast(activity, "Address issue")));
    }
}
