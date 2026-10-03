package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class DocumentUploadModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private Data data;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public class Data {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("docName")
        @Expose
        private String docName;
        @SerializedName("docExp")
        @Expose
        private String docExp;
        @SerializedName("docFrontImg")
        @Expose
        private String docFrontImg;
        @SerializedName("docBackImg")
        @Expose
        private String docBackImg;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDocName() {
            return docName;
        }

        public void setDocName(String docName) {
            this.docName = docName;
        }

        public String getDocExp() {
            return docExp;
        }

        public void setDocExp(String docExp) {
            this.docExp = docExp;
        }

        public String getDocFrontImg() {
            return docFrontImg;
        }

        public void setDocFrontImg(String docFrontImg) {
            this.docFrontImg = docFrontImg;
        }

        public String getDocBackImg() {
            return docBackImg;
        }

        public void setDocBackImg(String docBackImg) {
            this.docBackImg = docBackImg;
        }

    }

}
