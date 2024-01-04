package com.bismillah.driver.Fragment;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.bismillah.driver.Adapter.VehiclesAdapter;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Fragment.document.DocumentUploadListFragment;
import com.bismillah.driver.MainActivity;
import com.bismillah.driver.Model.DeleteVehicle;
import com.bismillah.driver.Model.ListVehicleModel;
import com.bismillah.driver.Presenter.ManageVehicelPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.VehicleManageView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.Constants.strVehicleID;

public class ManageVehiclesFragment extends BaseFragment implements VehicleManageView, VehiclesAdapter.RemvetheVehicle {

    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.add_img)
    ImageView addImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.vehicle_rclr)
    RecyclerView vehicleRclr;
    Unbinder unbinder;

    private List<ListVehicleModel> vehicleModels = new ArrayList<>();

    Activity context;
    Fragment fragment;
    private ManageVehicelPresenter manageVehicelPresenter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_managevehicle, null, false);
        unbinder = ButterKnife.bind(this, view);

        context = getActivity();
        vehicleModels.clear();

        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(Objects.requireNonNull(getActivity()).getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));

        manageVehicelPresenter = new ManageVehicelPresenter(this);
        manageVehicelPresenter.getVehcleList(SharedHelper.getKey(context, "userid"), context);

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.add_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.add_img:
                fragment = new AddVehicleFragment();
                moveToFragment(fragment);
                break;
        }
    }

    private void moveToFragment(Fragment fragment) {
        getActivity().getSupportFragmentManager().beginTransaction()
                .replace(R.id.manage_vehicle_container, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
//        new MainActivity().drawerLayout.closeDrawer(GravityCompat.START);
//        new MainActivity().drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
    }

    public void getViewVehicleList() {
        if (vehicleModels != null && !vehicleModels.isEmpty()) {
            @SuppressLint("WrongConstant") LinearLayoutManager layoutManagershops
                    = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
            vehicleRclr.setLayoutManager(layoutManagershops);
            vehicleRclr.setHasFixedSize(true);
            VehiclesAdapter adapter = new VehiclesAdapter(context, vehicleModels, this);
            vehicleRclr.setAdapter(adapter);
        }

    }

    @Override
    public void OnsuccessFully(Response<List<ListVehicleModel>> Response) {
        assert Response.body() != null;
        vehicleModels.addAll(Response.body());
        getViewVehicleList();

    }

    @Override
    public void OnFailure(Response<List<ListVehicleModel>> Response) {
        try {
            assert Response.errorBody() != null;
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,context,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void DeletesuccessFully(Response<DeleteVehicle> Response) {
    }

    @Override
    public void DeleteFailure(Response<DeleteVehicle> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,context,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void Removehicle(String strMake_id) {
        HashMap<String, String> map = new HashMap<>();
        map.put("makeid", strMake_id);
        map.put("driverid", SharedHelper.getKey(context, "userid"));
        manageVehicelPresenter.getDeleteVehicleList(map, context);
    }

    @Override
    public void editVehicle(String strMake_id,int position) {
        fragment = new AddVehicleFragment();
        Bundle bundle = new Bundle();
        bundle.putString("makeid",vehicleModels.get(position).getId());
        bundle.putString("makename",vehicleModels.get(position).getMakename());
        bundle.putString("model",vehicleModels.get(position).getModel());
        bundle.putString("licence",vehicleModels.get(position).getLicence());
        bundle.putString("year",vehicleModels.get(position).getYear());
        bundle.putString("color",vehicleModels.get(position).getColor());
        bundle.putString("handicap",vehicleModels.get(position).getHandicap());
        bundle.putString("service_type",vehicleModels.get(position).getVehicletype());


        fragment.setArguments(bundle);
        moveToFragment(fragment);
    }

    @Override
    public void docupdate(String strMake_id, int position) {
       /* fragment = new AddVehicleDocFragment();
        Bundle bundle = new Bundle();
        bundle.putString("makeid",strMake_id);
        fragment.setArguments(bundle);*/
        fragment =  new DocumentUploadListFragment("vehicle",false);
        strVehicleID = strMake_id;
        moveToFragment(fragment);
    }
}
