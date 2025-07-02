package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class FeedbackListModel {

    @SerializedName("feedbacks")
    @Expose
    private List<Feedback> feedbacks = null;
    @SerializedName("profileurl")
    @Expose
    private String profileurl;

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public String getProfileurl() {
        return profileurl;
    }

    public void setProfileurl(String profileurl) {
        this.profileurl = profileurl;
    }
    public class Riderfb {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("cmts")
        @Expose
        private String cmts;
        @SerializedName("rating")
        @Expose
        private String rating;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCmts() {
            return cmts;
        }

        public void setCmts(String cmts) {
            this.cmts = cmts;
        }

        public String getRating() {
            return rating;
        }

        public void setRating(String rating) {
            this.rating = rating;
        }

    }
    public class Userinfo {

        @SerializedName("fname")
        @Expose
        private String fname;
        @SerializedName("profile")
        @Expose
        private String profile;

        public String getFname() {
            return fname;
        }

        public void setFname(String fname) {
            this.fname = fname;
        }

        public String getProfile() {
            return profile;
        }

        public void setProfile(String profile) {
            this.profile = profile;
        }

    }
    public class Feedback {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("riderfb")
        @Expose
        private List<Riderfb> riderfb = null;
        @SerializedName("tripno")
        @Expose
        private String tripno;
        @SerializedName("userinfo")
        @Expose
        private Userinfo userinfo;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<Riderfb> getRiderfb() {
            return riderfb;
        }

        public void setRiderfb(List<Riderfb> riderfb) {
            this.riderfb = riderfb;
        }

        public String getTripno() {
            return tripno;
        }

        public void setTripno(String tripno) {
            this.tripno = tripno;
        }

        public Userinfo getUserinfo() {
            return userinfo;
        }

        public void setUserinfo(Userinfo userinfo) {
            this.userinfo = userinfo;
        }

    }


}
