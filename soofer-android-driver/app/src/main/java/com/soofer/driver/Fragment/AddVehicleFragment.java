package com.soofer.driver.Fragment;


import static com.soofer.driver.CommonClass.Constants.strVehicleID;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.snackbar.Snackbar;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Fragment.document.DocumentUploadListFragment;
import com.soofer.driver.Model.AddVehicleModel;
import com.soofer.driver.Model.CarModel;
import com.soofer.driver.Model.ServiceModel;
import com.soofer.driver.Presenter.CarModelPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.CarModelView;
import com.soofer.driver.View.ProfileView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.Response;
import retrofit2.adapter.rxjava3.HttpException;

public class AddVehicleFragment extends BaseFragment implements Validator.ValidationListener, CarModelView {

    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.add_img)
    ImageView addImg;
    // @NotEmpty(message = getString(R.string.select_make))
    @NotEmpty(message = "Select Make")
    @BindView(R.id.make_edt)
    MaterialEditText makeEdt;
    //@NotEmpty(message = getString(R.string.select_model))
    @NotEmpty(message = "Select Model")
    @BindView(R.id.model_edt)
    MaterialEditText modelEdt;
    //  @NotEmpty(message = getString(R.string.select_year))
    @NotEmpty(message = "Select Year")
    @BindView(R.id.year_edt)
    MaterialEditText yearEdt;
    @BindView(R.id.submit_btn)
    Button submitBtn;
    Unbinder unbinder;
    @BindView(R.id.header)
    RelativeLayout header;
    //   @NotEmpty(message = getString(R.string.please_add_your_cars_licence_plate_no))
    @NotEmpty(message = "Please  add your car's licence plate no.")
    @BindView(R.id.licence_edt)
    MaterialEditText licenceEdt;
    @NotEmpty(message = "Select color")
    @BindView(R.id.color_edt)
    MaterialEditText colorEdt;

    private List<String> CarModel = null;

    private Validator validator;

    private int basic = 0, normal = 0, lux = 0;
    @BindView(R.id.basci_lyt)
    RelativeLayout basciLyt;
    @BindView(R.id.normal_lyt)
    RelativeLayout normalLyt;
    @BindView(R.id.lux_lyt)
    RelativeLayout luxLyt;
    @BindView(R.id.basic_check)
    CheckBox basicCheck;
    @BindView(R.id.basic_normal)
    CheckBox basicNormal;
    @BindView(R.id.lux_check)
    CheckBox luxCheck;

    List<com.soofer.driver.Model.CarModel> carModels;

    private AlertDialog alert11;
    private AlertDialog vehicleAlert;
    Activity activity;
    Context context;
    private static String strYear, strmake, strModel, strcolor;
    private CarModelPresenter carModelPresenter;
    @BindView(R.id.handcap_check)
    CheckBox handcapCheck;

    private String str_makeid, str_model, str_year, str_licence, str_color, str_handi, str_basic, str_normal, str_lux;
    Bundle bundle;
    Fragment fragment;
    @BindView(R.id.service_type_spinner)
    Spinner serviceTypeSpinner;
    CompositeDisposable disposable;
    private String strServiceType = "";

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_addvehicle, null, false);

        unbinder = ButterKnife.bind(this, view);
        validator = new Validator(this);
        validator.setValidationListener(this);
        activity = getActivity();
        disposable = new CompositeDisposable();
        carModelPresenter = new CarModelPresenter(this, disposable);
        carModelPresenter.getCarModel(activity);


        context = getContext();

        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(getActivity().getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));

        luxCheck.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (luxCheck.isChecked()) {
                lux = 1;
            } else {
                lux = 0;
            }
        });
        carModelPresenter.getservicetype(activity);
        basicNormal.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (basicNormal.isChecked()) {
                normal = 1;
            } else {
                normal = 0;
            }
        });

        basicCheck.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (basicCheck.isChecked()) {
                basic = 1;
            } else {
                basic = 0;
            }
        });
        //  serviceTypeSpinner.setEnabled(false);
        //serviceTypeSpinner.setClickable(false);
        bundle = this.getArguments();
        if (bundle != null) {
            str_makeid = bundle.getString("makeid");
            strmake = bundle.getString("makename");
            str_model = bundle.getString("model");
            str_licence = bundle.getString("licence");
            str_year = bundle.getString("year");
            str_color = bundle.getString("color");
            str_handi = bundle.getString("handicap");
            strServiceType = bundle.getString("service_type");

            makeEdt.setText(strmake);
            modelEdt.setText(str_model);
            yearEdt.setText(str_year);
            licenceEdt.setText(str_licence);
            colorEdt.setText(str_color);
         /*   if (!str_handi.equals("false")) {
                handcapCheck.setChecked(true);
            } else {
                handcapCheck.setChecked(false);
            }
            if (str_basic.equals("true")) {
                basicCheck.setChecked(true);
            }
            if (str_lux.equals("true")) {
                luxCheck.setChecked(true);
            }
            if (str_normal.equals("true")) {
                basicNormal.setChecked(true);
            }*/
        }

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        try {
            Utiles.compositeClreate(disposable);
            if (vehicleAlert != null && vehicleAlert.isShowing()) {
                vehicleAlert.dismiss();
            }
            if (alert11 != null && alert11.isShowing()) {
                alert11.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @OnClick({R.id.back_img, R.id.make_edt, R.id.model_edt, R.id.year_edt, R.id.color_edt, R.id.licence_edt, R.id.submit_btn, R.id.basci_lyt, R.id.normal_lyt, R.id.lux_lyt, R.id.basic_check, R.id.basic_normal, R.id.lux_check})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.make_edt:
                vehicleDoc("Select Make", 0);
                break;
            case R.id.model_edt:
                if (makeEdt.getText().toString().isEmpty()) {
                    showErrorMessage("Please select Vehicle Make");
                } else {
                    vehicleDoc("Select Model", 1);
                }

                break;
            case R.id.year_edt:
                vehicleDoc("Select Year", 2);
                break;
            case R.id.color_edt:
                vehicleDoc("Select color", 3);
                break;
            case R.id.licence_edt:
                Utiles.CommonToast(getActivity(), getString(R.string.License));
                break;
            case R.id.submit_btn:
                validator.validate();
                break;
        }
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        HashMap<String, String> map = new HashMap<>();
        map.put("makename", makeEdt.getText().toString());
        map.put("model", modelEdt.getText().toString());
        map.put("year", yearEdt.getText().toString());
        map.put("color", colorEdt.getText().toString());
        map.put("licence", licenceEdt.getText().toString());
        map.put("cpy", "");
        map.put("driver", SharedHelper.getKey(context, "userid"));
        map.put("requestFrom", "app");
        map.put("vehicletype", strServiceType);
        if (bundle != null) {
            map.put("makeid", str_makeid);
        }
        if (bundle != null) {
            Alertdialog(activity.getResources().getString(R.string.are_you_update), true, map);
        } else {
            Alertdialog(activity.getResources().getString(R.string.are_you_sure_add), false, map);
        }
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(getActivity());
            if (view instanceof EditText) {
                showErrorMessage(message);
            } else {
                Utiles.CommonToast(getActivity(), message);
            }
        }
    }

    private void showErrorMessage(String error) {
        Snackbar snackbar = Snackbar
                .make(requireActivity().findViewById(android.R.id.content), error, Snackbar.LENGTH_SHORT);
        View snackbarView = snackbar.getView();
        TextView textView = (TextView) snackbarView.findViewById(R.id.snackbar_text);
        textView.setTextColor(Color.WHITE);
        snackbarView.setBackgroundColor(Color.BLACK);
        snackbar.show();
    }

    private void vehicleDoc(String title, int status) {
        final LayoutInflater inflater = (LayoutInflater) requireActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        assert inflater != null;
        View layout = inflater.inflate(R.layout.alert_doc, null);

        RecyclerView rclr_datas = (RecyclerView) layout.findViewById(R.id.rclr_datas);

        @SuppressLint("WrongConstant") LinearLayoutManager layoutManagershops
                = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
        rclr_datas.setLayoutManager(layoutManagershops);

        DocAdapter docAdapter = new DocAdapter(getContext(), status, carModels);
        rclr_datas.setAdapter(docAdapter);

        AlertDialog.Builder alert = new AlertDialog.Builder(activity);
        alert.setTitle(title);
        alert.setView(layout);
        alert.setCancelable(true);
        alert11 = alert.create();
        alert11.show();


    }

    @Override
    public void OnSuccessfullsy(Response<CarModel> Response) {
        carModels = new ArrayList<>();
        carModels.add(Response.body());

    }

    @Override
    public void OnFailurse(Response<CarModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void AddvehicleSucessfully(Response<AddVehicleModel> response) {
        Utiles.CommonToast(activity, response.body().getMessage());
        if (SharedHelper.getKey(activity, "appflow").equalsIgnoreCase("login")) {
            requireActivity().getSupportFragmentManager().popBackStackImmediate();
        } else {
            SharedHelper.putKey(context, "makeId", response.body().getTaxi().getId());
            SharedHelper.putKey(requireContext(), "loginflow", "login");
            strVehicleID = response.body().getTaxi().getId();
            fragment = new DocumentUploadListFragment("vehicle", true);
            Bundle bundle = new Bundle();
            bundle.putString("makeid", response.body().getTaxi().getId());
            fragment.setArguments(bundle);
            moveToFragment(fragment);
        }
    }

    @Override
    public void AddvehicleFailure(Response<AddVehicleModel> response) {
        try {
            String Message = response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void editVehicleSuccessfull() {
        getFragmentManager().popBackStackImmediate();
    }

    @Override
    public void editVehicleFauiler() {
        Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
    }

    @Override
    public void onSuccessServiceList(ServiceModel serviceModels) {
        getServiceTypeSPinner(serviceModels.getVehiclelists());
    }

    private void getServiceTypeSPinner(List<String> vehiclelists) {
        if (vehiclelists != null) {
            ArrayAdapter<String> languageAdapter = new ArrayAdapter<String>(activity,
                    R.layout.dropdown, vehiclelists);
            languageAdapter.setDropDownViewResource(R.layout.dropdown);
            serviceTypeSpinner.setAdapter(languageAdapter);
            int spinnerPosition = languageAdapter.getPosition(Utiles.Nullpointer(strServiceType));
            serviceTypeSpinner.setSelection(spinnerPosition);
            serviceTypeSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                    strServiceType = adapterView.getItemAtPosition(position).toString();
                }

                @Override
                public void onNothingSelected(AdapterView<?> adapterView) {

                }
            });
        }
    }


    @Override
    public void onFailureService(Throwable throwable) {

        try {
            HttpException error = (HttpException) throwable;
            String errorBody = error.response().errorBody().string();
            JSONObject jsonObject = new JSONObject(errorBody);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }
        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    public class DocAdapter extends RecyclerView.Adapter<DocAdapter.ViewHolder> {
        int Size = 0;
        Context context;
        int status;
        List<CarModel> carModels;
        CarModel carModel;

        public DocAdapter(Context context, int status, List<CarModel> carModels) {
            this.context = context;
            this.status = status;
            this.carModels = carModels;

        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(context).inflate(R.layout.adapter_doc_data, parent, false);
            FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(getActivity().getAssets(), getString(R.string.app_font));
            fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));

            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(final ViewHolder holder, final int position) {
            if (status == 0) {
                carModel = carModels.get(0);
                holder.data_txt.setText(carModel.getCarmake().get(0).getDatas().get(position).getMake());
            } else if (status == 1) {
                holder.data_txt.setText(CarModel.get(position));
            } else if (status == 2) {
                carModel = carModels.get(0);
                holder.data_txt.setText(carModel.getYears().get(0).getDatas().get(position).getName());
            } else if (status == 3) {
                carModel = carModels.get(0);
                holder.data_txt.setText(carModel.getColor().get(0).getDatas().get(position).getName());
            }

            holder.data_txt.setTag(position);
            holder.data_txt.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    alert11.dismiss();
                    int pos = (int) v.getTag();


                    if (status == 0) {
                        strmake = carModel.getCarmake().get(0).getDatas().get(pos).getMake();
                        makeEdt.setText(holder.data_txt.getText().toString());
                    } else if (status == 1) {
                        strModel = CarModel.get(pos);
                        modelEdt.setText(holder.data_txt.getText().toString());
                    } else if (status == 2) {
                        strYear = carModel.getYears().get(0).getDatas().get(pos).getName();
                        yearEdt.setText(holder.data_txt.getText().toString());
                    } else if (status == 3) {
                        System.out.println("Car Vehicle Color" + carModel.getColor().get(0).getDatas().get(pos).getName());
                        strcolor = carModel.getColor().get(0).getDatas().get(pos).getName();
                        colorEdt.setText(holder.data_txt.getText().toString());
                    }
                }
            });
        }

        @Override
        public int getItemCount() {
            if (carModels != null) {
                if (status == 0) {
                    Size = carModels.get(0).getCarmake().get(0).getDatas().size();
                } else if (status == 1) {
                    if (strmake != null) {
                        for (int i = 0; i < carModels.get(0).getCarmake().get(0).getDatas().size(); i++) {
                            if (strmake.equalsIgnoreCase(carModels.get(0).getCarmake().get(0).getDatas().get(i).getMake())) {
                                Size = carModels.get(0).getCarmake().get(0).getDatas().get(i).getModel().size();
                                CarModel = carModels.get(0).getCarmake().get(0).getDatas().get(i).getModel();
                            }

                        }

                    }

                } else if (status == 2) {
                    Size = carModels.get(0).getYears().get(0).getDatas().size();
                } else if (status == 3) {
                    Size = carModels.get(0).getColor().get(0).getDatas().size();
                }
            }
            return Size;
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView data_txt;

            ViewHolder(View view) {
                super(view);

                data_txt = (TextView) view.findViewById(R.id.data_txt);

            }
        }

    }

    private void moveToFragment(Fragment fragment) {
        requireActivity().getSupportFragmentManager().beginTransaction().replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commit();
    }

    public void Alertdialog(String Message, final Boolean status, final HashMap<String, String> map) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setMessage(Message);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        if (status) {
                            carModelPresenter.geteditVehicle(activity, map);
                        } else {
                            carModelPresenter.getAddVehicle(activity, map);
                        }

                        dialog.cancel();

                    }
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();

            }
        });
        vehicleAlert = builder1.create();
        vehicleAlert.show();


    }

}
