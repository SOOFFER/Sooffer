package com.soofer.app.Navigationdrawer;

import android.app.Activity;
import android.content.Context;

import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.R;


import java.util.Collections;
import java.util.List;

public class NavigationDrawerAdapter extends RecyclerView.Adapter<NavigationDrawerAdapter.MyViewHolder> {
    List<NavDrawerItem> data = Collections.emptyList();
    private LayoutInflater inflater;
    private Activity activity;
    private Context context;

    public NavigationDrawerAdapter(Activity activity, List<NavDrawerItem> data) {
        this.activity = activity;
        this.context = activity.getApplicationContext();
        inflater = LayoutInflater.from(context);
        this.data = data;
    }

    public void delete(int position) {
        data.remove(position);
        notifyItemRemoved(position);
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.activity_navigation_drawer_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        MyViewHolder holder = new MyViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, int position) {
        NavDrawerItem current = data.get(position);
        holder.title.setText(Constants.capitalizeFirstLetter(current.getTitle()));
        switch (position) {
            case 0:
                holder.nav_img.setImageResource(R.drawable.ic_profile);
                break;
            case 1:
                holder.nav_img.setImageResource(R.drawable.ic_wallet);
                break;
            case 2:
                holder.nav_img.setImageResource(R.drawable.ic_money_new);
                break;
            case 3:
                holder.nav_img.setImageResource(R.drawable.ic_trip);
                break;
            case 4:
                holder.nav_img.setImageResource(R.drawable.ic_invite_friends);
                break;
            case 5:
                holder.nav_img.setImageResource(R.drawable.ic_contact);
                break;
            case 6:
                holder.nav_img.setImageResource(R.drawable.ic_support);
                break;
            case 7:
                holder.nav_img.setImageResource(R.drawable.ic_offer_tag);
                break;
            case 8:
                holder.nav_img.setImageResource(R.drawable.ic_start);
                break;
            case 9:
                holder.nav_img.setImageResource(R.drawable.ic_notification);
                break;
            case 10:
                holder.nav_img.setImageResource(R.drawable.ic_notification);
                break;
        }
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {
        TextView title;
        ImageView nav_img;

        public MyViewHolder(View itemView) {
            super(itemView);
            title = (TextView) itemView.findViewById(R.id.nav_title);
            nav_img = (ImageView) itemView.findViewById(R.id.nav_img);
        }
    }
}