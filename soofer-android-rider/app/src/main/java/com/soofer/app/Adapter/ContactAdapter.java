package com.soofer.app.Adapter;

import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.Model.ContactlistModel;

import java.util.List;

import com.soofer.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class ContactAdapter extends RecyclerView.Adapter<ContactAdapter.MyViewHolder> {
    List<ContactlistModel> contactModels;

    Activity activity;
    RemoveContact removeContact;
    public ContactAdapter(Activity activity, List<ContactlistModel> contactModels,RemoveContact removeContact) {
        this.activity = activity;
        this.contactModels = contactModels;
        this.removeContact = removeContact;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.contact_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        ContactlistModel contactModel = contactModels.get(position);
        holder.nameTxt.setText(contactModel.getName());
        holder.phoneTxt.setText(contactModel.getNumber());

        holder.closeBtn.setTag(position);
        holder.closeBtn.setOnClickListener(v -> {
            int position1 = (int) v.getTag();
            removeContact.RemoveContact(contactModels.get(position1).getId(), position1);
        });
    }

    @Override
    public int getItemCount() {
        return contactModels.size();
    }

    static class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.close_btn)
        ImageButton closeBtn;
        @BindView(R.id.name_txt)
        TextView nameTxt;
        @BindView(R.id.phone_txt)
        TextView phoneTxt;

        MyViewHolder(View view) {
            super(view);

            ButterKnife.bind(this, view);
        }
    }
    public interface RemoveContact{
     void  RemoveContact(String contactid,int Position);
    }
}
