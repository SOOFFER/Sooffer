package com.soofer.driver.Activity;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.soofer.driver.Adapter.ChatAdapter;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.Model.FirebaseModel.Chat;
import com.soofer.driver.Model.FirebaseModel.FCMPayloadModel;
import com.soofer.driver.Model.FirebaseModel.NotificationModel;
import com.soofer.driver.Presenter.SentNotificationPresenter;
import com.soofer.driver.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;

import static com.soofer.driver.CommonClass.Constants.AUTH_KEY_FCM;

public class ChatActivity extends AppCompatActivity implements ChildEventListener, View.OnClickListener {


    @BindView(R.id.recyMessage)
    RecyclerView recyMessage;
    @BindView(R.id.edtMessage)
    EditText edtMessage;
    @BindView(R.id.imgSend)
    ImageView imgSend;
    @BindView(R.id.chatLayout)
    RelativeLayout chatLayout;
    @BindView(R.id.toolbar)
    Toolbar toolbar;
    String Message;

    private FirebaseDatabase database;
    private DatabaseReference chatRef;
    List<Chat> chatLists = new ArrayList<>();
    ChatAdapter chatAdapter;
    String strTripID = "";
    private Activity activity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        ButterKnife.bind(this);
        activity = this;
        strTripID = SharedHelper.getKey(this, "trip_id");
        chatRef = FirebaseDatabase.getInstance().getReference().child("ChatRoom").child(strTripID);
        chatRef.addChildEventListener(this);
        Message = edtMessage.getText().toString();
        imgSend.setOnClickListener(this);
        toolbar.setOnClickListener(it->{
            onBackPressed();
        });

    }


    @Override
    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
        Chat chat = dataSnapshot.getValue(Chat.class);
        chatLists.add(chat);
        if(!chatLists.isEmpty()) {
            Objects.requireNonNull(recyMessage.getLayoutManager()).scrollToPosition(chatLists.size() - 1);
            chatAdapter = new ChatAdapter(ChatActivity.this, dataSnapshot.getChildrenCount(), chatLists);
            recyMessage.setAdapter(chatAdapter);
        }
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
                chatRef.push().setValue(new Chat("Mr.Driver", edtMessage.getText().toString(), "driver"));
                AsyncTask.execute(() -> {
                    try {
                        pushFCMNotification(edtMessage.getText().toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
                edtMessage.setText("");
            }
        }
    }

    public void pushFCMNotification(String messageBody){
        try {

            FCMPayloadModel data = new FCMPayloadModel("Message From Driver",messageBody,"chat","open_chat");
            NotificationModel dataPayload = new NotificationModel(data,Constants.strRideToken);

            SentNotificationPresenter servicePresenter = new SentNotificationPresenter();
            servicePresenter.sendNotificationFCM(activity, dataPayload);

        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public HashMap<String, String> jsonToMap(JSONObject jsonObject) {
        HashMap<String, String> map = new HashMap<>();
        Iterator<String> keys = jsonObject.keys();

        while (keys.hasNext()) {
            String key = keys.next();
            try {
                map.put(key, jsonObject.getString(key));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return map;
    }

}

