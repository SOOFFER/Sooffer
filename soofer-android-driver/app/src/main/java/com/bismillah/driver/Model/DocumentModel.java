package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DocumentModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("documents")
    @Expose
    private List<Document> documents = null;

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

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }


    public class Document {

        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("fileFor")
        @Expose
        private String fileFor;
        @SerializedName("front")
        @Expose
        private Boolean front=false;

        public Boolean getDocumentUploaded() {
            return documentUploaded;
        }

        public void setDocumentUploaded(Boolean documentUploaded) {
            this.documentUploaded = documentUploaded;
        }

        @SerializedName("documentUploaded")
        @Expose
        private Boolean documentUploaded =false;
        @SerializedName("back")
        @Expose
        private Boolean back=false;
        @SerializedName("exp")
        @Expose
        private Boolean exp = false;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("frontImgUrl")
        @Expose
        private String frontImgUrl;
        @SerializedName("backImgUrl")
        @Expose
        private String backImgUrl;
        @SerializedName("docExp")
        @Expose
        private String docExp;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFileFor() {
            return fileFor;
        }

        public void setFileFor(String fileFor) {
            this.fileFor = fileFor;
        }

        public Boolean getFront() {
            return front;
        }

        public void setFront(Boolean front) {
            this.front = front;
        }

        public Boolean getBack() {
            return back;
        }

        public void setBack(Boolean back) {
            this.back = back;
        }

        public Boolean getExp() {
            return exp;
        }

        public void setExp(Boolean exp) {
            this.exp = exp;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFrontImgUrl() {
            return frontImgUrl;
        }

        public void setFrontImgUrl(String frontImgUrl) {
            this.frontImgUrl = frontImgUrl;
        }

        public String getBackImgUrl() {
            return backImgUrl;
        }

        public void setBackImgUrl(String backImgUrl) {
            this.backImgUrl = backImgUrl;
        }

        public String getDocExp() {
            return docExp;
        }

        public void setDocExp(String docExp) {
            this.docExp = docExp;
        }

    }


}
