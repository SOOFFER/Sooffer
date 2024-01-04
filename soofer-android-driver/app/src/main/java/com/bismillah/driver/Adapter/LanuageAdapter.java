package com.bismillah.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.FlowInterface.CommonInterface;
import com.bismillah.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LanuageAdapter extends RecyclerView.Adapter<LanuageAdapter.ViewHolder> {


    private Activity context;
    private List<String> fareModels;
    private CommonInterface commonInterface;
    private String strSelect;

    public LanuageAdapter(Activity context, List<String> fareModels, CommonInterface commonInterface,String strSelect) {
        this.context = context;
        this.fareModels = fareModels;
        this.commonInterface = commonInterface;
        this.strSelect = strSelect;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.language_adapter, parent, false);
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(context.getAssets(), context.getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) context.findViewById(android.R.id.content));
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        holder.languageRadio.setChecked(strSelect.equalsIgnoreCase(fareModels.get(position)));
        holder.languageRadio.setText(fareModels.get(position));



    }

    @Override
    public int getItemCount() {
        return fareModels.size();
    }



    public class ViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.language_radio)
        RadioButton languageRadio;

        public ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
            view.setOnClickListener(v -> {
                commonInterface.onCallback(getAdapterPosition());
            });
        }
    }


}
