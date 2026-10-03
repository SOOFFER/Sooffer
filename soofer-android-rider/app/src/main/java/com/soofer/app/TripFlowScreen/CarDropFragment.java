package com.soofer.app.TripFlowScreen;

import static com.soofer.app.CommonClass.Utiles.clearInstance;

import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.Constants;
import com.soofer.app.EventBus.CategoryPassing;
import com.soofer.app.Model.CardDeliveryModel;
import com.soofer.app.Presenter.CarDeliveryPresenter;
import com.soofer.app.R;
import com.soofer.app.View.CarDeliveryView;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import org.greenrobot.eventbus.EventBus;

import java.util.HashMap;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

public class CarDropFragment extends BottomSheetDialogFragment implements CarDeliveryView {


    @BindView(R.id.edtVehicelNumber)
    EditText edtVehicelNumber;
    @BindView(R.id.edtVehicelMake)
    EditText edtVehicelMake;
    @BindView(R.id.edtVehicelModel)
    EditText edtVehicelModel;
    @BindView(R.id.edtVehicelColor)
    EditText edtVehicleColor;
    @BindView(R.id.edtDeliver)
    TextView edtDeliver;
    @BindView(R.id.btnDone)
    Button btnDone;
    Unbinder unbinder;

    public CarDropFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_car_drop, container, false);
        unbinder = ButterKnife.bind(this, view);
        return view;
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }


    private void callUIgetData() {
        CarDeliveryPresenter carDeliveryPresenter = new CarDeliveryPresenter(this);
        String VehicelNumber = edtVehicelNumber.getText().toString();
        String VehicelMake = edtVehicelMake.getText().toString();
        String VehicelModel = edtVehicelModel.getText().toString();
        String Vehiclecolor = edtVehicleColor.getText().toString();
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("number" ,VehicelNumber);
        hashMap.put("makename" ,VehicelMake);
        hashMap.put("model",VehicelModel);
        hashMap.put("color",Vehiclecolor);
        if(VehicelNumber.isEmpty() || VehicelMake.isEmpty() || VehicelModel.isEmpty() || Vehiclecolor.isEmpty()){
            Toast.makeText(getContext(),"Kindly Fill All Fields",Toast.LENGTH_LONG).show();
        } else {
            carDeliveryPresenter.submitCarDelivery(hashMap, requireActivity());
        }
    }

    @Override
    public void OnSuccess(Response<CardDeliveryModel> response) {
        assert response.body() != null;
        Constants.Vehicle_id = response.body().getTaxi().getId();
        EventBus.getDefault().postSticky(new CategoryPassing("CarDelivery"));
        dismiss();
    }

    @Override
    public void OnFailure(Response<CardDeliveryModel> response) {

    }

    @OnClick(R.id.btnDone)
    public void onClick() {
        callUIgetData();
    }
}