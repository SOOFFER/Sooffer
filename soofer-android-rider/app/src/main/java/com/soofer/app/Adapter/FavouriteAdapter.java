package com.soofer.app.Adapter;

import android.app.Activity;
import androidx.appcompat.widget.PopupMenu;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.Model.ProfileModel;
import com.soofer.app.R;

import com.soofer.app.CommonClass.CommonData;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FavouriteAdapter extends RecyclerView.Adapter<FavouriteAdapter.MyViewHolder> {

    PopupMenu popupMenu;
    Activity activity;
    public static FavoriteLocation favoriteLocation;
    int size = 0;

    public FavouriteAdapter(Activity activity, FavoriteLocation favoriteLocation) {
        this.activity = activity;
        this.favoriteLocation = favoriteLocation;

    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.fovorite_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, final int position) {

            if (CommonData.addressList.get(position).getLable().equalsIgnoreCase("Home")) {
                holder.homeImg.setImageResource(R.drawable.ic_homelayer);
                holder.homeAddressTxt.setText(activity.getResources().getString(R.string.home));
            } else if (CommonData.addressList.get(position).getLable().equalsIgnoreCase("Work")) {
                holder.homeImg.setImageResource(R.drawable.ic_work_layer);
                holder.homeAddressTxt.setText(activity.getResources().getString(R.string.work));
            } else {
                holder.homeImg.setImageResource(R.drawable.ic_heartlayer);
                holder.homeAddressTxt.setText(CommonData.addressList.get(position).getLable());
            }
            if(CommonData.addressList.get(position).getIsvisible()){
                holder.homeImg.setImageResource(R.drawable.ic_recent);
            }
            holder.menuHome.setVisibility(CommonData.addressList.get(position).getIsvisible()? View.GONE :View.VISIBLE);

            holder.homeAddressPutTxt.setText(CommonData.addressList.get(position).getAddress());



        holder.homeAddressPutTxt.setOnClickListener(v -> favoriteLocation.favoriteLocation(position, true));
        holder.homeAddressTxt.setOnClickListener(v -> favoriteLocation.favoriteLocation(position, true));
        holder.menuHome.setOnClickListener(v -> {
            popupMenu = new PopupMenu(activity, holder.menuHome);
            popupMenu.inflate(R.menu.profile_popup_menu);
            popupMenu.setOnMenuItemClickListener(item -> {
                switch (item.getItemId()) {
                    case R.id.delete_menu:
                        favoriteLocation.favoriteLocation(position, false);
                        CommonData.addressList.remove(position);
                        String favorite = SharedHelper.getKey(activity,"favorite");
                        if(!favorite.isEmpty()){
                            Type type = new TypeToken<List<ProfileModel.Address>>(){}.getType();
                            ArrayList<ProfileModel.Address> addressList= new Gson().fromJson(favorite, type);
                            addressList.remove(position);
                            SharedHelper.putKey(activity,"favorite",new Gson().toJson(addressList));
                        }

                        notifyDataSetChanged();

                        break;
                }
                return false;
            });
            popupMenu.show();


        });
    }

    @Override
    public int getItemCount() {

            size = CommonData.addressList.size();


        return size;


    }


    static class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.home_img)
        ImageView homeImg;
        @BindView(R.id.home_address_txt)
        TextView homeAddressTxt;
        @BindView(R.id.home_address_put_txt)
        TextView homeAddressPutTxt;
        @BindView(R.id.menu_home)
        ImageView menuHome;
        @BindView(R.id.home_layout)
        RelativeLayout homeLayout;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
            // view.setOnClickListener(v -> favoriteLocation.favoriteLocation(getAdapterPosition(), true));
        }
    }

    public interface FavoriteLocation {
        void favoriteLocation(int position, boolean isadded);
    }
}
