package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import android.content.DialogInterface;

import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.DeleteVehicle;
import com.soofer.driver.Model.ListVehicleModel;
import com.soofer.driver.Presenter.ManageVehicelPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.VehicleManageView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;

import retrofit2.Response;

public class VehiclesAdapter extends RecyclerView.Adapter<VehiclesAdapter.ViewHolder> implements VehicleManageView {

    private Activity context;
    private List<ListVehicleModel> vehicleModels;
    private RemvetheVehicle remvetheVehicle;
    private ManageVehicelPresenter manageVehicelPresenter;
    private int position_del;

    public VehiclesAdapter(Activity context, List<ListVehicleModel> vehicleModels, RemvetheVehicle remvetheVehicle) {
        this.context = context;
        this.vehicleModels = vehicleModels;
        this.remvetheVehicle = remvetheVehicle;
        manageVehicelPresenter = new ManageVehicelPresenter(this);
    }

    @NotNull
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.adapter_manage_vehicle, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(parent.getContext().getAssets(), context.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) context.findViewById(android.R.id.content));

        return new ViewHolder(view);
    }

    @SuppressLint("RecyclerView")
    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        final ListVehicleModel listVehicleModel = vehicleModels.get(position);
        holder.make_txt.setText(listVehicleModel.getMakename());
        holder.licence_txt.setText(listVehicleModel.getVehicletype());
        holder.delete_img.setTag(position);
        holder.active_txt.setText(Constants.capitalizeFirstLetter(listVehicleModel.getTaxistatus()));
        holder.delete_img.setOnClickListener(v -> {
            position_del = (int) v.getTag();
            if (SharedHelper.getKey(context.getApplicationContext(), "vehicleId") != null && SharedHelper.getKey(context.getApplicationContext(), "vehicleId").equalsIgnoreCase(vehicleModels.get(position_del).getId())) {
                Alertdialog(context.getResources().getString(R.string.you_cannot_delete_Current_vehicle), true, 0);
            } else {
                /*if (!vehicleModels.get(position_del).getTaxistatus().equalsIgnoreCase("active")) {*/
                    Alertdialog(context.getResources().getString(R.string.are_you_sure_wanna_remove), false, position_del);
             /*   }*/
            }

        });
        holder.edit_img.setTag(position);
        holder.edit_img.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                position_del = (int) v.getTag();
                if (!vehicleModels.get(position_del).getTaxistatus().equalsIgnoreCase("active")) {
                    remvetheVehicle.editVehicle(vehicleModels.get(position_del).getId(), position_del);
                }

            }
        });
        holder.doc_img.setTag(position);
        holder.doc_img.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                position_del = (int) v.getTag();
                if (Utiles.IsNull(vehicleModels.get(position_del).getInsurance())) {
                    SharedHelper.putKey(context, "vehi_insurance", SharedHelper.getKey(context, "filepath") + vehicleModels.get(position_del).getInsurance());

                } else {
                    SharedHelper.putKey(context, "vehi_insurance", "");

                }
                if (Utiles.IsNull(vehicleModels.get(position_del).getPermit())) {
                    SharedHelper.putKey(context, "vehi_premit", SharedHelper.getKey(context, "filepath") + vehicleModels.get(position_del).getPermit());

                } else {
                    SharedHelper.putKey(context, "vehi_premit", "");

                }
                if (Utiles.IsNull(vehicleModels.get(position_del).getRegistration())) {
                    SharedHelper.putKey(context, "vehi_reg", SharedHelper.getKey(context, "filepath") + vehicleModels.get(position_del).getRegistration());

                } else {
                    SharedHelper.putKey(context, "vehi_reg", "");

                }
                if (Utiles.IsNull(vehicleModels.get(position_del).getRegistrationBack())) {
                    SharedHelper.putKey(context, "registrationBack", SharedHelper.getKey(context, "filepath") + vehicleModels.get(position_del).getRegistrationBack());

                } else {
                    SharedHelper.putKey(context, "registrationBack", "");

                }
                if (vehicleModels.get(position_del).getTaxistatus().equalsIgnoreCase("active")) {
                    SharedHelper.putKey(context, "vehicle_active", "1");
                } else {
                    SharedHelper.putKey(context, "vehicle_active", "0");
                }
                SharedHelper.putKey(context, "vehi_insurance_date", vehicleModels.get(position_del).getInsuranceexpdate());

                SharedHelper.putKey(context, "registrationexpdate", vehicleModels.get(position_del).getRegistrationexpdate());
                SharedHelper.putKey(context, "vehi_premit_date", vehicleModels.get(position_del).getPermitexpdate());
                SharedHelper.putKey(context, "vehi_reg_date", vehicleModels.get(position_del).getRegistrationexpdate());
                remvetheVehicle.docupdate(vehicleModels.get(position_del).getId(), position);
            }
        });

    }

    @Override
    public int getItemCount() {
        return vehicleModels.size();
    }

    @Override
    public void OnsuccessFully(Response<List<ListVehicleModel>> Response) {

    }

    @Override
    public void OnFailure(Response<List<ListVehicleModel>> Response) {

    }

    @Override
    public void DeletesuccessFully(Response<DeleteVehicle> Response) {
        vehicleModels.remove(position_del);
        notifyItemRemoved(position_del);
        notifyItemRangeChanged(position_del, vehicleModels.size());
    }

    @Override
    public void DeleteFailure(Response<DeleteVehicle> Response) {

    }

    public interface RemvetheVehicle {
        void Removehicle(String strMake_id);

        void editVehicle(String strMake_id, int position);

        void docupdate(String strMake_id, int position);
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        ImageView doc_img, edit_img;
        ImageView delete_img;
        TextView make_txt, licence_txt, active_txt;

        public ViewHolder(View view) {
            super(view);
            delete_img = (ImageView) view.findViewById(R.id.delete_img);
            doc_img = (ImageView) view.findViewById(R.id.doc_img);
            edit_img = (ImageView) view.findViewById(R.id.edit_img);
            make_txt = (TextView) view.findViewById(R.id.make_txt);
            licence_txt = (TextView) view.findViewById(R.id.licence_txt);
            active_txt = (TextView) view.findViewById(R.id.active_txt);
        }
    }

    private void Alertdialog(String Message, Boolean status, final int position) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        if (status) {

            builder1.setMessage(Message);
            builder1.setCancelable(true);

            builder1.setPositiveButton(
                    context.getResources().getString(R.string.ok),
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {

                            dialog.cancel();

                        }
                    });

            AlertDialog alert11 = builder1.create();
            alert11.show();
        } else {

            builder1.setMessage(Message);
            builder1.setCancelable(true);
            builder1.setPositiveButton(
                    R.string.yes,
                    (dialog, id) -> {
                        HashMap<String, String> map = new HashMap<>();
                        map.put("makeid", vehicleModels.get(position).getId());
                        map.put("driverid", SharedHelper.getKey(context, "userid"));
                        manageVehicelPresenter.getDeleteVehicleList(map, context);
                        dialog.cancel();

                    });
            builder1.setNegativeButton(R.string.no, (dialog, which) -> dialog.cancel());
            AlertDialog alert11 = builder1.create();
            alert11.show();
        }

    }
}
