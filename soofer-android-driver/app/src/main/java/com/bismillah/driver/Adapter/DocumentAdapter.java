package com.bismillah.driver.Adapter;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.Model.DocumentModel;
import com.bismillah.driver.R;

import org.jetbrains.annotations.NotNull;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class DocumentAdapter extends RecyclerView.Adapter<DocumentAdapter.MyViewHolder> {

    List<DocumentModel.Document> documents;
    Activity activity;
    CallbackLs callbackLs;

    public DocumentAdapter(Activity activity, CallbackLs callbackLs, List<DocumentModel.Document> documents) {
        this.activity = activity;
        this.callbackLs = callbackLs;
        this.documents = documents;
    }

    @NotNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.document_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NotNull MyViewHolder holder, final int position) {

        try {
            holder.checkboxDocument.setChecked(documents.get(position).getDocumentUploaded());
            holder.documentNameTxt.setText(documents.get(position).getName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        holder.itemView.setOnClickListener(it->{
            callbackLs.positionClick(documents.get(holder.getAdapterPosition()));
        });


    }

    @Override
    public int getItemCount() {
        return documents.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.checkbox_document)
        CheckBox checkboxDocument;

        @BindView(R.id.document_name_txt)
        TextView documentNameTxt;

        public MyViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);

        }
    }

    public interface CallbackLs {
        void positionClick(DocumentModel.Document data);
    }


}
