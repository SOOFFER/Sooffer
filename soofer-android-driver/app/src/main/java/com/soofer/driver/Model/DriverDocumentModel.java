package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DriverDocumentModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("file")
    @Expose
    private File file;
    @SerializedName("fileurl")
    @Expose
    private String fileurl;
    @SerializedName("request")
    @Expose
    private Request request;
    @SerializedName("driverstatus")
    @Expose
    private List<Driverstatus> driverstatus = null;

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

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public String getFileurl() {
        return fileurl;
    }

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public List<Driverstatus> getDriverstatus() {
        return driverstatus;
    }

    public void setDriverstatus(List<Driverstatus> driverstatus) {
        this.driverstatus = driverstatus;
    }

    public class Driverstatus {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("canoperate")
        @Expose
        private String canoperate;
        @SerializedName("docs")
        @Expose
        private String docs;
        @SerializedName("models")
        @Expose
        private String models;
        @SerializedName("curstatus")
        @Expose
        private String curstatus;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCanoperate() {
            return canoperate;
        }

        public void setCanoperate(String canoperate) {
            this.canoperate = canoperate;
        }

        public String getDocs() {
            return docs;
        }

        public void setDocs(String docs) {
            this.docs = docs;
        }

        public String getModels() {
            return models;
        }

        public void setModels(String models) {
            this.models = models;
        }

        public String getCurstatus() {
            return curstatus;
        }

        public void setCurstatus(String curstatus) {
            this.curstatus = curstatus;
        }

    }

    public class File {

        @SerializedName("fieldname")
        @Expose
        private String fieldname;
        @SerializedName("originalname")
        @Expose
        private String originalname;
        @SerializedName("encoding")
        @Expose
        private String encoding;
        @SerializedName("mimetype")
        @Expose
        private String mimetype;
        @SerializedName("destination")
        @Expose
        private String destination;
        @SerializedName("filename")
        @Expose
        private String filename;
        @SerializedName("path")
        @Expose
        private String path;
        @SerializedName("size")
        @Expose
        private Integer size;

        public String getFieldname() {
            return fieldname;
        }

        public void setFieldname(String fieldname) {
            this.fieldname = fieldname;
        }

        public String getOriginalname() {
            return originalname;
        }

        public void setOriginalname(String originalname) {
            this.originalname = originalname;
        }

        public String getEncoding() {
            return encoding;
        }

        public void setEncoding(String encoding) {
            this.encoding = encoding;
        }

        public String getMimetype() {
            return mimetype;
        }

        public void setMimetype(String mimetype) {
            this.mimetype = mimetype;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public Integer getSize() {
            return size;
        }

        public void setSize(Integer size) {
            this.size = size;
        }

    }
    public class Request {

        @SerializedName("filefor")
        @Expose
        private String filefor;
        @SerializedName("driverid")
        @Expose
        private String driverid;

        public String getFilefor() {
            return filefor;
        }

        public void setFilefor(String filefor) {
            this.filefor = filefor;
        }

        public String getDriverid() {
            return driverid;
        }

        public void setDriverid(String driverid) {
            this.driverid = driverid;
        }

    }
}
