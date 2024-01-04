package com.bismillah.app.TripFlowScreen;

import static com.bismillah.app.CommonClass.Utiles.clearInstance;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.bismillah.app.CommonClass.Constants;
import com.bismillah.app.EventBus.CategoryPassing;
import com.bismillah.app.Model.CardDeliveryModel;
import com.bismillah.app.Presenter.CarDeliveryPresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.CarDeliveryView;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import org.greenrobot.eventbus.EventBus;

import java.util.HashMap;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.MediaType;
import okhttp3.RequestBody;
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
     /*   btnDone.setOnClickListener(v ->
                callUIgetData()
        );*/
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
        /* HashMap<String, RequestBody> hashMap = new HashMap<>();
       hashMap.put("number", RequestBody.create(MediaType.parse("text/plain"),VehicelNumber));
        hashMap.put("makename", RequestBody.create(MediaType.parse("text/plain"),VehicelMake));
        hashMap.put("model", RequestBody.create(MediaType.parse("text/plain"),VehicelModel));*/
        hashMap.put("number" ,VehicelNumber);
        hashMap.put("makename" ,VehicelMake);
        hashMap.put("model",VehicelModel);
        hashMap.put("color",Vehiclecolor);
        if(VehicelNumber.isEmpty() || VehicelMake.isEmpty() || VehicelModel.isEmpty() || Vehiclecolor.isEmpty()){
            Toast.makeText(getContext(),"Kindly Fill All Fields",Toast.LENGTH_LONG).show();
        }
        else {
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