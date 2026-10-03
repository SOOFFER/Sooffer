package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.Adapter.ServiceStateAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.TwoDriverModel;
import com.soofer.driver.Model.VehicleStateModel;
import com.soofer.driver.Presenter.TwoDriverPresenter;
import com.soofer.driver.Presenter.VehicleStatePresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.TwodriverView;

import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.Response;

import static com.soofer.driver.CommonClass.Utiles.getErrorBody;

public class ManageVehicleStateFragment extends BaseFragment implements VehicleStatePresenter.CommonInterface, ServiceStateAdapter.CallbackListioner {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.vehicle_state_recycleview)
    RecyclerView vehicleStateRecycleview;
    Unbinder unbinder;
    @BindView(R.id.category_model_txt)
    TextView categoryModelTxt;

    private Activity activity;
    private Context context;

    public String strDriverID,twodriverimage;

    private FragmentManager fragmentManager;

    private VehicleStatePresenter vehicleStatePresenter;
    private CompositeDisposable disposable;

    public ManageVehicleStateFragment() {
        // Required empty public constructor
    }


    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_manage_vehicle_state, container, false);
        unbinder = ButterKnife.bind(this, view);
        fragmentManager = getFragmentManager();
        activity = getActivity();
        context = getContext();
        disposable = new CompositeDisposable();
        vehicleStatePresenter = new VehicleStatePresenter(activity, disposable, this);
        categoryModelTxt.setText(getString(R.string.vehicle_type)+" "+ SharedHelper.getKey(context, "vehicle_type"));
        strDriverID = SharedHelper.getKey(context, "userid");
        vehicleStatePresenter.getVehicleStateList(SharedHelper.getKey(context, "vehicleId"));
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            unbinder.unbind();
            if (disposable != null && disposable.isDisposed()) {
                disposable.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @OnClick({R.id.back_img})
    public void onViewClicked(View view) {
        switch (view.getId()){
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
        }

    }

    @Override
    public void onSuccess(Object object) {
        if (object instanceof List<?>) {
            List<VehicleStateModel> stateModels = (List<VehicleStateModel>) object;
            vehicleStateRecycleview.setAdapter(new ServiceStateAdapter(activity, stateModels, this));
        }
    }

    @Override
    public void onFailure(Throwable object) {
        getErrorBody(object, activity);
    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);
    }

    @Override
    public void dismissLoader() {
        Utiles.DismissLoader();
    }

    @Override
    public void onClickCall(String type, boolean ischeck) {
        HashMap<String, String> map = new HashMap<>();
        map.put("activeFor", type);
        if (ischeck) {
            map.put("status", "true");
        } else {
            map.put("status", "false");
        }
        vehicleStatePresenter.getUpdateCarModel(map);
    }
}
