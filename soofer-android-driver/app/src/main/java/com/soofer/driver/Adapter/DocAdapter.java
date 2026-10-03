package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.Fragment.RegisterFragment;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.R;

import java.util.List;

public class DocAdapter extends RecyclerView.Adapter<DocAdapter.ViewHolder> {
    int Size = 0;
    Context context;
    int status;

    public static String strcountry="";
    public static String strState="";
    public static String strCity="";

    List<CountryModel> countries;
    List<StateModel> states;
    List<CityModel> cities;
    CountryModel countrymodel;
    StateModel statemodel;
    CityModel cityModel;

    public DocAdapter(Context context, int status,
                      List<CountryModel> countries, List<StateModel> states, List<CityModel> cities) {
        this.context = context;
        this.status = status;
        this.countries = countries;
        this.states = states;
        this.cities = cities;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.adapter_doc_data, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
        if (status == 1) {
            countrymodel = countries.get(position);
            holder.data_txt.setText(countrymodel.getName());
        } else if (status == 2) {
            statemodel = states.get(position);
            holder.data_txt.setText(statemodel.getName());
        } else if(status == 3) {
            cityModel = cities.get(position);
            holder.data_txt.setText(cityModel.getName());
        }

        holder.data_txt.setTag(position);
        holder.data_txt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RegisterFragment.alert11.dismiss();
                int pos = (int) v.getTag();
                if (status == 1) {
                    strcountry = countries.get(pos).getId();

                } else if (status == 2) {
                    strState = states.get(pos).getId();

                } else if (status == 3) {
                     strCity = cities.get(pos).getId();

                }
            }
        });
    }

    @Override
    public int getItemCount() {
        if (status == 1) {
            Size = countries.size();
        }
        if (status == 2) {
            Size = states.size();
        }
        if (status == 3) {
            Size = cities.size();
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
