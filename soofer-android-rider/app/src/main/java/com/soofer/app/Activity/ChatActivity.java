package com.soofer.app.Activity;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.soofer.app.Adapter.ChatAdapter;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.Model.FirebaseModel.Chat;
import com.soofer.app.Model.FirebaseModel.FCMPayloadModel;
import com.soofer.app.Model.FirebaseModel.NotificationModel;
import com.soofer.app.Presenter.SentNotificationPresenter;
import com.soofer.app.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;

import static com.soofer.app.CommonClass.Constants.API_URL_FCM;
import static com.soofer.app.CommonClass.Constants.AUTH_KEY_FCM;

public class ChatActivity extends BaseActivity implements ChildEventListener, View.OnClickListener {

    @BindView(R.id.recyMessage)
    RecyclerView recyMessage;
    @BindView(R.id.edtMessage)
    EditText edtMessage;
    @BindView(R.id.imgSend)
    RelativeLayout imgSend;
    @BindView(R.id.chatLayout)
    RelativeLayout chatLayout;
    String type = "rider";

    DatabaseReference chatRef;
    List<Chat> chatLists = new ArrayList<>();
    ChatAdapter chatAdapter;
    String strTripID = "";
    @BindView(R.id.toolbar)
    Toolbar toolbar;
    public static Activity activity;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        ButterKnife.bind(this);
        activity = this;
        strTripID = SharedHelper.getKey(this, "trip_id");
        System.out.println("TRIP ID:::"+strTripID);
        chatRef = FirebaseDatabase.getInstance().getReference().child("ChatRoom").child(strTripID).child("messages");
        chatRef.addChildEventListener(this);
        imgSend.setOnClickListener(this);
        toolbar.setTitle(SharedHelper.getKey(activity,"driver_name"));
        toolbar.setNavigationOnClickListener(v -> onBackPressed());
    }


    @Override
    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
        Chat chat = dataSnapshot.getValue(Chat.class);
        chatLists.add(chat);
        Objects.requireNonNull(recyMessage.getLayoutManager()).scrollToPosition(chatLists.size() - 1);
        chatAdapter = new ChatAdapter(ChatActivity.this, dataSnapshot.getChildrenCount(), chatLists);
        recyMessage.setAdapter(chatAdapter);
    }

    @Override
    public void onChildChanged(@NonNull DataSnapshot dataSnapshot, String s) {

    }

    @Override
    public void onChildRemoved(@NonNull DataSnapshot dataSnapshot) {

    }

    @Override
    public void onChildMoved(@NonNull DataSnapshot dataSnapshot, String s) {

    }

    @Override
    public void onCancelled(@NonNull DatabaseError databaseError) {

    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.imgSend) {
            if (!edtMessage.getText().toString().trim().isEmpty()) {
                LocalTime currentTime = LocalTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
                String formattedTime = currentTime.format(formatter);
                System.out.println("Current Time: " + formattedTime);
                sendMessage(edtMessage.getText().toString(), type, formattedTime, strTripID);
                edtMessage.setText("");
            }
        }
    }

    private void sendMessage(String message, String type, String formattedTime, String strTripID){
        FCMPayloadModel data = new FCMPayloadModel("Message From Rider",message,type,"chat",formattedTime,strTripID,SharedHelper.getKey(activity,"driver_name"));
        SentNotificationPresenter sentNotificationPresenter = new SentNotificationPresenter();
        NotificationModel dataPayload = new NotificationModel(data,Constants.strDriver);
        sentNotificationPresenter.sendNotificationFCM(activity, dataPayload);
    }

}
